/**
 * Booking Confirmation Service
 * 
 * Implements Duffel's official guidance for booking confirmation emails:
 * - Order confirmation responsibility lies with travel seller (us)
 * - Must include itinerary, payment details, and booking reference
 * - Should be sent immediately after booking completion
 * - Reduces customer support calls and improves travel experience
 */

interface BookingConfirmationData {
  // Booking Reference
  booking_reference: string;
  confirmation_code: string;
  
  // Flight Details
  segments: Array<{
    marketing_carrier: {
      iata_code: string;
      name: string;
    };
    flight_number: string;
    departing_at: string;
    arriving_at: string;
    duration: string;
    origin: {
      iata_code: string;
      city_name: string;
      terminal?: string;
    };
    destination: {
      iata_code: string;
      city_name: string;
      terminal?: string;
    };
    operating_carrier?: {
      iata_code: string;
      name: string;
    };
  }>;
  
  // Passenger Information
  passengers: Array<{
    given_name: string;
    family_name: string;
    cabin_class: string;
    seat_designator?: string;
    baggage?: Array<{
      quantity: number;
      type: string;
    }>;
  }>;
  
  // Payment Details
  payment: {
    base_amount: number;
    tax_amount: number;
    total_amount: number;
    currency: string;
    markup_applied: boolean;
  };
  
  // Booking Conditions
  conditions: Array<{
    change_before_departure?: string;
    refund_before_departure?: string;
    no_show_policy?: string;
  }>;
  
