/**
 * controllers/contactController.js - Handles contact form submissions
 */

const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// ─── Email Transporter Setup ─────────────────────────────────────────────────
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

/**
 * @desc    Submit a contact message
 * @route   POST /api/contact
 * @access  Public
 */
const submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    // Save to database
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      ipAddress: req.ip
    });

    // ── Optional: Send email notification ─────────────────────────────────────
    const transporter = createTransporter();
    if (transporter) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM,
          to: process.env.EMAIL_USER,
          subject: `📬 New Contact: ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #6366f1;">New Portfolio Contact</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px; font-weight: bold;">Name:</td><td style="padding: 8px;">${name}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold;">Email:</td><td style="padding: 8px;">${email}</td></tr>
                <tr><td style="padding: 8px; font-weight: bold;">Subject:</td><td style="padding: 8px;">${subject}</td></tr>
              </table>
              <div style="margin-top: 16px; padding: 16px; background: #f3f4f6; border-radius: 8px;">
                <p style="font-weight: bold;">Message:</p>
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>
              <p style="color: #6b7280; font-size: 12px; margin-top: 16px;">Received at: ${new Date().toLocaleString()}</p>
            </div>
          `
        });
      } catch (emailErr) {
        // Don't fail the request if email fails — just log it
        console.warn('⚠️  Email notification failed:', emailErr.message);
      }
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully! I'll get back to you soon.",
      data: { id: contact._id }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all contact messages (admin only)
 * @route   GET /api/admin/messages
 * @access  Private (Admin)
 */
const getAllMessages = async (req, res, next) => {
  try {
    const { isRead, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    const skip = (Number(page) - 1) * Number(limit);

    const [messages, total, unreadCount] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Contact.countDocuments(filter),
      Contact.countDocuments({ isRead: false })
    ]);

    res.json({
      success: true,
      count: messages.length,
      total,
      unreadCount,
      page: Number(page),
      data: messages
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark a message as read
 * @route   PATCH /api/admin/messages/:id/read
 * @access  Private (Admin)
 */
const markAsRead = async (req, res, next) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.json({ success: true, message: 'Marked as read', data: message });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a contact message
 * @route   DELETE /api/admin/messages/:id
 * @access  Private (Admin)
 */
const deleteMessage = async (req, res, next) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    res.json({ success: true, message: 'Message deleted', data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitContact, getAllMessages, markAsRead, deleteMessage };