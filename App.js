import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import FinancialForecast from "./FinancialForecast";
import Analyseconcurrentielle from "./AnalyseConcurentielle";
import PublicInterest from "./Publicinterest";
import RechercheEntreprise from "./RechercheEntreprise";
import axios from 'axios';
import "./App.css";

function App() {
  const [activeSection, setActiveSection] = useState("home");

  const [concurrents, setConcurrents] = useState([
    { name: 'Spotify', bourse: '+1%', va: '297$', logo: 'https://logo.clearbit.com/spotify.com' },
    { name: 'Apple Music', bourse: '+0.16%', va: '223$', logo: 'https://logo.clearbit.com/apple.com' }
  ]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const ajouterConcurrent = (company) => {
    axios.get(`https://finnhub.io/api/v1/quote?symbol=${company.symbol}&token=cr0te8pr01qhal3pj750cr0te8pr01qhal3pj75g`)
      .then(response => {
        const nouveauConcurrent = {
          name: company.description,
          bourse: `${(response.data.dp > 0 ? '+' : '')}${response.data.dp}%`,
          va: `${response.data.c}$`,
          logo: `https://logo.clearbit.com/${company.symbol.toLowerCase()}.com`
        };
        setConcurrents([...concurrents, nouveauConcurrent]);
        setActiveSection("home"); // Retour au Dashboard après l'ajout
      });
  };

  return (
    <div className="App">
      <Sidebar onSectionChange={handleSectionChange} />
  
      {activeSection === "home" && (
        <Dashboard concurrents={concurrents} onAddClick={() => setActiveSection("RechercheEntreprise")} />
      )}
      {activeSection === "FinancialForecast" && <FinancialForecast />}
      {activeSection === "CompetitiveAnalysis" && <Analyseconcurrentielle />}
      {activeSection === "Publicinterest" && <PublicInterest />}
      {activeSection === "RechercheEntreprise" && (
        <RechercheEntreprise onAddCompany={ajouterConcurrent} />
      )}
    </div>
  );
}

export default App;
