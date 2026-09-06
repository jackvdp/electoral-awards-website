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
        self.home = Path(self.temp.name).resolve()
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

    def codex_only(self, definition, name='reverse'):
        self.claude.write_text('{"unrelated": {"keep": true}}')
        (self.codex / 'config.toml').write_bytes(sync.render(b'', [(name, definition)]))

    def test_reverse_http_preserves_references_backup_and_other_settings(self):
        self.codex_only({'url': 'https://example.com/' + self.secret,
                         'bearer_token_env_var': 'TOKEN', 'env_http_headers': {'X-Key': 'KEY'}})
        before = self.claude.read_bytes()
        result = self.run_script('--direction', 'to-claude', answer='yes\n')
        self.assertEqual(result.returncode, 0, result.stderr)
        data = json.loads(self.claude.read_text())
        server = data['projects'][str(self.root)]['mcpServers']['reverse']
        self.assertEqual(server['headers'], {'Authorization': 'Bearer ${TOKEN}', 'X-Key': '${KEY}'})
        self.assertTrue(data['unrelated']['keep'])
        self.assertEqual(self.claude.with_name('.claude.json.before-mcp-sync').read_bytes(), before)
        self.assertEqual(self.claude.stat().st_mode & 0o777, 0o600)
        self.assertEqual(self.run_script('--check').returncode, 0)

    def test_reverse_preview_and_cancellation_leave_both_sides_untouched(self):
        self.codex_only({'url': 'https://example.com/' + self.secret})
        before = self.claude.read_bytes()
        config = (self.codex / 'config.toml').read_bytes()
        for args in (('--check',), ()):
            self.assertEqual(self.run_script(*args, answer='no\n').returncode, 1)
            self.assertEqual(self.claude.read_bytes(), before)
            self.assertEqual((self.codex / 'config.toml').read_bytes(), config)
            self.assertFalse(self.claude.with_name('.claude.json.before-mcp-sync').exists())

    def test_reverse_user_scope_and_stdio_roundtrip(self):
        self.codex_only({'command': 'npx', 'args': ['sample']})
        self.assertEqual(self.run_script('--target', 'user', answer='yes\n').returncode, 0)
        self.assertEqual(json.loads(self.claude.read_text())['mcpServers']['reverse']['command'], 'npx')
        self.assertEqual(self.run_script('--check').returncode, 0)

    def test_reverse_project_stdio_cwd_roundtrip(self):
        self.codex_only({'command': 'npx', 'cwd': str(self.root), 'env': {'TOKEN': self.secret}})
        self.assertEqual(self.run_script(answer='yes\n').returncode, 0)
        self.assertEqual(self.run_script('--check').returncode, 0)

    def test_reverse_disabled_codex_server_is_not_enabled_in_claude(self):
        self.codex_only({'url': 'https://example.com'})
        config = self.codex / 'config.toml'
        config.write_text(config.read_text() + 'enabled = false\n')
        before = self.claude.read_bytes()
        self.assertEqual(self.run_script('--pre-push').returncode, 0)
        self.assertEqual(self.claude.read_bytes(), before)

    def test_reverse_hook_uses_terminal_and_stops_after_import(self):
        self.codex_only({'url': 'https://example.com'})
        terminal = unittest.mock.MagicMock()
        terminal.__enter__.return_value = terminal
        terminal.readline.return_value = 'yes\n'
        with patch.dict(os.environ, self.env), patch('sys.argv', [str(SCRIPT), '--project', str(self.root),
                '--claude-config', str(self.claude), '--pre-push']), patch('builtins.print'), \
                patch('builtins.open', return_value=terminal) as tty, patch('builtins.input') as stdin:
            self.assertEqual(sync.main(), 1)
            tty.assert_called_once_with('/dev/tty', 'r+')
            stdin.assert_not_called()
        self.assertEqual(self.run_script('--pre-push').returncode, 0)

    def test_reverse_custom_cwd_and_restrictions_require_review(self):
        for definition in ({'command': 'npx', 'cwd': '/other'},
                           {'url': 'https://example.com', 'disabled_tools': ['delete']},
                           {'url': 'https://example.com/${LITERAL}'},
                           {'command': 'npx', 'env_vars': ['SECRET']}):
            self.codex_only(definition)
            before = self.claude.read_bytes()
            result = self.run_script(answer='n\n')
            self.assertEqual(result.returncode, 1)
            self.assertIn('REVIEW', result.stdout)
            self.assertEqual(self.claude.read_bytes(), before)

    def test_reverse_respects_disabled_claude_name_without_definition(self):
        self.codex_only({'url': 'https://example.com'})
        self.claude.write_text(json.dumps({'projects': {str(self.root): {'disabledMcpServers': ['reverse']}}}))
        before = self.claude.read_bytes()
        self.assertEqual(self.run_script(answer='n\n').returncode, 1)
        self.assertEqual(self.claude.read_bytes(), before)

    def test_reverse_concurrent_edit_aborts(self):
        self.codex_only({'url': 'https://example.com'})
        with patch.dict(os.environ, self.env), patch('sys.argv', [str(SCRIPT), '--project', str(self.root),
                '--claude-config', str(self.claude), '--direction', 'to-claude']), patch('builtins.print'):
            def edit(_):
                self.claude.write_text('{"new": true}')
                return 'yes'
            with patch('builtins.input', side_effect=edit):
                with self.assertRaisesRegex(sync.ReviewError, 'changed during review'):
                    sync.main()
        self.assertEqual(json.loads(self.claude.read_text()), {'new': True})

    def test_both_directions_add_missing_names_without_replacing(self):
        (self.codex / 'config.toml').write_bytes(sync.render(b'', [('reverse', {'url': 'https://example.org'})]))
        result = self.run_script(answer='yes\nyes\n')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('sample', tomllib.loads(self.destination.read_text())['mcp_servers'])
        self.assertIn('reverse', json.loads(self.claude.read_text())['projects'][str(self.root)]['mcpServers'])
        self.assertEqual(self.run_script('--check').returncode, 0)

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


class IgnoreTests(ScriptTests):
    def setUp(self):
        super().setUp()
        self.ignore = self.root / '.mcp-sync-ignore'

    def test_ignore_answer_records_name_and_unblocks_push(self):
        result = self.run_script(answer='i\n')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('Ignoring', result.stdout)
        self.assertFalse(self.destination.exists())
        lines = [l for l in self.ignore.read_text().splitlines() if l and not l.startswith('#')]
        self.assertEqual(lines, ['sample'])
        self.assertTrue(self.ignore.read_text().startswith('# MCP servers'))
        self.assertEqual(self.run_script('--check').returncode, 0)
        listing = self.run_script('--pre-push')
        self.assertEqual(listing.returncode, 0, listing.stderr)
        self.assertIn('IGNORE: listed in', listing.stdout)
        self.assertNotIn('ADD:', listing.stdout)

    def test_review_item_can_be_ignored(self):
        p = self.codex / 'config.toml'
        p.write_text('[mcp_servers.sample]\nurl = "https://different.example.com"\n')
        self.assertEqual(self.run_script('--check').returncode, 1)
        result = self.run_script(answer='y\n')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('settings differ', result.stdout)
        self.assertEqual(self.run_script('--check').returncode, 0)
        self.assertEqual(self.run_script('--pre-push').returncode, 0)

    def test_declining_to_ignore_review_item_still_blocks(self):
        p = self.codex / 'config.toml'
        p.write_text('[mcp_servers.sample]\nurl = "https://different.example.com"\n')
        self.assertEqual(self.run_script(answer='n\n').returncode, 1)
        self.assertFalse(self.ignore.exists())

    def test_ignore_file_comments_and_custom_path_are_honoured(self):
        custom = self.home / 'names.txt'
        custom.write_text('# comment line\n  sample   # trailing note\n\nother\n')
        result = self.run_script('--check', '--ignore-file', str(custom))
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('IGNORE: listed in', result.stdout)
        self.assertIn('1 ignored', result.stdout)
        self.assertFalse(self.ignore.exists())

    def test_ignore_appends_to_existing_file_and_applies_both_directions(self):
        self.ignore.write_text('keep-me')
        (self.codex / 'config.toml').write_bytes(sync.render(b'', [('reverse', {'url': 'https://example.org'})]))
        result = self.run_script(answer='i\ni\n')
        self.assertEqual(result.returncode, 0, result.stderr)
        text = self.ignore.read_text()
        self.assertTrue(text.startswith('keep-me\n'))
        self.assertEqual(sync.load_ignored(self.ignore), {'keep-me', 'sample', 'reverse'})
        self.assertFalse(self.destination.exists())
        self.assertNotIn('mcpServers', json.loads(self.claude.read_text()).get('projects', {}).get(str(self.root), {}))
        self.assertEqual(self.run_script('--check').returncode, 0)

    def test_pre_push_ignore_uses_terminal_once_and_continues(self):
        terminal = unittest.mock.MagicMock()
        terminal.readline.return_value = 'i\n'
        with patch.dict(os.environ, self.env), patch('sys.argv', [str(SCRIPT),
                '--project', str(self.root), '--claude-config', str(self.claude), '--pre-push']), \
                patch('builtins.open', return_value=terminal) as tty, \
                patch('builtins.input') as stdin, patch('builtins.print'):
            self.assertEqual(sync.main(), 0)
            tty.assert_called_once_with('/dev/tty', 'r+')
            stdin.assert_not_called()
            terminal.close.assert_called_once()
        self.assertEqual(sync.load_ignored(self.ignore), {'sample'})
        self.assertFalse(self.destination.exists())

    def test_mixed_answers_import_some_and_ignore_others(self):
        data = json.loads(self.claude.read_text())
        data['mcpServers']['second'] = {'type': 'http', 'url': 'https://example.net'}
        self.claude.write_text(json.dumps(data))
        result = self.run_script('--direction', 'to-codex', answer='y\ni\n')
        self.assertEqual(result.returncode, 0, result.stderr)
        servers = tomllib.loads(self.destination.read_text())['mcp_servers']
        self.assertEqual(set(servers), {'sample'})
        self.assertEqual(sync.load_ignored(self.ignore), {'second'})
        self.assertEqual(self.run_script('--check').returncode, 0)


if __name__ == '__main__':
    unittest.main()
