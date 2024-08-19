import React from "react";
import Switch from "react-switch";
import "./FinancialForecast.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

const FinancialForecast = () => {
 
  const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [selectedLastMonth, setSelectedLastMonth] = useState("Jul");
  const [selectedNextMonth, setSelectedNextMonth] = useState("Aug");

  const [data, setData] = useState([
    { name: "Jun", past: 4000 },
    { name: "Jul", past: 3000 },
    { name: "Aug", past: 2000, normal: 2000, best: 2000, worst: 2000 },
    { name: "Sep", normal: 4100, best: 4920, worst: 3280 },
    { name: "Oct", normal: 4200, best: 5040, worst: 3360 },
  ]);

  const [lastMonth, setLastMonth] = useState({
    saved: "",
    profit: "",
    expenses: "",
    invested: "",
    investmentReturn: "",
    showInvestment: false,
  });
  
  const [nextMonth, setNextMonth] = useState({
    saved: "",
    profit: "",
    expenses: "",
    invested: "",
    investmentReturn: "",
    showInvestment: false,
    risks: {
      savedRisk: "medium",
      profitRisk: "medium",
      expensesRisk: "medium",
      investmentRisk: "medium",
    },
  });

  const riskPercentage = {
    low: 10,
    medium: 20,
    high: 30,
  };

  // Fonction pour mettre à jour la courbe past
  const handleLastMonthSubmit = () => {
    const baseValue =
      parseFloat(lastMonth.profit || 0) +
      parseFloat(lastMonth.saved || 0) -
      parseFloat(lastMonth.expenses || 0) +
      parseFloat(lastMonth.invested || 0) *
        (parseFloat(lastMonth.investmentReturn || 0) / 100);

    const newData = data.map((item) => {
      if (item.name === selectedLastMonth) {
        return { ...item, past: baseValue };
      }
      return item;
    });

    setData(newData);
  };

  // Fonction pour mettre à jour les courbes de prévisualisation financière
  const handleNextMonthSubmit = () => {
    const baseValue =
      parseFloat(nextMonth.profit || 0) +
      parseFloat(nextMonth.saved || 0) -
      parseFloat(nextMonth.expenses || 0) +
      parseFloat(nextMonth.invested || 0) *
        (parseFloat(nextMonth.investmentReturn || 0) / 100);

    const totalRisk =
      riskPercentage[nextMonth.risks.profitRisk] +
      riskPercentage[nextMonth.risks.savedRisk] +
      riskPercentage[nextMonth.risks.expensesRisk] +
      riskPercentage[nextMonth.risks.investmentRisk];

    const averageRisk = totalRisk / 4;

    const best = baseValue * (1 + averageRisk / 100);
    const worst = baseValue * (1 - averageRisk / 100);

    const newData = data.map((item) => {
      if (item.name === selectedNextMonth) {
        return { ...item, normal: baseValue, best: best, worst: worst };
      }
      return item;
    });

    setData(newData);
  };

  const handleInputChange = (e, monthType) => {
    const { name, value } = e.target;

    if (monthType === "lastMonth") {
      setLastMonth((prev) => ({ ...prev, [name]: value }));
    } else {
      setNextMonth((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRiskChange = (riskType, riskLevel) => {
    setNextMonth((prev) => ({
      ...prev,
      risks: {
        ...prev.risks,
        [riskType]: riskLevel,
      },
    }));
  };

  return (
    <div className="financial-forecast-container">
      <h2 className="chart-title">Prévisualisation Financière</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="past" stroke="#8884d8" />
          <Line type="monotone" dataKey="normal" stroke="#82ca9d" />
          <Line type="monotone" dataKey="best" stroke="#ffc658" />
          <Line type="monotone" dataKey="worst" stroke="#ff0000" />
        </LineChart>
      </ResponsiveContainer>

      <div className="financial-form">
        <h3>Dernier mois</h3>
        <select
          className="styled-select"
          value={selectedLastMonth}
          onChange={(e) => setSelectedLastMonth(e.target.value)}
        >
          {months.slice(0, 2).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        <div className="text-fields">
          <div className="input-section">
            <label>Bénéfices</label>
            <input
              type="text"
              name="profit"
              value={lastMonth.profit}
              onChange={(e) => handleInputChange(e, "lastMonth")}
              placeholder="Par mois"
            />
          </div>
          <div className="input-section">
            <label>Somme épargnée</label>
            <input
              type="text"
              name="saved"
              value={lastMonth.saved}
              onChange={(e) => handleInputChange(e, "lastMonth")}
              placeholder="Par mois"
            />
          </div>
          <div className="input-section">
            <label>Somme Dépensée</label>
            <input
              type="text"
              name="expenses"
              value={lastMonth.expenses}
              onChange={(e) => handleInputChange(e, "lastMonth")}
              placeholder="Par mois"
            />
          </div>
          <div className="input-section investment">
            <label>Somme investie</label>
            <Switch
              onChange={() =>
                setLastMonth((prev) => ({
                  ...prev,
                  showInvestment: !prev.showInvestment,
                }))
              }
              checked={lastMonth.showInvestment}
            />
            {lastMonth.showInvestment && (
              <>
                <input
                  type="text"
                  name="invested"
                  value={lastMonth.invested}
                  onChange={(e) => handleInputChange(e, "lastMonth")}
                  placeholder="Par mois"
                />
                <input
                  type="text"
                  name="investmentReturn"
                  value={lastMonth.investmentReturn}
                  onChange={(e) => handleInputChange(e, "lastMonth")}
                  placeholder="en %"
                />
              </>
            )}
          </div>
        </div>
        <button className="validate-button" onClick={handleLastMonthSubmit}>
          Valider
        </button>
      </div>

      <div className="financial-projection">
        <h3>Objectif du mois prochain</h3>
        <select
          className="styled-select"
          value={selectedNextMonth}
          onChange={(e) => setSelectedNextMonth(e.target.value)}
        >
          {months.slice(2).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        <div className="projection-inputs">
          <div className="input-section">
            <label>Bénéfices</label>
            <div className="risk-buttons">
              <button
                className={`risk-button low-risk ${
                  nextMonth.risks.profitRisk === "low" ? "selected" : ""
                }`}
                onClick={() => handleRiskChange("profitRisk", "low")}
              >
                faible
              </button>
              <button
                className={`risk-button medium-risk ${
                  nextMonth.risks.profitRisk === "medium" ? "selected" : ""
                }`}
                onClick={() => handleRiskChange("profitRisk", "medium")}
              >
                moyen
              </button>
              <button
                className={`risk-button high-risk ${
                  nextMonth.risks.profitRisk === "high" ? "selected" : ""
                }`}
                onClick={() => handleRiskChange("profitRisk", "high")}
              >
                risqué
              </button>
            </div>
            <input
              type="text"
              name="profit"
              value={nextMonth.profit}
              onChange={(e) => handleInputChange(e, "nextMonth")}
              placeholder="Par mois"
            />
          </div>
          <div className="input-section">
            <label>Somme épargnée</label>
            <div className="risk-buttons">
              <button
                className={`risk-button low-risk ${
                  nextMonth.risks.savedRisk === "low" ? "selected" : ""
                }`}
                onClick={() => handleRiskChange("savedRisk", "low")}
              >
                faible
              </button>
              <button
                className={`risk-button medium-risk ${
                  nextMonth.risks.savedRisk === "medium" ? "selected" : ""
                }`}
                onClick={() => handleRiskChange("savedRisk", "medium")}
              >
                moyen
              </button>
              <button
                className={`risk-button high-risk ${
                  nextMonth.risks.savedRisk === "high" ? "selected" : ""
                }`}
                onClick={() => handleRiskChange("savedRisk", "high")}
              >
                risqué
              </button>
            </div>
            <input
              type="text"
              name="saved"
              value={nextMonth.saved}
              onChange={(e) => handleInputChange(e, "nextMonth")}
              placeholder="Par mois"
            />
          </div>
          <div className="input-section">
            <label>Somme Dépensée</label>
            <div className="risk-buttons">
              <button
                className={`risk-button low-risk ${
                  nextMonth.risks.expensesRisk === "low" ? "selected" : ""
                }`}
                onClick={() => handleRiskChange("expensesRisk", "low")}
              >
                faible
              </button>
              <button
                className={`risk-button medium-risk ${
                  nextMonth.risks.expensesRisk === "medium" ? "selected" : ""
                }`}
                onClick={() => handleRiskChange("expensesRisk", "medium")}
              >
                moyen
              </button>
              <button
                className={`risk-button high-risk ${
                  nextMonth.risks.expensesRisk === "high" ? "selected" : ""
                }`}
                onClick={() => handleRiskChange("expensesRisk", "high")}
              >
                risqué
              </button>
            </div>
            <input
              type="text"
              name="expenses"
              value={nextMonth.expenses}
              onChange={(e) => handleInputChange(e, "nextMonth")}
              placeholder="Par mois"
            />
          </div>
          <div className="input-section investment">
            <label>Somme investie</label>
            <Switch
              onChange={() =>
                setNextMonth((prev) => ({
                  ...prev,
                  showInvestment: !prev.showInvestment,
                }))
              }
              checked={nextMonth.showInvestment}
            />
            {nextMonth.showInvestment && (
              <>
                <div className="risk-buttons">
                  <button
                    className={`risk-button low-risk ${
                      nextMonth.risks.investmentRisk === "low" ? "selected" : ""
                    }`}
                    onClick={() => handleRiskChange("investmentRisk", "low")}
                  >
                    faible
                  </button>
                  <button
                    className={`risk-button medium-risk ${
                      nextMonth.risks.investmentRisk === "medium"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleRiskChange("investmentRisk", "medium")}
                  >
                    moyen
                  </button>
                  <button
                    className={`risk-button high-risk ${
                      nextMonth.risks.investmentRisk === "high"
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleRiskChange("investmentRisk", "high")}
                  >
                    risqué
                  </button>
                </div>
                <input
                  type="text"
                  name="invested"
                  value={nextMonth.invested}
                  onChange={(e) => handleInputChange(e, "nextMonth")}
                  placeholder="€€€"
                />
                <input
                  type="text"
                  name="investmentReturn"
                  value={nextMonth.investmentReturn}
                  onChange={(e) => handleInputChange(e, "nextMonth")}
                  placeholder="en %"
                />
              </>
            )}
          </div>
        </div>
        <button className="validate-button" onClick={handleNextMonthSubmit}>
          Valider
        </button>
      </div>
    </div>
  );
};

export default FinancialForecast;
