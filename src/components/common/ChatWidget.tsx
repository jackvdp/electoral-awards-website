import { useChat } from '@ai-sdk/react';
import { UIMessage } from 'ai';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

export default function ChatWidget() {
  const { pathname } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    id: 'site-chat',
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hello! I can help with questions about the International Electoral Awards & Symposium. What would you like to know?',
        parts: [{ type: 'text', text: 'Hello! I can help with questions about the International Electoral Awards & Symposium. What would you like to know?' }],
      },
    ],
  });

  const isStreaming = status === 'submitted' || status === 'streaming';

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput('');
    sendMessage({ text });
  };

  return (
    <>
      {/* Chat panel */}
      {isOpen && (
        <div className="chat-widget-panel bg-white">
          {/* Header */}
          <div
            className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom bg-primary text-white"
            style={{ borderRadius: '0.75rem 0.75rem 0 0' }}
          >
            <span className="fw-bold small">Chat with us</span>
            <button
              type="button"
              className="btn btn-link text-white p-0 lh-1"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <i className="uil uil-times" style={{ fontSize: '1.25rem' }} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-widget-messages">
            {messages.map((message) => (
              <div key={message.id} className={`chat-message chat-message--${message.role}`}>
                <div className="chat-message-bubble">
                  {message.role === 'assistant' ? (
                    <ReactMarkdown
                      components={{
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target={href?.startsWith('http') ? '_blank' : undefined}
                            rel="noopener noreferrer"
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {getMessageText(message)}
                    </ReactMarkdown>
                  ) : (
                    getMessageText(message)
                  )}
                </div>
              </div>
            ))}

            {isStreaming && (messages[messages.length - 1] as { role: string })?.role === 'user' && (
              <div className="chat-message chat-message--assistant">
                <div className="chat-typing-indicator">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            {error && (
              <div className="chat-message chat-message--assistant">
                <div className="chat-message-bubble text-danger small">Something went wrong. Please try again.</div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="d-flex border-top p-2 gap-2">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isStreaming}
            />
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              disabled={!input.trim() || isStreaming}
              aria-label="Send message"
            >
              <i className="uil uil-message" />
            </button>
          </form>
        </div>
      )}

      {/* Floating bubble */}
      <button
        type="button"
        className="chat-widget-bubble btn btn-primary rounded-circle shadow-lg"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <i className={isOpen ? 'uil uil-times' : 'uil uil-comment-dots'} />
      </button>
    </>
  );
}
