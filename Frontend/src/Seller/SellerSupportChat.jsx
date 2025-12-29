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
      case 'open': return 'bg-[#9c7c3a] text-white';
      case 'pending': return 'bg-[#e6ddd2] text-[#3b3b3b]';
      case 'resolved': return 'bg-[#fbf7f2] text-[#666] border border-[#e6ddd2]';
      case 'closed': return 'bg-[#e6ddd2] text-[#666]';
      default: return 'bg-[#fbf7f2] text-[#666] border border-[#e6ddd2]';
    }
  };

  return (
    <div className="bg-[#fbf7f2] rounded-lg shadow-sm border border-[#e6ddd2] p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-light italic text-[#3b3b3b] font-serif">Support Center</h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 bg-[#9c7c3a] hover:bg-[#8a6a2f] text-white rounded-lg transition-colors font-light italic font-serif"
        >
          {showCreateForm ? 'Cancel' : 'Create Ticket'}
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6 p-4 border border-[#e6ddd2] rounded-lg bg-white">
          <h4 className="text-lg font-light italic text-[#3b3b3b] mb-4 font-serif">Create New Support Ticket</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm italic text-[#666] mb-1 font-serif">Subject</label>
              <input
                type="text"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                className="w-full px-3 py-2 border border-[#e6ddd2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] bg-white italic font-serif text-[#3b3b3b] placeholder-[#999]"
                placeholder="Brief description of your issue"
              />
            </div>
            <div>
              <label className="block text-sm italic text-[#666] mb-1 font-serif">Order ID (optional)</label>
              <input
                type="text"
                value={newTicket.orderId}
                onChange={(e) => setNewTicket({...newTicket, orderId: e.target.value})}
                className="w-full px-3 py-2 border border-[#e6ddd2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] bg-white italic font-serif text-[#3b3b3b] placeholder-[#999]"
                placeholder="Related order ID if applicable"
              />
            </div>
            <div>
              <label className="block text-sm italic text-[#666] mb-1 font-serif">Message</label>
              <textarea
                value={newTicket.message}
                onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-[#e6ddd2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] bg-white italic font-serif text-[#3b3b3b] placeholder-[#999]"
                placeholder="Describe your issue in detail"
              />
            </div>
            <button
              onClick={handleCreateTicket}
              disabled={loading}
              className="px-4 py-2 bg-[#9c7c3a] hover:bg-[#8a6a2f] text-white rounded-lg transition-colors disabled:opacity-50 font-light italic font-serif"
            >
              {loading ? 'Creating...' : 'Create Ticket'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-1">
          <h4 className="text-lg font-semibold text-[#3b3b3b] mb-4 font-serif">Assigned Tickets</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {tickets.map(ticket => (
              <div
                key={ticket._id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-3 border rounded-lg cursor-pointer transition-colors text-sm ${
                  selectedTicket?._id === ticket._id ? 'border-[#9c7c3a] bg-[#f5f0e8]' : 'border-[#e6ddd2] hover:bg-[#f5f0e8]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-[#3b3b3b] truncate font-sans">{ticket.subject}</h5>
                    <p className="text-xs text-[#666] font-sans">From: {ticket.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-[#666] font-sans">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ml-2 ${getStatusColor(ticket.status)} font-sans`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
            {tickets.length === 0 && (
              <p className="text-[#666] text-center py-4 text-sm font-sans">No assigned support tickets</p>
            )}
          </div>

          <h4 className="text-lg font-semibold text-[#3b3b3b] mb-4 mt-6 font-serif">My Tickets</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {myTickets.map(ticket => (
              <div
                key={ticket._id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-3 border rounded-lg cursor-pointer transition-colors text-sm ${
                  selectedTicket?._id === ticket._id ? 'border-[#9c7c3a] bg-[#f5f0e8]' : 'border-[#e6ddd2] hover:bg-[#f5f0e8]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-[#3b3b3b] truncate font-sans">{ticket.subject}</h5>
                    <p className="text-xs text-[#666] font-sans">Status: {ticket.status}</p>
                    <p className="text-xs text-[#666] font-sans">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ml-2 ${getStatusColor(ticket.status)} font-sans`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))}
            {myTickets.length === 0 && (
              <p className="text-[#666] text-center py-4 text-sm font-sans">No tickets created yet</p>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <div className="h-96 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-[#3b3b3b] font-serif">{selectedTicket.subject}</h4>
                  <p className="text-sm text-[#666] font-sans">
                    {selectedTicket.user ? `From: ${selectedTicket.user.name}` : 'My Ticket'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleStatusChange(selectedTicket._id, e.target.value)}
                    className="px-2 py-1 border border-[#e6ddd2] rounded text-sm bg-white font-sans"
                  >
                    <option value="open">Open</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <div className="flex-1 border border-[#e6ddd2] rounded-lg p-4 overflow-y-auto bg-white">
                <div className="space-y-2">
                  {selectedTicket.messages?.map((msg, idx) => (
                    <div key={idx} className={`p-3 rounded-lg ${
                      msg.from?._id === selectedTicket.user?._id
                        ? 'bg-[#f5f0e8] ml-8' // Customer messages - light beige, indented right
                        : 'bg-[#e6ddd2] mr-8' // Support messages - lighter beige, indented left
                    }`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-semibold text-[#666] font-sans">
                          {msg.from?.name || 'Unknown'}
                          <span className={`ml-1 px-1 py-0.5 rounded text-xs font-sans ${
                            msg.from?.role === 'admin' ? 'bg-[#e6ddd2] text-[#3b3b3b]' :
                            msg.from?.role === 'seller' ? 'bg-[#9c7c3a]/20 text-[#9c7c3a]' :
                            'bg-[#fbf7f2] text-[#666] border border-[#e6ddd2]'
                          }`}>
                            {msg.from?.role === 'admin' ? 'Admin' :
                             msg.from?.role === 'seller' ? 'Seller' : 'Customer'}
                          </span>
                        </span>
                        <span className="text-xs text-[#666] font-sans">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-[#3b3b3b] font-sans">{msg.message}</p>
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
                    className="flex-1 px-3 py-2 border border-[#e6ddd2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9c7c3a] bg-white font-sans"
                    disabled={loading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={loading}
                    className="px-4 py-2 bg-[#9c7c3a] hover:bg-[#8a6a2f] text-white rounded-lg transition-colors disabled:opacity-50 font-sans"
                  >
                    {loading ? 'Sending...' : 'Send'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-[#666] font-sans">
              Select a ticket to view and respond
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
