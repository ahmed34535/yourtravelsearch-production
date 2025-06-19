import { 
  destinations, hotels, flights, packages, users, bookings, webhooks, supportTickets, supportMessages,
  flightAlerts, priceAlerts, bookingConfirmations, priceWatchRequests, inAppNotifications,
  type Destination, type Hotel, type Flight, type Package, type User, type Booking, type Webhook, type SupportTicket, type SupportMessage,
  type FlightAlert, type PriceAlert, type BookingConfirmation, type PriceWatchRequest, type InAppNotification,
  type InsertDestination, type InsertHotel, type InsertFlight, type InsertPackage, type InsertUser, type InsertBooking, type InsertWebhook, type InsertSupportTicket, type InsertSupportMessage,
  type InsertFlightAlert, type InsertPriceAlert, type InsertBookingConfirmation, type InsertPriceWatchRequest, type InsertInAppNotification
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, and, gte, lte } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  updateUserPassword(id: number, newPassword: string): Promise<User | undefined>;
  updateUserAvatar(id: number, avatar: string): Promise<User | undefined>;
  
  // Destinations
  getDestinations(): Promise<Destination[]>;
  getDestination(id: number): Promise<Destination | undefined>;
  
  // Hotels
  getHotels(): Promise<Hotel[]>;
  getHotel(id: number): Promise<Hotel | undefined>;
  getFeaturedHotels(): Promise<Hotel[]>;
  searchHotels(location?: string, minPrice?: number, maxPrice?: number): Promise<Hotel[]>;
  
  // Flights
  getFlights(): Promise<Flight[]>;
  getFlight(id: number): Promise<Flight | undefined>;
  searchFlights(origin?: string, destination?: string, minPrice?: number, maxPrice?: number): Promise<Flight[]>;
  
  // Packages
  getPackages(): Promise<Package[]>;
  getPackage(id: number): Promise<Package | undefined>;
  
  // Bookings
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingByReference(reference: string): Promise<Booking | undefined>;
  getUserBookings(userId: number): Promise<Booking[]>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  
  // Webhooks
  getAllWebhooks(): Promise<Webhook[]>;
  getWebhook(id: number): Promise<Webhook | undefined>;
  createWebhook(webhook: InsertWebhook & { secret: string }): Promise<Webhook>;
  updateWebhook(id: number, updates: Partial<Webhook>): Promise<Webhook | undefined>;
  deleteWebhook(id: number): Promise<boolean>;
  incrementWebhookSuccess(id: number): Promise<void>;
  incrementWebhookFailure(id: number): Promise<void>;
  updateWebhookLastPing(id: number): Promise<void>;

  // Notification System
  getActiveBookings(): Promise<Booking[]>;
  createFlightAlert(alert: InsertFlightAlert): Promise<FlightAlert>;
  getPriceWatchRequests(): Promise<PriceWatchRequest[]>;
  createPriceAlert(alert: InsertPriceAlert): Promise<PriceAlert>;
  createBookingConfirmation(confirmation: InsertBookingConfirmation): Promise<BookingConfirmation>;
  createNotification(notification: InsertInAppNotification): Promise<InAppNotification>;
  getUserNotifications(userId: number): Promise<InAppNotification[]>;
  markNotificationAsRead(id: number): Promise<boolean>;
}

export class LiveAPIStorage implements IStorage {
  private users = new Map<number, User>();
  private bookings = new Map<number, Booking>();
  private webhooks = new Map<number, Webhook>();
  private nextUserId = 1;
  private nextBookingId = 1;
  private nextWebhookId = 1;

