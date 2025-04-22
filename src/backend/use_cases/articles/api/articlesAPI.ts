import { IArticle } from "backend/models/article";

/**
 * Client-side function to fetch all articles
 * @returns A promise that resolves to an array of IArticle objects
 */
export async function getAllArticlesAPI(): Promise<IArticle[]> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const response = await fetch(`${baseUrl}/api/articles`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch articles');
    }

    return await response.json();
}

/**
 * Client-side function to fetch a single article by id
 * @param id The id of the article to fetch
 * @returns A promise that resolves to an IArticle object
 */
export async function getArticleByIdAPI(id: string): Promise<IArticle> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const response = await fetch(`${baseUrl}/api/articles/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch article');
    }

    return await response.json();
}

/**
 * Client-side function to fetch article previews
 * @returns A promise that resolves to an array of IArticle objects with preview data
 */
export async function getArticlePreviewsAPI(): Promise<IArticle[]> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const response = await fetch(`${baseUrl}/api/articles/preview`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch article previews');
    }

    return await response.json();
}

/**
 * Client-side function to create a new article
 * @param article The article data to create
 * @returns A promise that resolves to the success message
 */
export async function createArticleAPI(article: Omit<IArticle, '_id'>): Promise<{ message: string }> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const response = await fetch(`${baseUrl}/api/articles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create article');
    }

    return await response.json();
}

/**
 * Client-side function to update an existing article
 * @param id The id of the article to update
 * @param article The updated article data
 * @returns A promise that resolves to the updated IArticle object
 */
export async function updateArticleAPI(id: string, article: Partial<IArticle>): Promise<IArticle> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const response = await fetch(`${baseUrl}/api/articles/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update article');
    }

    return await response.json();
}

/**
 * Client-side function to delete an article
 * @param id The id of the article to delete
 * @returns A promise that resolves to the success message
 */
export async function deleteArticleAPI(id: string): Promise<{ message: string }> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const response = await fetch(`${baseUrl}/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete article');
    }

    return await response.json();
}

/**
 * Client-side function to delete all articles
 * @returns A promise that resolves to the success message
 */
export async function deleteAllArticlesAPI(): Promise<{ message: string }> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const response = await fetch(`${baseUrl}/api/articles?passcode=delete-all-articles`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete all articles');
    }

    return await response.json();
}