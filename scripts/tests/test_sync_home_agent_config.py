import importlib.util
import io
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

SCRIPT = Path(__file__).resolve().parents[1] / 'sync-home-agent-config.py'
spec = importlib.util.spec_from_file_location('home_sync', SCRIPT)
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)


class HomeSyncTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.home = Path(self.temp.name).resolve()
        self.codex = self.home / '.codex'

    def write(self, relative, text='instructions'):
        p = self.home / relative
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text)
        return p

    def apply_all(self):
        plans, problems = sync.scan(self.home, self.codex)
        self.assertFalse(problems, problems)
        for plan in plans:
            sync.apply(plan)
        self.assertEqual(sync.scan(self.home, self.codex), ([], []))

    def run_main(self, *args, answer='no'):
        with patch('sys.argv', [str(SCRIPT), '--home', str(self.home), *args]), \
                patch('builtins.input', return_value=answer), patch('sys.stdout', io.StringIO()):
            return sync.main()

    def test_claude_instructions_link_to_codex(self):
        source = self.write('.claude/CLAUDE.md')
        self.apply_all()
        self.assertEqual((self.codex / 'AGENTS.md').resolve(), source)

    def test_codex_instructions_move_to_claude(self):
        link = self.write('.codex/AGENTS.md')
        self.apply_all()
        self.assertTrue(link.is_symlink())
        self.assertEqual((self.home / '.claude/CLAUDE.md').read_text(), 'instructions')

    def test_root_instructions_reverse_link_normalised(self):
        source = self.write('AGENTS.md')
        (self.home / 'CLAUDE.md').symlink_to('AGENTS.md')
        self.apply_all()
        self.assertTrue(source.is_symlink())
        self.assertFalse((self.home / 'CLAUDE.md').is_symlink())

    def test_whole_skills_folder_moves_and_shares_future_changes(self):
        self.write('.agents/skills/example/SKILL.md')
        self.apply_all()
        self.assertTrue((self.home / '.agents/skills').is_symlink())
        self.write('.agents/skills/new/SKILL.md', 'new')
        self.assertEqual((self.home / '.claude/skills/new/SKILL.md').read_text(), 'new')

    def test_existing_folders_share_skills_in_both_directions(self):
        self.write('.agents/skills/codex/SKILL.md')
        self.write('.claude/skills/claude/SKILL.md')
        self.apply_all()
        for name in ('codex', 'claude'):
            self.assertTrue((self.home / '.agents/skills' / name).is_symlink())
            self.assertFalse((self.home / '.claude/skills' / name).is_symlink())

    def test_identical_skills_backed_up_before_linking(self):
        for app in ('.agents', '.claude'):
            self.write(f'{app}/skills/example/SKILL.md')
        self.apply_all()
        self.assertTrue((self.home / '.agents/skills-before-home-sync/example.before-home-sync/SKILL.md').exists())

    def test_conflicts_preserved(self):
        c = self.write('.claude/CLAUDE.md', 'claude')
        a = self.write('.codex/AGENTS.md', 'codex')
        self.assertEqual(self.run_main(answer='yes'), 1)
        self.assertEqual(c.read_text(), 'claude')
        self.assertEqual(a.read_text(), 'codex')

    def test_check_and_cancel_do_not_write(self):
        a = self.write('.codex/AGENTS.md')
        before = sync.fingerprint(a)
        for args in (('--check',), ()):
            self.assertEqual(self.run_main(*args), 1)
            self.assertEqual(sync.fingerprint(a), before)
            self.assertFalse((self.home / '.claude').exists())

    def test_concurrent_content_change_aborts(self):
        a = self.write('.codex/AGENTS.md')
        def change(_):
            a.write_text('changed')
            return 'yes'
        with patch('sys.argv', [str(SCRIPT), '--home', str(self.home)]), \
                patch('builtins.input', side_effect=change), patch('sys.stdout', io.StringIO()):
            with self.assertRaisesRegex(sync.ReviewError, 'changed during review'):
                sync.main()
        self.assertFalse(a.is_symlink())

    def test_external_link_and_override_require_review(self):
        outside = self.write('outside.md')
        self.codex.mkdir()
        (self.codex / 'AGENTS.md').symlink_to(outside)
        self.write('.codex/AGENTS.override.md')
        plans, problems = sync.scan(self.home, self.codex)
        self.assertFalse(plans)
        self.assertEqual(len(problems), 2)

    def test_failed_link_restores_original(self):
        a = self.write('.codex/AGENTS.md')
        plans, _ = sync.scan(self.home, self.codex)
        with patch.object(Path, 'symlink_to', side_effect=OSError('failed')):
            with self.assertRaises(OSError):
                sync.apply(plans[0])
        self.assertEqual(a.read_text(), 'instructions')
        self.assertFalse((self.home / '.claude/CLAUDE.md').exists())

    def test_hook_without_terminal_does_not_read_stdin(self):
        self.write('.codex/AGENTS.md')
        with patch('builtins.open', side_effect=OSError('no tty')):
            self.assertEqual(self.run_main('--pre-push', answer='yes'), 1)
        self.assertFalse((self.home / '.claude').exists())

    def test_relative_external_skill_link_not_moved(self):
        self.write('.agents/skills/example/SKILL.md')
        target = self.write('.agents/shared.txt')
        (self.home / '.agents/skills/example/data').symlink_to('../../shared.txt')
        plans, problems = sync.scan(self.home, self.codex)
        self.assertFalse(plans)
        self.assertIn('Relative link', problems[0])
        self.assertTrue(target.exists())

    def test_hook_confirmation_stops_after_changes_then_passes(self):
        self.write('.codex/AGENTS.md')
        terminal = unittest.mock.MagicMock()
        terminal.__enter__.return_value = terminal
        terminal.readline.return_value = 'yes\n'
        with patch('builtins.open', return_value=terminal) as tty:
            self.assertEqual(self.run_main('--pre-push'), 1)
            tty.assert_called_once_with('/dev/tty', 'r+')
        self.assertTrue((self.codex / 'AGENTS.md').is_symlink())
        self.assertEqual(self.run_main('--pre-push'), 0)
