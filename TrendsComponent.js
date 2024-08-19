// frontend/src/TrendsComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrendsComponent = () => {
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('US');
  const [trendsData, setTrendsData] = useState([]);

  const fetchTrends = () => {
    axios.get('http://localhost:5000/api/trends', {
      params: {
        company: company,
        country: country
      }
    })
    .then(response => setTrendsData(response.data))
    .catch(error => console.error("Erreur lors de la récupération des données", error));
  };

  useEffect(() => {
    if (company) {
      fetchTrends();
    }
  }, [company, country]);

  return (
    <div>
      <input 
        type="text" 
        value={company} 
        onChange={(e) => setCompany(e.target.value)} 
        placeholder="Nom de l'entreprise" 
      />
      <input 
        type="text" 
        value={country} 
        onChange={(e) => setCountry(e.target.value)} 
        placeholder="Pays (ex: US, FR)" 
      />
      <button onClick={fetchTrends}>Rechercher</button>

      {trendsData.length > 0 && (
        <div>
          <h3>Résultats de recherche pour {company} dans {country}</h3>
          <ul>
            {trendsData.map((item, index) => (
              <li key={index}>{item.date}: {item[company]}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TrendsComponent;