  // Customer Details
  customer: {
    email: string;
    phone?: string;
  };
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export class BookingConfirmationService {
  private sendGridApiKey: string | null = null;
  private fromEmail: string = 'bookings@travelhub.com';
  private fromName: string = 'TravelHub Bookings';

  constructor(apiKey?: string) {
    this.sendGridApiKey = apiKey || null;
  }

  /**
   * Send booking confirmation email following Duffel's guidelines
   */
  async sendBookingConfirmation(bookingData: BookingConfirmationData): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }> {
    try {
      const template = this.generateConfirmationTemplate(bookingData);
      
      const emailData = {
        personalizations: [{
          to: [{
            email: bookingData.customer.email,
            name: `${bookingData.passengers[0].given_name} ${bookingData.passengers[0].family_name}`
          }]
        }],
        from: {
          email: this.fromEmail,
          name: this.fromName
        },
        subject: template.subject,
        content: [
          {
            type: 'text/plain',
            value: template.text
          },
          {
            type: 'text/html',
            value: template.html
          }
        ]
      };

      // In development, simulate email sending
      if (!this.sendGridApiKey || this.sendGridApiKey === 'test_key') {
        return this.simulateEmailSending(bookingData, template);
      }

      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.sendGridApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      if (response.ok) {
        const messageId = response.headers.get('x-message-id');
        return {
          success: true,
          messageId: messageId || undefined
        };
      } else {
        const error = await response.text();
        return {
          success: false,
          error: `SendGrid error: ${response.status} ${error}`
        };
      }
    } catch (error) {
      console.error('Email sending error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate HTML email template following Duffel's specification
   */
  private generateConfirmationTemplate(data: BookingConfirmationData): EmailTemplate {
    const primarySegment = data.segments[0];
    const passenger = data.passengers[0];
    
    const subject = `Booking Confirmed - ${primarySegment.origin.iata_code} to ${primarySegment.destination.iata_code} - ${data.booking_reference}`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
        .confirmation-box { background: #dbeafe; padding: 15px; border-radius: 6px; text-align: center; margin: 20px 0; }
        .segment { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #2563eb; }
        .passenger-info { background: white; padding: 15px; border-radius: 6px; margin: 10px 0; }
        .payment-summary { background: #f1f5f9; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .important { color: #dc2626; font-weight: bold; }
        .footer { background: #374151; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
        .flight-route { display: flex; align-items: center; justify-content: space-between; margin: 10px 0; }
        .airport { text-align: center; }
        .airport-code { font-size: 24px; font-weight: bold; }
        .flight-arrow { flex: 1; text-align: center; margin: 0 10px; }
        @media (max-width: 600px) {
          .flight-route { flex-direction: column; }
          .flight-arrow { margin: 10px 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>✈️ Booking Confirmed</h1>
        <p>Your flight has been successfully booked</p>
      </div>
      
      <div class="content">
        <div class="confirmation-box">
          <h2>BOOKING CONFIRMED</h2>
          <p><strong>Confirmation Code: ${data.confirmation_code}</strong></p>
          <p><strong>Booking Reference: ${data.booking_reference}</strong></p>
          <p class="important">Please save this confirmation for your records</p>
        </div>

        <div class="segment">
          <h3>Flight Details</h3>
          <p><strong>Flight ${primarySegment.marketing_carrier.iata_code} ${primarySegment.flight_number}</strong></p>
          <p><strong>Date:</strong> ${new Date(primarySegment.departing_at).toLocaleDateString()}</p>
          <p><strong>Duration:</strong> ${primarySegment.duration}</p>
          
          <div class="flight-route">
            <div class="airport">
              <div class="airport-code">${primarySegment.origin.iata_code}</div>
              <div>${primarySegment.origin.city_name}</div>
              ${primarySegment.origin.terminal ? `<div>Terminal ${primarySegment.origin.terminal}</div>` : ''}
              <div><strong>${new Date(primarySegment.departing_at).toLocaleTimeString()}</strong></div>
            </div>
            
            <div class="flight-arrow">
              <div>✈️</div>
              <div>${primarySegment.duration}</div>
            </div>
            
            <div class="airport">
              <div class="airport-code">${primarySegment.destination.iata_code}</div>
              <div>${primarySegment.destination.city_name}</div>
              ${primarySegment.destination.terminal ? `<div>Terminal ${primarySegment.destination.terminal}</div>` : ''}
              <div><strong>${new Date(primarySegment.arriving_at).toLocaleTimeString()}</strong></div>
            </div>
          </div>
          
          ${primarySegment.operating_carrier ? `<p><strong>Operated by:</strong> ${primarySegment.operating_carrier.name}</p>` : ''}
        </div>

        <div class="passenger-info">
          <h3>Passenger Information</h3>
          ${data.passengers.map(p => `
            <div style="margin: 10px 0; padding: 10px; background: #f8fafc; border-radius: 4px;">
              <p><strong>Passenger:</strong> ${p.given_name} ${p.family_name}</p>
              <p><strong>Class:</strong> ${p.cabin_class}</p>
              ${p.seat_designator ? `<p><strong>Seat:</strong> ${p.seat_designator}</p>` : ''}
              ${p.baggage && p.baggage.length > 0 ? `
                <p><strong>Baggage:</strong> ${p.baggage.map(b => `${b.quantity} ${b.type}`).join(', ')}</p>
              ` : ''}
            </div>
          `).join('')}
        </div>

        <div class="payment-summary">
          <h3>Your Trip Receipt</h3>
          <div style="display: flex; justify-content: space-between; margin: 5px 0;">
            <span>Fare:</span>
            <span>${data.payment.currency} ${data.payment.base_amount.toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 5px 0;">
            <span>Fees & taxes:</span>
            <span>${data.payment.currency} ${data.payment.tax_amount.toFixed(2)}</span>
          </div>
          <hr style="margin: 10px 0;">
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px;">
            <span>Total:</span>
            <span>${data.payment.currency} ${data.payment.total_amount.toFixed(2)}</span>
          </div>
        </div>

        <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h3>Important Information</h3>
          <ul>
            <li><strong>Check-in:</strong> Use booking reference ${data.booking_reference} to check in online or at the airport</li>
            <li><strong>Arrive Early:</strong> Please arrive at least 2 hours before domestic flights, 3 hours before international flights</li>
            <li><strong>Documents:</strong> Ensure you have valid ID/passport for travel</li>
            <li><strong>Changes:</strong> Contact us for any changes to your booking</li>
          </ul>
        </div>

        ${data.conditions.length > 0 ? `
          <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <h3>Booking Conditions</h3>
            ${data.conditions.map(condition => `
              <p style="margin: 5px 0; font-size: 14px;">
                ${condition.change_before_departure ? `Changes allowed until ${condition.change_before_departure}` : ''}
                ${condition.refund_before_departure ? `Refunds allowed until ${condition.refund_before_departure}` : ''}
                ${condition.no_show_policy ? `No-show policy: ${condition.no_show_policy}` : ''}
              </p>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div class="footer">
        <p>Thank you for choosing TravelHub</p>
        <p>For support, contact us at support@travelhub.com</p>
        <p>Safe travels! ✈️</p>
      </div>
    </body>
    </html>`;

    const text = `
BOOKING CONFIRMATION

Confirmation Code: ${data.confirmation_code}
Booking Reference: ${data.booking_reference}

FLIGHT DETAILS
Flight: ${primarySegment.marketing_carrier.iata_code} ${primarySegment.flight_number}
Date: ${new Date(primarySegment.departing_at).toLocaleDateString()}
Departure: ${primarySegment.origin.iata_code} (${primarySegment.origin.city_name}) at ${new Date(primarySegment.departing_at).toLocaleTimeString()}
Arrival: ${primarySegment.destination.iata_code} (${primarySegment.destination.city_name}) at ${new Date(primarySegment.arriving_at).toLocaleTimeString()}
Duration: ${primarySegment.duration}

PASSENGER
Name: ${passenger.given_name} ${passenger.family_name}
Class: ${passenger.cabin_class}
${passenger.seat_designator ? `Seat: ${passenger.seat_designator}` : ''}

PAYMENT SUMMARY
Fare: ${data.payment.currency} ${data.payment.base_amount.toFixed(2)}
Fees & taxes: ${data.payment.currency} ${data.payment.tax_amount.toFixed(2)}
Total: ${data.payment.currency} ${data.payment.total_amount.toFixed(2)}

IMPORTANT: Use booking reference ${data.booking_reference} to check in. Arrive at least 2-3 hours before departure.

Thank you for choosing TravelHub!
`;

    return { subject, html, text };
  }

  /**
   * Simulate email sending for development
   */
  private async simulateEmailSending(
    bookingData: BookingConfirmationData, 
    template: EmailTemplate
  ): Promise<{ success: boolean; messageId: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('=== BOOKING CONFIRMATION EMAIL SIMULATION ===');
    console.log(`To: ${bookingData.customer.email}`);
    console.log(`Subject: ${template.subject}`);
    console.log(`Booking Reference: ${bookingData.booking_reference}`);
    console.log(`Flight: ${bookingData.segments[0].marketing_carrier.iata_code} ${bookingData.segments[0].flight_number}`);
    console.log(`Total Amount: ${bookingData.payment.currency} ${bookingData.payment.total_amount}`);
    console.log('=== EMAIL SENT SUCCESSFULLY ===');

    return {
      success: true,
      messageId: `sim_${Date.now()}_${Math.random().toString(36).substring(2)}`
    };
  }

  /**
   * Set SendGrid API key for live email sending
   */
  setApiKey(apiKey: string): void {
    this.sendGridApiKey = apiKey;
  }

  /**
   * Configure sender details
   */
  setSenderDetails(email: string, name: string): void {
    this.fromEmail = email;
    this.fromName = name;
  }

  /**
   * Validate booking data before sending confirmation
   */
  validateBookingData(data: BookingConfirmationData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.booking_reference) errors.push('Booking reference is required');
    if (!data.confirmation_code) errors.push('Confirmation code is required');
    if (!data.customer.email) errors.push('Customer email is required');
    if (!data.segments || data.segments.length === 0) errors.push('Flight segments are required');
    if (!data.passengers || data.passengers.length === 0) errors.push('Passenger information is required');
    if (!data.payment.total_amount) errors.push('Payment amount is required');

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export const bookingConfirmationService = new BookingConfirmationService();