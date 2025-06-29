import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register the components that Chart.js will use
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const VanStateChart = () => {
  const [chartData, setChartData] = useState({
    labels: [], // e.g., ['Maharashtra', 'Gujarat']
    datasets: [], // will hold the chart data
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVanData = async () => {
      try {
        // Make the API call to your backend endpoint
        const response = await axios.get('http://localhost:5000/api/reports/vans/by-state');
        const data = response.data;

        // Process the data into the format required by Chart.js
        const labels = data.map(item => item.state);
        const counts = data.map(item => item.count);

        setChartData({
          labels: labels,
          datasets: [{
            label: 'Number of Vans',
            data: counts,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(199, 199, 199, 0.6)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(199, 199, 199, 1)',
            ],
            borderWidth: 1,
          }],
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch van data for chart:', err);
        setError('Failed to load chart data.');
        setLoading(false);
      }
    };

    fetchVanData();
  }, []); // The empty dependency array ensures this effect runs only once on mount

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows you to control the size with CSS
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Fleet Distribution by State',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'State',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Vans',
        },
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return <div className="chart-placeholder">Loading chart...</div>;
  }

  if (error) {
    return <div className="chart-placeholder error">{error}</div>;
  }

  return (
    <div className="chart-container" style={{ width: '100%', height: '400px' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default VanStateChart;
