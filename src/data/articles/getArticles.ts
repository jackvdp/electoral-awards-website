import articles from './articles';

const getArticle = (id: string) => {
  return articles.find(article => article.id == id)
};

export default getArticle