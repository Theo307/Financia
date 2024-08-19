import React from "react";
import "./Competitors.css";

const competitorsData = [
  { name: "Spotify", marketChange: "+1%", value: "$297" },
  { name: "Apple Music", marketChange: "+0.16%", value: "$223" },
  // Ajoute d'autres concurrents ici
];

function Competitors() {
  return (
    <div className="competitors">
      <h2>Concurrents</h2>
      <table>
        <thead>
          <tr>
            <th>Concurrents</th>
            <th>Bourse</th>
            <th>VA</th>
          </tr>
        </thead>
        <tbody>
          {competitorsData.map((competitor, index) => (
            <tr key={index}>
              <td>{competitor.name}</td>
              <td>{competitor.marketChange}</td>
              <td>{competitor.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-competitor">+</button>
    </div>
  );
}

export default Competitors;
