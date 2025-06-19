/**
 * Email Service - Gmail SMTP Integration
 * Handles booking confirmations, notifications, and customer communications
 */

import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

interface BookingConfirmationData {
  bookingId: string;
  passengerName: string;
  flightNumber: string;
  route: string;
  date: string;
  time: string;
  total: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    // Professional email service configuration
    // Supports Gmail Workspace, Outlook, or any SMTP provider
    const emailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER, // business email address
        pass: process.env.SMTP_PASS, // app password or SMTP password
      },
    };

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.transporter = nodemailer.createTransporter(emailConfig);
    } else {
      console.log('Email service not configured - SMTP credentials missing');
    }
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.transporter) {
      console.log(`Email would be sent to ${options.to}: ${options.subject}`);
      return false;
    }

    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'support@yourtravelsearch.com',
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async sendBookingConfirmation(email: string, data: BookingConfirmationData): Promise<boolean> {
    const subject = `Booking Confirmation - ${data.flightNumber}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: #2563eb; color: white; padding: 30px; text-align: center; }
          .content { padding: 30px; }
          .flight-details { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
          .label { font-weight: bold; color: #374151; }
          .value { color: #1f2937; }
          .total { background: #dcfce7; padding: 15px; border-radius: 8px; text-align: center; margin-top: 20px; }
          .footer { background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✈️ YourTravelSearch</h1>
            <p>Your flight is confirmed!</p>
          </div>
          
          <div class="content">
            <h2>Hello ${data.passengerName},</h2>
            <p>Thank you for booking with YourTravelSearch. Your flight reservation is confirmed.</p>
            
            <div class="flight-details">
              <h3>Flight Details</h3>
              <div class="detail-row">
                <span class="label">Booking ID:</span>
                <span class="value">${data.bookingId}</span>
              </div>
              <div class="detail-row">
                <span class="label">Flight:</span>
                <span class="value">${data.flightNumber}</span>
              </div>
              <div class="detail-row">
                <span class="label">Route:</span>
                <span class="value">${data.route}</span>
              </div>
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">${data.date}</span>
              </div>
              <div class="detail-row">
                <span class="label">Time:</span>
                <span class="value">${data.time}</span>
              </div>
            </div>
            
            <div class="total">
              <h3>Total Paid: ${data.total}</h3>
            </div>
            
            <p><strong>Important:</strong> Please arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights.</p>
            
            <p>Have a great trip!</p>
          </div>
          
          <div class="footer">
            <p>YourTravelSearch - Powered by live airline data via Duffel</p>
            <p>Need help? Contact us at support@yourtravelsearch.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Flight Confirmation - ${data.flightNumber}
      
      Hello ${data.passengerName},
      
      Your flight booking is confirmed:
      
      Booking ID: ${data.bookingId}
      Flight: ${data.flightNumber}
      Route: ${data.route}
      Date: ${data.date}
      Time: ${data.time}
      Total: ${data.total}
      
      Please arrive at the airport 2-3 hours before departure.
      
      Have a great trip!
      
      YourTravelSearch Team
    `;

    return this.sendEmail({ to: email, subject, html, text });
  }

  async sendPriceAlert(email: string, flightRoute: string, oldPrice: string, newPrice: string): Promise<boolean> {
    const subject = `Price Drop Alert: ${flightRoute}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>🎉 Price Drop Alert!</h2>
        <p>Great news! The price for your watched flight has dropped:</p>
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>${flightRoute}</h3>
          <p style="text-decoration: line-through; color: #ef4444;">Was: ${oldPrice}</p>
          <p style="font-size: 24px; color: #16a34a; font-weight: bold;">Now: ${newPrice}</p>
        </div>
        <p><a href="https://yourtravelsearch.com" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Book Now</a></p>
      </div>
    `;

    return this.sendEmail({ to: email, subject, html });
  }

  async testConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email connection test failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();