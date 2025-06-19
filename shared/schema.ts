import { pgTable, text, serial, integer, boolean, decimal, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  priceFrom: decimal("price_from", { precision: 10, scale: 2 }).notNull(),
  country: text("country").notNull(),
});

export const hotels = pgTable("hotels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
  pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
  amenities: text("amenities").array().notNull(),
  featured: boolean("featured").default(false),
});

export const flights = pgTable("flights", {
  id: serial("id").primaryKey(),
  airline: text("airline").notNull(),
  flightNumber: text("flight_number").notNull(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  departureTime: text("departure_time").notNull(),
  arrivalTime: text("arrival_time").notNull(),
  duration: text("duration").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stops: integer("stops").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const packages = pgTable("packages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  duration: text("duration").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  includes: text("includes").array().notNull(),
  savings: decimal("savings", { precision: 10, scale: 2 }).notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  dateOfBirth: text("date_of_birth"),
  passportNumber: text("passport_number"),
  emailVerified: boolean("email_verified").default(false),
  phoneVerified: boolean("phone_verified").default(false),
  emailVerificationToken: text("email_verification_token"),
  phoneVerificationCode: text("phone_verification_code"),
  verificationTokenExpires: timestamp("verification_token_expires"),
  passwordResetToken: text("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  // Profile enhancements
  avatar: text("avatar"),
  preferredCurrency: text("preferred_currency").default("USD"),
  preferredLanguage: text("preferred_language").default("en"),
  timezone: text("timezone").default("UTC"),
  twoFactorEnabled: boolean("two_factor_enabled").default(false),
  twoFactorSecret: text("two_factor_secret"),
  // Travel preferences
  seatPreference: text("seat_preference"), // 'window', 'aisle', 'middle'
  mealPreference: text("meal_preference"), // 'vegetarian', 'vegan', 'kosher', etc.
  frequentFlyerNumbers: text("frequent_flyer_numbers"), // JSON string
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  // Additional travel fields
  nationality: text("nationality"),
  dietaryRequirements: text("dietary_requirements"),
  accessibilityRequirements: text("accessibility_requirements"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(), // Booking reference (e.g., TRV123ABC)
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // 'flight', 'hotel', 'package'
  itemId: integer("item_id").notNull(), // ID of the booked item (flight, hotel, etc.)
  status: text("status").notNull().default("pending"), // 'pending', 'confirmed', 'cancelled'
  totalAmount: text("total_amount").notNull(), // Changed from decimal to text for API compatibility
  currency: text("currency").notNull().default("USD"),
  details: text("details"), // JSON string containing booking details
  bookingData: text("booking_data"), // Additional booking data field
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});



export const webhooks = pgTable("webhooks", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  secret: text("secret").notNull(),
  events: text("events").array().notNull(),
  active: boolean("active").notNull().default(true),
  successCount: integer("success_count").notNull().default(0),
  failureCount: integer("failure_count").notNull().default(0),
  lastPing: timestamp("last_ping"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payment Methods Table
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'card', 'bank', 'paypal'
  cardLast4: text("card_last4"),
  cardBrand: text("card_brand"), // 'visa', 'mastercard', 'amex'
  expiryMonth: integer("expiry_month"),
  expiryYear: integer("expiry_year"),
  billingName: text("billing_name"),
  billingAddress: text("billing_address"), // JSON string
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
  stripePaymentMethodId: text("stripe_payment_method_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Support Tickets Table
export const supportTickets = pgTable("support_tickets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  ticketNumber: text("ticket_number").notNull().unique(),
  subject: text("subject").notNull(),
  category: text("category").notNull(), // 'booking', 'payment', 'technical', 'general'
  priority: text("priority").notNull().default("medium"), // 'low', 'medium', 'high', 'urgent'
  status: text("status").notNull().default("open"), // 'open', 'in_progress', 'resolved', 'closed'
  description: text("description").notNull(),
  attachments: text("attachments").array(), // URLs to uploaded files
  assignedTo: text("assigned_to"), // Support agent
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Support Messages Table (for ticket conversations)
export const supportMessages = pgTable("support_messages", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").references(() => supportTickets.id).notNull(),
  senderId: integer("sender_id").references(() => users.id),
  senderType: text("sender_type").notNull(), // 'user', 'agent'
  message: text("message").notNull(),
  attachments: text("attachments").array(),
  isInternal: boolean("is_internal").default(false), // Internal agent notes
  createdAt: timestamp("created_at").defaultNow(),
});

// Trip Sharing Table
export const tripShares = pgTable("trip_shares", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id).notNull(),
  sharedBy: integer("shared_by").references(() => users.id).notNull(),
  shareToken: text("share_token").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  isPublic: boolean("is_public").default(false),
  viewCount: integer("view_count").default(0),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews Table
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bookingId: integer("booking_id").references(() => bookings.id),
  type: text("type").notNull(), // 'flight', 'hotel', 'package', 'overall'
  serviceProvider: text("service_provider"), // Airline, hotel name, etc.
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title"),
  content: text("content"),
  pros: text("pros").array(),
  cons: text("cons").array(),
  travelDate: timestamp("travel_date"),
  isVerified: boolean("is_verified").default(false),
  helpfulVotes: integer("helpful_votes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Flight Alerts Table
export const flightAlerts = pgTable("flight_alerts", {
  id: serial("id").primaryKey(),
  alertId: varchar("alert_id", { length: 50 }).notNull().unique(),
  userId: integer("user_id").references(() => users.id).notNull(),
  flightNumber: text("flight_number").notNull(),
  airline: text("airline").notNull(),
  route: text("route").notNull(),
  scheduledDeparture: text("scheduled_departure").notNull(),
  currentStatus: text("current_status").notNull(), // 'on-time', 'delayed', 'cancelled', 'gate-changed'
  delayMinutes: integer("delay_minutes"),
  originalGate: text("original_gate"),
  newGate: text("new_gate"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Price Alerts Table
export const priceAlerts = pgTable("price_alerts", {
  id: serial("id").primaryKey(),
  alertId: varchar("alert_id", { length: 50 }).notNull().unique(),
  userId: integer("user_id").references(() => users.id).notNull(),
  route: text("route").notNull(),
  targetPrice: decimal("target_price", { precision: 10, scale: 2 }).notNull(),
  currentPrice: decimal("current_price", { precision: 10, scale: 2 }).notNull(),
  departureDate: text("departure_date").notNull(),
  alertType: text("alert_type").notNull(), // 'price-drop', 'deal-alert', 'mistake-fare'
  savings: decimal("savings", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Booking Confirmations Table
export const bookingConfirmations = pgTable("booking_confirmations", {
  id: serial("id").primaryKey(),
  confirmationId: varchar("confirmation_id", { length: 50 }).notNull().unique(),
  userId: integer("user_id").references(() => users.id).notNull(),
  bookingReference: text("booking_reference").notNull(),
  passengerName: text("passenger_name").notNull(),
  flightDetails: jsonb("flight_details").notNull(),
  totalAmount: text("total_amount").notNull(),
  currency: text("currency").notNull(),
  bookingDate: timestamp("booking_date").defaultNow(),
});

// Price Watch Requests Table
export const priceWatchRequests = pgTable("price_watch_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  route: text("route").notNull(),
  targetPrice: decimal("target_price", { precision: 10, scale: 2 }).notNull(),
  departureDate: text("departure_date").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// In-App Notifications Table
export const inAppNotifications = pgTable("in_app_notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'flight-alert', 'price-alert', 'booking-confirmation', 'system'
  title: text("title").notNull(),
  message: text("message").notNull(),
  data: jsonb("data"), // Additional notification data
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Travel Itineraries Table
export const itineraries = pgTable("itineraries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  destinations: text("destinations").array().notNull(), // Array of destination names
  totalBudget: decimal("total_budget", { precision: 10, scale: 2 }),
  currency: text("currency").default("USD"),
  status: text("status").default("planning"), // 'planning', 'confirmed', 'active', 'completed'
  shareToken: text("share_token").unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Booking Modifications Table - Critical for operations
export const bookingModifications = pgTable("booking_modifications", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id).notNull(),
  modificationId: text("modification_id").notNull().unique(), // External API modification ID
  type: text("type").notNull(), // 'change', 'cancellation', 'refund', 'upgrade'
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'completed', 'rejected'
  requestedBy: integer("requested_by").references(() => users.id).notNull(),
  processedBy: text("processed_by"), // Admin/agent who processed
  originalDetails: text("original_details"), // JSON of original booking
  newDetails: text("new_details"), // JSON of requested changes
  feesAmount: decimal("fees_amount", { precision: 10, scale: 2 }).default("0.00"),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }).default("0.00"),
  reasonCode: text("reason_code"), // 'customer_request', 'airline_change', 'force_majeure'
  notes: text("notes"),
  expiresAt: timestamp("expires_at"), // Time limit for customer to accept changes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Financial Transactions Table - Critical for operations
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").references(() => bookings.id),
  transactionId: text("transaction_id").notNull().unique(), // External payment ID
  type: text("type").notNull(), // 'payment', 'refund', 'fee', 'commission'
  status: text("status").notNull(), // 'pending', 'completed', 'failed', 'cancelled'
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull(),
  paymentMethod: text("payment_method"), // 'card', 'bank', 'paypal'
  gatewayResponse: text("gateway_response"), // JSON response from payment processor
  reconciled: boolean("reconciled").default(false),
  reconciledAt: timestamp("reconciled_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Operational Reports Table - Critical for business intelligence
export const operationalReports = pgTable("operational_reports", {
  id: serial("id").primaryKey(),
  reportType: text("report_type").notNull(), // 'daily_revenue', 'booking_summary', 'customer_satisfaction'
  period: text("period").notNull(), // 'daily', 'weekly', 'monthly'
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  data: text("data"), // JSON containing report metrics
  generatedBy: text("generated_by"), // 'system', 'admin_user_id'
  status: text("status").default("completed"), // 'generating', 'completed', 'failed'
  createdAt: timestamp("created_at").defaultNow(),
});

// Compliance Audit Log Table - Critical for regulatory compliance
export const complianceAuditLog = pgTable("compliance_audit_log", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(), // 'data_access', 'data_export', 'data_deletion', 'privacy_request'
  userId: integer("user_id").references(() => users.id),
  adminId: text("admin_id"), // Admin who performed action
  resourceType: text("resource_type"), // 'user_data', 'booking', 'payment'
  resourceId: text("resource_id"), // ID of accessed resource
  action: text("action").notNull(), // 'view', 'edit', 'delete', 'export'
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  justification: text("justification"), // Required for sensitive operations
  dataCategories: text("data_categories").array(), // Types of data accessed
  createdAt: timestamp("created_at").defaultNow(),
});

// Customer Communication Log Table - Critical for support operations
export const communicationLog = pgTable("communication_log", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  bookingId: integer("booking_id").references(() => bookings.id),
  type: text("type").notNull(), // 'email', 'sms', 'push', 'in_app'
  channel: text("channel").notNull(), // 'booking_confirmation', 'flight_alert', 'support_response'
  subject: text("subject"),
  content: text("content").notNull(),
  status: text("status").notNull(), // 'sent', 'delivered', 'read', 'failed'
  externalId: text("external_id"), // ID from email/SMS provider
  metadata: text("metadata"), // JSON with provider-specific data
  createdAt: timestamp("created_at").defaultNow(),
  deliveredAt: timestamp("delivered_at"),
  readAt: timestamp("read_at"),
});

// Itinerary Items Table
export const itineraryItems = pgTable("itinerary_items", {
  id: serial("id").primaryKey(),
  itineraryId: integer("itinerary_id").references(() => itineraries.id).notNull(),
  type: text("type").notNull(), // 'flight', 'hotel', 'activity', 'transport', 'note'
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  location: text("location"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  bookingReference: text("booking_reference"),
  notes: text("notes"),
  attachments: text("attachments").array(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications Table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // 'booking', 'payment', 'reminder', 'promotion'
  title: text("title").notNull(),
  message: text("message").notNull(),
  actionUrl: text("action_url"),
  isRead: boolean("is_read").default(false),
  priority: text("priority").default("normal"), // 'low', 'normal', 'high'
  metadata: text("metadata"), // JSON string for additional data
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Type definitions for notifications
export type FlightAlert = typeof flightAlerts.$inferSelect;
export type InsertFlightAlert = typeof flightAlerts.$inferInsert;
export type PriceAlert = typeof priceAlerts.$inferSelect;
export type InsertPriceAlert = typeof priceAlerts.$inferInsert;
export type BookingConfirmation = typeof bookingConfirmations.$inferSelect;
export type InsertBookingConfirmation = typeof bookingConfirmations.$inferInsert;
export type PriceWatchRequest = typeof priceWatchRequests.$inferSelect;
export type InsertPriceWatchRequest = typeof priceWatchRequests.$inferInsert;
export type InAppNotification = typeof inAppNotifications.$inferSelect;
export type InsertInAppNotification = typeof inAppNotifications.$inferInsert;

export const insertDestinationSchema = createInsertSchema(destinations).omit({
  id: true,
});

export const insertHotelSchema = createInsertSchema(hotels).omit({
  id: true,
});

export const insertFlightSchema = createInsertSchema(flights).omit({
  id: true,
});

export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  dateOfBirth: true,
  passportNumber: true,
  preferredCurrency: true,
  preferredLanguage: true,
  timezone: true,
  seatPreference: true,
  mealPreference: true,
  emergencyContactName: true,
  emergencyContactPhone: true,
  nationality: true,
  dietaryRequirements: true,
  accessibilityRequirements: true,
  frequentFlyerNumbers: true,
});

// New table insert schemas
export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).omit({
  id: true,
  createdAt: true,
});

export const insertSupportTicketSchema = createInsertSchema(supportTickets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSupportMessageSchema = createInsertSchema(supportMessages).omit({
  id: true,
  createdAt: true,
});

// Support ticket type exports
export type SupportTicket = typeof supportTickets.$inferSelect;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type SupportMessage = typeof supportMessages.$inferSelect;
export type InsertSupportMessage = z.infer<typeof insertSupportMessageSchema>;


export const insertTripShareSchema = createInsertSchema(tripShares).omit({
  id: true,
  shareToken: true,
  viewCount: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  isVerified: true,
  helpfulVotes: true,
  createdAt: true,
});

export const insertItinerarySchema = createInsertSchema(itineraries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertItineraryItemSchema = createInsertSchema(itineraryItems).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

// Type exports
export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinations.$inferSelect;

export type InsertHotel = z.infer<typeof insertHotelSchema>;
export type Hotel = typeof hotels.$inferSelect;

export type InsertFlight = z.infer<typeof insertFlightSchema>;
export type Flight = typeof flights.$inferSelect;

export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packages.$inferSelect;

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type PaymentMethod = typeof paymentMethods.$inferSelect;



export type InsertTripShare = z.infer<typeof insertTripShareSchema>;
export type TripShare = typeof tripShares.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertItinerary = z.infer<typeof insertItinerarySchema>;
export type Itinerary = typeof itineraries.$inferSelect;

export type InsertItineraryItem = z.infer<typeof insertItineraryItemSchema>;
export type ItineraryItem = typeof itineraryItems.$inferSelect;

export type InsertSystemNotification = z.infer<typeof insertNotificationSchema>;
export type SystemNotification = typeof notifications.$inferSelect;

export const insertWebhookSchema = createInsertSchema(webhooks).omit({
  id: true,
  secret: true,
  successCount: true,
  failureCount: true,
  lastPing: true,
  createdAt: true,
});

export type InsertWebhook = z.infer<typeof insertWebhookSchema>;
export type Webhook = typeof webhooks.$inferSelect;

// Email and Phone Verification Schemas
export const emailVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const phoneVerificationSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export const verifyEmailTokenSchema = z.object({
  token: z.string().min(32, "Invalid verification token"),
});

export const verifyPhoneCodeSchema = z.object({
  phone: z.string().min(10, "Phone number required"),
  code: z.string().length(6, "Verification code must be 6 digits"),
});

export const resendVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type EmailVerification = z.infer<typeof emailVerificationSchema>;
export type PhoneVerification = z.infer<typeof phoneVerificationSchema>;
export type VerifyEmailToken = z.infer<typeof verifyEmailTokenSchema>;
export type VerifyPhoneCode = z.infer<typeof verifyPhoneCodeSchema>;
export type ResendVerification = z.infer<typeof resendVerificationSchema>;

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
}));
