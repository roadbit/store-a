import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';

import UserCount from '../PanelComponents/UserCount'
import UserCountReg from '../PanelComponents/UserCountReg'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale);

const baseURL = process.env.REACT_APP_SERVER_BASE_URL;

const VisitChart = () => {
  const [data, setData] = useState({ labels: [], datasets: [] });
  const [totalVisits, setTotalVisits] = useState(0);

  useEffect(() => {
    axios.get(`${baseURL}/api/visits`)
      .then(response => {
        const data = response.data;
        const labels = data.map(item => item.hour);
        const counts = data.map(item => item.count);
        const total = counts.reduce((sum, count) => sum + count, 0);

        setData({
          labels,
          datasets: [
            {
              label: 'Відвідування за годинами',
              data: counts,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            }
          ]
        });

        setTotalVisits(total);
      })
      .catch(error => console.error('Error fetching visits:', error));
  }, []);

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `Кількість: ${tooltipItem.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Час'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Відвідувань'
        },
        beginAtZero: true
      }
    }
  };

  return (
    <div className="visit-chart">
      <div className="user_db">
        <div className='online_user-item'>
          <h3>Відвідувань за добу: {totalVisits}</h3>
        </div>
        <UserCount />
        <UserCountReg />
      </div>
      <div className="chart-body">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default VisitChart;