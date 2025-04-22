// components/admin/ArticlePreview.tsx
import React from 'react';
import { IArticle } from 'backend/models/article';
import ReactMarkdown from 'react-markdown';

interface ArticlePreviewProps {
    article: IArticle;
}

const ArticlePreview: React.FC<ArticlePreviewProps> = ({ article }) => {
    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="card-title mb-0">Article Preview</h4>
                <button
                    type="button"
                    className="btn-close"
                    onClick={() => window.history.back()}
                    aria-label="Close"
                ></button>
            </div>
            <div className="card-body">
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <span className="badge bg-primary me-2">{article.category}</span>
                            <small className="text-muted">
                                {new Date(article.date).toLocaleDateString()}
                            </small>
                        </div>
                        <a href={`/articles/${article.link}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                            View Published
                        </a>
                    </div>
                    <h2 className="mb-3">{article.title}</h2>
                    <div className="mb-4">
                        <img
                            src={article.image}
                            alt={article.title}
                            className="img-fluid rounded mb-3"
                            style={{ maxHeight: '300px', objectFit: 'cover', width: '100%' }}
                        />
                        <p className="lead">{article.description}</p>
                    </div>
                    <div className="article-content">
                        <ReactMarkdown>{article.content}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticlePreview;