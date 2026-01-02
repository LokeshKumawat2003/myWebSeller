import React, { useState, useEffect } from 'react';
import { getAllSupportTickets, assignSupportTicket, updateSupportTicketStatus, postSupportResponse } from '../../../services/api';
import { adminListSellers } from '../../../services/adminApi';
import { adminListAdmins } from '../../../services/adminApi';
import { useThemeColors } from '../../AdminContext';

export default function SupportManagement() {
  const colors = useThemeColors();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadTickets();
    loadSellers();
    loadAdmins();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await getAllSupportTickets();
      setTickets(data);
    } catch (err) {
      console.error('Error loading tickets:', err);
    }
  };

  const loadSellers = async () => {
    try {
      const data = await adminListSellers();
      setSellers(data);
    } catch (err) {
      console.error('Error loading sellers:', err);
    }
  };

  const loadAdmins = async () => {
    try {
      const data = await adminListAdmins();
      setAdmins(data);
    } catch (err) {
      console.error('Error loading admins:', err);
    }
  };

  const handleAssign = async (ticketId, assignedTo) => {
    try {
      await assignSupportTicket(ticketId, assignedTo);
      loadTickets();
      if (selectedTicket && selectedTicket._id === ticketId) {
        const updatedTickets = await getAllSupportTickets();
        const updatedTicket = updatedTickets.find(t => t._id === ticketId);
        setSelectedTicket(updatedTicket);
      }
    } catch (err) {
      alert('Error assigning ticket: ' + err.message);
    }
  };

  const handleStatusChange = async (ticketId, status) => {
    try {
      await updateSupportTicketStatus(ticketId, status);
      loadTickets();
      if (selectedTicket && selectedTicket._id === ticketId) {
        const updatedTickets = await getAllSupportTickets();
        const updatedTicket = updatedTickets.find(t => t._id === ticketId);
        setSelectedTicket(updatedTicket);
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);
    try {
      await postSupportResponse(selectedTicket._id, newMessage);
      setNewMessage('');
      loadTickets();
      // Refresh selected ticket
      const updatedTickets = await getAllSupportTickets();
      const updatedTicket = updatedTickets.find(t => t._id === selectedTicket._id);
      setSelectedTicket(updatedTicket);
    } catch (err) {
      alert('Error sending message: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">Support Ticket Management</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets List */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">All Support Tickets</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {tickets.map(ticket => (
              <div
                key={ticket._id}
                onClick={() => setSelectedTicket(ticket)}
                className="p-4 rounded-lg cursor-pointer transition"
                style={{
                  borderColor: colors.border,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  backgroundColor: selectedTicket?._id === ticket._id ? colors.bgSecondary : colors.bgPrimary,
                }}
                onMouseEnter={(e) => {
                  if (selectedTicket?._id !== ticket._id) {
                    e.target.style.backgroundColor = colors.bgSecondary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedTicket?._id !== ticket._id) {
                    e.target.style.backgroundColor = colors.bgPrimary;
                  }
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold" style={{ color: colors.textPrimary }}>{ticket.subject}</h5>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>From: {ticket.user?.name || 'Unknown'}</p>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>Assigned: {ticket.assignedTo?.name || 'Unassigned'}</p>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
            {tickets.length === 0 && (
              <p className="text-gray-600 text-center py-8">No support tickets</p>
            )}
          </div>
        </div>

        {/* Ticket Details */}
        <div>
          {selectedTicket ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg shadow" style={{ backgroundColor: colors.bgPrimary }}>
                <h4 className="text-lg font-semibold mb-2" style={{ color: colors.textPrimary }}>{selectedTicket.subject}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold" style={{ color: colors.textPrimary }}>User:</p>
                    <p style={{ color: colors.textSecondary }}>{selectedTicket.user?.name} ({selectedTicket.user?.email})</p>
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: colors.textPrimary }}>Status:</p>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => handleStatusChange(selectedTicket._id, e.target.value)}
                      className="px-2 py-1 rounded text-sm"
                      style={{
                        backgroundColor: colors.bgPrimary,
                        color: colors.textPrimary,
                        borderColor: colors.border,
                        borderWidth: '1px',
                        borderStyle: 'solid'
                      }}
                    >
                      <option value="open">Open</option>
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                  <div>
                    <p className="font-semibold luxury-text-primary">Assigned To:</p>
                    <select
                      value={selectedTicket.assignedTo?._id || ''}
                      onChange={(e) => handleAssign(selectedTicket._id, e.target.value)}
                      className="px-2 py-1 border luxury-border rounded text-sm luxury-bg"
                    >
                      <option value="">Unassigned</option>
                      <optgroup label="Admins">
                        {admins.map(admin => (
                          <option key={admin._id} value={admin._id}>
                            {admin.name} ({admin.email}) - Admin
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Sellers">
                        {sellers.map(seller => (
                          <option key={seller._id || seller.user._id} value={seller._id || seller.user._id}>
                            {seller.name || seller.user?.name} ({seller.email || seller.user?.email}) - Seller
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <p className="font-semibold luxury-text-primary">Created:</p>
                    <p className="luxury-text-secondary">{new Date(selectedTicket.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {selectedTicket.order && (
                  <div className="mt-4">
                    <p className="font-semibold luxury-text-primary">Related Order:</p>
                    <p className="luxury-text-secondary">ID: {selectedTicket.order}</p>
                  </div>
                )}
              </div>

              <div className="luxury-bg p-4 rounded-lg shadow">
                <h5 className="font-semibold luxury-text-primary mb-2">Messages</h5>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedTicket.messages?.map((msg, idx) => (
                    <div key={idx} className={`p-3 rounded-lg ${
                      msg.from?._id === selectedTicket.user?._id 
                        ? 'luxury-bg-secondary ml-8' // Customer messages - light blue, indented right
                        : 'bg-green-50 mr-8' // Support messages - light green, indented left
                    }`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-semibold luxury-text-secondary">
                          {msg.from?.name || 'Unknown'} 
                          <span className={`ml-1 px-1 py-0.5 rounded text-xs ${
                            msg.from?.role === 'admin' ? 'bg-red-100 text-red-800' :
                            msg.from?.role === 'seller' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {msg.from?.role === 'admin' ? 'Admin' :
                             msg.from?.role === 'seller' ? 'Seller' : 'Customer'}
                          </span>
                        </span>
                        <span className="text-xs luxury-text-secondary">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm luxury-text-primary">{msg.message}</p>
                    </div>
                  ))}
                </div>
                {selectedTicket.status !== 'closed' && (
                  <div className="mt-4 flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
                      placeholder="Type your reply..."
                      className="flex-1 px-3 py-2 border luxury-border rounded-lg focus:outline-none focus:ring-2 focus:ring-luxury-accent luxury-bg"
                      disabled={loading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={loading}
                      className="px-4 py-2 luxury-accent hover:bg-luxury-accent text-white rounded-lg transition disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : 'Reply'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="luxury-bg p-8 rounded-lg shadow text-center luxury-text-secondary">
              Select a ticket to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
