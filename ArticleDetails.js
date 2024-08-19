import React from 'react';
import { useParams } from 'react-router-dom';
import './ArticleDetails.css';

const ArticleDetail = ({ articles }) => {
  const { id } = useParams();
  const article = articles[id];

  return (
    <div className="article-detail-container">
      <h1>{article.title}</h1>
      <p>{article.description}</p>
      <a href={article.url} target="_blank" rel="noopener noreferrer">Lire l'article complet</a>
    </div>
  );
};

export default ArticleDetail;
