import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const CategoryBarChartComponent = ({ month }) => {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const fetchCategoryData = async () => {
      const { data } = await axios.get('http://localhost:5000/api/transactions/pie-chart', {
        params: { month },
      });
      setCategoryData(data);
    };
    fetchCategoryData();
  }, [month]);

  return (
    <BarChart width={600} height={300} data={categoryData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="category" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#82ca9d" />
    </BarChart>
  );
};

export default CategoryBarChartComponent;
