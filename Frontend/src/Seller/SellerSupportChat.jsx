import React, { useState, useEffect } from 'react';
import { getAssignedSupportTickets, postSupportResponse, updateSupportTicketStatus, createSupportTicket, getUserSupportTickets } from '../services/api';

export default function SellerSupportChat() {
  const [tickets, setTickets] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', message: '', orderId: '' });

  useEffect(() => {
    loadTickets();
    loadMyTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const data = await getAssignedSupportTickets();
      setTickets(data);
    } catch (err) {
      console.error('Error loading assigned tickets:', err);
    }
  };

  const loadMyTickets = async () => {
    try {
      const data = await getUserSupportTickets();
      setMyTickets(data);
    } catch (err) {
      console.error('Error loading my tickets:', err);
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.message.trim()) return;
    setLoading(true);
    try {
      await createSupportTicket(newTicket);
      setNewTicket({ subject: '', message: '', orderId: '' });
      setShowCreateForm(false);
      loadMyTickets();
    } catch (err) {
      alert('Error creating ticket: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);
    try {
      await postSupportResponse(selectedTicket._id, newMessage);
      setNewMessage('');
      loadTickets();
      loadMyTickets();
      // Refresh selected ticket
      const updatedTickets = await getAssignedSupportTickets();
      const updatedMyTickets = await getUserSupportTickets();
      const updatedTicket = [...updatedTickets, ...updatedMyTickets].find(t => t._id === selectedTicket._id);
      setSelectedTicket(updatedTicket);
    } catch (err) {
      alert('Error sending message: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ticketId, status) => {
    try {
      await updateSupportTicketStatus(ticketId, status);
      loadTickets();
      loadMyTickets();
      if (selectedTicket && selectedTicket._id === ticketId) {
        const updatedTickets = await getAssignedSupportTickets();
        const updatedMyTickets = await getUserSupportTickets();
        const updatedTicket = [...updatedTickets, ...updatedMyTickets].find(t => t._id === ticketId);
        setSelectedTicket(updatedTicket);
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
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
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-black">Support Center</h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
        >
          {showCreateForm ? 'Cancel' : 'Create Ticket'}
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h4 className="text-lg font-semibold text-black mb-4">Create New Support Ticket</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Brief description of your issue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order ID (optional)</label>
              <input
                type="text"
                value={newTicket.orderId}
                onChange={(e) => setNewTicket({...newTicket, orderId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Related order ID if applicable"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={newTicket.message}
                onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe your issue in detail"
              />
            </div>
            <button
              onClick={handleCreateTicket}
              disabled={loading}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-1">
          <h4 className="text-lg font-semibold text-black mb-4">Assigned Tickets</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {tickets.map(ticket => (
              <div
                key={ticket._id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-3 border rounded-lg cursor-pointer transition text-sm ${
                  selectedTicket?._id === ticket._id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-black truncate">{ticket.subject}</h5>
                    <p className="text-xs text-gray-600">From: {ticket.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ml-2 ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
            {tickets.length === 0 && (
              <p className="text-gray-600 text-center py-4 text-sm">No assigned support tickets</p>
            )}
          </div>

          <h4 className="text-lg font-semibold text-black mb-4 mt-6">My Tickets</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {myTickets.map(ticket => (
              <div
                key={ticket._id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-3 border rounded-lg cursor-pointer transition text-sm ${
                  selectedTicket?._id === ticket._id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-black truncate">{ticket.subject}</h5>
                    <p className="text-xs text-gray-600">Status: {ticket.status}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ml-2 ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
            {myTickets.length === 0 && (
              <p className="text-gray-600 text-center py-4 text-sm">No tickets created yet</p>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <div className="h-96 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-black">{selectedTicket.subject}</h4>
                  <p className="text-sm text-gray-600">
                    {selectedTicket.user ? `From: ${selectedTicket.user.name}` : 'My Ticket'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleStatusChange(selectedTicket._id, e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                  >
                    <option value="open">Open</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <div className="flex-1 border rounded-lg p-4 overflow-y-auto bg-white">
                <div className="space-y-2">
                  {selectedTicket.messages?.map((msg, idx) => (
                    <div key={idx} className={`p-3 rounded-lg ${
                      msg.from?._id === selectedTicket.user?._id
                        ? 'bg-blue-50 ml-8' // Customer messages - light blue, indented right
                        : 'bg-green-50 mr-8' // Support messages - light green, indented left
                    }`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-semibold text-gray-600">
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
                        <span className="text-xs text-gray-500">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-black">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </div>
              {selectedTicket.status !== 'closed' && (
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
                    placeholder="Type your response..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={loading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={loading}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-500">
              Select a ticket to view and respond
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
