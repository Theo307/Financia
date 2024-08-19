import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import axios from 'axios';
import ArticleList from './ArticleList';
import './AnalyseConcurentielle.css';

const StockData = () => {
  const [companyName, setCompanyName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [stockInfo, setStockInfo] = useState(null);
  const [overviewInfo, setOverviewInfo] = useState(null);
  const [chartData, setChartData] = useState({});
  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiKeysAlphaVantage = [
    'UV0ODMVPFOWS4T0S',
    '65M2KWLC633XCJEN',
    'V1GRJWDR5FPIPYYE',
    'YIX0XNCYMR8PTLBD',
    '4M4C63VH008KADX8',
    'XZHX7V418KN03EZ0',
    'XP190B85GH57YVBX'
  ];

  const apiKeysMarketaux = [
    'VZUkJYj3J06Y2JDFSKmbRtjGzPeWdw1BhqGfmH96',
    'VOTRE_CLE_API_MARKETAUX_2',
  ];

  const companies = [
    { name: 'Apple Inc.', symbol: 'AAPL', logo: 'https://logo.clearbit.com/apple.com' },
    { name: 'Microsoft Corporation', symbol: 'MSFT', logo: 'https://logo.clearbit.com/microsoft.com' },
    { name: 'Amazon.com, Inc.', symbol: 'AMZN', logo: 'https://logo.clearbit.com/amazon.com' },
    { name: 'Google LLC', symbol: 'GOOGL', logo: 'https://logo.clearbit.com/google.com' },
    { name: 'Facebook, Inc.', symbol: 'META', logo: 'https://logo.clearbit.com/facebook.com' },
  ];

  const handleInputChange = async (e) => {
    const input = e.target.value.toUpperCase();
    setCompanyName(input);

    setLoading(true);
    setError(null);

    const matchedCompany = companies.find(company => company.symbol === input);

    try {
      if (matchedCompany) {
        setSymbol(matchedCompany.symbol);

        const functionType = 'TIME_SERIES_DAILY';
        const overviewType = 'OVERVIEW';
        const baseURL = 'https://www.alphavantage.co/query';

        // Récupérer les données boursières pour le graphique
        const stockData = await fetchWithRetriesAlphaVantage(`${baseURL}?function=${functionType}&symbol=${matchedCompany.symbol}`);
        const overviewData = await fetchWithRetriesAlphaVantage(`${baseURL}?function=${overviewType}&symbol=${matchedCompany.symbol}`);

        // Préparer les données pour le graphique
        const chartLabels = stockData && Object.keys(stockData['Time Series (Daily)']).reverse();
        const chartPrices = chartLabels && chartLabels.map(date => stockData['Time Series (Daily)'][date]['4. close']);

        const analystTargetPrice = overviewData && overviewData.AnalystTargetPrice 
          ? Array(chartLabels.length).fill(overviewData.AnalystTargetPrice)
          : null;

        setChartData({
          labels: chartLabels || [],
          datasets: [
            {
              label: `${matchedCompany.symbol} Stock Price`,
              data: chartPrices || [],
              fill: false,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: '#0071eb',
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.4,
            },
            analystTargetPrice && {
              label: 'Analyst Target Price',
              data: analystTargetPrice,
              fill: false,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: '#ff6384',
              borderWidth: 2,
              borderDash: [10, 5],
              pointRadius: 0,
            },
          ].filter(Boolean),
        });

        setStockInfo(stockData);
        setOverviewInfo(overviewData);
      }

      // Récupérer les articles d'actualités via Marketaux API
      await fetchNewsWithRetries(input);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithRetriesAlphaVantage = async (url) => {
    for (let i = 0; i < apiKeysAlphaVantage.length; i++) {
      try {
        const response = await fetch(`${url}&apikey=${apiKeysAlphaVantage[i]}`);
        const data = await response.json();
        if (!data['Error Message']) {
          return data;
        } else {
          console.error(`Clé API ${apiKeysAlphaVantage[i]} a retourné une erreur: ${data['Error Message']}`);
        }
      } catch (err) {
        console.error(`Erreur avec la clé API ${apiKeysAlphaVantage[i]}:`, err);
      }
    }
    throw new Error('Toutes les clés API Alpha Vantage ont échoué.');
  };

  const fetchNewsWithRetries = async (query) => {
    for (let i = 0; i < apiKeysMarketaux.length; i++) {
      const url = `https://api.marketaux.com/v1/news/all?api_token=${apiKeysMarketaux[i]}&symbols=${query}&filter_entities=true&language=en&sort=published_desc`;

      try {
        const response = await axios.get(url);
        if (response.data && response.data.data) {
          setNewsArticles(response.data.data);
          return;
        }
      } catch (err) {
        console.error(`Erreur avec la clé API Marketaux ${apiKeysMarketaux[i]}:`, err);
      }
    }
    throw new Error('Toutes les clés API Marketaux ont échoué.');
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(companyName.toLowerCase())
  );

  const ArticleDetail = () => {
    const { id } = useParams();
    const article = newsArticles[id];

    return (
      <div className="article-detail-container">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <a href={article.url} target="_blank" rel="noopener noreferrer">Lire l'article complet</a>
      </div>
    );
  };

  return (
    <Router>
      <div className="stock-data-container">
        <div className="search-bar-container">
          <input
            type="text"
            value={companyName}
            onChange={handleInputChange}
            placeholder="Entrez le nom de l'entreprise ou le symbole"
            className="search-input"
          />
          {companyName && filteredCompanies.length > 0 && (
            <ul className="suggestions-list">
              {filteredCompanies.map((company) => (
                <li
                  key={company.symbol}
                  onClick={() => handleInputChange({ target: { value: company.symbol } })}
                  className="suggestion-item"
                >
                  <img src={company.logo} alt={company.name} />
                  {company.name} ({company.symbol})
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="main-content">
          {loading && <p>Chargement...</p>}
          {error && <p>Erreur: {error}</p>}

          {overviewInfo && (
            <div className="company-info">
              <img src={filteredCompanies.find(c => c.symbol === symbol)?.logo} alt={overviewInfo.Name} />
              <div>
                <h2>Valeur:</h2>
                <p>{overviewInfo.MarketCapitalization ? `${(overviewInfo.MarketCapitalization / 1e9).toFixed(2)} Md` : 'Non communiqué'}</p>
              </div>
              <div>
                <h2>Chiffre d'affaire:</h2>
                <p>{overviewInfo.RevenueTTM ? `${(overviewInfo.RevenueTTM / 1e9).toFixed(2)} Md` : 'Non communiqué'}</p>
              </div>
              <div>
                <h2>Bénéfice/Perte brut:</h2>
                <p className={overviewInfo.GrossProfitTTM >= 0 ? 'positive-value' : 'negative-value'}>
                  {overviewInfo.GrossProfitTTM ? `${(overviewInfo.GrossProfitTTM / 1e6).toFixed(0)} M` : 'Non communiqué'}
                </p>
              </div>
              <div>
                <h2>Secteur:</h2>
                <p>{overviewInfo.Sector || 'Non communiqué'}</p>
              </div>
            </div>
          )}

          {chartData && chartData.labels && (
            <div className="chart-container">
              <h2>Graphique des prix de {symbol}</h2>
              <Line data={chartData} options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    grid: {
                      display: true,
                      color: '#e5e5e5',
                    },
                    ticks: {
                      color: '#ffffff',
                      maxTicksLimit: 10,
                    },
                  },
                  y: {
                    grid: {
                      display: true,
                      color: '#e5e5e5',
                    },
                    ticks: {
                      color: '#ffffff',
                    },
                  },
                },
                plugins: {
                  legend: {
                    display: true,
                  },
                  tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false,
                  },
                },
                elements: {
                  line: {
                    tension: 0.4,
                  },
                },
              }} />
            </div>
          )}

          {newsArticles.length > 0 && (
            <ArticleList articles={newsArticles} />
          )}
        </div>

        <Routes>
          <Route path="/article/:id" element={<ArticleDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default StockData;
