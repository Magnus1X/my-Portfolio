const express = require('express');
const nodemailer = require('nodemailer');
const prisma = require('../config/database');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Create email transporter: use Gmail service when configured, else dev JSON transport
const isEmailConfigured = () => {
  return Boolean(
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS &&
    process.env.EMAIL_FROM
  )
}

const createTransporter = async () => {
  if (!isEmailConfigured()) {
    // Development fallback: emulate emails for local testing
    return nodemailer.createTransport({ jsonTransport: true })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      // Allow Gmail TLS in dev environments
      rejectUnauthorized: false,
      ciphers: 'TLSv1.2'
    }
  })

  // Verify transporter configuration to ensure real emails will send
  try {
    await transporter.verify()
    return transporter
  } catch (err) {
    // If verification fails (e.g., bad credentials), fall back to dev transport
    if (process.env.NODE_ENV !== 'production') {
      return nodemailer.createTransport({ jsonTransport: true })
    }
    throw err
  }
}

// Send contact form email
router.post('/', [
  body('name').isLength({ min: 1, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('subject').isLength({ min: 1, max: 200 }),
  body('message').isLength({ min: 1, max: 2000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    // Persist message to DB
    let savedMessage
    try {
      savedMessage = await prisma.message.create({
        data: {
          name,
          email,
          subject,
          content: message,
        }
      })
    } catch (dbErr) {
      console.error('Error saving contact message:', dbErr)
      // Continue with email sending even if DB save fails
    }

    const transporter = await createTransporter();

    // Email content
    const mailOptions = {
      from: `Saurav Kumar <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_FROM, // Send to admin email
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 3px; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This message was sent from your portfolio contact form.
          </p>
        </div>
      `
    };

    // Send email
    let simulated = false
    try {
      await transporter.sendMail(mailOptions);
    } catch (sendErr) {
      // Fallback to dev transport if send fails locally
      if (process.env.NODE_ENV !== 'production') {
        const devTransporter = nodemailer.createTransport({ jsonTransport: true })
        await devTransporter.sendMail(mailOptions)
        simulated = true
      } else {
        throw sendErr
      }
    }

    // Send confirmation email to user
    const confirmationOptions = {
      from: `Saurav Kumar <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Thank you for contacting Saurav Kumar',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank You for Your Message!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for reaching out through my portfolio. I've received your message and will get back to you as soon as possible.</p>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Your message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 3px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p>Best regards,<br>Saurav Kumar</p>
          <hr style="margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated confirmation email. Please do not reply to this message.
          </p>
        </div>
      `
    };

    try {
      await transporter.sendMail(confirmationOptions);
    } catch (sendErr2) {
      if (process.env.NODE_ENV !== 'production') {
        const devTransporter = nodemailer.createTransport({ jsonTransport: true })
        await devTransporter.sendMail(confirmationOptions)
        simulated = true
      } else {
        throw sendErr2
      }
    }

    const hint = simulated ? 'Email simulated in development due to SMTP issues. Verify Gmail app password and 2FA.' : undefined
    res.json({ message: 'Message sent successfully! I\'ll get back to you soon.', hint, savedMessageId: savedMessage?.id });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again later.', error: process.env.NODE_ENV === 'development' ? String(error) : undefined });
  }
});

module.exports = router;