  constructor() {
    // Initialize with demo user and admin
    this.users.set(1, {
      id: 1,
      username: "demo@travelsearch.com",
      password: "demo",
      email: "demo@travelsearch.com",
      firstName: "Demo",
      lastName: "User",
      phone: null,
      dateOfBirth: null,
      passportNumber: null,
      emailVerified: null,
      phoneVerified: null,
      nationality: null,
      emergencyContactName: null,
      emergencyContactPhone: null,
      dietaryRequirements: null,
      accessibilityRequirements: null,
      preferredCurrency: null,
      preferredLanguage: null,
      seatPreference: null,
      mealPreference: null,
      frequentFlyerNumbers: null,
      avatar: null,
      role: "user",
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      createdAt: new Date(),
    });

    this.users.set(2, {
      id: 2,
      username: "admin@travelsearch.com",
      password: "admin123",
      email: "admin@travelsearch.com",
      firstName: "Admin",
      lastName: "User",
      phone: null,
      dateOfBirth: null,
      passportNumber: null,
      emailVerified: null,
      phoneVerified: null,
      nationality: null,
      emergencyContactName: null,
      emergencyContactPhone: null,
      dietaryRequirements: null,
      accessibilityRequirements: null,
      preferredCurrency: null,
      preferredLanguage: null,
      seatPreference: null,
      mealPreference: null,
      frequentFlyerNumbers: null,
      avatar: null,
      role: "admin",
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      createdAt: new Date(),
    });

    this.nextUserId = 3;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextUserId++,
      username: insertUser.username || insertUser.email,
      password: insertUser.password,
      email: insertUser.email,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      phone: insertUser.phone || null,
      dateOfBirth: insertUser.dateOfBirth || null,
      passportNumber: insertUser.passportNumber || null,
      emailVerified: insertUser.emailVerified || null,
      phoneVerified: insertUser.phoneVerified || null,
      nationality: insertUser.nationality || null,
      emergencyContactName: insertUser.emergencyContactName || null,
      emergencyContactPhone: insertUser.emergencyContactPhone || null,
      dietaryRequirements: insertUser.dietaryRequirements || null,
      accessibilityRequirements: insertUser.accessibilityRequirements || null,
      preferredCurrency: insertUser.preferredCurrency || null,
      preferredLanguage: insertUser.preferredLanguage || null,
      seatPreference: insertUser.seatPreference || null,
      mealPreference: insertUser.mealPreference || null,
      frequentFlyerNumbers: insertUser.frequentFlyerNumbers || null,
      avatar: insertUser.avatar || null,
      role: insertUser.role || "user",
      emailNotifications: insertUser.emailNotifications ?? true,
      smsNotifications: insertUser.smsNotifications ?? false,
      pushNotifications: insertUser.pushNotifications ?? true,
      createdAt: new Date(),
    };

    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updateUserPassword(id: number, newPassword: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    user.password = newPassword;
    this.users.set(id, user);
    return user;
  }

  async updateUserAvatar(id: number, avatar: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    user.avatar = avatar;
    this.users.set(id, user);
    return user;
  }

  // Travel data operations require live API integration
  async getDestinations(): Promise<Destination[]> {
    throw new Error("Live travel API integration required. Please configure DUFFEL_API_TOKEN to access destination data.");
  }

  async getDestination(id: number): Promise<Destination | undefined> {
    throw new Error("Live travel API integration required. Please configure DUFFEL_API_TOKEN to access destination data.");
  }

  async getHotels(): Promise<Hotel[]> {
    throw new Error("Live hotel API integration required. Please configure hotel booking API credentials to access hotel data.");
  }

  async getHotel(id: number): Promise<Hotel | undefined> {
    throw new Error("Live hotel API integration required. Please configure hotel booking API credentials to access hotel data.");
  }

  async getFeaturedHotels(): Promise<Hotel[]> {
    throw new Error("Live hotel API integration required. Please configure hotel booking API credentials to access hotel data.");
  }

  async searchHotels(location?: string, minPrice?: number, maxPrice?: number): Promise<Hotel[]> {
    throw new Error("Live hotel API integration required. Please configure hotel booking API credentials to access hotel data.");
  }

  async getFlights(): Promise<Flight[]> {
    throw new Error("Live flight API integration required. Please configure DUFFEL_API_TOKEN to access flight data.");
  }

  async getFlight(id: number): Promise<Flight | undefined> {
    throw new Error("Live flight API integration required. Please configure DUFFEL_API_TOKEN to access flight data.");
  }

  async searchFlights(origin?: string, destination?: string, minPrice?: number, maxPrice?: number): Promise<Flight[]> {
    throw new Error("Live flight API integration required. Please configure DUFFEL_API_TOKEN to access flight data.");
  }

  async getPackages(): Promise<Package[]> {
    throw new Error("Live package API integration required. Please configure travel package API credentials to access package data.");
  }

  async getPackage(id: number): Promise<Package | undefined> {
    throw new Error("Live package API integration required. Please configure travel package API credentials to access package data.");
  }

