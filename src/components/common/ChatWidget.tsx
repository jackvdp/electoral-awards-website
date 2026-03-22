import { useChat } from '@ai-sdk/react';
import { UIMessage } from 'ai';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from 'auth/useAuth';

const STORAGE_KEY = 'chat-messages';
const STORAGE_TIME_KEY = 'chat-messages-time';
const MAX_AGE_MS = 3 * 60 * 60 * 1000; // 3 hours

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant' as const,
  parts: [{ type: 'text' as const, text: 'Hello! I can help with questions about the International Electoral Awards & Symposium. What would you like to know?' }],
};

function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

function loadMessages(): UIMessage[] {
  try {
    const storedTime = localStorage.getItem(STORAGE_TIME_KEY);
    if (storedTime && Date.now() - Number(storedTime) > MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_TIME_KEY);
      return [welcomeMessage];
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return [welcomeMessage];
}

export default function ChatWidget() {
  const { pathname } = useRouter();
  const { isLoggedIn, currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showClosePrompt, setShowClosePrompt] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, setMessages, status, error } = useChat({
    id: 'site-chat',
    messages: loadMessages(),
  });

  // Persist messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      localStorage.setItem(STORAGE_TIME_KEY, String(Date.now()));
    }
  }, [messages]);

  const isStreaming = status === 'submitted' || status === 'streaming';

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Scroll to bottom and focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null;

  const handleClose = () => {
    // Only show prompt if there's a real conversation (more than just the welcome message)
    if (messages.length > 1) {
      setShowClosePrompt(true);
    } else {
      setIsOpen(false);
      setIsFullscreen(false);
    }
  };

  const handleSaveAndClose = () => {
    setShowClosePrompt(false);
    setIsOpen(false);
    setIsFullscreen(false);
  };

  const handleDiscardAndClose = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_TIME_KEY);
    setMessages([welcomeMessage]);
    setShowClosePrompt(false);
    setIsOpen(false);
    setIsFullscreen(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput('');
    sendMessage({ text }, {
      body: {
        isLoggedIn,
        userName: currentUser?.user_metadata?.firstname || null,
      },
    });
  };

  return (
    <>
      {/* Chat panel */}
      {isOpen && (
        <div className={`chat-widget-panel bg-white ${isFullscreen ? 'chat-widget-panel--fullscreen' : ''}`}>
          {/* Header */}
          <div
            className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom bg-primary text-white"
            style={{ borderRadius: '0.75rem 0.75rem 0 0' }}
          >
            <span className="fw-bold small">Chat with us</span>
            <div className="d-flex gap-2 align-items-center">
              <button
                type="button"
                className="btn btn-link text-white p-0 lh-1"
                onClick={() => setIsFullscreen((prev) => !prev)}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                <i className={isFullscreen ? 'uil uil-compress-alt' : 'uil uil-expand-alt'} style={{ fontSize: '1.1rem' }} />
              </button>
              <button
                type="button"
                className="btn btn-link text-white p-0 lh-1"
                onClick={handleClose}
                aria-label="Close chat"
              >
                <i className="uil uil-times" style={{ fontSize: '1.25rem' }} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-widget-messages">
            {messages.map((message) => {
              if (message.role !== 'assistant') {
                const text = getMessageText(message);
                if (!text) return null;
                return (
                  <div key={message.id} className={`chat-message chat-message--${message.role}`}>
                    <div className="chat-message-bubble">{text}</div>
                  </div>
                );
              }

              // Render each text part as its own bubble so multi-step
              // tool responses appear as separate messages
              const textParts = message.parts.filter(
                (p): p is { type: 'text'; text: string } => p.type === 'text' && !!p.text.trim()
              );
              if (textParts.length === 0) return null;

              const isLastMessage = message === messages[messages.length - 1];
              const lastPart = message.parts[message.parts.length - 1];
              const waitingForTool = isStreaming && isLastMessage && lastPart?.type === 'tool-invocation';

              return (
                <div key={message.id}>
                  {textParts.map((part, i) => (
                    <div key={`${message.id}-${i}`} className="chat-message chat-message--assistant">
                      <div className="chat-message-bubble">
                        <ReactMarkdown
                          components={{
                            a: ({ href, children }) => (
                              <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
                            ),
                          }}
                        >
                          {part.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  {waitingForTool && (
                    <div className="chat-message chat-message--assistant">
                      <div className="chat-typing-indicator">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

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

          {/* Close prompt */}
          {showClosePrompt && (
            <div className="border-top p-3 text-center bg-light">
              <p className="small mb-2">Save this conversation for later?</p>
              <div className="d-flex justify-content-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={handleSaveAndClose}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleDiscardAndClose}
                >
                  Discard
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-muted"
                  onClick={() => setShowClosePrompt(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="d-flex border-top p-2 gap-2">
            <input
              ref={inputRef}
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
        onClick={() => isOpen ? handleClose() : setIsOpen(true)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <i className={isOpen ? 'uil uil-times' : 'uil uil-comment-dots'} />
      </button>
    </>
  );
}
