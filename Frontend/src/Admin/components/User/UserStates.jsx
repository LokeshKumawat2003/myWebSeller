import React from 'react';
import { Loader2, Users } from 'lucide-react';

const UserLoadingState = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
      <div className="flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-3" />
        <div>
          <p className="text-gray-600 font-medium">Loading users...</p>
          <p className="text-sm text-gray-500 mt-1">Please wait while we fetch the user data</p>
        </div>
      </div>
    </div>
  );
};

const UserEmptyState = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
      <div className="text-center">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
        <p className="text-gray-600">Users will appear here once they register on the platform</p>
      </div>
    </div>
  );
};

export { UserLoadingState, UserEmptyState };