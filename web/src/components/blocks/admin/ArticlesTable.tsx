// components/admin/ArticlesTable.tsx
import React, { useState } from 'react';
import DataTable from './reusables/DataTable';
import { IArticle } from 'backend/models/article';
import { deleteArticleAPI } from "backend/use_cases/articles/api/articlesAPI";
import { useRouter } from 'next/router';
import Link from 'next/link';
import CreateArticleModal from "./articleModals/createArticleModal";
import UpdateArticleModal from './articleModals/updateArticleModal';

interface ArticlesTableProps {
    articles: IArticle[];
}

const ArticlesTable: React.FC<ArticlesTableProps> = ({ articles }) => {
    const router = useRouter();
    const [currentArticles, setCurrentArticles] = useState<IArticle[]>(articles);
    const [selectedArticle, setSelectedArticle] = useState<IArticle | null>(null);

    const headers = ['Title', 'Category', 'Date', 'Actions'];

    const handleDeleteArticle = async (articleId: string) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            try {
                await deleteArticleAPI(articleId);
                setCurrentArticles(currentArticles.filter(article => article._id !== articleId));
            } catch (error) {
                console.error('Error deleting article:', error);
                alert('Failed to delete article');
            }
        }
    };

    const openUpdateModal = (article: IArticle) => {
        setSelectedArticle(article);
    };

    const handleArticleCreated = (newArticle: IArticle) => {
        setCurrentArticles([...currentArticles, newArticle]);
    };

    const handleArticleUpdated = (updatedArticle: IArticle) => {
        setCurrentArticles(
            currentArticles.map(article =>
                article._id === updatedArticle._id ? updatedArticle : article
            )
        );
        setSelectedArticle(null); // Clear the selected article
    };

    const renderRow = (article: IArticle) => (
        <tr>
            <td>
                <Link href={`/articles/${article.link}`}>
                    {article.title}
                </Link>
            </td>
            <td>{article.category}</td>
            <td>{new Date(article.date).toLocaleDateString()}</td>
            <td>
                <Link href={`/admin/dashboard/article-view?articleId=${article._id}`}
                      className="btn btn-sm btn-outline-secondary rounded-pill me-1">
                    View
                </Link>
                <button
                    className="btn btn-sm btn-soft-primary rounded-pill me-1"
                    data-bs-toggle="modal"
                    data-bs-target={`#update-article-modal-${article._id}`}
                    onClick={() => openUpdateModal(article)}
                >
                    Edit
                </button>
                <button
                    className="btn btn-sm btn-soft-red rounded-pill"
                    onClick={() => handleDeleteArticle(article._id)}
                >
                    Delete
                </button>
            </td>
        </tr>
    );

    const headerAction = (
        <>
            <button
                data-bs-toggle="modal"
                data-bs-target="#create-article-modal"
                className="btn btn-sm btn-primary rounded-pill"
            >
                Create Article
            </button>
            <CreateArticleModal
                modalID="create-article-modal"
                onCreated={handleArticleCreated}
            />
        </>
    );

    return (
        <>
            <DataTable
                headerTitle="Articles"
                headerAction={headerAction}
                headers={headers}
                data={currentArticles}
                renderRow={renderRow}
            />

            {/* Render update modal outside the DataTable component */}
            {selectedArticle && (
                <UpdateArticleModal
                    modalID={`update-article-modal-${selectedArticle._id}`}
                    articleData={selectedArticle}
                    onUpdated={handleArticleUpdated}
                />
            )}
        </>
    );
};

export default ArticlesTable;