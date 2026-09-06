"""Run with Python 3.11+: python3 -m unittest discover -s scripts/tests."""
import importlib.util
import io
import json
import os
from pathlib import Path
import subprocess
import tempfile
import tomllib
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parents[1] / 'sync-claude-mcp.py'
spec = importlib.util.spec_from_file_location('sync_mcp', SCRIPT)
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)


class ConversionTests(unittest.TestCase):
    def test_precedence_whole_entry(self):
        root = Path('/repo')
        data = {'mcpServers': {'x': {'url': 'user', 'headers': {'secret': 'x'}}},
                'projects': {str(root): {'mcpServers': {'x': {'url': 'local'}}}}}
        found = sync.discover(root, data, {'mcpServers': {'x': {'url': 'project'}}}, set())
        self.assertEqual(found[0]['server'], {'url': 'local'})
        self.assertEqual(found[0]['shadowed'], ['user', 'project'])

    def test_header_references(self):
        result = sync.convert({'type': 'http', 'url': 'https://example.com',
            'headers': {'Authorization': 'Bearer ${TOKEN}', 'X-Key': '${KEY}',
                        'Other': '${OPTION:-fallback}'}}, Path('/repo'), {})
        self.assertEqual(result['bearer_token_env_var'], 'TOKEN')
        self.assertEqual(result['env_http_headers'], {'X-Key': 'KEY'})
        self.assertEqual(result['http_headers'], {'Other': 'fallback'})

    def test_missing_variables_and_unsupported_settings(self):
        for server in [ {'type': 'http', 'url': '${MISSING}'},
                        {'type': 'sse', 'url': 'https://example.com'},
                        {'type': 'http', 'url': 'https://example.com', 'oauth': {}},
                        {'command': 'npx', 'args': 'wrong'}]:
            with self.assertRaises(sync.ReviewError):
                sync.convert(server, Path('/repo'), {})

    def test_stdio_env_cwd_and_toml_escaping(self):
        result = sync.convert({'command': 'npx', 'args': ['${PACKAGE}', 'quote"\nline'],
                               'env': {'TOKEN': '${KEY}'}, 'cwd': 'subdir'},
                              Path('/repo'), {'PACKAGE': 'server', 'KEY': 'private'})
        text = sync.render(b'# preserve comment\nmodel = "unchanged"\n', [('demo', result)])
        parsed = tomllib.loads(text.decode())
        self.assertEqual(parsed['mcp_servers']['demo'], result)
        self.assertEqual(result['cwd'], '/repo/subdir')
        self.assertTrue(text.startswith(b'# preserve comment'))


class ScriptTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.home = Path(self.temp.name)
        self.root = self.home / 'repo'
        self.root.mkdir()
        subprocess.run(['git', 'init', '-q', str(self.root)], check=True)
        self.codex = self.home / '.codex'
        self.codex.mkdir()
        (self.codex / 'config.toml').write_text('# existing\nmodel = "keep"\n')
        self.claude = self.home / '.claude.json'
        self.secret = 'VERY_PRIVATE_SENTINEL'
        self.claude.write_text(json.dumps({'mcpServers': {
            'sample': {'type': 'http', 'url': 'https://example.com/' + self.secret,
                       'headers': {'X-Key': self.secret}}}}))
        self.env = dict(os.environ, HOME=str(self.home), CODEX_HOME=str(self.codex))
        self.destination = self.root / '.codex/config.toml'

    def run_script(self, *args, answer=''):
        import sys
        result = subprocess.run([sys.executable, str(SCRIPT), '--project', str(self.root),
                                 '--claude-config', str(self.claude), *args],
                                input=answer, text=True, capture_output=True, env=self.env)
        self.assertNotIn(self.secret, result.stdout + result.stderr)
        return result

    def test_preview_and_cancellation_write_nothing(self):
        before = (self.root / '.git/info/exclude').read_bytes()
        for args, answer in [(('--check',), ''), ((), 'n\n'), ((), '')]:
            self.assertEqual(self.run_script(*args, answer=answer).returncode, 1)
            self.assertFalse(self.destination.exists())
            self.assertEqual((self.root / '.git/info/exclude').read_bytes(), before)

    def test_confirm_ignore_permissions_and_idempotence(self):
        result = self.run_script(answer='yes\n')
        self.assertEqual(result.returncode, 0, result.stderr)
        value = tomllib.loads(self.destination.read_text())
        self.assertEqual(value['mcp_servers']['sample']['http_headers']['X-Key'], self.secret)
        self.assertEqual(self.destination.stat().st_mode & 0o777, 0o600)
        self.assertEqual(subprocess.run(['git', '-C', str(self.root), 'check-ignore', '-q',
                                        '.codex/config.toml']).returncode, 0)
        self.assertEqual(self.run_script('--check').returncode, 0)
        self.assertFalse(self.destination.with_suffix('.toml.before-mcp-sync').exists())

    def test_user_target_backup_preserves_other_settings(self):
        before = (self.codex / 'config.toml').read_bytes()
        self.assertEqual(self.run_script('--target', 'user', answer='y\n').returncode, 0)
        self.assertEqual((self.codex / 'config.toml.before-mcp-sync').read_bytes(), before)
        self.assertEqual(tomllib.loads((self.codex / 'config.toml').read_text())['model'], 'keep')
        self.assertFalse(self.destination.exists())

    def test_existing_different_server_not_replaced(self):
        p = self.codex / 'config.toml'
        p.write_text('[mcp_servers.sample]\nurl = "https://different.example.com"\n')
        before = p.read_bytes()
        result = self.run_script(answer='yes\n')
        self.assertIn('settings differ', result.stdout)
        self.assertEqual(p.read_bytes(), before)
        self.assertFalse(self.destination.exists())

    def test_tracked_project_config_refused(self):
        self.destination.parent.mkdir()
        self.destination.write_text('# tracked\n')
        subprocess.run(['git', '-C', str(self.root), 'add', '.codex/config.toml'], check=True)
        result = self.run_script(answer='yes\n')
        self.assertEqual(result.returncode, 1)
        self.assertIn('tracked by Git', result.stderr)
        self.assertEqual(self.destination.read_text(), '# tracked\n')

    def test_parse_errors_do_not_print_credentials(self):
        self.claude.write_text('{"credential": "' + self.secret)
        result = self.run_script('--check')
        self.assertEqual(result.returncode, 1)
        self.assertIn('Invalid JSON', result.stderr)

    def test_concurrent_edit_aborts(self):
        with patch.dict(os.environ, self.env), patch('sys.argv', [str(SCRIPT), '--project', str(self.root),
                '--claude-config', str(self.claude)]), patch('builtins.print'):
            def edit_and_confirm(_):
                self.claude.write_text('{}')
                return 'yes'
            with patch('builtins.input', side_effect=edit_and_confirm):
                with self.assertRaisesRegex(sync.ReviewError, 'changed during review'):
                    sync.main()
        self.assertFalse(self.destination.exists())

    def test_pre_push_without_terminal_does_not_read_git_input(self):
        with patch.dict(os.environ, self.env), patch('sys.argv', [str(SCRIPT),
                '--project', str(self.root), '--claude-config', str(self.claude), '--pre-push']), \
                patch('builtins.open', side_effect=OSError('No terminal')), \
                patch('builtins.input') as stdin, patch('builtins.print'):
            self.assertEqual(sync.main(), 1)
            stdin.assert_not_called()
        self.assertFalse(self.destination.exists())

    def test_pre_push_skips_deliberately_disabled_servers(self):
        data = json.loads(self.claude.read_text())
        data['projects'] = {str(self.root): {'disabledMcpServers': ['sample']}}
        self.claude.write_text(json.dumps(data))
        result = self.run_script('--pre-push')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('SKIP: disabled', result.stdout)
        self.assertFalse(self.destination.exists())

    def test_pre_push_import_stops_then_matching_config_passes(self):
        terminal = unittest.mock.MagicMock()
        terminal.__enter__.return_value = terminal
        terminal.readline.return_value = 'yes\n'
        output = io.StringIO()
        with patch.dict(os.environ, self.env), patch('sys.argv', [str(SCRIPT),
                '--project', str(self.root), '--claude-config', str(self.claude), '--pre-push']), \
                patch('builtins.open', return_value=terminal) as tty, \
                patch('builtins.input') as stdin, patch('sys.stdout', output):
            self.assertEqual(sync.main(), 1)
            tty.assert_called_once_with('/dev/tty', 'r+')
            stdin.assert_not_called()
            self.assertTrue(self.destination.exists())
            tty.reset_mock()
            self.assertEqual(sync.main(), 0)
            tty.assert_not_called()
        self.assertIn('Push stopped', output.getvalue())


if __name__ == '__main__':
    unittest.main()
