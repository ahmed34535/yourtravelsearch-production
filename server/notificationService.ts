import { storage } from "./storage";

export interface FlightAlert {
  id: string;
  userId: number;
  flightNumber: string;
  airline: string;
  route: string;
  scheduledDeparture: string;
  currentStatus: 'on-time' | 'delayed' | 'cancelled' | 'gate-changed';
  delayMinutes?: number;
  originalGate?: string;
  newGate?: string;
  createdAt: Date;
}

export interface PriceAlert {
  id: string;
  userId: number;
  route: string;
  targetPrice: number;
  currentPrice: number;
  departureDate: string;
  alertType: 'price-drop' | 'deal-alert' | 'mistake-fare';
  savings: number;
  createdAt: Date;
}

export interface BookingConfirmation {
  id: string;
  userId: number;
  bookingReference: string;
  passengerName: string;
  flightDetails: {
    airline: string;
    flightNumber: string;
    route: string;
    departureTime: string;
    arrivalTime: string;
    aircraft: string;
    seat?: string;
  };
  totalAmount: string;
  currency: string;
  bookingDate: Date;
}

class NotificationService {
  // Flight delay and gate change monitoring
  async monitorFlightUpdates() {
    try {
      // Get all active bookings that need monitoring
      const activeBookings = await storage.getActiveBookings();
      
      for (const booking of activeBookings) {
        const flightStatus = await this.checkFlightStatus(booking.flightNumber);
        
        if (flightStatus.hasChanges) {
          await this.sendFlightAlert({
            userId: booking.userId,
            flightNumber: booking.flightNumber,
            airline: booking.airline,
            route: booking.route,
            scheduledDeparture: booking.departureTime,
            currentStatus: flightStatus.status,
            delayMinutes: flightStatus.delayMinutes,
            originalGate: flightStatus.originalGate,
            newGate: flightStatus.newGate
          });
        }
      }
    } catch (error) {
      console.error('Flight monitoring error:', error);
    }
  }

  private async checkFlightStatus(flightNumber: string) {
    // Integration with flight status APIs (FlightAware, FlightStats)
    // For now, simulate realistic flight status data
    const statusOptions = ['on-time', 'delayed', 'gate-changed'];
    const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    
    return {
      hasChanges: Math.random() > 0.7, // 30% chance of changes
      status: randomStatus as any,
      delayMinutes: randomStatus === 'delayed' ? Math.floor(Math.random() * 120) + 15 : undefined,
      originalGate: randomStatus === 'gate-changed' ? 'A12' : undefined,
      newGate: randomStatus === 'gate-changed' ? 'B25' : undefined
    };
  }

  async sendFlightAlert(alert: Partial<FlightAlert>) {
    const user = await storage.getUser(alert.userId!);
    if (!user) return;

    const alertData: FlightAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: alert.userId || 1,
      flightNumber: alert.flightNumber || 'Unknown',
      airline: alert.airline || 'Unknown',
      route: alert.route || 'Unknown Route',
      scheduledDeparture: alert.scheduledDeparture || new Date().toISOString(),
      currentStatus: alert.currentStatus || 'on-time',
      delayMinutes: alert.delayMinutes,
      originalGate: alert.originalGate,
      newGate: alert.newGate,
      createdAt: new Date(),
    };

    // Store alert in database
    await storage.createFlightAlert(alertData);

    // Send notifications through multiple channels
    await this.sendEmailNotification(user.email, this.formatFlightAlertEmail(alertData));
    await this.sendPushNotification(user.id, this.formatFlightAlertPush(alertData));
    await this.createInAppNotification(user.id, alertData);

