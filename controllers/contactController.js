/**
 * controllers/contactController.js - Handles contact form submissions
 */

const Contact = require('../models/Contact');
const { MailerSend, EmailParams, Sender, Recipient } = require('mailersend');

// ─── MailerSend Instance ──────────────────────────────────────────────────────
const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY,
});

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

    // ── Send email via MailerSend ─────────────────────────────────────────────
    const sentFrom = new Sender(process.env.EMAIL_FROM, process.env.EMAIL_FROM_NAME);

    const recipients = [
      new Recipient(process.env.EMAIL_TO, 'Prabhakar Kumar')
    ];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(new Sender(email, name))
      .setSubject(`📬 New Contact: ${subject}`)
      .setHtml(`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">New Portfolio Contact</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold;">Name:</td>
              <td style="padding: 8px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Email:</td>
              <td style="padding: 8px;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Subject:</td>
              <td style="padding: 8px;">${subject}</td>
            </tr>
          </table>
          <div style="margin-top: 16px; padding: 16px; background: #f3f4f6; border-radius: 8px;">
            <p style="font-weight: bold;">Message:</p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 16px;">
            Received at: ${new Date().toLocaleString()}
          </p>
        </div>
      `)
      .setText(
        `New message from ${name} (${email})\n\nSubject: ${subject}\n\nMessage:\n${message}\n\nReceived at: ${new Date().toLocaleString()}`
      );

    await mailerSend.email.send(emailParams);
    console.log('✅ Email sent successfully to', process.env.EMAIL_TO);

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