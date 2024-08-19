import React from 'react';
import { Link } from 'react-router-dom';
import './ArticleList.css';

const ArticleList = ({ articles }) => {
  return (
    <div className="article-list-container">
      <h2>Les actualités</h2>
      <div className="article-cards">
        {articles.slice(0, 3).map((article, index) => (
          <div key={index} className="article-card">
            <span className="article-title">{article.title}</span>
            <Link to={`/article/${index}`} className="article-link">plus..</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleList;
