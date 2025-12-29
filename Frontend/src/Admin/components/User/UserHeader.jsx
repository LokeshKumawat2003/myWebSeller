import React from 'react';
import { Users, UserCheck, UserX } from 'lucide-react';

const UserHeader = ({ totalUsers, activeUsers, inactiveUsers }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white p-8 rounded-xl shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-indigo-100 mt-1">Manage platform users and their accounts</p>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <div className="flex items-center gap-2 text-indigo-100 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Total Users</span>
            </div>
            <p className="text-2xl font-bold">{totalUsers}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 text-indigo-100 mb-1">
              <UserCheck className="w-4 h-4" />
              <span className="text-sm font-medium">Active</span>
            </div>
            <p className="text-2xl font-bold">{activeUsers}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 text-indigo-100 mb-1">
              <UserX className="w-4 h-4" />
              <span className="text-sm font-medium">Inactive</span>
            </div>
            <p className="text-2xl font-bold">{inactiveUsers}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;