  // Booking operations
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const newBooking: Booking = {
      id: this.nextBookingId++,
      type: booking.type,
      status: booking.status,
      reference: booking.reference,
      userId: booking.userId,
      totalAmount: booking.totalAmount,
      currency: booking.currency,
      details: booking.details || null,
      bookingData: booking.bookingData || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.bookings.set(newBooking.id, newBooking);
    return newBooking;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingByReference(reference: string): Promise<Booking | undefined> {
    for (const booking of Array.from(this.bookings.values())) {
      if (booking.reference === reference) {
        return booking;
      }
    }
    return undefined;
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.userId === userId);
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const booking = this.bookings.get(id);
    if (!booking) return undefined;

    booking.status = status;
    booking.updatedAt = new Date();
    this.bookings.set(id, booking);
    return booking;
  }

  // Webhook operations
  async getAllWebhooks(): Promise<Webhook[]> {
    return Array.from(this.webhooks.values());
  }

  async getWebhook(id: number): Promise<Webhook | undefined> {
    return undefined;
  }

  async createWebhook(webhook: InsertWebhook & { secret: string }): Promise<Webhook> {
    throw new Error("Webhook management requires live API integration");
  }

  async updateWebhook(id: number, updates: Partial<Webhook>): Promise<Webhook | undefined> {
    throw new Error("Webhook management requires live API integration");
  }

  async deleteWebhook(id: number): Promise<boolean> {
    throw new Error("Webhook management requires live API integration");
  }

  async incrementWebhookSuccess(id: number): Promise<void> {
    // Live webhook analytics implementation needed
  }

  async incrementWebhookFailure(id: number): Promise<void> {
    // Live webhook analytics implementation needed
  }

  async updateWebhookLastPing(id: number): Promise<void> {
    // Live webhook analytics implementation needed
  }

