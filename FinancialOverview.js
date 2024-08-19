import React from 'react';
import CustomChart from './CustomChart';

const FinancialOverview = () => {
    const chartData = {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'Revenue',
                data: [12, 19, 3, 5, 2],
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
        // Options simplifiées ou personnalisées pour cet aperçu
    };

    return (
        <div>
            <h2>Financial Overview</h2>
            <CustomChart data={chartData} options={chartOptions} />
        </div>
    );
};

export default FinancialOverview;

