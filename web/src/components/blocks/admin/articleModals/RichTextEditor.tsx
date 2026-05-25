// components/admin/articleModals/RichTextEditor.tsx
import React, { useState, useEffect } from 'react';

interface RichTextEditorProps {
    initialValue: string;
    onChange: (value: string) => void;
    placeholder?: string;
    minHeight?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
                                                           initialValue,
                                                           onChange,
                                                           placeholder = 'Write your content here...',
                                                           minHeight = '300px'
                                                       }) => {
    const [content, setContent] = useState(initialValue);

    useEffect(() => {
        setContent(initialValue);
    }, [initialValue]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value;
        setContent(newContent);
        onChange(newContent);
    };

    // Simple toolbar actions
    const insertMarkdown = (markdownSyntax: string, selection: boolean = false) => {
        const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        let newText = '';

        if (selection && selectedText) {
            // Apply syntax to selection
            newText = textarea.value.substring(0, start) +
                markdownSyntax.replace('$1', selectedText) +
                textarea.value.substring(end);
        } else {
            // Insert syntax at cursor position
            newText = textarea.value.substring(0, start) +
                markdownSyntax +
                textarea.value.substring(end);
        }

        setContent(newText);
        onChange(newText);

        // Restore focus to textarea
        setTimeout(() => {
            textarea.focus();
            if (selection && selectedText) {
                // Calculate new cursor position based on the pattern
                const cursorPos = markdownSyntax.indexOf('$1');
                if (cursorPos !== -1) {
                    const newPosition = start + cursorPos + selectedText.length;
                    textarea.setSelectionRange(newPosition, newPosition);
                }
            } else {
                // Position cursor based on markdown syntax (e.g., between ** for bold)
                const cursorPattern = markdownSyntax.indexOf('||');
                if (cursorPattern !== -1) {
                    const newPosition = start + cursorPattern;
                    textarea.setSelectionRange(newPosition, newPosition);
                    // Remove the cursor placeholder from the actual text
                    const finalText = newText.replace('||', '');
                    setContent(finalText);
                    onChange(finalText);
                } else {
                    // Default cursor positioning at the end of the insertion
                    const newPosition = start + markdownSyntax.length;
                    textarea.setSelectionRange(newPosition, newPosition);
                }
            }
        }, 0);
    };

    return (
        <div className="rich-text-editor">
            <div className="editor-toolbar border rounded p-2 mb-2 bg-light">
                <button type="button" className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => insertMarkdown('**$1**', true)} title="Bold">
                    <i className="uil uil-bold"></i>
                </button>
                <button type="button" className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => insertMarkdown('*$1*', true)} title="Italic">
                    <i className="uil uil-italic"></i>
                </button>
                <button type="button" className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => insertMarkdown('# ||', false)} title="Heading 1">
                    <i className="uil uil-heading"></i>
                </button>
                <button type="button" className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => insertMarkdown('## ||', false)} title="Heading 2">
                    <i className="uil uil-heading"></i>2
                </button>
                <button type="button" className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => insertMarkdown('[](||)', false)} title="Link">
                    <i className="uil uil-link"></i>
                </button>
                <button type="button" className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => insertMarkdown('![](||)', false)} title="Image">
                    <i className="uil uil-image"></i>
                </button>
                <button type="button" className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => insertMarkdown('- ||', false)} title="List">
                    <i className="uil uil-list-ul"></i>
                </button>
                <button type="button" className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => insertMarkdown('1. ||', false)} title="Numbered List">
                    <i className="uil uil-list-ol"></i>
                </button>
                <button type="button" className="btn btn-sm btn-outline-secondary"
                        onClick={() => insertMarkdown('> ||', false)} title="Quote">
                    <i className="uil uil-comment-alt-lines"></i>
                </button>
            </div>
            <textarea
                id="markdown-editor"
                className="form-control"
                value={content}
                onChange={handleChange}
                placeholder={placeholder}
                style={{ minHeight }}
            />
            <div className="mt-2 small text-muted">
                This editor supports <a href="https://www.markdownguide.org/basic-syntax/" target="_blank" rel="noopener noreferrer">Markdown</a> formatting
            </div>
        </div>
    );
};

export default RichTextEditor;