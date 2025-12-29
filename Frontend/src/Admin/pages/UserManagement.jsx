import React, { useState, useEffect } from 'react';
import { adminListSellers } from '../../services/adminApi';
import UserHeader from '../components/User/UserHeader';
import UsersTable from '../components/User/UsersTable';
import { UserLoadingState, UserEmptyState } from '../components/User/UserStates';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Get sellers as users (admin doesn't have direct user endpoint yet)
      const sellersData = await adminListSellers();
      const usersList = sellersData.map(seller => ({
        _id: seller.user?._id,
        name: seller.user?.name,
        email: seller.user?.email,
        type: 'Seller',
        status: seller.approved ? 'Active' : 'Pending',
      })) || [];
      setUsers(usersList);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeUsers = users.filter(u => u.status === 'Active').length;

  return (
    <div className="space-y-6">
      <UserHeader
        totalUsers={users.length}
        activeUsers={activeUsers}
        inactiveUsers={users.length - activeUsers}
      />

      {loading ? (
        <UserLoadingState />
      ) : users.length === 0 ? (
        <UserEmptyState />
      ) : (
        <UsersTable users={users} />
      )}
    </div>
  );
}
