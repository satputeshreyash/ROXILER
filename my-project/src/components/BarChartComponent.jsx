import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const BarChartComponent = ({ month }) => {
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    const fetchBarChartData = async () => {
      const { data } = await axios.get('http://localhost:5000/api/transactions/bar-chart', {
        params: { month },
      });
      setBarData(data);
    };
    fetchBarChartData();
  }, [month]);

  return (
    <BarChart width={600} height={300} data={barData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="priceRange" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#8884d8" />
    </BarChart>
  );
};

export default BarChartComponent;
