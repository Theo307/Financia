import React, { useState } from 'react';
import axios from 'axios';
import './PublicInterest.css';

const PublicInterest = () => {
  const [company, setCompany] = useState('');
  const [articles, setArticles] = useState([]);

  const handleSearch = () => {
    if (company) {
      axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: company,
          apiKey: '80ea1329b0ed4124b2d71591df03b35d',  // Remplacez par votre clé API News API
          language: 'fr',
          sortBy: 'relevancy',
        }
      })
      .then(response => {
        setArticles(response.data.articles);
      })
      .catch(error => {
        console.error('Error fetching news:', error);
      });
    }
  };

  return (
    <div className="public-interest-container">
      <div className="search-bar">
        <input 
          type="text" 
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="Rechercher une entreprise..."
        />
        <button onClick={handleSearch}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001a1.007 1.007 0 0 0-.025.025l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.025-.025zm-5.44-4.11a5.5 5.5 0 1 1 0 7.778 5.5 5.5 0 0 1 0-7.778z"/>
          </svg>
        </button>
      </div>
      <div className="articles-container">
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <div key={index} className="article">
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">Lire l'article</a>
            </div>
          ))
        ) : (
          <p>Aucun article trouvé. Essayez de rechercher une autre entreprise.</p>
        )}
      </div>
    </div>
  );
};

export default PublicInterest;
