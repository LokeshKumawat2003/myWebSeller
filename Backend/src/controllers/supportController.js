const SupportTicket = require('../models/SupportTicket');
const mongoose = require('mongoose');

exports.createTicket = async (req, res) => {
  try {
    console.log('Creating ticket for user:', req.user);
    console.log('Request body:', req.body);

    const { subject, orderId, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: 'Subject and message are required' });
    }

    const ticketData = {
      user: req.user._id,
      subject,
      messages: [{ from: req.user._id, message }],
      status: 'open'
    };

    // Only add order if orderId is provided, not empty, and is a valid ObjectId
    if (orderId && orderId.trim() && mongoose.Types.ObjectId.isValid(orderId.trim())) {
      ticketData.order = orderId.trim();
    }

    console.log('Ticket data to save:', ticketData);

    const ticket = new SupportTicket(ticketData);
    await ticket.save();

    // Populate the ticket before returning
    await ticket.populate('user', 'name email role');
    await ticket.populate('messages.from', 'name email role');

    console.log('Ticket saved successfully:', ticket);

    res.status(201).json(ticket);
  } catch (err) {
    console.error('Error creating ticket:', err);
    res.status(500).json({ message: 'Error creating ticket', error: err.message });
  }
};

exports.listTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user._id })
      .populate('messages.from', 'name email role')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tickets' });
  }
};

exports.postMessage = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    ticket.messages.push({ from: req.user._id, message: req.body.message });
    await ticket.save();
    
    // Populate before returning
    await ticket.populate('messages.from', 'name email role');
    
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Error posting message' });
  }
};

exports.listAllTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .populate('user', 'name email role')
      .populate('assignedTo', 'name email role')
      .populate('messages.from', 'name email role')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tickets' });
  }
};

exports.assignTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    ticket.assignedTo = req.body.assignedTo;
    await ticket.save();
    
    // Populate before returning
    await ticket.populate('user', 'name email role');
    await ticket.populate('assignedTo', 'name email role');
    await ticket.populate('messages.from', 'name email role');
    
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Error assigning ticket' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    ticket.status = req.body.status;
    await ticket.save();
    
    // Populate before returning
    await ticket.populate('user', 'name email role');
    await ticket.populate('assignedTo', 'name email role');
    await ticket.populate('messages.from', 'name email role');
    
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Error updating status' });
  }
};

exports.listAssignedTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ assignedTo: req.user._id })
      .populate('user', 'name email role')
      .populate('messages.from', 'name email role')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching assigned tickets' });
  }
};

exports.postSupportMessage = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    
    // Allow posting if user is assigned to the ticket OR if they created the ticket (for sellers/admins who created tickets)
    const isAssigned = ticket.assignedTo && ticket.assignedTo.toString() === req.user._id.toString();
    const isCreator = ticket.user.toString() === req.user._id.toString();
    
    if (!isAssigned && !isCreator) {
      return res.status(403).json({ message: 'Not authorized to reply to this ticket' });
    }
    
    ticket.messages.push({ from: req.user._id, message: req.body.message });
    await ticket.save();
    
    // Populate before returning
    await ticket.populate('messages.from', 'name email role');
    
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Error posting message' });
  }
};
