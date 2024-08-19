import React from 'react';
import './Dashboard.css';

const Dashboard = ({ concurrents, onAddClick }) => {
    return (
        <div className="dashboard-container">
            <table className="dashboard-table">
                <thead>
                    <tr>
                        <th>Concurrent</th>
                        <th>Bourse</th>
                        <th>VA</th>
                    </tr>
                </thead>
                <tbody>
                    {concurrents.map((concurrent, index) => (
                        <tr key={index}>
                            <td className="concurrent-name">
                                <img src={concurrent.logo} alt={concurrent.name} className="logo" />
                                {concurrent.name}
                            </td>
                            <td className="bourse">{concurrent.bourse}</td>
                            <td className="va">{concurrent.va}</td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan="3" className="ajouter-concurrent">
                            <button
                                className="ajouter-concurrent-btn"
                                onClick={onAddClick}
                            >
                                +
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;
