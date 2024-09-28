const express = require('express');
const {
  initializeDatabase,
  getTransactions,
  getStatistics,
  getBarChartData,
  getCategoryData,
} = require('../controllers/transactionController');

const router = express.Router();

router.get('/initialize', initializeDatabase);
router.get('/list', getTransactions);
router.get('/statistics', getStatistics);
router.get('/bar-chart', getBarChartData);
router.get('/category-chart', getCategoryData);

module.exports = router;
