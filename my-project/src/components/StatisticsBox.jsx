import React from 'react';

const StatisticsBox = ({ statistics }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-blue-100 p-4 rounded-md text-center">
        <div className="text-lg font-bold">Total Sale Amount</div>
        <div className="text-2xl">${statistics.totalSaleAmount || 0}</div>
      </div>
      <div className="bg-green-100 p-4 rounded-md text-center">
        <div className="text-lg font-bold">Total Sold Items</div>
        <div className="text-2xl">{statistics.soldItems || 0}</div>
      </div>
      <div className="bg-red-100 p-4 rounded-md text-center">
        <div className="text-lg font-bold">Total Not Sold Items</div>
        <div className="text-2xl">{statistics.notSoldItems || 0}</div>
      </div>
    </div>
  );
};

export default StatisticsBox;
