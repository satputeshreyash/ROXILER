const axios = require('axios');
const Transaction = require('../models/Transaction');

const getMonthNumber = (monthName) => {
    const months = {
      january: 1,
      february: 2,
      march: 3,
      april: 4,
      may: 5,
      june: 6,
      july: 7,
      august: 8,
      september: 9,
      october: 10,
      november: 11,
      december: 12,
    };
  
    return months[monthName.toLowerCase()];
  };

  // Get statistics (total sale amount, sold items, and not sold items)
const getStatistics = async (req, res) => {
    const { month } = req.query;
  
    // Convert month name to number
    const monthNumber = getMonthNumber(month);
    if (!monthNumber) {
      return res.status(400).json({ message: 'Invalid month provided' });
    }
  
    try {
      // Fetch all transactions
      const transactions = await Transaction.find();
      
      // Filter transactions by the month of `dateOfSale`
      const filteredTransactions = transactions.filter(transaction =>
        new Date(transaction.dateOfSale).getMonth() + 1 === monthNumber
      );
  
      // Calculate total sale amount
      const totalSaleAmount = filteredTransactions.reduce((acc, cur) => acc + cur.price, 0);
      
      // Count sold and not sold items
      const soldItems = filteredTransactions.filter(item => item.sold).length;
      const notSoldItems = filteredTransactions.filter(item => !item.sold).length;
  
      // Respond with statistics
      res.status(200).json({ totalSaleAmount, soldItems, notSoldItems });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get statistics', error });
    }
  };

  // Get bar chart data (price range)
 // Get bar chart data (price range)
 const getBarChartData = async (req, res) => {
    const { month } = req.query;
  
    // Convert month name to number
    const monthNumber = getMonthNumber(month);
    if (!monthNumber) {
      return res.status(400).json({ message: 'Invalid month provided' });
    }
  
    try {
      const transactions = await Transaction.find();
  
      // Filter transactions by the month of `dateOfSale`
      const filteredTransactions = transactions.filter(transaction =>
        new Date(transaction.dateOfSale).getMonth() + 1 === monthNumber
      );
  
      // Define price ranges
      const priceRanges = [
        { range: '0-100', count: 0 },
        { range: '101-200', count: 0 },
        { range: '201-300', count: 0 },
        { range: '301-400', count: 0 },
        { range: '401-500', count: 0 },
        { range: '501-600', count: 0 },
        { range: '601-700', count: 0 },
        { range: '701-800', count: 0 },
        { range: '801-900', count: 0 },
        { range: '901-above', count: 0 },
      ];
  
      // Count transactions in each price range
      filteredTransactions.forEach(transaction => {
        const price = transaction.price;
        if (price <= 100) priceRanges[0].count++;
        else if (price <= 200) priceRanges[1].count++;
        else if (price <= 300) priceRanges[2].count++;
        else if (price <= 400) priceRanges[3].count++;
        else if (price <= 500) priceRanges[4].count++;
        else if (price <= 600) priceRanges[5].count++;
        else if (price <= 700) priceRanges[6].count++;
        else if (price <= 800) priceRanges[7].count++;
        else if (price <= 900) priceRanges[8].count++;
        else priceRanges[9].count++;
      });

     // console.log(priceRanges)
  
      res.status(200).json(priceRanges);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get bar chart data', error });
    }
  };
  

  
  // Get category data (number of items per category)
const getCategoryData = async (req, res) => {
    const { month } = req.query;
  
    // Convert month name to number
    const monthNumber = getMonthNumber(month);
    if (!monthNumber) {
      return res.status(400).json({ message: 'Invalid month provided' });
    }
  
    try {
      const transactions = await Transaction.find();
  
      // Filter transactions by the month of `dateOfSale`
      const filteredTransactions = transactions.filter(transaction =>
        new Date(transaction.dateOfSale).getMonth() + 1 === monthNumber
      );
  
      // Count the number of items in each category
      const categories = {};
      filteredTransactions.forEach(transaction => {
        const category = transaction.category || 'Uncategorized';
        categories[category] = (categories[category] || 0) + 1;
      });
  
      // Convert the categories object to an array
      const categoryArray = Object.keys(categories).map(category => ({
        category,
        count: categories[category],
      }));
  
      res.status(200).json(categoryArray);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get category data', error });
    }
  };

  
  const getTransactions = async (req, res) => {
    const { page = 1, perPage = 10, search = '' } = req.query;
  
    try {
      // Build the search query
      const query = search
        ? {
            $or: [
              { title: new RegExp(search, 'i') },
              { description: new RegExp(search, 'i') },
              { price: parseFloat(search) || 0 },
            ],
          }
        : {};
  
      // Fetch transactions with pagination
      const transactions = await Transaction.find(query)
        .skip((page - 1) * perPage)
        .limit(parseInt(perPage));
  
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get transactions', error });
    }
  };



  
  // Fetch data from the third-party API and initialize the database
const initializeDatabase = async (req, res) => {
    try {
      const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
      
      // Remove existing data
      await Transaction.deleteMany({});
  
      // Insert new data
      await Transaction.insertMany(response.data);
      
      res.status(200).json({ message: 'Database initialized with seed data' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to initialize database', error });
    }
  };

  module.exports = {
    getMonthNumber,
    getStatistics,
    getBarChartData,
    getCategoryData,
    getTransactions,
    initializeDatabase
  }
  

  