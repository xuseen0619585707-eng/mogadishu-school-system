import React, { useState, useContext } from 'react';
import { CreditCard, DollarSign, Calendar, CheckCircle, AlertCircle, Download, Plus } from 'lucide-react';
import { MOCK_FEES, DASHBOARD_STATS } from '../constants';
import { AuthContext } from '../App';
import { Fee } from '../types';

const Fees: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [fees] = useState<Fee[]>(MOCK_FEES);

  const canEdit = user?.role === 'Admin' || user?.role === 'Accountant' || user?.role === 'Principal';

  const totalCollected = MOCK_FEES.filter(f => f.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = MOCK_FEES.filter(f => f.status !== 'Paid').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance & Fees</h1>
          <p className="text-gray-500">Track invoices, payments, and school revenue.</p>
        </div>
        {canEdit && (
            <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors">
                <Plus size={18} className="mr-2" />
                Create Invoice
            </button>
        )}
      </div>

      {/* Finance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                    <DollarSign size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Collected Revenue</p>
                    <h3 className="text-2xl font-bold text-gray-900">${totalCollected.toLocaleString()}</h3>
                </div>
             </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                    <AlertCircle size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Pending Dues</p>
                    <h3 className="text-2xl font-bold text-gray-900">${totalPending.toLocaleString()}</h3>
                </div>
             </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
             <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <CreditCard size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500">Total Invoiced</p>
                    <h3 className="text-2xl font-bold text-gray-900">${(totalCollected + totalPending).toLocaleString()}</h3>
                </div>
             </div>
          </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
           <h3 className="font-bold text-gray-800">Recent Invoices</h3>
           <div className="flex space-x-2">
               <button className="px-3 py-1 text-sm bg-gray-100 rounded-md text-gray-600 font-medium">All</button>
               <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 rounded-md">Paid</button>
               <button className="px-3 py-1 text-sm text-gray-500 hover:bg-gray-50 rounded-md">Pending</button>
           </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400 font-semibold">
              <tr>
                <th className="px-6 py-4">Invoice ID</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Due Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {fees.map((fee) => (
                <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-400">#{fee.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{fee.studentName}</td>
                  <td className="px-6 py-4">{fee.type}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">${fee.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center w-fit px-2.5 py-0.5 rounded-full text-xs font-bold 
                        ${fee.status === 'Paid' ? 'bg-green-100 text-green-700' : 
                          fee.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                       {fee.status === 'Paid' && <CheckCircle size={12} className="mr-1" />}
                       {fee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center text-gray-500">
                        <Calendar size={14} className="mr-2" />
                        {fee.dueDate}
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors" title="Download Invoice">
                        <Download size={18} />
                     </button>
                     {canEdit && fee.status !== 'Paid' && (
                         <button className="ml-2 text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-md font-bold hover:bg-indigo-100">
                            Mark Paid
                         </button>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Fees;