    console.log(`Flight alert sent to ${user.email}: ${alertData.currentStatus} for flight ${alertData.flightNumber}`);
  }

  // Price drop monitoring
  async monitorPriceDrops() {
    try {
      const priceWatches = await storage.getPriceWatchRequests();
      
      for (const watch of priceWatches) {
        const currentPrice = await this.getCurrentFlightPrice(watch.route, watch.departureDate);
        
        if (currentPrice < watch.targetPrice) {
          const savings = watch.targetPrice - currentPrice;
          await this.sendPriceAlert({
            userId: watch.userId,
            route: watch.route,
            targetPrice: watch.targetPrice,
            currentPrice: currentPrice,
            departureDate: watch.departureDate,
            alertType: 'price-drop',
            savings: savings
          });
        }
      }
    } catch (error) {
      console.error('Price monitoring error:', error);
    }
  }

  private async getCurrentFlightPrice(route: string, departureDate: string): Promise<number> {
    // Integration with Duffel API for real-time pricing
    // For simulation, return realistic price variations
    const basePrice = 450;
    const variation = (Math.random() - 0.5) * 200;
    return Math.max(200, basePrice + variation);
  }

  async sendPriceAlert(alert: Partial<PriceAlert>) {
    const user = await storage.getUser(alert.userId!);
    if (!user) return;

    const alertData: PriceAlert = {
      id: `price_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: alert.userId || 1,
      route: alert.route || 'Unknown Route',
      targetPrice: alert.targetPrice || 0,
      currentPrice: alert.currentPrice || 0,
      departureDate: alert.departureDate || new Date().toISOString(),
      alertType: alert.alertType || 'price-drop',
      savings: alert.savings || 0,
      createdAt: new Date(),
    };

    await storage.createPriceAlert(alertData);
    await this.sendEmailNotification(user.email, this.formatPriceAlertEmail(alertData));
    await this.sendPushNotification(user.id, this.formatPriceAlertPush(alertData));

    console.log(`Price alert sent to ${user.email}: ${alertData.savings} savings on ${alertData.route}`);
  }

  // Booking confirmation emails
  async sendBookingConfirmation(confirmation: Partial<BookingConfirmation>) {
    const user = await storage.getUser(confirmation.userId!);
    if (!user) return;

    const confirmationData: BookingConfirmation = {
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: confirmation.userId || 1,
      bookingReference: confirmation.bookingReference || 'Unknown',
      passengerName: confirmation.passengerName || 'Unknown',
      flightDetails: confirmation.flightDetails || {},
      totalAmount: confirmation.totalAmount || '0',
      currency: confirmation.currency || 'USD',
      bookingDate: new Date(),
    };

    await storage.createBookingConfirmation(confirmationData);
    await this.sendEmailNotification(user.email, this.formatBookingConfirmationEmail(confirmationData));
    
    console.log(`Booking confirmation sent to ${user.email}: ${confirmationData.bookingReference}`);
  }

  // Email formatting methods
  private formatFlightAlertEmail(alert: FlightAlert): string {
    let subject = '';
    let message = '';

    switch (alert.currentStatus) {
      case 'delayed':
        subject = `Flight Delay Alert: ${alert.flightNumber} delayed by ${alert.delayMinutes} minutes`;
        message = `Your flight ${alert.flightNumber} (${alert.route}) has been delayed by ${alert.delayMinutes} minutes. New departure time will be updated shortly.`;
        break;
      case 'gate-changed':
        subject = `Gate Change Alert: ${alert.flightNumber} moved to gate ${alert.newGate}`;
        message = `Your flight ${alert.flightNumber} (${alert.route}) has changed gates from ${alert.originalGate} to ${alert.newGate}.`;
        break;
      case 'cancelled':
        subject = `Flight Cancellation: ${alert.flightNumber} has been cancelled`;
        message = `Your flight ${alert.flightNumber} (${alert.route}) has been cancelled. Please contact customer service for rebooking options.`;
        break;
    }

    return `
      <h2>${subject}</h2>
      <p>${message}</p>
      <div style="margin: 20px 0; padding: 15px; background: #f0f9ff; border-radius: 8px;">
        <h3>Flight Details:</h3>
        <p><strong>Flight:</strong> ${alert.airline} ${alert.flightNumber}</p>
        <p><strong>Route:</strong> ${alert.route}</p>
        <p><strong>Scheduled Departure:</strong> ${alert.scheduledDeparture}</p>
      </div>
      <p>For assistance, contact our 24/7 support team at 1-800-TRAVAL-1 or support@travalsearch.com</p>
    `;
  }

  private formatPriceAlertEmail(alert: PriceAlert): string {
    return `
      <h2>Price Drop Alert! Save $${alert.savings.toFixed(2)}</h2>
      <p>Great news! The price for your watched route has dropped.</p>
      <div style="margin: 20px 0; padding: 15px; background: #f0f9ff; border-radius: 8px;">
        <h3>Deal Details:</h3>
        <p><strong>Route:</strong> ${alert.route}</p>
        <p><strong>Departure:</strong> ${alert.departureDate}</p>
        <p><strong>Previous Price:</strong> $${alert.targetPrice.toFixed(2)}</p>
        <p><strong>Current Price:</strong> $${alert.currentPrice.toFixed(2)}</p>
        <p><strong>Your Savings:</strong> $${alert.savings.toFixed(2)}</p>
      </div>
      <p style="background: #059669; color: white; padding: 12px; text-align: center; border-radius: 6px;">
        <a href="https://travalsearch.com/flight-search?route=${encodeURIComponent(alert.route)}" style="color: white; text-decoration: none;">
          Book Now - Limited Time!
        </a>
      </p>
    `;
  }

  private formatBookingConfirmationEmail(confirmation: BookingConfirmation): string {
    return `
      <h2>Booking Confirmed! ✈️</h2>
      <p>Thank you for booking with TravalSearch. Your trip is confirmed!</p>
      
      <div style="margin: 20px 0; padding: 20px; background: #f8fafc; border: 2px solid #059669; border-radius: 8px;">
        <h3>Booking Reference: ${confirmation.bookingReference}</h3>
        <p><strong>Passenger:</strong> ${confirmation.passengerName}</p>
        <p><strong>Total Amount:</strong> ${confirmation.currency} ${confirmation.totalAmount}</p>
      </div>

      <div style="margin: 20px 0; padding: 15px; background: #f0f9ff; border-radius: 8px;">
        <h3>Flight Details:</h3>
        <p><strong>Flight:</strong> ${confirmation.flightDetails.airline} ${confirmation.flightDetails.flightNumber}</p>
        <p><strong>Route:</strong> ${confirmation.flightDetails.route}</p>
        <p><strong>Departure:</strong> ${confirmation.flightDetails.departureTime}</p>
        <p><strong>Arrival:</strong> ${confirmation.flightDetails.arrivalTime}</p>
        <p><strong>Aircraft:</strong> ${confirmation.flightDetails.aircraft}</p>
        ${confirmation.flightDetails.seat ? `<p><strong>Seat:</strong> ${confirmation.flightDetails.seat}</p>` : ''}
      </div>

      <h3>Important Information:</h3>
      <ul>
        <li>Check-in opens 24 hours before departure</li>
        <li>Arrive at airport 2 hours before domestic, 3 hours before international flights</li>
        <li>Keep this confirmation for your records</li>
      </ul>

      <p>Questions? Contact us 24/7 at support@travalsearch.com or 1-800-TRAVAL-1</p>
    `;
  }

  // Push notification formatting
  private formatFlightAlertPush(alert: FlightAlert): object {
    let title = '';
    let body = '';

    switch (alert.currentStatus) {
      case 'delayed':
        title = `Flight ${alert.flightNumber} Delayed`;
        body = `${alert.delayMinutes} minute delay. Check app for updates.`;
        break;
      case 'gate-changed':
        title = `Gate Change: ${alert.flightNumber}`;
        body = `New gate: ${alert.newGate}. Previous: ${alert.originalGate}`;
        break;
      case 'cancelled':
        title = `Flight Cancelled: ${alert.flightNumber}`;
        body = `Contact support for rebooking options.`;
        break;
    }

    return { title, body, icon: '/flight-icon.png' };
  }

  private formatPriceAlertPush(alert: PriceAlert): object {
    return {
      title: `Price Drop Alert!`,
      body: `Save $${alert.savings.toFixed(2)} on ${alert.route}`,
      icon: '/price-alert-icon.png'
    };
  }

  // Notification delivery methods
  private async sendEmailNotification(email: string, content: string) {
    // Integration with SendGrid or similar email service
    console.log(`Email sent to ${email}`);
    // TODO: Implement actual email sending when email service is configured
  }

  private async sendPushNotification(userId: number, notification: object) {
    // Integration with push notification service
    console.log(`Push notification sent to user ${userId}:`, notification);
    // TODO: Implement actual push notifications
  }

  private async createInAppNotification(userId: number, alert: FlightAlert) {
    // Store notification for in-app display
    await storage.createNotification({
      userId,
      type: 'flight-alert',
      title: `Flight ${alert.flightNumber} Update`,
      message: `Status: ${alert.currentStatus}`,
      data: alert,
      read: false,
      createdAt: new Date()
    });
  }

  // Scheduled monitoring methods
  startFlightMonitoring() {
    // Check flight statuses every 5 minutes
    setInterval(() => {
      this.monitorFlightUpdates();
    }, 5 * 60 * 1000);
    
    console.log('Flight monitoring started - checking every 5 minutes');
  }

  startPriceMonitoring() {
    // Check prices every hour
    setInterval(() => {
      this.monitorPriceDrops();
    }, 60 * 60 * 1000);
    
    console.log('Price monitoring started - checking every hour');
  }
}

export const notificationService = new NotificationService();