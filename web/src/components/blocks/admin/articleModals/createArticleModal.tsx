// components/admin/articleModals/CreateArticleModal.tsx
import React, { useState } from 'react';
import { createArticleAPI } from "backend/use_cases/articles/api/articlesAPI";
import { IArticle } from 'backend/models/article';
import ReusableForm, { InputItem } from 'components/reuseable/Form';
import RichTextEditor from './RichTextEditor';
import {IEvent} from "../../../../backend/models/event";

interface CreateArticleModalProps {
    modalID: string;
    onCreated: (article: IArticle) => void;
}

const CreateArticleModal: React.FC<CreateArticleModalProps> = ({ modalID, onCreated }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [articleContent, setArticleContent] = useState<string>('');

    // Generate URL-friendly slug from title
    const generateSlug = (title: string): string => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleFormSubmit = async (values: Record<string, string>) => {
        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            // Add content from RichTextEditor to the values
            values.content = articleContent;

            // Validate required fields
            const requiredFields = ['title', 'category', 'image', 'description', 'content'];
            for (const field of requiredFields) {
                if (!values[field]) {
                    throw new Error(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
                }
            }

            // Format article data
            const articleData = {
                title: values.title,
                description: values.description,
                content: values.content,
                category: values.category,
                link: generateSlug(values.title),
                image: values.image,
                date: new Date().toISOString(), // Use proper ISO format
            };

            console.log("Submitting article data:", articleData);


            await createArticleAPI(articleData as IArticle);
        } catch (error) {
            console.error('Error creating article:', error);
            setErrorMessage(error instanceof Error ? error.message : 'Failed to create article');
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
            defaultValue: '',
            required: true
        },
        {
            title: 'Category',
            placeholder: 'Enter category',
            type: 'input',
            name: 'category',
            defaultValue: '',
            required: true
        },
        {
            title: 'Image URL',
            placeholder: 'Enter image URL',
            type: 'input',
            name: 'image',
            defaultValue: '',
            required: true
        },
        {
            title: 'Description',
            placeholder: 'Enter a short description',
            type: 'area',
            name: 'description',
            defaultValue: '',
            required: true
        },
    ];

    return (
        <div className="modal fade" id={modalID} tabIndex={-1} aria-labelledby={`${modalID}-label`} aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id={`${modalID}-label`}>Create Article</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {errorMessage && (
                            <div className="alert alert-danger" role="alert">
                                {errorMessage}
                            </div>
                        )}

                        <ReusableForm
                            inputItems={inputItems}
                            submitButtonTitle="Create Article"
                            onSubmit={handleFormSubmit}
                            disableSubmitInitially={false}
                            additionalButtons={[
                                <button
                                    key="cancel"
                                    type="button"
                                    className="btn btn-secondary m-4"
                                    data-bs-dismiss="modal"
                                >
                                    Cancel
                                </button>
                            ]}
                        />

                        <div className="mb-3">
                            <label className="form-label">Content</label>
                            <RichTextEditor
                                initialValue=""
                                onChange={(value) => {
                                    setArticleContent(value);
                                }}
                                minHeight="400px"
                            />
                            {isSubmitting && !articleContent && (
                                <div className="text-danger mt-2">Content is required</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateArticleModal;