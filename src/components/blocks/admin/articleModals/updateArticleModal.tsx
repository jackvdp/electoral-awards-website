// components/admin/articleModals/UpdateArticleModal.tsx
import React, { useState, useEffect } from 'react';
import {updateArticleAPI} from "backend/use_cases/articles/api/articlesAPI";
import { IArticle } from 'backend/models/article';
import ReusableForm, { InputItem } from 'components/reuseable/Form';
import RichTextEditor from './RichTextEditor';

interface UpdateArticleModalProps {
    modalID: string;
    articleData: IArticle;
    onUpdated: (article: IArticle) => void;
}

const UpdateArticleModal: React.FC<UpdateArticleModalProps> = ({ modalID, articleData, onUpdated }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Format date for the input
    const formatDateForInput = (dateString: string): string => {
        try {
            // Try to parse the date
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return new Date().toISOString().split('T')[0];
            }
            return date.toISOString().split('T')[0];
        } catch (error) {
            return new Date().toISOString().split('T')[0];
        }
    };

    useEffect(() => {
        // Ensure modal shows when the component renders
        const modalElement = document.getElementById(modalID);
        if (modalElement) {
            const bsModal = new (window as any).bootstrap.Modal(modalElement);
            bsModal.show();
        }
    }, [modalID]);

    const handleSubmit = async (values: Record<string, string>) => {
        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            // Format article data
            const updatedArticleData = {
                title: values.title,
                description: values.description,
                content: values.content,
                category: values.category,
                link: values.link,
                image: values.image,
                date: values.date,
            };

            // Update article
            const updatedArticle = await updateArticleAPI(articleData._id, updatedArticleData);

            // Close modal
            const modalElement = document.getElementById(modalID);
            if (modalElement) {
                const bsModal = (window as any).bootstrap.Modal.getInstance(modalElement);
                bsModal?.hide();
            }

            // Update parent component
            onUpdated(updatedArticle);
        } catch (error) {
            console.error('Error updating article:', error);
            setErrorMessage(error instanceof Error ? error.message : 'Failed to update article');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputItems: InputItem[] = [
        {
            title: 'Title',
            placeholder: 'Enter article title',
            type: 'input',
            name: 'title',
            defaultValue: articleData.title,
            required: true
        },
        {
            title: 'Category',
            placeholder: 'Enter category',
            type: 'input',
            name: 'category',
            defaultValue: articleData.category,
            required: true
        },
        {
            title: 'Link',
            placeholder: 'URL-friendly slug',
            type: 'input',
            name: 'link',
            defaultValue: articleData.link,
            required: true
        },
        {
            title: 'Image URL',
            placeholder: 'Enter image URL',
            type: 'input',
            name: 'image',
            defaultValue: articleData.image,
            required: true
        },
        {
            title: 'Date',
            placeholder: 'YYYY-MM-DD',
            type: 'date',
            name: 'date',
            defaultValue: formatDateForInput(articleData.date),
            required: true
        },
        {
            title: 'Description',
            placeholder: 'Enter a short description',
            type: 'area',
            name: 'description',
            defaultValue: articleData.description,
            required: true
        },
        // Content field is handled separately with RichTextEditor

    ];

    return (
        <div className="modal fade" id={modalID} tabIndex={-1} aria-labelledby={`${modalID}-label`} aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={`${modalID}-label`}>Update Article</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {errorMessage && (
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                        )}
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target as HTMLFormElement);
                            const values: Record<string, string> = {};

                            // Process form fields
                            inputItems.forEach(item => {
                                const value = formData.get(item.name);
                                if (value) values[item.name] = value.toString();
                            });

                            // Add content from RichTextEditor
                            const contentTextarea = document.getElementById('update-article-content-value') as HTMLInputElement;
                            if (contentTextarea) {
                                values['content'] = contentTextarea.value;
                            }

                            handleSubmit(values);
                        }}>
                            <ReusableForm
                                inputItems={inputItems}
                                submitButtonTitle=""
                                onSubmit={() => {}}
                                disableSubmitInitially={false}
                                isSubmitting={isSubmitting}
                                noSubmitButton={true}
                            />

                            <div className="mb-3">
                                <label className="form-label">Content</label>
                                <RichTextEditor
                                    initialValue={articleData.content}
                                    onChange={(value) => {
                                        // Store content in hidden input for form submission
                                        const hiddenInput = document.getElementById('update-article-content-value') as HTMLInputElement;
                                        if (hiddenInput) hiddenInput.value = value;
                                    }}
                                    minHeight="400px"
                                />
                                <input
                                    type="hidden"
                                    id="update-article-content-value"
                                    name="content"
                                    defaultValue={articleData.content}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Updating...' : 'Update Article'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateArticleModal;