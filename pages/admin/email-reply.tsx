import { GetServerSideProps, NextPage } from 'next';
import React, { useState, useRef } from 'react';
import { createClient } from 'backend/supabase/server-props';
import AdminPage from 'components/blocks/admin/reusables/AdminPage';
import Head from 'next/head';

const EmailReply: NextPage = () => {
  const [emailInput, setEmailInput] = useState('');
  const [reply, setReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleGenerate = async () => {
    if (!emailInput.trim() || isGenerating) return;

    setReply('');
    setIsGenerating(true);
    setCopied(false);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/admin/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim() }),
        signal: controller.signal,
      });

      if (!res.ok) {
        setReply('Something went wrong. Please try again.');
        setIsGenerating(false);
        return;
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let text = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });
          setReply(text);
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setReply('Something went wrong. Please try again.');
      }
    } finally {
      setIsGenerating(false);
      abortRef.current = null;
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setIsGenerating(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setEmailInput('');
    setReply('');
    setCopied(false);
  };

  return (
    <AdminPage title="Email Reply Generator">
      <Head>
        <title>Admin Dashboard | Email Reply Generator</title>
      </Head>

      <div className="row">
        {/* Input */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-white d-flex align-items-center justify-content-between">
              <h5 className="mb-0">Received Email</h5>
              {emailInput && (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleClear}
                  disabled={isGenerating}
                >
                  <i className="uil uil-trash-alt me-1" />
                  Clear
                </button>
              )}
            </div>
            <div className="card-body d-flex flex-column">
              <textarea
                className="form-control flex-grow-1 mb-3"
                style={{ minHeight: 300, resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem' }}
                placeholder="Paste the email you received here..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                disabled={isGenerating}
              />
              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary"
                  onClick={handleGenerate}
                  disabled={!emailInput.trim() || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <i className="uil uil-envelope-edit me-1" />
                      Generate Reply
                    </>
                  )}
                </button>
                {isGenerating && (
                  <button className="btn btn-outline-danger" onClick={handleStop}>
                    <i className="uil uil-times me-1" />
                    Stop
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="col-lg-6 mb-4">
          <div className="card h-100">
            <div className="card-header bg-white d-flex align-items-center justify-content-between">
              <h5 className="mb-0">Draft Reply</h5>
              {reply && !isGenerating && (
                <button
                  className={`btn btn-sm ${copied ? 'btn-success' : 'btn-outline-primary'}`}
                  onClick={handleCopy}
                >
                  <i className={`uil ${copied ? 'uil-check' : 'uil-copy'} me-1`} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            <div className="card-body">
              {reply ? (
                <pre
                  className="mb-0"
                  style={{
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem',
                    minHeight: 300,
                  }}
                >
                  {reply}
                  {isGenerating && <span className="text-muted">▊</span>}
                </pre>
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center text-muted"
                  style={{ minHeight: 300 }}
                >
                  {isGenerating ? (
                    <div className="text-center">
                      <span className="spinner-border spinner-border-sm d-block mx-auto mb-2" role="status" />
                      <span>Generating reply...</span>
                    </div>
                  ) : (
                    <span>Paste an email and click Generate Reply to get started.</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
};

export default EmailReply;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabase = createClient(ctx);

  const { data: { session } } = await supabase.auth.getSession();
  if (!session || session.user.user_metadata.role !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: {} };
};
