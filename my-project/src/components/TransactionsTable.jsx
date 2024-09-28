import React from 'react';

const TransactionsTable = ({ transactions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-100">
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
            <tr key={transaction.id} className="bg-white hover:bg-gray-50">
              <td className="border px-4 py-2">{transaction.title}</td>
              <td className="border px-4 py-2">{transaction.description}</td>
              <td className="border px-4 py-2">{transaction.price}</td>
              <td className="border px-4 py-2">{transaction.dateOfSale}</td>
              <td className="border px-4 py-2">{transaction.sold ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
