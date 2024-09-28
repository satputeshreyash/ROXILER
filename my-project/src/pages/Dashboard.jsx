import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [statistics, setStatistics] = useState({ totalSaleAmount: 0, soldItems: 0, notSoldItems: 0 });
  const [transactions, setTransactions] = useState([]);
  const [barChartData, setBarChartData] = useState({});
  const [month, setMonth] = useState('march'); // Default to March

  useEffect(() => {
    fetchStatistics();
    fetchTransactions();
    fetchBarChartData();
  }, [month]);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`/api/transactions/statistics?month=${month}`);
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`/api/transactions/list?page=1&perPage=10`);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get(`/api/transactions/bar-chart?month=${month}`);
      console.log("Bar Chart Data Response:", response.data); // Log the response

      const chartData = response.data;

      // Ensure chartData is an array
      if (!Array.isArray(chartData)) {
        console.error('Expected chart data to be an array, but got:', chartData);
        throw new Error("Chart data is not an array");
      }

      // Prepare data for the Bar chart
      const data = {
        labels: chartData.map(range => range.range), // Extract labels from the chart data
        datasets: [
          {
            label: 'Count',
            data: chartData.map(range => range.count), // Extract count data from the chart data
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      };

      setBarChartData(data); // Set the prepared data for the bar chart
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Dashboard</h1>
      <div className="mb-4">
        <label htmlFor="month" className="mr-2">Select Month:</label>
        <select 
          id="month" 
          value={month} 
          onChange={handleMonthChange} 
          className="border p-1"
        >
          {["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"].map((monthName, index) => (
            <option key={index} value={monthName}>{monthName.charAt(0).toUpperCase() + monthName.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="bg-blue-100 p-4">
          <h2>Total Sale Amount</h2>
          <p>${statistics.totalSaleAmount}</p>
        </div>
        <div className="bg-green-100 p-4">
          <h2>Total Sold Items</h2>
          <p>{statistics.soldItems}</p>
        </div>
        <div className="bg-red-100 p-4">
          <h2>Total Not Sold Items</h2>
          <p>{statistics.notSoldItems}</p>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-3">Transactions</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Date of Sale</th>
            <th className="border px-4 py-2">Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction._id}>
              <td className="border px-4 py-2">{transaction.title}</td>
              <td className="border px-4 py-2">{transaction.description}</td>
              <td className="border px-4 py-2">${transaction.price.toFixed(2)}</td>
              <td className="border px-4 py-2">{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{transaction.sold ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-lg font-bold mt-5">Price Range Bar Chart</h2>
      <div className="bg-white shadow rounded p-4">
        {barChartData.labels ? (
          <Bar data={barChartData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
        ) : (
          <p>Loading chart data...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
