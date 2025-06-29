import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#a6cee3', '#fb9a99', '#b2df8a'];

function InventoryCategoryChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCategorySummary = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reports/inventory/category-summary');
        const formattedData = response.data.map(item => ({
          name: item.category,
          value: parseFloat(item.total_quantity)
        }));
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching inventory category summary:', error);
      }
    };

    fetchCategorySummary();
  }, []);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h4 style={{ textAlign: 'center' }}>Inventory Distribution by Category</h4>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default InventoryCategoryChart;