  // Notification System - Placeholder implementations for LiveAPIStorage
  async getActiveBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => 
      booking.status === 'confirmed' || booking.status === 'pending'
    );
  }

  async createFlightAlert(alert: InsertFlightAlert): Promise<FlightAlert> {
    throw new Error("Flight alerts require live API integration");
  }

  async getPriceWatchRequests(): Promise<PriceWatchRequest[]> {
    return [];
  }

  async createPriceAlert(alert: InsertPriceAlert): Promise<PriceAlert> {
    throw new Error("Price alerts require live API integration");
  }

  async createBookingConfirmation(confirmation: InsertBookingConfirmation): Promise<BookingConfirmation> {
    throw new Error("Booking confirmations require live API integration");
  }

  async createNotification(notification: InsertInAppNotification): Promise<InAppNotification> {
    throw new Error("Notifications require live API integration");
  }

  async getUserNotifications(userId: number): Promise<InAppNotification[]> {
    return [];
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    return false;
  }
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: any): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<any>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserPassword(id: number, newPassword: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ password: newPassword })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserAvatar(id: number, avatar: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ avatar })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Destinations
  async getDestinations(): Promise<Destination[]> {
    return await db.select().from(destinations);
  }

  async getDestination(id: number): Promise<Destination | undefined> {
    const [destination] = await db.select().from(destinations).where(eq(destinations.id, id));
    return destination;
  }

  // Hotels
  async getHotels(): Promise<Hotel[]> {
    return await db.select().from(hotels);
  }

  async getHotel(id: number): Promise<Hotel | undefined> {
    const [hotel] = await db.select().from(hotels).where(eq(hotels.id, id));
    return hotel;
  }

  async getFeaturedHotels(): Promise<Hotel[]> {
    return await db.select().from(hotels).where(eq(hotels.featured, true));
  }

  async searchHotels(location?: string, minPrice?: number, maxPrice?: number): Promise<Hotel[]> {
    let query = db.select().from(hotels);
    
    if (location) {
      query = query.where(ilike(hotels.location, `%${location}%`));
    }
    
    return await query;
  }

  // Flights
  async getFlights(): Promise<Flight[]> {
    return await db.select().from(flights);
  }

  async getFlight(id: number): Promise<Flight | undefined> {
    const [flight] = await db.select().from(flights).where(eq(flights.id, id));
    return flight;
  }

  async searchFlights(origin?: string, destination?: string, minPrice?: number, maxPrice?: number): Promise<Flight[]> {
    let query = db.select().from(flights);
    
    if (origin) {
      query = query.where(ilike(flights.origin, `%${origin}%`));
    }
    
    if (destination) {
      query = query.where(ilike(flights.destination, `%${destination}%`));
    }
    
    return await query;
  }

  // Packages
  async getPackages(): Promise<Package[]> {
    return await db.select().from(packages);
  }

  async getPackage(id: number): Promise<Package | undefined> {
    const [pkg] = await db.select().from(packages).where(eq(packages.id, id));
    return pkg;
  }

  // Bookings
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db
      .insert(bookings)
      .values(booking)
      .returning();
    return newBooking;
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async getBookingByReference(reference: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.reference, reference));
    return booking;
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.userId, userId));
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const [booking] = await db
      .update(bookings)
      .set({ status })
      .where(eq(bookings.id, id))
      .returning();
    return booking;
  }

  // Webhooks
  async getAllWebhooks(): Promise<Webhook[]> {
    return await db.select().from(webhooks);
  }

  async getWebhook(id: number): Promise<Webhook | undefined> {
    const [webhook] = await db.select().from(webhooks).where(eq(webhooks.id, id));
    return webhook;
  }

  async createWebhook(webhook: InsertWebhook & { secret: string }): Promise<Webhook> {
    const [newWebhook] = await db
      .insert(webhooks)
      .values({
        ...webhook,
        createdAt: new Date(),
        successCount: 0,
        failureCount: 0
      })
      .returning();
    return newWebhook;
  }

  async updateWebhook(id: number, updates: Partial<Webhook>): Promise<Webhook | undefined> {
    const [webhook] = await db
      .update(webhooks)
      .set(updates)
      .where(eq(webhooks.id, id))
      .returning();
    return webhook;
  }

  async deleteWebhook(id: number): Promise<boolean> {
    const result = await db.delete(webhooks).where(eq(webhooks.id, id));
    return true;
  }

  async incrementWebhookSuccess(id: number): Promise<void> {
    await db
      .update(webhooks)
      .set({ 
        successCount: 0,
        lastPing: new Date()
      })
      .where(eq(webhooks.id, id));
  }

  async incrementWebhookFailure(id: number): Promise<void> {
    await db
      .update(webhooks)
      .set({ 
        failureCount: 0,
        lastPing: new Date()
      })
      .where(eq(webhooks.id, id));
  }

  async updateWebhookLastPing(id: number): Promise<void> {
    await db
      .update(webhooks)
      .set({ lastPing: new Date() })
      .where(eq(webhooks.id, id));
  }

  // Notification System Implementation
  async getActiveBookings(): Promise<Booking[]> {
    const allBookings = await db.select().from(bookings);
    return allBookings.filter(booking => booking.status === 'confirmed' || booking.status === 'pending');
  }

  async createFlightAlert(alert: InsertFlightAlert): Promise<FlightAlert> {
    const [flightAlert] = await db
      .insert(flightAlerts)
      .values(alert)
      .returning();
    return flightAlert;
  }

  async getPriceWatchRequests(): Promise<PriceWatchRequest[]> {
    return await db.select().from(priceWatchRequests);
  }

  async createPriceAlert(alert: InsertPriceAlert): Promise<PriceAlert> {
    const [priceAlert] = await db
      .insert(priceAlerts)
      .values(alert)
      .returning();
    return priceAlert;
  }

  async createBookingConfirmation(confirmation: InsertBookingConfirmation): Promise<BookingConfirmation> {
    const [bookingConfirmation] = await db
      .insert(bookingConfirmations)
      .values(confirmation)
      .returning();
    return bookingConfirmation;
  }

  async createNotification(notification: InsertInAppNotification): Promise<InAppNotification> {
    const [inAppNotification] = await db
      .insert(inAppNotifications)
      .values(notification)
      .returning();
    return inAppNotification;
  }

  async getUserNotifications(userId: number): Promise<InAppNotification[]> {
    return await db.select().from(inAppNotifications).where(eq(inAppNotifications.userId, userId));
  }

  async markNotificationAsRead(id: number): Promise<boolean> {
    const result = await db
      .update(inAppNotifications)
      .set({ read: true })
      .where(eq(inAppNotifications.id, id));
    return true;
  }
}

export const storage = new DatabaseStorage();