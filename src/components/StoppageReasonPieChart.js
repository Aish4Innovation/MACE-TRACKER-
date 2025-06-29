// src/components/StoppageReasonPieChart.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00c49f', '#ff6666'];

function StoppageReasonPieChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/reports/stoppages/reasons-summary');
        setData(res.data);
      } catch (err) {
        console.error('Error fetching stoppage reasons:', err);
      }
    };
    fetchReasons();
  }, []);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h4 style={{ textAlign: 'center', marginBottom: '10px' }}>Stoppage Reason Distribution</h4>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="reason"
            cx="50%"
            cy="50%"
            outerRadius={120}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StoppageReasonPieChart;
