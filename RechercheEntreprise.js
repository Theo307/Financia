import React, { useState } from 'react';
import axios from 'axios';
import './RechercheEntreprise.css';

const RechercheEntreprise = ({ onAddCompany }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);
        if (value.length > 2) {
            const response = await axios.get(`https://finnhub.io/api/v1/search?q=${value}&token=cr0te8pr01qhal3pj750cr0te8pr01qhal3pj75g`);
            setSuggestions(response.data.result.slice(0, 10));
        } else {
            setSuggestions([]);
        }
    };

    const handleAdd = (company) => {
        onAddCompany(company);
        setQuery('');
        setSuggestions([]);
    };

    return (
        <div className="search-page">
            <input
                type="text"
                placeholder="Search"
                value={query}
                onChange={handleSearch}
                className="search-bar"
            />
            <div className="suggestions-container">
                {suggestions.map((company) => (
                    <div key={company.symbol} className="suggestion-item">
                        <div className="company-info">
                            <div>{company.description}</div>
                            <div>{company.symbol}</div>
                        </div>
                        <button onClick={() => handleAdd(company)}>+</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RechercheEntreprise;
