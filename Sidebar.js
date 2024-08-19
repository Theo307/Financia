import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faChartLine,
  faUsers,
  faBell,
  faLifeRing,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

const Sidebar = ({ onSectionChange }) => {
  return (
    <div className="sidebar">
      <div className="logo">Financia</div>
      <nav>
        <ul>
          <li onClick={() => onSectionChange("home")}>
            <FontAwesomeIcon icon={faHome} /> Vue d'ensemble
          </li>
          <li onClick={() => onSectionChange("FinancialForecast")}>
            <FontAwesomeIcon icon={faChartLine} /> Prévision financière
          </li>
          <li onClick={() => onSectionChange("CompetitiveAnalysis")}>
            <FontAwesomeIcon icon={faUsers} />Performance Financière
          </li>
          <li onClick={() => onSectionChange("Publicinterest")}>
            <FontAwesomeIcon icon={faUsers} />Intérêt du public
          </li>
        </ul>
      </nav>
      <div className="settings">
        <div>
          <FontAwesomeIcon icon={faBell} /> Notifications
        </div>
        <div>
          <FontAwesomeIcon icon={faLifeRing} /> Support
        </div>
        <div>
          <FontAwesomeIcon icon={faCog} /> Paramètres
        </div>
      </div>
      <div className="user">
        <div className="user-name">Brooklyn Simmons</div>
        <div className="user-email">brooklyn@Simmons.com</div>
      </div>
    </div>
  );
};

export default Sidebar;
