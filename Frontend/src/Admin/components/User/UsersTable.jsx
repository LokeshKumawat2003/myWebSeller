import React from 'react';
import { User, Mail, Shield, Clock, UserCheck, UserX } from 'lucide-react';
import { useThemeColors } from '../../AdminContext';

const UsersTable = ({ users }) => {
  const colors = useThemeColors();

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return { backgroundColor: colors.bgSecondary, color: colors.textPrimary };
      case 'Pending': return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'Inactive': return { backgroundColor: '#fecaca', color: '#dc2626' };
      default: return { backgroundColor: colors.bgSecondary, color: colors.textSecondary };
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'Seller': return { backgroundColor: colors.bgSecondary, color: colors.textPrimary };
      case 'Admin': return { backgroundColor: colors.bgSecondary, color: colors.textPrimary };
      case 'Customer': return { backgroundColor: colors.bgSecondary, color: colors.textPrimary };
      default: return { backgroundColor: colors.bgSecondary, color: colors.textSecondary };
    }
  };

  return (
    <div className="rounded-xl shadow-sm overflow-hidden" style={{ backgroundColor: colors.bgPrimary, borderColor: colors.border, borderWidth: '1px', borderStyle: 'solid' }}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ backgroundColor: colors.bgSecondary, borderColor: colors.border, borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>User</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Type</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textSecondary }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="transition-colors" style={{ borderColor: colors.border, borderBottomWidth: '1px', borderBottomStyle: 'solid' }}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.bgSecondary }}>
                        <User className="w-5 h-5" style={{ color: colors.accent }} />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>{user.name}</div>
                      <div className="text-sm" style={{ color: colors.textSecondary }}>ID: {user._id?.substring(0, 8)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" style={{ color: colors.textSecondary }} />
                    <span className="text-sm" style={{ color: colors.textPrimary }}>{user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={getTypeColor(user.type)}>
                    {user.type === 'Seller' && <Shield className="w-3 h-3 mr-1" />}
                    {user.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={getStatusColor(user.status)}>
                    {user.status === 'Active' && <UserCheck className="w-3 h-3 mr-1" />}
                    {user.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                    {user.status === 'Inactive' && <UserX className="w-3 h-3 mr-1" />}
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;