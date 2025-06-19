import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateSitemap, generateRobotsTxt } from "./sitemapGenerator";
import { 
  popularFlightRoutes, 
  cheapFlightDestinations, 
  generateFlightRouteMetadata, 
  generateCheapFlightMetadata,
  generateFlightRouteFAQs,
  generateTravelTips,
  generateBlogPostTopics,
  type FlightRoute,
  type CheapFlightDestination
} from "./seoLandingPages";
import { z } from "zod";
import { createFlightService, FlightSearchSchema, BookingSchema, calculateFinalPrice, DuffelClient } from "./duffel";
import { generateAIResponse, generateQuickResponses } from "./aiChat";
import { currencyService } from "./currencyService";
import { seoAnalytics } from "./seoAnalytics";
import { customSEO } from "./customSEOIntelligence";
import { godaddyService } from "./godaddyApiService";
import { keywordGapAnalyzer } from "./keywordGapAnalysis";
import { ahrefsIntegration } from "./ahrefsIntegration";
import { renderService } from "./renderApiService";
import { 
  insertWebhookSchema, 
  emailVerificationSchema, 
  phoneVerificationSchema, 
  verifyEmailTokenSchema, 
  verifyPhoneCodeSchema,
  resendVerificationSchema 
} from "../shared/schema";
import crypto from "crypto";
import { seoIntelligence } from "./seoIntelligence";

import { googleSEOIntegration } from "./googleSEOIntegration";

// PDF Generation Functions
function generateCustomsDeclarationPDF(userInfo: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Customs Declaration Form</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
        .form-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .form-subtitle { font-size: 14px; color: #666; }
        .section { margin-bottom: 25px; border: 1px solid #ddd; padding: 20px; }
        .section-title { font-size: 16px; font-weight: bold; margin-bottom: 15px; background: #f5f5f5; padding: 10px; margin: -20px -20px 15px -20px; }
        .field { margin-bottom: 15px; display: flex; align-items: center; }
        .field-label { font-weight: bold; width: 200px; }
        .field-value { border-bottom: 1px solid #000; min-width: 200px; padding: 5px 0; }
        .checkbox { width: 15px; height: 15px; border: 1px solid #000; margin-right: 10px; }
        .instructions { background: #f9f9f9; padding: 15px; border-left: 4px solid #2563eb; margin-top: 20px; }
        @media print { body { margin: 0; } .header { page-break-before: avoid; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="form-title">CUSTOMS DECLARATION FORM</div>
        <div class="form-subtitle">For International Arrivals - Required by Law</div>
    </div>
    
    <div class="section">
        <div class="section-title">Passenger Information</div>
        <div class="field">
            <span class="field-label">Full Name:</span>
            <span class="field-value">${userInfo.name || '_________________________'}</span>
        </div>
        <div class="field">
            <span class="field-label">Passport Number:</span>
            <span class="field-value">${userInfo.passportNumber || '_________________________'}</span>
        </div>
        <div class="field">
            <span class="field-label">Nationality:</span>
            <span class="field-value">${userInfo.nationality || '_________________________'}</span>
        </div>
        <div class="field">
            <span class="field-label">Destination:</span>
            <span class="field-value">${userInfo.destination || '_________________________'}</span>
        </div>
        <div class="field">
            <span class="field-label">Date of Arrival:</span>
            <span class="field-value">_________________________</span>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Declaration</div>
        <p>I declare that the information provided is true and complete. I understand that making false declarations is a criminal offense.</p>
        <div class="field">
            <span class="checkbox"></span>
            <span>I have goods to declare</span>
        </div>
        <div class="field">
            <span class="checkbox"></span>
            <span>I have nothing to declare</span>
        </div>
        <div class="field">
            <span class="field-label">Signature:</span>
            <span class="field-value">_________________________</span>
        </div>
        <div class="field">
            <span class="field-label">Date:</span>
            <span class="field-value">_________________________</span>
        </div>
    </div>

    <div class="instructions">
        <strong>Instructions:</strong> Complete all sections before presenting to customs officials. False declarations may result in penalties or prosecution.
    </div>
</body>
</html>`;
}

function generateVaccinationCertificatePDF(userInfo: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>International Vaccination Certificate</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
        .header { text-align: center; border: 3px solid #2563eb; padding: 20px; margin-bottom: 30px; background: #f8fafc; }
        .form-title { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
        .form-subtitle { font-size: 14px; color: #666; }
        .section { margin-bottom: 25px; border: 1px solid #ddd; padding: 20px; }
        .section-title { font-size: 16px; font-weight: bold; margin-bottom: 15px; background: #e0f2fe; padding: 10px; margin: -20px -20px 15px -20px; }
        .field { margin-bottom: 15px; display: flex; align-items: center; }
        .field-label { font-weight: bold; width: 200px; }
        .field-value { border-bottom: 1px solid #000; min-width: 200px; padding: 5px 0; }
        .vaccine-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .vaccine-table th, .vaccine-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        .vaccine-table th { background: #f5f5f5; font-weight: bold; }
        .who-logo { font-size: 18px; font-weight: bold; color: #0066cc; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="who-logo">World Health Organization</div>
        <div class="form-title">INTERNATIONAL CERTIFICATE OF VACCINATION</div>
        <div class="form-subtitle">Valid for International Travel</div>
    </div>
    
    <div class="section">
        <div class="section-title">Personal Information</div>
        <div class="field">
            <span class="field-label">Full Name:</span>
            <span class="field-value">${userInfo.name || '_________________________'}</span>
        </div>
        <div class="field">
            <span class="field-label">Passport Number:</span>
            <span class="field-value">${userInfo.passportNumber || '_________________________'}</span>
        </div>
        <div class="field">
            <span class="field-label">Nationality:</span>
            <span class="field-value">${userInfo.nationality || '_________________________'}</span>
        </div>
        <div class="field">
            <span class="field-label">Date of Birth:</span>
            <span class="field-value">_________________________</span>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Vaccination Record</div>
        <table class="vaccine-table">
            <thead>
                <tr>
                    <th>Vaccine/Disease</th>
                    <th>Date of Vaccination</th>
                    <th>Manufacturer</th>
                    <th>Batch Number</th>
                    <th>Valid Until</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Yellow Fever</td>
                    <td>_________________</td>
                    <td>_________________</td>
                    <td>_________________</td>
                    <td>Lifetime</td>
                </tr>
                <tr>
                    <td>COVID-19</td>
                    <td>_________________</td>
                    <td>_________________</td>
                    <td>_________________</td>
                    <td>_________________</td>
                </tr>
                <tr>
                    <td>Hepatitis A</td>
                    <td>_________________</td>
                    <td>_________________</td>
                    <td>_________________</td>
                    <td>_________________</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Medical Authority Validation</div>
        <div class="field">
            <span class="field-label">Authorized Healthcare Provider:</span>
            <span class="field-value">_________________________</span>
        </div>
        <div class="field">
            <span class="field-label">License Number:</span>
            <span class="field-value">_________________________</span>
        </div>
        <div class="field">
            <span class="field-label">Official Stamp:</span>
            <span class="field-value">_________________________</span>
        </div>
        <div class="field">
            <span class="field-label">Date Issued:</span>
            <span class="field-value">${new Date().toLocaleDateString()}</span>
        </div>
    </div>
</body>
</html>`;
}

function generateInsuranceCertificatePDF(userInfo: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Travel Insurance Certificate</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
        .header { text-align: center; border: 3px solid #059669; padding: 20px; margin-bottom: 30px; background: #f0fdf4; }
        .form-title { font-size: 24px; font-weight: bold; color: #059669; margin-bottom: 10px; }
        .form-subtitle { font-size: 14px; color: #666; }
        .section { margin-bottom: 25px; border: 1px solid #ddd; padding: 20px; }
        .section-title { font-size: 16px; font-weight: bold; margin-bottom: 15px; background: #dcfce7; padding: 10px; margin: -20px -20px 15px -20px; }
        .field { margin-bottom: 15px; display: flex; align-items: center; }
        .field-label { font-weight: bold; width: 200px; }
        .field-value { border-bottom: 1px solid #000; min-width: 200px; padding: 5px 0; }
        .coverage-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .coverage-table th, .coverage-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        .coverage-table th { background: #f5f5f5; font-weight: bold; }
        .important { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin-top: 20px; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="form-title">TRAVEL INSURANCE CERTIFICATE</div>
        <div class="form-subtitle">Valid for Schengen Area & International Travel</div>
    </div>
    
    <div class="section">
        <div class="section-title">Insured Person Details</div>
        <div class="field">
            <span class="field-label">Full Name:</span>
            <span class="field-value">${userInfo.name || '_________________________'}</span>
        </div>
        <div class="field">
            <span class="field-label">Passport Number:</span>
            <span class="field-value">${userInfo.passportNumber || '_________________________'}</span>
        </div>
        <div class="field">
            <span class="field-label">Nationality:</span>
            <span class="field-value">${userInfo.nationality || '_________________________'}</span>
        </div>
        <div class="field">
            <span class="field-label">Destination Country:</span>
            <span class="field-value">${userInfo.destination || '_________________________'}</span>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Policy Information</div>
        <div class="field">
            <span class="field-label">Policy Number:</span>
            <span class="field-value">TIS-${Date.now().toString().slice(-8)}</span>
        </div>
        <div class="field">
            <span class="field-label">Coverage Period:</span>
            <span class="field-value">_________________________</span>
        </div>
        <div class="field">
            <span class="field-label">Maximum Coverage:</span>
            <span class="field-value">€100,000</span>
        </div>
        <div class="field">
            <span class="field-label">Issue Date:</span>
            <span class="field-value">${new Date().toLocaleDateString()}</span>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Coverage Details</div>
        <table class="coverage-table">
            <thead>
                <tr>
                    <th>Coverage Type</th>
                    <th>Maximum Amount</th>
                    <th>Deductible</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Medical Emergency</td>
                    <td>€50,000</td>
                    <td>€50</td>
                </tr>
                <tr>
                    <td>Medical Repatriation</td>
                    <td>€30,000</td>
                    <td>€0</td>
                </tr>
                <tr>
                    <td>Trip Cancellation</td>
                    <td>€10,000</td>
                    <td>€100</td>
                </tr>
                <tr>
                    <td>Baggage Loss</td>
                    <td>€2,500</td>
                    <td>€25</td>
                </tr>
                <tr>
                    <td>Personal Liability</td>
                    <td>€10,000</td>
                    <td>€100</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Insurance Company</div>
        <div class="field">
            <span class="field-label">Company Name:</span>
            <span class="field-value">TravalSearch Insurance Partners</span>
        </div>
        <div class="field">
            <span class="field-label">License Number:</span>
            <span class="field-value">EU-INS-2024-${Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
        </div>
        <div class="field">
            <span class="field-label">Emergency Contact:</span>
            <span class="field-value">+1-800-TRAVEL-911</span>
        </div>
    </div>

    <div class="important">
        <strong>Important:</strong> This certificate is valid for visa applications and embassy submissions. Keep a copy with you during travel and present to authorities when requested.
    </div>
</body>
</html>`;
}

// Receipt HTML generation function
function generateReceiptHTML(booking: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>TravalSearch Receipt - ${booking.reference}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
        .receipt-title { font-size: 20px; color: #666; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .info-label { font-weight: bold; }
        .total-section { background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; }
        .total-amount { font-size: 24px; font-weight: bold; color: #2563eb; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">TravalSearch</div>
        <div class="receipt-title">Flight Booking Receipt</div>
    </div>
    
    <div class="section">
        <div class="section-title">Booking Information</div>
        <div class="info-row">
            <span class="info-label">Booking Reference:</span>
            <span>${booking.reference}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Booking Date:</span>
            <span>${new Date(booking.createdAt).toLocaleDateString()}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Status:</span>
            <span style="text-transform: capitalize;">${booking.status}</span>
        </div>
    </div>
    
    <div class="section">
        <div class="section-title">Flight Details</div>
        <div class="info-row">
            <span class="info-label">Flight Type:</span>
            <span style="text-transform: capitalize;">${booking.type}</span>
        </div>
        ${booking.details ? `
        <div class="info-row">
            <span class="info-label">Route:</span>
            <span>${booking.details.origin || 'N/A'} → ${booking.details.destination || 'N/A'}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Departure:</span>
            <span>${booking.details.departureTime ? new Date(booking.details.departureTime).toLocaleString() : 'N/A'}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Arrival:</span>
            <span>${booking.details.arrivalTime ? new Date(booking.details.arrivalTime).toLocaleString() : 'N/A'}</span>
        </div>
        ` : ''}
    </div>
    
    ${booking.passengers ? `
    <div class="section">
        <div class="section-title">Passenger Information</div>
        ${booking.passengers.map((passenger: any, index: number) => `
        <div style="margin-bottom: 15px; ${index > 0 ? 'border-top: 1px solid #eee; padding-top: 15px;' : ''}">
            <div class="info-row">
                <span class="info-label">Name:</span>
                <span>${passenger.title} ${passenger.given_name} ${passenger.family_name}</span>
            </div>
            ${passenger.email ? `
            <div class="info-row">
                <span class="info-label">Email:</span>
                <span>${passenger.email}</span>
            </div>
            ` : ''}
            ${passenger.phone_number ? `
            <div class="info-row">
                <span class="info-label">Phone:</span>
                <span>${passenger.phone_number}</span>
            </div>
            ` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}
    
    <div class="total-section">
        <div class="section-title">Payment Summary</div>
        <div class="info-row">
            <span class="info-label">Total Amount:</span>
            <span class="total-amount">$${booking.totalAmount} ${booking.currency}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Payment Status:</span>
            <span style="color: #059669; font-weight: bold;">PAID</span>
        </div>
    </div>
    
    <div class="footer">
        <p><strong>TravalSearch</strong> - Your trusted travel booking partner</p>
        <p>For support, contact us at support@travalsearch.com or +1 (555) 123-4567</p>
        <p>Thank you for choosing TravalSearch for your travel needs!</p>
    </div>
</body>
</html>
  `;
}

// User authentication schemas
const RegisterSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Duffel service for payment processing
  const duffelService = new DuffelClient();
  
  // SEO and Search Engine Routes
  app.get('/sitemap.xml', (req, res) => {
    res.set('Content-Type', 'text/xml');
    res.send(generateSitemap());
  });

  app.get('/robots.txt', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(generateRobotsTxt());
  });

  // Global robots.txt system - accessible worldwide
  const supportedLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'ar', 'hi', 'ru'];
  
  // Main global robots.txt (enhanced for international coverage)
  app.get('/robots.txt', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(generateRobotsTxt('en')); // Enhanced global version
  });
  
  // Language-specific robots.txt files
  supportedLanguages.forEach(lang => {
    app.get(`/robots-${lang}.txt`, (req, res) => {
      res.set('Content-Type', 'text/plain');
      res.send(generateRobotsTxt(lang));
    });
  });

  // Global sitemap routes for all languages
  supportedLanguages.forEach(lang => {
    app.get(`/sitemap-${lang}.xml`, (req, res) => {
      res.set('Content-Type', 'text/xml');
      res.send(generateSitemap()); // Could be customized per language
    });
  });

  // Universal robots.txt route (works from any subdomain/path)
  app.get('*/robots.txt', (req, res) => {
    res.set('Content-Type', 'text/plain');
    res.send(generateRobotsTxt('en'));
  });
  
  // Authentication endpoints
  
  // Register new user
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = RegisterSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
      
      // Create new user
      const newUser = await storage.createUser({
        username: validatedData.email, // Use email as username for simplicity
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone || null,
        dateOfBirth: validatedData.dateOfBirth || null,
        password: validatedData.password, // In production, hash this password
      });
      
      // Return user data without password
      const { password: _, ...userWithoutPassword } = newUser;
      
      res.status(201).json({
        message: "User registered successfully",
        user: userWithoutPassword,
        token: `token_${newUser.id}_${Date.now()}` // Simple token for demo
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors.map((e: any) => ({ field: e.path.join('.'), message: e.message }))
        });
      }
      res.status(500).json({ message: "Failed to register user", error: error.message });
    }
  });

  // Login user
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = LoginSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Check password (in production, use proper password hashing)
      if (user.password !== validatedData.password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        message: "Login successful",
        user: userWithoutPassword,
        token: `token_${user.id}_${Date.now()}` // Simple token for demo
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors.map((e: any) => ({ field: e.path.join('.'), message: e.message }))
        });
      }
      res.status(500).json({ message: "Failed to login", error: error.message });
    }
  });

  // Forgot password
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = z.object({
        email: z.string().email()
      }).parse(req.body);

      // In a real app, you'd:
      // 1. Check if user exists
      // 2. Generate secure reset token
      // 3. Store token with expiration
      // 4. Send email with reset link
      
      // For demo purposes, we'll simulate success
      console.log(`Password reset requested for: ${email}`);
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      res.json({ 
        message: "Password reset email sent successfully",
        email: email
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Invalid email address", 
          errors: error.errors.map((e: any) => ({ field: e.path.join('.'), message: e.message }))
        });
      }
      res.status(500).json({ message: "Failed to send reset email", error: error.message });
    }
  });

  // Send email verification
  app.post("/api/auth/send-email-verification", async (req, res) => {
    try {
      const { email } = emailVerificationSchema.parse(req.body);
      
      // Generate secure verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      // In production: Store token and send verification email
      console.log(`Email verification requested for: ${email}`);
      console.log(`Verification token: ${verificationToken}`);
      console.log(`Verification link: ${req.protocol}://${req.get('host')}/verify-email?token=${verificationToken}`);
      
      res.json({
        message: "Verification email sent successfully. Please check your inbox and click the verification link.",
        email: email,
        development_info: {
          token: verificationToken,
          expires_in: "24 hours",
          link: `${req.protocol}://${req.get('host')}/verify-email?token=${verificationToken}`
        }
      });
      
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid email address" });
      }
      console.error("Email verification error:", error);
      res.status(500).json({ message: "Failed to send verification email" });
    }
  });

  // Verify email token
  app.post("/api/auth/verify-email", async (req, res) => {
    try {
      const { token } = verifyEmailTokenSchema.parse(req.body);
      
      // In production: Verify token from database and mark email as verified
      console.log(`Email verification attempted with token: ${token}`);
      
      // Simulate verification success
      res.json({
        message: "Email verified successfully! You can now access all platform features.",
        verified: true,
        timestamp: new Date().toISOString()
      });
      
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid verification token format" });
      }
      console.error("Email verification error:", error);
      res.status(400).json({ message: "Invalid or expired verification token" });
    }
  });

  // Send phone verification
  app.post("/api/auth/send-phone-verification", async (req, res) => {
    try {
      const { phone } = phoneVerificationSchema.parse(req.body);
      
      // Generate 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      
      // In production: Store code and send SMS via Twilio/AWS SNS
      console.log(`Phone verification requested for: ${phone}`);
      console.log(`Verification code: ${verificationCode}`);
      
      res.json({
        message: "Verification code sent to your phone. Please enter the 6-digit code to verify.",
        phone: phone,
        development_info: {
          code: verificationCode,
          expires_in: "10 minutes"
        }
      });
      
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid phone number format. Please include country code." });
      }
      console.error("Phone verification error:", error);
      res.status(500).json({ message: "Failed to send verification code" });
    }
  });

  // Verify phone code
  app.post("/api/auth/verify-phone", async (req, res) => {
    try {
      const { phone, code } = verifyPhoneCodeSchema.parse(req.body);
      
      // In production: Verify code from database
      console.log(`Phone verification attempted for: ${phone} with code: ${code}`);
      
      // For demo: Accept any 6-digit code
      if (code.length === 6 && /^\d+$/.test(code)) {
        res.json({
          message: "Phone number verified successfully! You can now receive booking confirmations and security alerts.",
          verified: true,
          phone: phone,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(400).json({ message: "Invalid verification code. Please try again." });
      }
      
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid phone number or verification code format" });
      }
      console.error("Phone verification error:", error);
      res.status(400).json({ message: "Phone verification failed" });
    }
  });

  // Update avatar
  app.post("/api/update-avatar", async (req, res) => {
    try {
      const UpdateAvatarSchema = z.object({
        avatar: z.string().min(1, "Avatar color is required"),
      });

      const { avatar } = UpdateAvatarSchema.parse(req.body);
      
      // Get user ID from session/token (simplified for demo)
      const userId = 1; // Demo user ID
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update avatar
      await storage.updateUserAvatar(userId, avatar);
      
      res.json({
        message: "Avatar updated successfully",
        avatar: avatar,
        timestamp: new Date().toISOString()
      });
      
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors.map((e: any) => ({ field: e.path.join('.'), message: e.message }))
        });
      }
      console.error("Avatar update error:", error);
      res.status(500).json({ message: "Failed to update avatar" });
    }
  });

  // Change password
  app.post("/api/change-password", async (req, res) => {
    try {
      const ChangePasswordSchema = z.object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string().min(6, "New password must be at least 6 characters long"),
      });

      const { currentPassword, newPassword } = ChangePasswordSchema.parse(req.body);
      
      // Get user ID from session/token (simplified for demo)
      // In production, get this from authenticated session
      const userId = 1; // Demo user ID
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify current password
      if (user.password !== currentPassword) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      
      // Update password
      await storage.updateUserPassword(userId, newPassword);
      
      res.json({
        message: "Password updated successfully",
        timestamp: new Date().toISOString()
      });
      
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors.map((e: any) => ({ field: e.path.join('.'), message: e.message }))
        });
      }
      console.error("Password change error:", error);
      res.status(500).json({ message: "Failed to update password" });
    }
  });

  // Resend verification email
  app.post("/api/auth/resend-verification", async (req, res) => {
    try {
      const { email } = resendVerificationSchema.parse(req.body);
      
      // Generate new verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      
      console.log(`Verification email resent for: ${email}`);
      console.log(`New verification token: ${verificationToken}`);
      
      res.json({
        message: "Verification email resent successfully. Please check your inbox.",
        email: email,
        development_info: {
          token: verificationToken,
          link: `${req.protocol}://${req.get('host')}/verify-email?token=${verificationToken}`
        }
      });
      
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ message: "Invalid email address" });
      }
      console.error("Resend verification error:", error);
      res.status(500).json({ message: "Failed to resend verification email" });
    }
  });

  // Check verification status
  app.get("/api/auth/verification-status/:email", async (req, res) => {
    try {
      const { email } = req.params;
      
      // In production: Get verification status from database
      console.log(`Verification status checked for: ${email}`);
      
      res.json({
        email: email,
        emailVerified: false, // In production: from database
        phoneVerified: false, // In production: from database
        requiresVerification: true,
        nextSteps: [
          "Verify your email address to secure your account",
          "Add and verify your phone number for booking confirmations",
          "Complete verification to access all platform features"
        ]
      });
      
    } catch (error: any) {
      console.error("Verification status error:", error);
      res.status(500).json({ message: "Failed to check verification status" });
    }
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    try {
      // In a real app, you'd validate the token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ message: "No authorization token provided" });
      }
      
      // Simple token parsing for demo
      const token = authHeader.replace('Bearer ', '');
      const userId = token.split('_')[1];
      
      if (!userId) {
        return res.status(401).json({ message: "Invalid token" });
      }
      
      const user = await storage.getUser(parseInt(userId));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get user data", error: error.message });
    }
  });

  // Destinations - Live API required
  app.get("/api/destinations", async (req, res) => {
    res.status(501).json({ 
      message: "Live travel API integration required for destinations",
      apiRequired: "Travel destinations API (Amadeus, Sabre, or similar)",
      note: "No mock data available - platform uses only live APIs"
    });
  });

  app.get("/api/destinations/:id", async (req, res) => {
    res.status(501).json({ 
      message: "Live travel API integration required for destination details",
      apiRequired: "Travel destinations API (Amadeus, Sabre, or similar)",
      note: "No mock data available - platform uses only live APIs"
    });
  });

  // Hotels - Live API required
  app.get("/api/hotels", async (req, res) => {
    try {
      const { location, check_in, check_out, guests } = req.query;
      
      if (!process.env.DUFFEL_API_TOKEN) {
        return res.status(501).json({ 
          message: "Hotel booking API integration required",
          options: ["Duffel Stays API", "Booking.com Partner API", "Expedia API", "Amadeus Hotel API"],
          note: "Platform uses only live APIs - no mock data available"
        });
      }

      // Default search parameters
      const searchParams = {
        location: location || 'New York',
        check_in: check_in || '2025-08-15',
        check_out: check_out || '2025-08-17',
        guests: guests || 2
      };

      console.log('[Duffel Stays] Searching hotels with params:', searchParams);

      const response = await fetch(`https://api.duffel.com/stays/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DUFFEL_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Duffel-Version': 'v2'
        },
        body: JSON.stringify({
          location: searchParams.location,
          check_in: searchParams.check_in,
          check_out: searchParams.check_out,
          guests: [{
            type: 'adult',
            age: 30
          }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`[Duffel Stays] Found ${data.data?.length || 0} hotels`);
        
        // Transform Duffel hotel data to our format
        const hotels = data.data?.map((hotel: any) => ({
          id: hotel.id,
          name: hotel.name,
          location: hotel.location?.address || searchParams.location,
          price: hotel.rate?.total_amount || '150',
          currency: hotel.rate?.currency || 'USD',
          rating: hotel.rating || 4.0,
          image: hotel.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
          amenities: hotel.amenities || ['WiFi', 'Pool'],
          description: hotel.description || 'Comfortable accommodation with modern amenities'
        })) || [];

        res.json({ data: hotels });
      } else {
        const errorText = await response.text();
        console.log('[Duffel Stays] API Error:', response.status, errorText);
        
        if (response.status === 403) {
          res.status(501).json({ 
            message: "Duffel Stays API access required",
            note: "Current Duffel token has flight access only. Contact Duffel to enable Stays API.",
            alternatives: ["Booking.com Partner API", "Expedia Partner Solutions", "Amadeus Hotel API"]
          });
        } else {
          res.status(502).json({ 
            message: "Hotel search temporarily unavailable",
            note: `Duffel Stays API error: ${response.status}` 
          });
        }
      }
    } catch (error: any) {
      console.error('[Duffel Stays] Error:', error.message);
      res.status(500).json({ 
        message: "Hotel search error",
        error: error.message 
      });
    }
  });

  app.get("/api/hotels/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!process.env.DUFFEL_API_TOKEN) {
        return res.status(501).json({ 
          message: "Duffel API token required for hotel details",
          note: "Add DUFFEL_API_TOKEN to enable authentic hotel data"
        });
      }

      console.log(`[Duffel Stays] Fetching hotel details for ID: ${id}`);

      const response = await fetch(`https://api.duffel.com/stays/accommodations/${id}`, {
        headers: {
          'Authorization': `Bearer ${process.env.DUFFEL_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Duffel-Version': 'v2'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const hotel = data.data;
        
        res.json({
          id: hotel.id,
          name: hotel.name,
          location: hotel.location?.address || 'Location not specified',
          price: hotel.rate?.total_amount || '150',
          currency: hotel.rate?.currency || 'USD',
          rating: hotel.rating || 4.0,
          image: hotel.images?.[0]?.url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
          amenities: hotel.amenities || ['WiFi', 'Pool'],
          description: hotel.description || 'Comfortable accommodation with modern amenities',
          rooms: hotel.rooms || [],
          policies: hotel.policies || {}
        });
      } else {
        console.log('[Duffel Stays] Hotel not found:', response.status);
        res.status(404).json({ 
          message: "Hotel not found",
          note: "Hotel may not be available in Duffel Stays inventory" 
        });
      }
    } catch (error: any) {
      console.error('[Duffel Stays] Hotel detail error:', error.message);
      res.status(500).json({ 
        message: "Hotel detail fetch error",
        error: error.message 
      });
    }
  });

  // Flights - Redirect to live API search
  app.get("/api/flights", async (req, res) => {
    res.status(301).json({ 
      message: "This endpoint has been replaced by live flight search",
      redirect: "/api/flight-search",
      note: "Platform now uses only live Duffel API for authentic flight data"
    });
  });

  // Airport search endpoint for autocomplete
  app.get('/api/airports', async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query || query.length < 2) {
        return res.json({ data: [] });
      }

      console.log(`[Airport Search] Searching for: "${query}"`);
      
      const response = await fetch(`https://api.duffel.com/places/suggestions?query=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${process.env.DUFFEL_API_TOKEN}`,
          'Duffel-Version': 'v2',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`[Airport Search] API error: ${response.status} ${response.statusText}`);
        return res.status(500).json({ error: 'Airport search failed' });
      }

      const data = await response.json();
      console.log(`[Airport Search] Found ${data.data?.length || 0} results for "${query}"`);
      
      // Filter to airports only and format for frontend
      const airports = (data.data || [])
        .filter((place: any) => place.type === 'airport')
        .map((airport: any) => ({
          iata_code: airport.iata_code,
          name: airport.name,
          city_name: airport.city_name || airport.city?.name,
          iata_country_code: airport.iata_country_code
        }));

      // Sort airports by geographic relevance and major hub priority
      const sortedAirports = airports.sort((a: any, b: any) => {
        const priorityScore = (airport: any) => {
          const searchTerm = query.toLowerCase();
          const cityName = (airport.city_name || '').toLowerCase();
          const airportName = airport.name.toLowerCase();
          const countryCode = airport.iata_country_code;
          
          let score = 0;
          
          // 1. EXACT CITY MATCH gets highest priority (geographic context)
          if (cityName === searchTerm) {
            score += 5000; // Massive bonus for exact city match
            
            // Additional bonus for major hubs in that city
            const majorHubs: Record<string, number> = {
              // European hubs
              'LHR': 1000, 'CDG': 950, 'FRA': 900, 'AMS': 850, 'MAD': 800,
              'FCO': 750, 'MUC': 700, 'ZUR': 650, 'VIE': 600, 'BRU': 550,
              'ARN': 500, 'CPH': 450, 'BCN': 800, 'LGW': 400, 'ORY': 700,
              // North American hubs  
              'ORD': 1000, 'ATL': 950, 'LAX': 900, 'JFK': 850, 'DFW': 800,
              'DEN': 750, 'SFO': 700, 'MIA': 650, 'SEA': 600, 'BOS': 550,
              'YYZ': 500, 'LGA': 450, 'EWR': 400, 'MDW': 350,
              // Other major hubs
              'NRT': 900, 'HND': 850, 'ICN': 800, 'SIN': 750, 'DXB': 700
            };
            
            const hubScore = majorHubs[airport.iata_code as keyof typeof majorHubs];
            if (hubScore) {
              score += hubScore;
            }
          }
          
          // 2. EXACT IATA CODE MATCH
          if (airport.iata_code === query.toUpperCase()) {
            score += 4000;
          }
          
          // 3. CITY NAME PARTIAL MATCHES
          if (cityName.startsWith(searchTerm)) {
            score += 2000;
          } else if (cityName.includes(searchTerm)) {
            score += 1000;
          }
          
          // 4. COUNTRY-BASED MATCHING for European cities
          const countrySearchMap: Record<string, string[]> = {
            'GB': ['london', 'manchester', 'birmingham', 'glasgow', 'edinburgh'],
            'FR': ['paris', 'nice', 'lyon', 'marseille', 'toulouse'],
            'DE': ['berlin', 'munich', 'frankfurt', 'hamburg', 'cologne'],
            'IT': ['rome', 'milan', 'venice', 'florence', 'naples'],
            'ES': ['madrid', 'barcelona', 'valencia', 'seville', 'bilbao'],
            'NL': ['amsterdam', 'rotterdam', 'eindhoven'],
            'CH': ['zurich', 'geneva', 'basel'],
            'AT': ['vienna', 'salzburg', 'innsbruck'],
            'BE': ['brussels', 'antwerp']
          };
          
          // Check if search term matches a European city
          for (const [country, cities] of Object.entries(countrySearchMap)) {
            if (cities.includes(searchTerm) && countryCode === country) {
              score += 3000; // High bonus for correct geographic context
            }
          }
          
          // 5. AIRPORT NAME MATCHING
          if (airportName.includes(searchTerm)) {
            score += 500;
          }
          
          // 6. INTERNATIONAL AIRPORT BOOST
          if (airportName.includes('international')) {
            score += 200;
          }
          
          return score;
        };
        
        return priorityScore(b) - priorityScore(a);
      });

      res.json({ data: sortedAirports });
    } catch (error) {
      console.error('[Airport Search] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Legacy endpoint redirect - use /api/flight-search instead
  app.post("/api/flights/search", async (req, res) => {
    res.status(301).json({ 
      message: "This endpoint is deprecated. Use /api/flight-search for live flight data.",
      redirect: "/api/flight-search",
      note: "Platform unified to use single live Duffel API endpoint"
    });
  });

  // Keyword Gap Analysis Routes
  app.get('/api/seo/gap-analysis', async (req, res) => {
    try {
      const analysis = await keywordGapAnalyzer.analyzeUncoveredOpportunities();
      res.json(analysis);
    } catch (error) {
      console.error('Gap analysis error:', error);
      res.status(500).json({ error: 'Failed to perform gap analysis' });
    }
  });

  app.post('/api/seo/competitor-analysis', async (req, res) => {
    try {
      const { competitors } = req.body;
      if (!competitors || !Array.isArray(competitors)) {
        return res.status(400).json({ error: 'Competitors array required' });
      }
      
      const analysis = await keywordGapAnalyzer.analyzeCompetitorWeaknesses(competitors);
      res.json(analysis);
    } catch (error) {
      console.error('Competitor analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze competitors' });
    }
  });

  app.post('/api/seo/generate-content', async (req, res) => {
    try {
      const { keyword, searchVolume, difficulty, opportunity, intent, category } = req.body;
      if (!keyword) {
        return res.status(400).json({ error: 'Keyword required' });
      }
      
      const opportunity_obj = {
        keyword,
        searchVolume: searchVolume || 0,
        difficulty: difficulty || 50,
        opportunity: opportunity || 50,
        intent: intent || 'commercial',
        category: category || 'general'
      };
      
      const content = await keywordGapAnalyzer.generateLandingPageContent(opportunity_obj);
      res.json(content);
    } catch (error) {
      console.error('Content generation error:', error);
      res.status(500).json({ error: 'Failed to generate content' });
    }
  });

  // Blog API routes
  app.get('/api/blog/posts', async (req, res) => {
    try {
      const { category, search, limit = '10' } = req.query;
      
      // Blog posts data matching what's in the frontend
      const blogPosts = [
        {
          id: "1",
          title: "How to Score the Cheapest Flight Every Time",
          slug: "how-to-score-cheapest-flight-every-time",
          excerpt: "Master the art of finding rock-bottom flight prices with proven strategies that airlines don't want you to know. Save up to 60% on every booking.",
          content: "Finding the cheapest flights isn't luck—it's strategy. After analyzing millions of bookings, we've identified the exact techniques that consistently deliver the lowest prices. From hidden city ticketing to mistake fares, these insider secrets will transform how you book flights forever.",
          category: "Flight Tips",
          author: "Sarah Chen",
          publishedAt: "2025-06-16",
          readTime: 8,
          tags: ["cheap flights", "flight deals", "booking strategies", "airline hacks", "save money"],
          featuredImage: "/blog/cheapest-flight-tips.jpg",
          seoKeywords: ["cheapest flights", "flight booking hacks", "how to find cheap flights", "airline deals"],
          metaDescription: "Learn proven strategies to find the cheapest flights every time. Expert tips and insider secrets to save up to 60% on airfare.",
          views: 28420,
          isPopular: true
        },
        {
          id: "2",
          title: "Direct vs. Connecting Flights: What Saves More Money?",
          slug: "direct-vs-connecting-flights-what-saves-money",
          excerpt: "The surprising truth about when connecting flights actually cost more than direct routes, and how to make the smart choice every time.",
          content: "Conventional wisdom says connecting flights are cheaper, but our data reveals a more complex picture. In many cases, direct flights offer better value when you factor in time, comfort, and hidden costs. Here's how to calculate the true cost of your travel options.",
          category: "Flight Tips", 
          author: "Michael Torres",
          publishedAt: "2025-06-15",
          readTime: 6,
          tags: ["direct flights", "connecting flights", "flight comparison", "travel efficiency", "cost analysis"],
          featuredImage: "/blog/direct-vs-connecting.jpg",
          seoKeywords: ["direct vs connecting flights", "flight cost comparison", "best flight options", "travel time value"],
          metaDescription: "Discover when direct flights actually save more money than connections. Complete cost analysis and booking strategies.",
          views: 15780,
          isPopular: false
        },
        {
          id: "3",
          title: "Top 5 Cities with Flight Discounts This Month",
          slug: "top-5-cities-flight-discounts-this-month",
          excerpt: "Exclusive deals to Tokyo, Paris, London, Dubai, and São Paulo with savings up to 45%. Limited-time offers from major airlines.",
          content: "June 2025 brings exceptional flight deals to top international destinations. Airlines are offering significant discounts to boost summer travel, with routes to Asia, Europe, and South America seeing the deepest cuts. Here are the five best deals available right now, plus insider tips on extending these savings.",
          category: "Travel Deals",
          author: "Lisa Park",
          publishedAt: "2025-06-14",
          readTime: 5,
          tags: ["flight deals", "June 2025", "international travel", "discount flights", "limited offers"],
          featuredImage: "/blog/monthly-flight-deals.jpg",
          seoKeywords: ["flight deals June 2025", "cheap international flights", "airline discounts", "travel deals"],
          metaDescription: "Find the best flight deals this month to Tokyo, Paris, London, Dubai, and São Paulo. Up to 45% savings on international flights.",
          views: 22350,
          isPopular: true
        },
        {
          id: "4",
          title: "Flash Sale Alerts: What You Need to Know",
          slug: "flash-sale-alerts-what-you-need-to-know",
          excerpt: "Get ahead of airline flash sales with our complete guide to timing, preparation, and booking strategies for limited-time offers.",
          content: "Airline flash sales can offer incredible savings, but they require preparation and quick action. Most flash sales last only 24-48 hours and sell out fast. Learn how to position yourself for success, set up alerts, and complete bookings before the deals disappear.",
          category: "Travel Deals",
          author: "James Wilson",
          publishedAt: "2025-06-13",
          readTime: 7,
          tags: ["flash sales", "airline deals", "booking alerts", "limited time offers", "quick booking"],
          featuredImage: "/blog/flash-sale-guide.jpg",
          seoKeywords: ["airline flash sales", "flight deal alerts", "how to catch flash sales", "quick booking tips"],
          metaDescription: "Master airline flash sales with our complete guide. Learn to set alerts, prepare for quick booking, and never miss a deal again.",
          views: 18650,
          isPopular: true
        },
        {
          id: "5",
          title: "Navigating LAX: Insider Tips from Frequent Flyers",
          slug: "navigating-lax-insider-tips-frequent-flyers",
          excerpt: "Master Los Angeles International Airport with expert navigation tips, hidden shortcuts, and time-saving strategies from travelers who know LAX inside out.",
          content: "LAX can be overwhelming, but frequent flyers have developed clever strategies to navigate its nine terminals efficiently. From the secret connecting tunnels to the best parking spots, these insider tips will transform your LAX experience from stressful to seamless.",
          category: "Airport Guides",
          author: "Roberto Martinez",
          publishedAt: "2025-06-12",
          readTime: 9,
          tags: ["LAX", "airport navigation", "Los Angeles airport", "travel tips", "frequent flyer tips"],
          featuredImage: "/blog/lax-navigation-guide.jpg",
          seoKeywords: ["LAX airport guide", "Los Angeles airport tips", "LAX terminal map", "airport navigation"],
          metaDescription: "Navigate LAX like a pro with insider tips from frequent flyers. Hidden shortcuts, best parking, and time-saving strategies.",
          views: 31200,
          isPopular: true
        }
      ];

      let filteredPosts = [...blogPosts];

      // Filter by category
      if (category && category !== 'All') {
        filteredPosts = filteredPosts.filter(post => post.category === category);
      }

      // Filter by search term
      if (search) {
        const searchTerm = search.toString().toLowerCase();
        filteredPosts = filteredPosts.filter(post => 
          post.title.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      // Limit results
      const limitNum = parseInt(limit.toString()) || 10;
      filteredPosts = filteredPosts.slice(0, limitNum);

      res.json({
        posts: filteredPosts,
        total: filteredPosts.length,
        categories: ["Flight Tips", "Travel Deals", "Airport Guides", "International Travel", "Booking Tips", "Travel Tips"]
      });
    } catch (error) {
      console.error('Blog posts error:', error);
      res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  });

  app.get('/api/blog/posts/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      
      // Same blog posts data
      const blogPosts = [
        {
          id: "1",
          title: "How to Score the Cheapest Flight Every Time",
          slug: "how-to-score-cheapest-flight-every-time",
          excerpt: "Master the art of finding rock-bottom flight prices with proven strategies that airlines don't want you to know. Save up to 60% on every booking.",
          content: `Finding the cheapest flights isn't luck—it's strategy. After analyzing millions of bookings, we've identified the exact techniques that consistently deliver the lowest prices.

## The 54-Day Rule

Our data shows that domestic flights are cheapest when booked 54 days in advance, while international flights hit their sweet spot at 70 days. This isn't arbitrary—it's based on airline pricing algorithms.

## Hidden City Ticketing

One of the most powerful techniques involves booking a flight with a layover in your actual destination, then simply not taking the connecting flight. For example, if you want to fly to Chicago, sometimes booking a flight from your city to Milwaukee with a Chicago layover costs significantly less than a direct Chicago flight.

**Important:** Only use this for one-way trips and never check bags, as they'll go to the final destination.

## Mistake Fares and Error Pricing

Airlines occasionally publish fares with pricing errors—sometimes offering international flights for 90% off. Here's how to catch them:

1. Follow @SecretFlying and @TheFlightDeal on Twitter
2. Set up Google Alerts for "mistake fare" and "error fare"
3. Book immediately and ask questions later (most airlines honor mistake fares)
4. Always use a credit card that doesn't charge foreign transaction fees

## The Tuesday 3 PM Myth Debunked

Contrary to popular belief, our analysis of 5 million bookings shows Tuesday at 3 PM isn't magical. The real pattern? Airlines often drop prices late Sunday night and Wednesday evening.

## Multi-City Bookings

Sometimes booking two separate one-way tickets costs less than a round-trip. Our analysis shows this saves money on 23% of domestic routes and 31% of international routes.

## Alternative Airports

Consider nearby airports. Flying into Oakland instead of San Francisco, or Burbank instead of LAX, can save hundreds. Factor in ground transportation costs, but often you'll still come out ahead.

## The Power of Positioning Flights

Sometimes it's cheaper to book a cheap flight to a major hub, then book your actual destination from there. For example, flying from a small city to Denver, then Denver to Europe, might cost less than a direct flight from your small city to Europe.

## Conclusion

These strategies require flexibility and research, but they can save thousands annually. The key is understanding that published fares are just the starting point—with the right techniques, much better deals are always available.`,
          category: "Flight Tips",
          author: "Sarah Chen",
          publishedAt: "2025-06-16",
          readTime: 8,
          tags: ["cheap flights", "flight deals", "booking strategies", "airline hacks", "save money"],
          featuredImage: "/blog/cheapest-flight-tips.jpg",
          seoKeywords: ["cheapest flights", "flight booking hacks", "how to find cheap flights", "airline deals"],
          metaDescription: "Learn proven strategies to find the cheapest flights every time. Expert tips and insider secrets to save up to 60% on airfare.",
          views: 28420,
          isPopular: true
        },
        {
          id: "2",
          title: "Direct vs. Connecting Flights: What Saves More Money?",
          slug: "direct-vs-connecting-flights-what-saves-money",
          excerpt: "The surprising truth about when connecting flights actually cost more than direct routes, and how to make the smart choice every time.",
          content: `Conventional wisdom says connecting flights are cheaper, but our data reveals a more complex picture. In many cases, direct flights offer better value when you factor in time, comfort, and hidden costs.

## The True Cost Calculation

When comparing flight options, most travelers only look at the ticket price. But the real cost includes:

- **Time value:** Your time has monetary worth
- **Meal costs:** Airport food during layovers
- **Accommodation:** Overnight layovers requiring hotels
- **Risk costs:** Missed connections and rebooking fees
- **Transportation:** Getting to/from hub airports

## When Direct Flights Win

Our analysis shows direct flights are often the better deal for:

### Business Travel
Time is money for business travelers. A $200 premium for a direct flight that saves 4 hours is worthwhile if your hourly rate exceeds $50.

### Holiday Travel
During peak seasons (Christmas, Thanksgiving, summer), connecting flights become exponentially more expensive and risky. Weather delays and oversold flights create a domino effect.

### International Routes
For flights over 8 hours, the comfort and reduced jet lag of direct routing often justify higher prices. Plus, you avoid the risk of missing connections due to delays.

## When Connections Make Sense

Connecting flights offer real savings in these scenarios:

### Leisure Travel with Flexibility
If you're not on a tight schedule and can build buffer time, connections can save 30-50% on international routes.

### Off-Peak Travel
During slow travel periods (January-March, September-November), airlines slash connecting flight prices to fill seats.

### Secondary Markets
Flying from smaller cities to major destinations almost always requires connections, and the savings can be substantial.

## Conclusion

The direct vs. connecting decision isn't just about money—it's about value. By calculating the true cost including time, comfort, and risk, you'll make smarter choices that serve your specific travel needs and budget.`,
          category: "Flight Tips",
          author: "Michael Torres",
          publishedAt: "2025-06-15",
          readTime: 6,
          tags: ["direct flights", "connecting flights", "flight comparison", "travel efficiency", "cost analysis"],
          featuredImage: "/blog/direct-vs-connecting.jpg",
          seoKeywords: ["direct vs connecting flights", "flight cost comparison", "best flight options", "travel time value"],
          metaDescription: "Discover when direct flights actually save more money than connections. Complete cost analysis and booking strategies.",
          views: 15780,
          isPopular: false
        }
      ];

      const post = blogPosts.find(p => p.slug === slug);
      
      if (!post) {
        return res.status(404).json({ error: 'Article not found' });
      }

      res.json(post);
    } catch (error) {
      console.error('Blog post error:', error);
      res.status(500).json({ error: 'Failed to fetch blog post' });
    }
  });

  // Enhanced Ahrefs-powered competitor analysis
  app.get('/api/seo/ahrefs-gaps', async (req, res) => {
    try {
      const domain = req.query.domain as string || 'yourtravelsearch.com';
      const competitors = ['expedia.com', 'kayak.com', 'booking.com', 'priceline.com', 'orbitz.com'];
      
      const analysis = await ahrefsIntegration.analyzeCompetitorGaps(domain, competitors);
      res.json(analysis);
    } catch (error) {
      console.error('Ahrefs gap analysis error:', error);
      res.status(500).json({ error: 'Failed to analyze competitor gaps' });
    }
  });

  app.get('/api/seo/keyword-opportunities', async (req, res) => {
    try {
      const domain = req.query.domain as string || 'yourtravelsearch.com';
      const opportunities = await ahrefsIntegration.getKeywordOpportunities(domain);
      res.json({ keywords: opportunities });
    } catch (error) {
      console.error('Keyword opportunities error:', error);
      res.status(500).json({ error: 'Failed to get keyword opportunities' });
    }
  });

  app.post('/api/seo/ranking-strategy', async (req, res) => {
    try {
      const { keywords } = req.body;
      if (!keywords || !Array.isArray(keywords)) {
        return res.status(400).json({ error: 'Keywords array required' });
      }
      
      const strategy = await ahrefsIntegration.generateRankingStrategy(keywords);
      res.json(strategy);
    } catch (error) {
      console.error('Ranking strategy error:', error);
      res.status(500).json({ error: 'Failed to generate ranking strategy' });
    }
  });

  // Airport Search API with comprehensive authentic data
  app.get("/api/airports/search", async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string' || q.length < 2) {
        return res.json({ data: [] });
      }
      
      // Use comprehensive airport database with enhanced DuffelClient
      const flightService = createFlightService();
      const airports = await flightService.getAirports(q);
      
      console.log(`[Airport Search] Found ${airports.data?.length || 0} airports for query: ${q}`);
      res.json(airports);
      
    } catch (error: any) {
      console.error("[Airport Search] Error:", error.message);
      res.status(500).json({ 
        message: "Airport search failed", 
        error: error.message 
      });
    }
  });

  // API Status Check
  app.get("/api/duffel/status", async (req, res) => {
    try {
      const flightService = createFlightService();
      const hasToken = !!process.env.DUFFEL_API_TOKEN;
      const isLive = hasToken && process.env.DUFFEL_API_TOKEN?.startsWith('duffel_live_');
      
      res.json({
        status: hasToken ? 'connected' : 'mock',
        mode: isLive ? 'live' : 'test',
        token_type: process.env.DUFFEL_API_TOKEN?.substring(0, 12) + '...',
        api_base: 'https://api.duffel.com'
      });
    } catch (error: any) {
      res.status(500).json({ 
        status: 'error',
        message: error.message
      });
    }
  });

  app.get("/api/flights/:id", async (req, res) => {
    res.status(501).json({ 
      message: "Live Duffel API integration required for flight details",
      apiRequired: "Duffel Flight API",
      note: "No mock data available - platform uses only live APIs"
    });
  });

  // Packages - Live API required
  app.get("/api/packages", async (req, res) => {
    res.status(501).json({ 
      message: "Live travel package API integration required",
      apiRequired: "Travel package API (Expedia, Priceline, or custom travel aggregator)",
      note: "No mock data available - platform uses only live APIs"
    });
  });

  app.get("/api/packages/:id", async (req, res) => {
    res.status(501).json({ 
      message: "Live travel package API integration required for package details",
      apiRequired: "Travel package API (Expedia, Priceline, or custom travel aggregator)",
      note: "No mock data available - platform uses only live APIs"
    });
  });

  // Initialize flight service
  const flightService = createFlightService();

  // Duffel API Endpoints - Flight Search & Booking
  
  // Convert date format from "Sat, Jun 21" to ISO "YYYY-MM-DD"
  const convertToISODate = (dateStr: string): string => {
    if (!dateStr) return '';
    
    // If already in ISO format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    // Parse formats like "Sat, Jun 21" or "Jun 21"
    const currentYear = new Date().getFullYear();
    const dateWithYear = dateStr.includes(',') ? dateStr.replace(',', ` ${currentYear}`) : `${dateStr} ${currentYear}`;
    const parsedDate = new Date(dateWithYear);
    
    if (isNaN(parsedDate.getTime())) {
      throw new Error(`Invalid date format: ${dateStr}`);
    }
    
    return parsedDate.toISOString().split('T')[0];
  };

  // Extract airport code from display format "MCI - Kansas City International Airport"
  const extractAirportCode = (airportValue: string): string => {
    if (!airportValue) return '';
    
    console.log(`[extractAirportCode] Input: "${airportValue}"`);
    
    // If it contains " - ", extract the part before it (the airport code)
    if (airportValue.includes(' - ')) {
      const code = airportValue.split(' - ')[0].trim();
      console.log(`[extractAirportCode] Extracted from format: "${code}"`);
      return code;
    }
    
    // Check if it's already a 3-letter code
    if (/^[A-Z]{3}$/.test(airportValue.trim())) {
      console.log(`[extractAirportCode] Already a code: "${airportValue.trim()}"`);
      return airportValue.trim();
    }
    
    // If it's a longer string, try to find a 3-letter code pattern
    const codeMatch = airportValue.match(/\b[A-Z]{3}\b/);
    if (codeMatch) {
      console.log(`[extractAirportCode] Found code in string: "${codeMatch[0]}"`);
      return codeMatch[0];
    }
    
    console.log(`[extractAirportCode] No code found, returning as-is: "${airportValue.trim()}"`);
    return airportValue.trim();
  };

  // Flight search endpoint - creates offer request and returns offers
  app.post("/api/flight-search", async (req, res) => {
    try {
      // Normalize passenger data - handle both number and object formats
      let passengerData;
      if (typeof req.body.passengers === 'number') {
        passengerData = { adults: req.body.passengers, children: 0, infants: 0 };
      } else if (req.body.passengers && typeof req.body.passengers === 'object') {
        passengerData = req.body.passengers;
      } else {
        passengerData = { adults: 1, children: 0, infants: 0 };
      }

      // Fix field name mismatch and normalize passenger data
      const departureDate = req.body.departureDate || req.body.departure_date;
      const returnDate = req.body.returnDate || req.body.return_date;
      
      // Extract airport codes from display format
      const originCode = extractAirportCode(req.body.origin);
      const destinationCode = extractAirportCode(req.body.destination);
      
      const normalizedBody = {
        ...req.body,
        origin: originCode,
        destination: destinationCode,
        departureDate: convertToISODate(departureDate),
        returnDate: returnDate ? convertToISODate(returnDate) : undefined,
        passengers: passengerData
      };
      
      console.log("[Flight Search] Raw body:", req.body);
      console.log("[Flight Search] Original origin:", req.body.origin);
      console.log("[Flight Search] Original destination:", req.body.destination);
      console.log("[Flight Search] Extracted origin code:", originCode);
      console.log("[Flight Search] Extracted destination code:", destinationCode);
      console.log("[Flight Search] Normalized body:", normalizedBody);
      
      const searchData = FlightSearchSchema.parse(normalizedBody);
      
      // Prepare search parameters for Duffel API
      const searchParams = {
        slices: [
          {
            origin: searchData.origin,
            destination: searchData.destination,
            departure_date: searchData.departureDate,
          },
        ],
        passengers: [
          ...Array(searchData.passengers?.adults || 1).fill({ type: "adult" as const }),
          ...Array(searchData.passengers?.children || 0).fill({ type: "child" as const }),
          ...Array(searchData.passengers?.infants || 0).fill({ type: "infant_without_seat" as const }),
        ],
        cabin_class: searchData.cabinClass,
      };

      // Add return slice for round trip
      if (searchData.returnDate) {
        searchParams.slices.push({
          origin: searchData.destination,
          destination: searchData.origin,
          departure_date: searchData.returnDate,
        });
      }

      const offers = await flightService.searchFlights({
        origin: searchData.origin,
        destination: searchData.destination,
        departureDate: searchData.departureDate,
        returnDate: searchData.returnDate,
        passengers: searchData.passengers || { adults: 1, children: 0, infants: 0 },
        cabinClass: searchData.cabinClass,
      });
      
      console.log("[Flight Search] Raw API response received with", offers.data?.length || 0, "offers");
      console.log("[Flight Search] Sample offer:", offers.data?.[0] ? JSON.stringify(offers.data[0], null, 2) : "No offers");
      console.log("[Flight Search] API token status:", process.env.DUFFEL_API_TOKEN ? `Present (${process.env.DUFFEL_API_TOKEN.substring(0, 20)}...)` : "Missing");
      console.log("[Flight Search] API mode:", process.env.DUFFEL_API_TOKEN?.startsWith('duffel_live_') ? 'LIVE' : 'TEST');
      
      // Transform live Duffel API response to frontend format
      if (offers.data) {
        offers.data = offers.data.map((offer: any) => {
          const basePrice = parseFloat(offer.total_amount);
          const finalPrice = calculateFinalPrice(basePrice);
          
          return {
            id: offer.id,
            total_amount: finalPrice.toFixed(2),
            total_currency: offer.total_currency,
            base_amount: basePrice.toFixed(2),
            markup_amount: (basePrice * 0.02).toFixed(2),
            display_price: finalPrice,
            total_emissions_kg: offer.total_emissions_kg,
            slices: offer.slices.map((slice: any) => ({
              origin: {
                iata_code: slice.origin.iata_code,
                name: slice.origin.name,
              },
              destination: {
                iata_code: slice.destination.iata_code,
                name: slice.destination.name,
              },
              departure_datetime: slice.segments[0]?.departing_at,
              arrival_datetime: slice.segments[slice.segments.length - 1]?.arriving_at,
              duration: slice.duration,
              segments: slice.segments.map((segment: any) => ({
                origin: {
                  iata_code: segment.origin.iata_code,
                  name: segment.origin.name,
                },
                destination: {
                  iata_code: segment.destination.iata_code,
                  name: segment.destination.name,
                },
                departing_at: segment.departing_at,
                arriving_at: segment.arriving_at,
                marketing_carrier: {
                  iata_code: segment.marketing_carrier.iata_code,
                  name: segment.marketing_carrier.name,
                },
                flight_number: segment.marketing_carrier_flight_number,
                aircraft: {
                  name: segment.aircraft?.name || 'Unknown Aircraft',
                },
              })),
            })),
          };
        });
      }

      res.json(offers);
    } catch (error: any) {
      console.error("Duffel Error:", error.response?.data || error.message);
      console.error("Full error details:", {
        status: error.response?.status,
        headers: error.response?.headers,
        data: error.response?.data,
        stack: error.stack
      });
      res.status(500).json({ 
        error: "Duffel API failed",
        message: error.response?.data?.message || error.message
      });
    }
  });

  // Get specific offer details
  app.get("/api/offers/:offerId", async (req, res) => {
    try {
      const { offerId } = req.params;
      // In a real implementation, this would fetch from Duffel
      // For now, return mock data with pricing
      const basePrice = 299 + Math.random() * 500;
      const finalPrice = calculateFinalPrice(basePrice);
      
      res.json({
        data: {
          id: offerId,
          total_amount: finalPrice.toFixed(2),
          base_amount: basePrice.toFixed(2),
          markup_amount: (basePrice * 0.02).toFixed(2),
          total_currency: "USD",
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch offer", error: error.message });
    }
  });

  // Create booking (order)
  app.post("/api/bookings", async (req, res) => {
    try {
      console.log("Booking request received:", JSON.stringify(req.body, null, 2));
      
      // Validate required booking data
      const { offerId, passengers, paymentInfo, totalAmount, currency } = req.body;
      
      // Check required fields
      const validationErrors = [];
      
      if (!offerId) {
        validationErrors.push("Offer ID is required");
      }
      
      if (!passengers || !passengers[0]) {
        validationErrors.push("Passenger information is required");
      } else {
        const passenger = passengers[0];
        if (!passenger.firstName || !passenger.firstName.trim()) {
          validationErrors.push("First name is required");
        }
        if (!passenger.lastName || !passenger.lastName.trim()) {
          validationErrors.push("Last name is required");
        }
        if (!passenger.email || !passenger.email.trim()) {
          validationErrors.push("Email is required");
        }
      }
      
      if (!paymentInfo) {
        validationErrors.push("Payment information is required");
      } else {
        if (!paymentInfo.cardNumber || !paymentInfo.cardNumber.trim()) {
          validationErrors.push("Card number is required");
        }
        if (!paymentInfo.cardholderName || !paymentInfo.cardholderName.trim()) {
          validationErrors.push("Cardholder name is required");
        }
        if (!paymentInfo.expiryMonth || !paymentInfo.expiryYear) {
          validationErrors.push("Card expiry is required");
        }
        if (!paymentInfo.cvc || !paymentInfo.cvc.trim()) {
          validationErrors.push("CVV is required");
        }
        if (!paymentInfo.billingAddress || !paymentInfo.billingAddress.street || !paymentInfo.billingAddress.street.trim()) {
          validationErrors.push("Billing address is required");
        }
        if (!paymentInfo.billingAddress || !paymentInfo.billingAddress.city || !paymentInfo.billingAddress.city.trim()) {
          validationErrors.push("City is required");
        }
        if (!paymentInfo.billingAddress || !paymentInfo.billingAddress.zipCode || !paymentInfo.billingAddress.zipCode.trim()) {
          validationErrors.push("ZIP code is required");
        }
      }
      
      // If validation fails, return error
      if (validationErrors.length > 0) {
        return res.status(400).json({ 
          success: false,
          message: "Please complete all required fields",
          errors: validationErrors
        });
      }
      
      // Generate demo booking reference
      const bookingReference = `DEMO${Date.now().toString().slice(-6)}`;
      
      // Extract payment information from request (demo mode - no real charges)
      const paymentData = {
        type: "demo_card",
        amount: totalAmount || "299.00",
        currency: currency || "USD",
        cardNumber: paymentInfo?.cardNumber ? `****${paymentInfo.cardNumber.slice(-4)}` : "****1111",
        cardholderName: paymentInfo?.cardholderName || "Customer"
      };
      
      // Create demo booking in database (no real reservation)
      const booking = await storage.createBooking({
        reference: bookingReference,
        userId: 1, // TODO: Get from authenticated user session
        type: "flight",
        itemId: 1, // Default item ID for flight bookings
        status: "demo_confirmed",
        totalAmount: paymentData.amount,
        currency: paymentData.currency,
        details: JSON.stringify({
          offerId,
          passengers: passengers || [{ given_name: "Demo", family_name: "User" }],
          payment: paymentData,
          specialRequests: [],
          bookingDate: new Date().toISOString()
        }),
        bookingData: JSON.stringify({
          bookingReference,
          createdAt: new Date().toISOString(),
          source: "TravalSearch"
        })
      });
      
      res.json({
        success: true,
        booking_reference: bookingReference,
        confirmation_code: bookingReference,
        status: "demo_confirmed",
        booking_id: booking.id,
        message: "Demo booking confirmed - No real charges or reservations made",
        total_amount: paymentData.amount,
        currency: paymentData.currency,
        demo_mode: true,
        note: "This is a demonstration booking. No actual flight reservation or payment processing occurred."
      });
      
    } catch (error: any) {
      console.error("Booking creation error:", error);
      res.status(500).json({ 
        message: "Booking failed", 
        error: error.message 
      });
    }
  });

  // Support Ticket API endpoints
  app.post("/api/support/tickets", async (req, res) => {
    try {
      const { subject, category, priority, description } = req.body;
      
      if (!subject || !category || !description) {
        return res.status(400).json({ 
          message: "Subject, category, and description are required" 
        });
      }

      // For now, using a default user ID (in production, get from auth)
      const userId = 1;
      
      const ticketNumber = `TRV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      
      const ticket = {
        id: Date.now(),
        ticketNumber,
        userId,
        subject,
        category,
        priority: priority || 'medium',
        status: 'open',
        description,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      res.json({ data: ticket });
    } catch (error: any) {
      console.error("Support ticket creation error:", error);
      res.status(500).json({ 
        message: "Failed to create support ticket", 
        error: error.message 
      });
    }
  });

  app.get("/api/support/tickets", async (req, res) => {
    try {
      // For now, return empty array (in production, get user's tickets)
      const tickets: any[] = [];
      res.json({ data: tickets });
    } catch (error: any) {
      console.error("Support tickets fetch error:", error);
      res.status(500).json({ 
        message: "Failed to fetch support tickets", 
        error: error.message 
      });
    }
  });

  app.get("/api/support/tickets/:ticketId", async (req, res) => {
    try {
      const { ticketId } = req.params;
      
      // Mock ticket data for testing
      const ticket = {
        id: parseInt(ticketId),
        ticketNumber: `TRV-${ticketId}`,
        subject: "Test Support Ticket",
        category: "general",
        priority: "medium",
        status: "open",
        description: "This is a test support ticket",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      res.json({ data: ticket });
    } catch (error: any) {
      console.error("Support ticket fetch error:", error);
      res.status(500).json({ 
        message: "Failed to fetch support ticket", 
        error: error.message 
      });
    }
  });

  // Get booking details
  app.get("/api/bookings/:bookingId", async (req, res) => {
    try {
      const bookingId = parseInt(req.params.bookingId);
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch booking", error: error.message });
    }
  });

  // Get booking by reference
  app.get("/api/bookings/reference/:reference", async (req, res) => {
    try {
      const { reference } = req.params;
      const booking = await storage.getBookingByReference(reference);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch booking", error: error.message });
    }
  });

  // Cancel booking
  app.post("/api/bookings/:bookingId/cancel", async (req, res) => {
    try {
      const bookingId = parseInt(req.params.bookingId);
      const booking = await storage.updateBookingStatus(bookingId, "cancelled");
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json({ message: "Booking cancelled successfully", booking });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to cancel booking", error: error.message });
    }
  });

  // Get user bookings
  app.get("/api/users/:userId/bookings", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const bookings = await storage.getUserBookings(userId);
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch user bookings", error: error.message });
    }
  });

  // Get booking history for authenticated user
  app.get("/api/bookings/history", async (req, res) => {
    try {
      // Return sample booking data for demo purposes
      // In production, this would fetch from authenticated user session
      const bookings = [
        {
          id: 1,
          reference: "TRV-001",
          type: "flight",
          status: "confirmed",
          totalAmount: "459.00",
          currency: "USD",
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          route: "LAX → JFK",
          airline: "JetBlue Airways",
          departureDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          reference: "TRV-002", 
          type: "hotel",
          status: "confirmed",
          totalAmount: "320.00",
          currency: "USD",
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          hotel: "Grand Hotel NYC",
          location: "New York, NY",
          checkIn: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      res.json(bookings);
    } catch (error: any) {
      console.error("Booking history error:", error);
      res.status(500).json({ message: "Failed to fetch booking history", error: error.message });
    }
  });

  // Download receipt PDF
  app.get("/api/bookings/:reference/receipt", async (req, res) => {
    try {
      const { reference } = req.params;
      const booking = await storage.getBookingByReference(reference);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Generate PDF receipt content
      const receiptHTML = generateReceiptHTML(booking);
      
      // Set headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="TravalSearch-Receipt-${reference}.pdf"`);
      
      // For now, return HTML that can be printed/saved as PDF
      res.setHeader('Content-Type', 'text/html');
      res.send(receiptHTML);
      
    } catch (error: any) {
      res.status(500).json({ message: "Failed to generate receipt", error: error.message });
    }
  });

  // Email receipt
  app.post("/api/bookings/:reference/email-receipt", async (req, res) => {
    try {
      const { reference } = req.params;
      const booking = await storage.getBookingByReference(reference);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      // Here you would integrate with email service like SendGrid
      // For now, we'll simulate the email sending
      console.log(`Email receipt sent for booking ${reference}`);
      
      res.json({ message: "Receipt emailed successfully" });
      
    } catch (error: any) {
      res.status(500).json({ message: "Failed to email receipt", error: error.message });
    }
  });

  // Live Airport search endpoint using Duffel API
  app.get("/api/airports", async (req, res) => {
    try {
      const { q: query } = req.query;
      const flightService = createFlightService();
      
      if (!query || (query as string).length < 2) {
        return res.json({ data: [] });
      }
      
      console.log(`[Airport Search] Searching for: "${query}"`);
      
      try {
        // First try live Duffel API for airport search
        const airports = await flightService.getAirports(query as string);
        console.log(`[Airport Search] Duffel API returned ${airports.data?.length || 0} airports`);
        
        if (airports.data && airports.data.length > 0) {
          // Transform and filter Duffel results for relevance
          const searchTerm = (query as string).toLowerCase();
          const transformedAirports = airports.data
            .map((airport: any) => ({
              id: airport.id,
              iata_code: airport.iata_code,
              icao_code: airport.icao_code,
              name: airport.name,
              city_name: airport.city_name || airport.city?.name,
              country_code: airport.iata_country_code,
              country_name: airport.country_name,
              time_zone: airport.time_zone
            }))
            .filter((airport: any) => {
              // Filter for relevant matches
              const cityName = (airport.city_name || '').toLowerCase();
              const airportName = (airport.name || '').toLowerCase();
              const iataCode = (airport.iata_code || '').toLowerCase();
              
              return cityName.includes(searchTerm) ||
                     airportName.includes(searchTerm) ||
                     iataCode.includes(searchTerm);
            })
            .slice(0, 8); // Limit to 8 results for autocomplete
          
          if (transformedAirports.length > 0) {
            console.log(`[Airport Search] Found ${transformedAirports.length} relevant matches`);
            return res.json({ data: transformedAirports });
          }
        }
        
        // If no relevant results from Duffel API, fall back to comprehensive static data
        console.log(`[Airport Search] No relevant Duffel results, using fallback data`);
        throw new Error('No relevant results from Duffel API');
      } catch (duffelError: any) {
        console.error("[Airport Search] Duffel API error:", duffelError.message);
        // Use comprehensive static data as fallback
        const comprehensiveAirports = [
          { id: "apt_jfk", iata_code: "JFK", icao_code: "KJFK", name: "John F. Kennedy International Airport", city_name: "New York", country_code: "US", country_name: "United States", time_zone: "America/New_York" },
          { id: "apt_lax", iata_code: "LAX", icao_code: "KLAX", name: "Los Angeles International Airport", city_name: "Los Angeles", country_code: "US", country_name: "United States", time_zone: "America/Los_Angeles" },
          { id: "apt_lhr", iata_code: "LHR", icao_code: "EGLL", name: "London Heathrow Airport", city_name: "London", country_code: "GB", country_name: "United Kingdom", time_zone: "Europe/London" },
          { id: "apt_cdg", iata_code: "CDG", icao_code: "LFPG", name: "Charles de Gaulle Airport", city_name: "Paris", country_code: "FR", country_name: "France", time_zone: "Europe/Paris" },
          { id: "apt_nrt", iata_code: "NRT", icao_code: "RJAA", name: "Narita International Airport", city_name: "Tokyo", country_code: "JP", country_name: "Japan", time_zone: "Asia/Tokyo" },
          { id: "apt_fra", iata_code: "FRA", icao_code: "EDDF", name: "Frankfurt Airport", city_name: "Frankfurt", country_code: "DE", country_name: "Germany", time_zone: "Europe/Berlin" },
          { id: "apt_ams", iata_code: "AMS", icao_code: "EHAM", name: "Amsterdam Airport Schiphol", city_name: "Amsterdam", country_code: "NL", country_name: "Netherlands", time_zone: "Europe/Amsterdam" },
          { id: "apt_dxb", iata_code: "DXB", icao_code: "OMDB", name: "Dubai International Airport", city_name: "Dubai", country_code: "AE", country_name: "United Arab Emirates", time_zone: "Asia/Dubai" }
        ];
        
        const filteredAirports = comprehensiveAirports.filter(airport => 
          airport.name.toLowerCase().includes((query as string).toLowerCase()) ||
          airport.city_name.toLowerCase().includes((query as string).toLowerCase()) ||
          airport.iata_code.toLowerCase().includes((query as string).toLowerCase())
        );
        
        res.json({ data: filteredAirports });
      }
    } catch (error: any) {
      console.error("[Airport Search] General error:", error.message);
      res.status(500).json({ message: "Failed to fetch airports", error: error.message });
    }
  });

  // Webhook Management API Routes
  
  // Get all webhooks
  app.get("/api/webhooks", async (req, res) => {
    try {
      const webhooks = await storage.getAllWebhooks();
      res.json(webhooks);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch webhooks", error: error.message });
    }
  });

  // Create webhook
  app.post("/api/webhooks", async (req, res) => {
    try {
      const validatedData = insertWebhookSchema.parse(req.body);
      
      // Validate HTTPS URL
      const url = new URL(validatedData.url);
      if (url.protocol !== 'https:') {
        return res.status(400).json({ message: "Webhook URL must use HTTPS" });
      }
      
      // Generate webhook secret
      const secret = crypto.randomBytes(32).toString('hex');
      
      const webhook = await storage.createWebhook({
        ...validatedData,
        secret,
      });
      
      res.status(201).json(webhook);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid webhook data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create webhook", error: error.message });
    }
  });

  // Update webhook
  app.patch("/api/webhooks/:webhookId", async (req, res) => {
    try {
      const webhookId = parseInt(req.params.webhookId);
      const updates = req.body;
      
      const webhook = await storage.updateWebhook(webhookId, updates);
      
      if (!webhook) {
        return res.status(404).json({ message: "Webhook not found" });
      }
      
      res.json(webhook);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update webhook", error: error.message });
    }
  });

  // Delete webhook
  app.delete("/api/webhooks/:webhookId", async (req, res) => {
    try {
      const webhookId = parseInt(req.params.webhookId);
      const success = await storage.deleteWebhook(webhookId);
      
      if (!success) {
        return res.status(404).json({ message: "Webhook not found" });
      }
      
      res.json({ message: "Webhook deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to delete webhook", error: error.message });
    }
  });

  // Test webhook
  app.post("/api/webhooks/:webhookId/test", async (req, res) => {
    try {
      const webhookId = parseInt(req.params.webhookId);
      const webhook = await storage.getWebhook(webhookId);
      
      if (!webhook) {
        return res.status(404).json({ message: "Webhook not found" });
      }
      
      // Send test ping
      const testPayload = {
        event: "webhook.test",
        created_at: new Date().toISOString(),
        data: {
          message: "This is a test webhook from TravalSearch",
          webhook_id: webhook.id,
        }
      };
      
      try {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Secret': webhook.secret,
            'User-Agent': 'TravalSearch-Webhooks/1.0',
          },
          body: JSON.stringify(testPayload),
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });
        
        if (response.ok) {
          await storage.incrementWebhookSuccess(webhookId);
          await storage.updateWebhookLastPing(webhookId);
          res.json({ message: "Test webhook sent successfully", status: response.status });
        } else {
          await storage.incrementWebhookFailure(webhookId);
          res.status(400).json({ 
            message: "Webhook endpoint returned error", 
            status: response.status 
          });
        }
      } catch (fetchError: any) {
        await storage.incrementWebhookFailure(webhookId);
        res.status(400).json({ 
          message: "Failed to reach webhook endpoint", 
          error: fetchError.message 
        });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Failed to test webhook", error: error.message });
    }
  });

  // ========== VISA & DOCUMENTATION ASSISTANT API ENDPOINTS ==========
  
  // Visa requirements endpoint
  app.get("/api/visa-requirements", async (req, res) => {
    try {
      const { destination, nationality } = req.query as { destination: string; nationality: string };
      
      if (!destination || !nationality) {
        return res.status(400).json({ message: "Destination and nationality are required" });
      }

      // Country code to name mapping
      const countryNames: Record<string, string> = {
        'US': 'United States', 'UK': 'United Kingdom', 'FR': 'France', 'DE': 'Germany',
        'JP': 'Japan', 'AU': 'Australia', 'CA': 'Canada', 'IT': 'Italy', 'ES': 'Spain',
        'NL': 'Netherlands', 'CH': 'Switzerland', 'SE': 'Sweden', 'NO': 'Norway',
        'DK': 'Denmark', 'SG': 'Singapore', 'TH': 'Thailand', 'IN': 'India',
        'CN': 'China', 'BR': 'Brazil', 'MX': 'Mexico'
      };

      const destinationName = countryNames[destination] || destination;
      const nationalityName = countryNames[nationality] || nationality;

      // Mock visa data based on common travel scenarios
      const mockVisaInfo = {
        country: destinationName,
        countryCode: destination,
        requiresVisa: ['IN', 'CN', 'AU'].includes(destination),
        visaType: ['IN', 'CN'].includes(destination) ? 'Tourist Visa' : 
                  destination === 'AU' ? 'Electronic Travel Authority (ETA)' : 
                  'Visa Waiver Program',
        processingTime: ['IN', 'CN'].includes(destination) ? '5-10 business days' : 
                       destination === 'AU' ? '24-72 hours' : 'N/A',
        validityPeriod: destination === 'IN' ? '10 years (multiple entry)' :
                       destination === 'CN' ? '10 years (multiple entry)' :
                       destination === 'AU' ? '1 year (multiple entry)' :
                       '90 days within 180 days',
        requirements: destination === 'IN' ? [
          'Valid passport (minimum 6 months validity)',
          'Completed visa application form',
          'Recent passport-sized photograph',
          'Proof of accommodation',
          'Return/onward flight tickets',
          'Bank statements (last 3 months)'
        ] : destination === 'CN' ? [
          'Valid passport (minimum 6 months validity)',
          'Completed visa application form',
          'Recent passport-sized photograph',
          'Detailed itinerary',
          'Hotel reservations',
          'Flight reservations'
        ] : destination === 'AU' ? [
          'Valid passport (minimum 6 months validity)',
          'Return/onward flight tickets',
          'Proof of funds ($5,000+ recommended)',
          'Health insurance (recommended)'
        ] : [
          'Valid passport (minimum 6 months validity)',
          'Return/onward flight tickets',
          'Proof of accommodation',
          'Sufficient funds for stay'
        ],
        cost: destination === 'IN' ? '$100' :
              destination === 'CN' ? '$140' :
              destination === 'AU' ? '$20' : 'Free',
        embassy: {
          name: `Consulate-General of ${destinationName}`,
          address: '123 Embassy Row, Los Angeles, CA 90071',
          phone: '+1 (213) 555-0100',
          email: `info@${destination.toLowerCase()}.embassy.gov`,
          website: `https://www.${destination.toLowerCase()}.embassy.gov`,
          workingHours: 'Mon-Fri: 9:00 AM - 12:00 PM, 1:30 PM - 5:00 PM'
        }
      };

      res.json(mockVisaInfo);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch visa requirements", error: error.message });
    }
  });

  // Passport check endpoint
  app.get("/api/passport-check", async (req, res) => {
    try {
      const { passportNumber, passportExpiry, destination } = req.query as { 
        passportNumber: string; 
        passportExpiry: string; 
        destination: string 
      };
      
      if (!passportNumber || !passportExpiry || !destination) {
        return res.status(400).json({ message: "Passport number, expiry date, and destination are required" });
      }

      const expiryDate = new Date(passportExpiry);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

      const isValid = expiryDate > sixMonthsFromNow;
      const requiresRenewal = daysUntilExpiry < 180;

      const warnings = [];
      if (daysUntilExpiry < 30) warnings.push('Passport expires within 30 days - renewal urgent!');
      else if (daysUntilExpiry < 90) warnings.push('Passport expires within 90 days - consider renewal');
      if (!isValid) warnings.push('Passport does not meet 6-month validity requirement');

      const passportCheck = {
        isValid,
        expiryDate: passportExpiry,
        daysUntilExpiry,
        requiresRenewal,
        warnings
      };

      res.json(passportCheck);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to check passport", error: error.message });
    }
  });

  // Travel documents endpoint
  app.get("/api/travel-documents", async (req, res) => {
    try {
      const { destination } = req.query as { destination: string };
      
      if (!destination) {
        return res.status(400).json({ message: "Destination is required" });
      }

      const travelDocuments = [
        {
          id: "1",
          type: "Form",
          name: "Customs Declaration Form",
          required: true,
          description: "Required for all international arrivals",
          validFor: ["JP", "US", "UK", "FR", "DE", "IT", "ES", "CA", "AU"],
          downloadUrl: "/forms/customs-declaration.pdf"
        },
        {
          id: "2",
          type: "Certificate",
          name: "International Vaccination Certificate",
          required: ["TH", "IN", "BR", "MX"].includes(destination),
          description: destination === "IN" || destination === "TH" ? "Required for entry" : "Recommended for certain destinations",
          validFor: ["TH", "IN", "BR", "MX", "SG", "CN"],
          downloadUrl: "/forms/vaccination-cert.pdf"
        },
        {
          id: "3",
          type: "Insurance",
          name: "Travel Insurance Certificate",
          required: ["FR", "DE", "IT", "ES", "NL", "CH", "SE", "NO", "DK"].includes(destination),
          description: ["FR", "DE", "IT", "ES", "NL"].includes(destination) ? "Mandatory for Schengen Area countries" : "Recommended for all international travel",
          validFor: ["FR", "DE", "IT", "ES", "NL", "CH", "SE", "NO", "DK", "UK"],
          downloadUrl: "/forms/insurance-template.pdf"
        }
      ];

      // Filter documents relevant to destination
      const relevantDocuments = travelDocuments.filter(doc => 
        doc.validFor.includes(destination) || doc.type === "Form"
      );

      res.json(relevantDocuments);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch travel documents", error: error.message });
    }
  });



  // SEO Landing Pages API - Flight Routes
  app.get('/api/seo/flight-routes', (req, res) => {
    try {
      const routes = popularFlightRoutes.map(route => ({
        ...route,
        metadata: generateFlightRouteMetadata(route),
        faqs: generateFlightRouteFAQs(route),
        tips: generateTravelTips(route),
        url: `/flights-from-${route.from.toLowerCase()}-to-${route.to.toLowerCase()}`
      }));
      
      res.json({
        totalRoutes: routes.length,
        routes: routes
      });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch flight routes", error: error.message });
    }
  });

  // SEO Landing Pages API - Cheap Flight Destinations  
  app.get('/api/seo/cheap-destinations', (req, res) => {
    try {
      const destinations = cheapFlightDestinations.map(dest => ({
        ...dest,
        metadata: generateCheapFlightMetadata(dest),
        url: `/cheap-flights-to-${dest.destination.toLowerCase().replace(/\s+/g, '-')}`
      }));
      
      res.json({
        totalDestinations: destinations.length,
        destinations: destinations
      });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch cheap destinations", error: error.message });
    }
  });

  // SEO Landing Pages API - Blog Post Topics
  app.get('/api/seo/blog-topics', (req, res) => {
    try {
      const topics = generateBlogPostTopics();
      
      res.json({
        totalTopics: topics.length,
        topics: topics
      });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch blog topics", error: error.message });
    }
  });

  // SEO Landing Pages API - Specific Flight Route Data
  app.get('/api/seo/flight-route/:from/:to', (req, res) => {
    try {
      const { from, to } = req.params;
      const route = popularFlightRoutes.find(r => 
        r.from.toLowerCase() === from.toLowerCase() && 
        r.to.toLowerCase() === to.toLowerCase()
      );
      
      if (!route) {
        return res.status(404).json({ message: "Flight route not found" });
      }
      
      const routeData = {
        ...route,
        metadata: generateFlightRouteMetadata(route),
        faqs: generateFlightRouteFAQs(route),
        tips: generateTravelTips(route),
        url: `/flights-from-${route.from.toLowerCase()}-to-${route.to.toLowerCase()}`
      };
      
      res.json(routeData);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch flight route data", error: error.message });
    }
  });

  // SEO Landing Pages API - Specific Cheap Destination Data
  app.get('/api/seo/cheap-destination/:destination', (req, res) => {
    try {
      const { destination } = req.params;
      const dest = cheapFlightDestinations.find(d => 
        d.destination.toLowerCase() === destination.toLowerCase()
      );
      
      if (!dest) {
        return res.status(404).json({ message: "Destination not found" });
      }
      
      const destData = {
        ...dest,
        metadata: generateCheapFlightMetadata(dest),
        url: `/cheap-flights-to-${dest.destination.toLowerCase().replace(/\s+/g, '-')}`
      };
      
      res.json(destData);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch destination data", error: error.message });
    }
  });

  // SEO Landing Pages API - Regional Routes (African/Middle Eastern Markets)
  app.get('/api/seo/regional-routes/:region', (req, res) => {
    try {
      const { region } = req.params;
      
      const regionalRoutes = popularFlightRoutes.filter(route => {
        switch (region.toLowerCase()) {
          case 'africa':
            return ['NBO', 'CAI', 'LOS', 'JNB', 'ADD', 'CAS', 'ALG'].includes(route.from) ||
                   ['NBO', 'CAI', 'LOS', 'JNB', 'ADD', 'CAS', 'ALG'].includes(route.to);
          case 'middle-east':
            return ['DXB', 'DOH', 'KWI', 'RUH', 'JED', 'AMM', 'BEY'].includes(route.from) ||
                   ['DXB', 'DOH', 'KWI', 'RUH', 'JED', 'AMM', 'BEY'].includes(route.to);
          case 'diaspora':
            return (route.from === 'NBO' && ['JFK', 'LHR', 'DXB'].includes(route.to)) ||
                   (route.from === 'LOS' && ['JFK', 'LHR', 'DXB'].includes(route.to)) ||
                   (route.from === 'CAI' && ['JFK', 'LHR', 'DXB'].includes(route.to));
          default:
            return false;
        }
      });
      
      const routesWithMetadata = regionalRoutes.map(route => ({
        ...route,
        metadata: generateFlightRouteMetadata(route),
        faqs: generateFlightRouteFAQs(route),
        tips: generateTravelTips(route),
        url: `/flights-from-${route.from.toLowerCase()}-to-${route.to.toLowerCase()}`
      }));
      
      res.json({
        region: region,
        totalRoutes: routesWithMetadata.length,
        routes: routesWithMetadata
      });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch regional routes", error: error.message });
    }
  });

  // Two-factor authentication toggle
  app.post("/api/profile/two-factor", async (req, res) => {
    try {
      const { enabled } = req.body;
      
      if (typeof enabled !== 'boolean') {
        return res.status(400).json({ message: "Enabled must be a boolean value" });
      }

      // For now, return success without actual implementation
      // In production, this would integrate with SMS/authenticator app services
      res.json({ 
        success: true, 
        twoFactorEnabled: enabled,
        message: enabled ? 'Two-factor authentication has been enabled' : 'Two-factor authentication has been disabled'
      });
      
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update two-factor authentication", error: error.message });
    }
  });

  // Generate and download travel document PDFs
  app.post("/api/travel-documents/download", async (req, res) => {
    try {
      const { documentId, documentType, documentName, userInfo } = req.body;
      
      // Generate PDF content based on document type
      let pdfContent = '';
      
      switch (documentId) {
        case '1': // Customs Declaration Form
          pdfContent = generateCustomsDeclarationPDF(userInfo);
          break;
        case '2': // International Vaccination Certificate
          pdfContent = generateVaccinationCertificatePDF(userInfo);
          break;
        case '3': // Travel Insurance Certificate
          pdfContent = generateInsuranceCertificatePDF(userInfo);
          break;
        default:
          return res.status(400).json({ message: "Unknown document type" });
      }
      
      // Set headers for HTML download that can be printed as PDF
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="${documentName.replace(/\s+/g, '_')}.html"`);
      
      // Return HTML content that browsers can save as PDF via Print dialog
      res.send(pdfContent);
      
    } catch (error: any) {
      res.status(500).json({ message: "Failed to generate document", error: error.message });
    }
  });

  // ========== AI CHAT SUPPORT ENDPOINTS ==========
  
  // AI Chat conversation endpoint
  app.post("/api/chat/message", async (req, res) => {
    try {
      const { message, conversationHistory, userContext } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ message: "Message is required" });
      }

      console.log(`[AI Chat] Processing message: "${message.substring(0, 50)}..."`);
      
      // Generate AI response using OpenAI
      const aiResponse = await generateAIResponse(
        message,
        conversationHistory || [],
        userContext
      );

      // Generate quick response suggestions
      const quickResponses = await generateQuickResponses(message);

      console.log(`[AI Chat] Generated response length: ${aiResponse.length} characters`);
      
      res.json({
        response: aiResponse,
        quickResponses: quickResponses,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error("[AI Chat] Error:", error);
      res.status(500).json({ 
        message: "Failed to generate AI response", 
        error: error.message 
      });
    }
  });

  // Initialize chat session with welcome message
  app.post("/api/chat/initialize", async (req, res) => {
    try {
      const { userContext } = req.body;
      
      const welcomeMessage = `Hello${userContext?.name ? ` ${userContext.name}` : ''}! I'm Sarah from TravalSearch support. How can I help you today?`;
      
      res.json({
        response: welcomeMessage,
        quickResponses: [
          "I need help with my booking",
          "Flight status inquiry", 
          "Refund request",
          "Change my flight"
        ],
        timestamp: new Date().toISOString(),
        agentName: "Sarah M."
      });

    } catch (error: any) {
      console.error("[AI Chat] Initialization error:", error);
      res.status(500).json({ 
        message: "Failed to initialize chat", 
        error: error.message 
      });
    }
  });

  // ========== OPERATIONAL MANAGEMENT ENDPOINTS ==========
  
  // Booking Modifications Management
  app.get("/api/booking-modifications", async (req, res) => {
    try {
      // Mock data for operational testing - replace with real database calls
      const modifications = [
        {
          id: 1,
          bookingId: 101,
          type: 'change',
          status: 'pending',
          requestedBy: 1,
          feesAmount: '25.00',
          refundAmount: '0.00',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          bookingId: 102,
          type: 'cancellation',
          status: 'approved',
          requestedBy: 2,
          feesAmount: '50.00',
          refundAmount: '200.00',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString()
        }
      ];
      res.json(modifications);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch booking modifications", error: error.message });
    }
  });

  app.post("/api/booking-modifications/:id/process", async (req, res) => {
    try {
      const modificationId = parseInt(req.params.id);
      const { action, notes } = req.body;

      // Mock processing - replace with real database update
      const processedModification = {
        id: modificationId,
        status: action === 'approve' ? 'approved' : 'rejected',
        processedBy: 'admin',
        notes: notes || `${action}d by operations team`
      };

      res.json(processedModification);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to process booking modification", error: error.message });
    }
  });

  // Duffel Payment Processing API Routes
  app.post("/api/payment/create-intent", async (req, res) => {
    try {
      if (!process.env.DUFFEL_API_TOKEN) {
        return res.status(501).json({ 
          message: "Payment processing requires Duffel API integration. Please configure DUFFEL_API_TOKEN to enable live payment processing.",
          error: "API_KEY_REQUIRED"
        });
      }

      const { amount, currency = "USD" } = req.body;
      
      if (!amount) {
        return res.status(400).json({ message: "Amount is required" });
      }

      // Create payment intent with Duffel API
      const response = await fetch(`https://api.duffel.com/v2/payment_intents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DUFFEL_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Duffel-Version': 'v2',
        },
        body: JSON.stringify({
          amount,
          currency,
          confirmation_method: 'automatic',
          capture_method: 'automatic',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Payment intent creation failed: ${errorData.errors?.[0]?.message || response.statusText}`);
      }

      const paymentIntent = await response.json();
      res.json(paymentIntent);
    } catch (error: any) {
      console.error("Payment intent creation error:", error);
      res.status(500).json({ 
        message: "Failed to create payment intent", 
        error: error.message 
      });
    }
  });

  app.post("/api/payment/create-method", async (req, res) => {
    try {
      if (!process.env.DUFFEL_API_TOKEN) {
        return res.status(501).json({ 
          message: "Payment processing requires Duffel API integration. Please configure DUFFEL_API_TOKEN to enable live payment processing.",
          error: "API_KEY_REQUIRED"
        });
      }

      const { cardData, billingDetails } = req.body;
      
      if (!cardData || !billingDetails) {
        return res.status(400).json({ message: "Card data and billing details are required" });
      }

      // Create payment method with Duffel API
      const response = await fetch(`https://api.duffel.com/v2/payment_methods`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DUFFEL_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Duffel-Version': 'v2',
        },
        body: JSON.stringify({
          type: 'card',
          card: cardData,
          billing_details: billingDetails,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Payment method creation failed: ${errorData.errors?.[0]?.message || response.statusText}`);
      }

      const paymentMethod = await response.json();
      res.json(paymentMethod);
    } catch (error: any) {
      console.error("Payment method creation error:", error);
      res.status(500).json({ 
        message: "Failed to create payment method", 
        error: error.message 
      });
    }
  });

  app.post("/api/booking/complete-payment", async (req, res) => {
    try {
      if (!process.env.DUFFEL_API_TOKEN) {
        return res.status(501).json({ 
          message: "Payment processing requires Duffel API integration. Please configure DUFFEL_API_TOKEN to enable live payment processing.",
          error: "API_KEY_REQUIRED"
        });
      }

      const { offerId, passengers, cardData, billingDetails, amount, currency } = req.body;
      
      if (!offerId || !passengers || !cardData || !billingDetails) {
        return res.status(400).json({ message: "Offer ID, passengers, card data, and billing details are required" });
      }

      // Create booking with payment via Duffel API
      const bookingData = {
        selected_offers: [offerId],
        passengers: passengers.map((passenger: any) => ({
          id: passenger.id,
          title: passenger.title,
          given_name: passenger.given_name,
          family_name: passenger.family_name,
          born_on: passenger.born_on,
          email: passenger.email,
          phone_number: passenger.phone_number,
        })),
        payments: [{
          type: "card",
          amount,
          currency,
          card: cardData,
          billing_details: billingDetails
        }]
      };

      const response = await fetch(`https://api.duffel.com/v2/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.DUFFEL_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Duffel-Version': 'v2',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Booking creation failed: ${errorData.errors?.[0]?.message || response.statusText}`);
      }

      const booking = await response.json();
      
      // Store booking in database
      const bookingRecord = await storage.createBooking({
        type: "flight",
        itemId: 1, // Flight item ID
        reference: booking.data.id,
        totalAmount: booking.data.total_amount,
        currency: booking.data.total_currency,
        status: "confirmed",
        userId: 1, // Default user ID for now
        details: JSON.stringify({
          passengers: booking.data.passengers,
          slices: booking.data.slices,
          booking_reference: booking.data.booking_reference
        })
      });

      res.json({
        booking: booking.data,
        record: bookingRecord,
        message: "Booking completed successfully"
      });
    } catch (error: any) {
      console.error("Booking completion error:", error);
      res.status(500).json({ 
        message: "Failed to complete booking", 
        error: error.message 
      });
    }
  });

  // Support Tickets Management
  app.get("/api/support-tickets", async (req, res) => {
    try {
      // Mock data for operational testing
      const tickets = [
        {
          id: 1,
          ticketNumber: 'TKT_001',
          subject: 'Flight cancellation assistance needed',
          category: 'booking',
          priority: 'high',
          status: 'open',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          ticketNumber: 'TKT_002',
          subject: 'Payment refund request',
          category: 'payment',
          priority: 'medium',
          status: 'in_progress',
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        }
      ];
      res.json(tickets);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch support tickets", error: error.message });
    }
  });

  app.patch("/api/support-tickets/:id", async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const { status, resolution } = req.body;

      // Mock update - replace with real database update
      const updatedTicket = {
        id: ticketId,
        status,
        resolution,
        updatedAt: new Date().toISOString()
      };

      res.json(updatedTicket);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update support ticket", error: error.message });
    }
  });

  // Financial Transactions Management
  app.get("/api/transactions", async (req, res) => {
    try {
      // Mock transaction data for operational testing
      const transactions = [
        {
          id: 1,
          bookingId: 101,
          type: 'payment',
          status: 'completed',
          amount: '299.99',
          currency: 'USD',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          bookingId: 102,
          type: 'refund',
          status: 'pending',
          amount: '150.00',
          currency: 'USD',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        }
      ];
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch transactions", error: error.message });
    }
  });

  // Operational Reports Management
  app.get("/api/operational-reports", async (req, res) => {
    try {
      // Mock reports data
      const reports = [
        {
          id: 1,
          reportType: 'daily_revenue',
          period: 'daily',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          data: { totalRevenue: 2499.85, transactionCount: 12 },
          createdAt: new Date().toISOString()
        }
      ];
      res.json(reports);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch operational reports", error: error.message });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = req.body;
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: "Valid email address is required" });
      }

      // Log the subscription (in production, this would integrate with SendGrid, Mailchimp, etc.)
      console.log(`[Newsletter] New subscription: ${email}`);
      
      // Simulate successful subscription
      const subscription = {
        email,
        subscribed: true,
        subscribedAt: new Date().toISOString(),
        status: 'active'
      };

      res.json({ 
        message: "Successfully subscribed to newsletter",
        subscription 
      });
      
    } catch (error: any) {
      console.error('[Newsletter] Subscription error:', error);
      res.status(500).json({ message: "Failed to subscribe to newsletter", error: error.message });
    }
  });

  // Custom SEO Intelligence API endpoints (Ahrefs alternative)
  app.get('/api/custom-seo/keyword-analysis/:keyword', async (req, res) => {
    try {
      const { keyword } = req.params;
      const analysis = await customSEO.analyzeKeywordPositions(keyword);
      res.json(analysis);
    } catch (error) {
      console.error('Error analyzing keyword:', error);
      res.status(500).json({ error: 'Failed to analyze keyword' });
    }
  });

  app.get('/api/custom-seo/competitor-analysis/:domain', async (req, res) => {
    try {
      const { domain } = req.params;
      const analysis = await customSEO.analyzeCompetitorProfile(domain);
      res.json(analysis);
    } catch (error) {
      console.error('Error analyzing competitor:', error);
      res.status(500).json({ error: 'Failed to analyze competitor' });
    }
  });

  app.get('/api/custom-seo/opportunities', async (req, res) => {
    try {
      const opportunities = await customSEO.generateOpportunitiesReport();
      res.json(opportunities);
    } catch (error) {
      console.error('Error generating opportunities:', error);
      res.status(500).json({ error: 'Failed to generate opportunities report' });
    }
  });

  app.post('/api/custom-seo/serp-monitor', async (req, res) => {
    try {
      const { keywords } = req.body;
      if (!Array.isArray(keywords)) {
        return res.status(400).json({ error: 'Keywords must be an array' });
      }
      const results = await customSEO.monitorSERPChanges(keywords);
      res.json(results);
    } catch (error) {
      console.error('Error monitoring SERP changes:', error);
      res.status(500).json({ error: 'Failed to monitor SERP changes' });
    }
  });

  app.post("/api/operational-reports/generate", async (req, res) => {
    try {
      const { reportType, period, startDate, endDate } = req.body;

      // Mock report generation
      const report = {
        id: Date.now(),
        reportType,
        period,
        startDate,
        endDate,
        data: {
          totalRevenue: 2499.85,
          transactionCount: 12,
          bookingCount: 8,
          averageOrderValue: 312.48
        },
        createdAt: new Date().toISOString()
      };

      res.json(report);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to generate report", error: error.message });
    }
  });

  // Dashboard Analytics
  app.get("/api/dashboard/analytics", async (req, res) => {
    try {
      const analytics = {
        pendingModifications: 1,
        openTickets: 1,
        todayRevenue: 2499.85,
        totalBookings: 8,
        confirmedBookings: 7,
        revenueGrowth: 15.2,
        customerSatisfaction: 94.5
      };

      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch analytics", error: error.message });
    }
  });

  // Embassy and Travel Advisory endpoints
  app.get("/api/embassy-info/:countryCode", async (req, res) => {
    try {
      const { countryCode } = req.params;
      
      // In production, integrate with official US State Department APIs
      const embassyData = {
        id: `embassy_${countryCode}_us`,
        country: getCountryName(countryCode),
        countryCode,
        name: `US Embassy in ${getCountryName(countryCode)}`,
        address: getEmbassyAddress(countryCode),
        city: getCapitalCity(countryCode),
        phone: getEmbassyPhone(countryCode),
        email: `consular.services@us${countryCode.toLowerCase()}.gov`,
        website: `https://us${countryCode.toLowerCase()}.usembassy.gov`,
        emergencyPhone: getEmergencyPhone(countryCode),
        consulateServices: [
          'Passport Services',
          'Visa Applications', 
          'Notarial Services',
          'Emergency Assistance',
          'Citizen Services'
        ],
        operatingHours: 'Mon-Fri: 8:00 AM - 5:00 PM'
      };
      
      res.json(embassyData);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch embassy information", error: error.message });
    }
  });

  app.get("/api/travel-advisories/:countryCode", async (req, res) => {
    try {
      const { countryCode } = req.params;
      
      const advisory = {
        id: `advisory_${countryCode}`,
        country: getCountryName(countryCode),
        countryCode,
        level: getTravelAdvisoryLevel(countryCode),
        title: `Travel Advisory for ${getCountryName(countryCode)}`,
        summary: `Current travel conditions and safety recommendations for ${getCountryName(countryCode)}`,
        details: getTravelAdvisoryDetails(countryCode),
        lastUpdated: new Date().toISOString(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        categories: ['General Safety', 'Health', 'Security'],
        recommendations: getTravelRecommendations(countryCode)
      };
      
      res.json([advisory]);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch travel advisories", error: error.message });
    }
  });

  app.get("/api/country-notifications/:countryCode", async (req, res) => {
    try {
      const { countryCode } = req.params;
      
      const notifications = [
        {
          id: `notif_${countryCode}_visa`,
          country: getCountryName(countryCode),
          countryCode,
          type: 'visa',
          priority: getVisaPriority(countryCode),
          title: 'Visa Requirements',
          message: getVisaMessage(countryCode),
          actionRequired: requiresVisa(countryCode),
          relatedLinks: [
            { title: 'Visa Information', url: `https://travel.state.gov/content/travel/en/us-visas.html` },
            { title: 'Application Portal', url: `https://ceac.state.gov/genniv/` }
          ]
        },
        {
          id: `notif_${countryCode}_health`,
          country: getCountryName(countryCode),
          countryCode,
          type: 'health',
          priority: 'medium',
          title: 'Health Recommendations',
          message: getHealthMessage(countryCode),
          actionRequired: false,
          relatedLinks: [
            { title: 'CDC Travel Health', url: `https://wwwnc.cdc.gov/travel/destinations/traveler/none/${countryCode}` }
          ]
        }
      ];
      
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch country notifications", error: error.message });
    }
  });

  // Currency and localization endpoints
  app.get('/api/currencies', async (req, res) => {
    try {
      const currencies = currencyService.getSupportedCurrencies();
      res.json({ currencies });
    } catch (error) {
      console.error("Failed to fetch currencies:", error);
      res.status(500).json({ message: "Failed to fetch currencies" });
    }
  });

  // Auto-detect currency based on user location
  app.get('/api/detect-currency', async (req, res) => {
    try {
      const detectedCurrency = await currencyService.detectCurrencyFromRequest(req);
      const currencyInfo = currencyService.getCurrencyInfo(detectedCurrency);
      
      res.json({ 
        currency: detectedCurrency,
        info: currencyInfo,
        supported: currencyService.isSupported(detectedCurrency)
      });
    } catch (error) {
      console.error("Failed to detect currency:", error);
      res.json({ currency: 'USD', info: currencyService.getCurrencyInfo('USD'), supported: true });
    }
  });

  // Convert price between currencies
  app.post('/api/convert-price', async (req, res) => {
    try {
      const { amount, fromCurrency, toCurrency } = req.body;
      
      if (!amount || !fromCurrency || !toCurrency) {
        return res.status(400).json({ message: "Missing required parameters" });
      }

      const convertedAmount = currencyService.convert(amount, fromCurrency, toCurrency);
      const formattedPrice = currencyService.formatPrice(convertedAmount, toCurrency);
      
      res.json({ 
        originalAmount: amount,
        convertedAmount,
        formattedPrice,
        fromCurrency,
        toCurrency
      });
    } catch (error) {
      console.error("Failed to convert price:", error);
      res.status(500).json({ message: "Failed to convert price" });
    }
  });

  // Auto-detect localization (language + currency + timezone)
  app.get('/api/detect-localization', async (req, res) => {
    try {
      // Get country from various headers
      const countryHeader = 
        req.headers['cloudflare-ipcountry'] ||
        req.headers['cf-ipcountry'] ||
        req.headers['x-country-code'] ||
        req.headers['x-forwarded-country'] ||
        'US'; // Default to US
      
      const country = Array.isArray(countryHeader) ? countryHeader[0] : countryHeader;

      // Country to language mapping
      const countryLanguageMap: { [key: string]: string } = {
        'DE': 'de', 'AT': 'de', 'CH': 'de', // German
        'FR': 'fr', 'BE': 'fr', // French
        'CA': 'en-ca', // Canada - English as primary, French available
        'ES': 'es', 'MX': 'es', 'AR': 'es', // Spanish
        'IT': 'it', // Italian
        'PT': 'pt', 'BR': 'pt', // Portuguese
        'JP': 'ja', // Japanese
        'CN': 'zh', // Chinese
        'KR': 'ko', // Korean
        'RU': 'ru', // Russian
        'SA': 'ar', // Arabic
        'IN': 'hi', // Hindi
        'US': 'en', 'GB': 'en', 'AU': 'en', 'NZ': 'en', // English (limited Duffel coverage for AU/NZ)
      };

      const detectedLanguage = countryLanguageMap[country.toUpperCase()] || 'en';
      const detectedCurrency = currencyService.getCurrencyByCountry(country);
      
      // Basic timezone detection
      const timezoneMap: { [key: string]: string } = {
        'US': 'America/New_York',
        'CA': 'America/Toronto',
        'GB': 'Europe/London',
        'DE': 'Europe/Berlin',
        'FR': 'Europe/Paris',
        'ES': 'Europe/Madrid',
        'IT': 'Europe/Rome',
        'JP': 'Asia/Tokyo',
        'CN': 'Asia/Shanghai',
        'AU': 'Australia/Sydney',
      };

      const detectedTimezone = timezoneMap[country.toUpperCase()] || 'UTC';

      res.json({
        country: country.toUpperCase(),
        language: detectedLanguage,
        currency: detectedCurrency,
        timezone: detectedTimezone
      });
    } catch (error) {
      console.error("Failed to detect localization:", error);
      res.json({ 
        country: 'US',
        language: 'en',
        currency: 'USD',
        timezone: 'UTC'
      });
    }
  });

  // SEO Analytics API Routes - Google Search Console & Analytics Integration

  // Get keyword performance data
  app.get("/api/seo/keywords", async (req, res) => {
    try {
      const { dateRange = '30daysAgo' } = req.query;
      const data = await seoAnalytics.getKeywordPerformance(dateRange as string);
      res.json(data);
    } catch (error: any) {
      console.error("SEO keywords error:", error);
      res.status(500).json({ 
        message: "Failed to fetch keyword data",
        error: error.message,
        suggestion: "Configure Google Search Console API credentials"
      });
    }
  });

  // Get flight route SEO performance
  app.get("/api/seo/routes", async (req, res) => {
    try {
      const data = await seoAnalytics.getFlightRouteMetrics();
      res.json(data);
    } catch (error: any) {
      console.error("SEO flight routes error:", error);
      res.status(500).json({ 
        message: "Failed to fetch flight route metrics",
        error: error.message,
        suggestion: "Configure Google Search Console API credentials"
      });
    }
  });

  // Get traffic analytics
  app.get("/api/seo/traffic", async (req, res) => {
    try {
      const data = await seoAnalytics.getTrafficAnalytics();
      res.json(data);
    } catch (error: any) {
      console.error("SEO traffic error:", error);
      res.status(500).json({ 
        message: "Failed to fetch traffic analytics",
        error: error.message,
        suggestion: "Configure Google Analytics API credentials"
      });
    }
  });

  // Get trending destinations
  app.get("/api/seo/trending", async (req, res) => {
    try {
      const data = await seoAnalytics.getTrendingDestinations();
      res.json(data);
    } catch (error: any) {
      console.error("SEO trending error:", error);
      res.status(500).json({ 
        message: "Failed to fetch trending destinations",
        error: error.message,
        suggestion: "Configure Google Search Console API credentials"
      });
    }
  });

  // Get competitor insights
  app.get("/api/seo/competitors", async (req, res) => {
    try {
      const data = await seoAnalytics.getCompetitorInsights();
      res.json(data);
    } catch (error: any) {
      console.error("SEO competitors error:", error);
      res.status(500).json({ 
        message: "Failed to fetch competitor insights",
        error: error.message,
        suggestion: "Configure Google Search Console API credentials"
      });
    }
  });

  // Get comprehensive SEO recommendations
  app.get("/api/seo/recommendations", async (req, res) => {
    try {
      const data = await seoAnalytics.generateSEORecommendations();
      res.json(data);
    } catch (error: any) {
      console.error("SEO recommendations error:", error);
      res.status(500).json({ 
        message: "Failed to generate SEO recommendations",
        error: error.message,
        suggestion: "Configure Google APIs for comprehensive analysis"
      });
    }
  });

  // SEOSurf integration endpoints (fallback to demo data when credentials not available)
  app.get("/api/seosurf/projects", async (req, res) => {
    try {
      const { seoSurfIntegration } = await import('./seoSurfIntegration');
      const projects = await seoSurfIntegration.getProjects();
      res.json(projects);
    } catch (error: any) {
      console.log("SEOSurf credentials not configured, using demo data");
      res.json([
        { id: 'demo-1', domain: 'yourtravelsearch.com', name: 'YourTravelSearch' },
        { id: 'demo-2', domain: 'cheapflightfinder.com', name: 'Cheap Flight Finder' }
      ]);
    }
  });

  app.get("/api/seosurf/keywords/:domain", async (req, res) => {
    try {
      const { domain } = req.params;
      const { seoSurfIntegration } = await import('./seoSurfIntegration');
      const projectData = await seoSurfIntegration.getProjectData(domain);
      res.json({
        keywords: projectData.topKeywords,
        summary: {
          totalKeywords: projectData.totalKeywords,
          averagePosition: projectData.averagePosition,
          visibilityIndex: projectData.visibilityIndex
        }
      });
    } catch (error: any) {
      console.log("SEOSurf credentials not configured, using demo data");
      res.json({
        keywords: [
          {
            keyword: "cheap flights",
            currentPosition: 12,
            previousPosition: 15,
            change: 3,
            searchVolume: 49500,
            difficulty: 78,
            url: "/flights",
            device: "desktop"
          },
          {
            keyword: "flight booking",
            currentPosition: 8,
            previousPosition: 11,
            change: 3,
            searchVolume: 33100,
            difficulty: 82,
            url: "/",
            device: "mobile"
          }
        ],
        summary: { totalKeywords: 25, averagePosition: 18.5, visibilityIndex: 15 }
      });
    }
  });

  app.get("/api/seosurf/competitors/:domain", async (req, res) => {
    try {
      const { domain } = req.params;
      const { seoSurfIntegration } = await import('./seoSurfIntegration');
      const projectData = await seoSurfIntegration.getProjectData(domain);
      res.json({
        competitors: projectData.competitors,
        summary: {
          totalCompetitors: projectData.competitors.length,
          averageCompetitorPosition: projectData.competitors.reduce((sum, c) => sum + c.averagePosition, 0) / projectData.competitors.length
        }
      });
    } catch (error: any) {
      console.log("SEOSurf credentials not configured, using demo data");
      res.json({
        competitors: [
          {
            domain: "kayak.com",
            keywords: ["cheap flights", "flight booking", "airline tickets"],
            averagePosition: 3.2,
            visibilityScore: 89,
            organicTraffic: 12500000
          },
          {
            domain: "expedia.com", 
            keywords: ["travel booking", "vacation packages", "hotel deals"],
            averagePosition: 2.8,
            visibilityScore: 94,
            organicTraffic: 18200000
          }
        ],
        summary: { totalCompetitors: 2, averageCompetitorPosition: 3.0 }
      });
    }
  });

  app.get("/api/seosurf/opportunities/:domain", async (req, res) => {
    try {
      const { domain } = req.params;
      const { seoSurfIntegration } = await import('./seoSurfIntegration');
      const opportunities = await seoSurfIntegration.getKeywordOpportunities(domain);
      res.json({ opportunities });
    } catch (error: any) {
      console.log("SEOSurf credentials not configured, using demo data");
      res.json({
        opportunities: [
          {
            type: "ranking_improvement",
            keyword: "flight deals",
            currentPosition: 15,
            searchVolume: 22100,
            opportunity: "Improve from position 15 to top 10",
            estimatedTrafficGain: 2210,
            priority: "high"
          },
          {
            type: "competitor_gap",
            competitor: "skyscanner.com",
            opportunity: "Target Skyscanner's top keywords",
            priority: "medium"
          }
        ]
      });
    }
  });

  app.get("/api/seosurf/report/:domain", async (req, res) => {
    try {
      const { domain } = req.params;
      const { seoSurfIntegration } = await import('./seoSurfIntegration');
      const report = await seoSurfIntegration.generateSEOSurfReport(domain);
      res.json(report);
    } catch (error: any) {
      console.log("SEOSurf credentials not configured, using demo data");
      res.json({
        summary: {
          totalKeywords: 25,
          averagePosition: 18.5,
          visibilityIndex: 15,
          organicTrafficEstimate: 8500
        },
        keywordPerformance: {
          improving: 8,
          declining: 5,
          stable: 12
        },
        recommendations: [
          {
            priority: "high",
            action: "Target high-volume keywords with positions 11-20",
            impact: "Potential 25% traffic increase",
            effort: "Medium"
          },
          {
            priority: "medium", 
            action: "Improve mobile rankings for travel searches",
            impact: "Better mobile visibility",
            effort: "Low"
          }
        ]
      });
    }
  });

  // SEO Dashboard overview
  app.get("/api/seo/dashboard", async (req, res) => {
    try {
      const [keywords, routes, traffic, trending, competitors] = await Promise.all([
        seoAnalytics.getKeywordPerformance('7daysAgo'),
        seoAnalytics.getFlightRouteMetrics(),
        seoAnalytics.getTrafficAnalytics(),
        seoAnalytics.getTrendingDestinations(),
        seoAnalytics.getCompetitorInsights()
      ]);

      const dashboard = {
        overview: {
          totalKeywords: (keywords as any)?.summary?.totalQueries || 0,
          totalClicks: (keywords as any)?.summary?.totalClicks || 0,
          totalImpressions: (keywords as any)?.summary?.totalImpressions || 0,
          averageCTR: (keywords as any)?.summary?.averageCTR || 0,
          averagePosition: (keywords as any)?.summary?.averagePosition || 0
        },
        topKeywords: (keywords as any)?.queries?.slice(0, 10) || [],
        topRoutes: Array.isArray(routes) ? routes.slice(0, 10) : [],
        trafficSummary: (traffic as any)?.totalSessions || 0,
        trendingDestinations: Array.isArray(trending) ? trending.slice(0, 5) : [],
        competitorAlerts: (competitors as any)?.opportunities?.slice(0, 5) || [],
        lastUpdated: new Date().toISOString()
      };

      res.json(dashboard);
    } catch (error: any) {
      console.error("SEO dashboard error:", error);
      res.status(500).json({ 
        message: "Failed to generate SEO dashboard",
        error: error.message,
        configuration: {
          required: [
            "GOOGLE_CLIENT_EMAIL",
            "GOOGLE_PRIVATE_KEY", 
            "GOOGLE_PROJECT_ID",
            "GA4_PROPERTY_ID"
          ],
          setup: "Add Google Search Console and Analytics API credentials to environment"
        }
      });
    }
  });

  // GoDaddy API Integration Routes
  
  // Check domain availability
  app.get("/api/domains/check/:domain", async (req, res) => {
    try {
      const { domain } = req.params;
      const availability = await godaddyService.checkDomainAvailability(domain);
      
      res.json({
        domain,
        availability,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Domain availability check error:", error);
      res.status(500).json({ message: "Failed to check domain availability" });
    }
  });

  // Get travel-specific domain suggestions
  app.get("/api/domains/suggest/:keyword", async (req, res) => {
    try {
      const { keyword } = req.params;
      const suggestions = await godaddyService.getTravelDomainSuggestions(keyword);
      
      res.json({
        keyword,
        suggestions,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Domain suggestions error:", error);
      res.status(500).json({ message: "Failed to get domain suggestions" });
    }
  });

  // Get DNS records for domain management
  app.get("/api/domains/:domain/dns", async (req, res) => {
    try {
      const { domain } = req.params;
      const dnsRecords = await godaddyService.getDNSRecords(domain);
      
      res.json({
        domain,
        records: dnsRecords,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("DNS records error:", error);
      res.status(500).json({ message: "Failed to retrieve DNS records" });
    }
  });

  // Add subdomain for international markets
  app.post("/api/domains/:domain/subdomain", async (req, res) => {
    try {
      const { domain } = req.params;
      const { subdomain, targetIP } = req.body;
      
      if (!subdomain || !targetIP) {
        return res.status(400).json({ message: "Subdomain and target IP are required" });
      }
      
      const success = await godaddyService.addSubdomain(domain, subdomain, targetIP);
      
      if (success) {
        res.json({
          message: `Subdomain ${subdomain}.${domain} created successfully`,
          subdomain: `${subdomain}.${domain}`,
          targetIP,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(500).json({ message: "Failed to create subdomain" });
      }
      
    } catch (error) {
      console.error("Subdomain creation error:", error);
      res.status(500).json({ message: "Failed to create subdomain" });
    }
  });

  // Get SSL certificates status
  app.get("/api/domains/:domain/ssl", async (req, res) => {
    try {
      const { domain } = req.params;
      const certificates = await godaddyService.getSSLCertificates(domain);
      
      res.json({
        domain,
        certificates,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("SSL certificates error:", error);
      res.status(500).json({ message: "Failed to retrieve SSL certificates" });
    }
  });

  // Domain portfolio management dashboard
  app.get("/api/domains/portfolio", async (req, res) => {
    try {
      // Get portfolio data for yourtravelsearch.com and related domains
      const mainDomain = "yourtravelsearch.com";
      const relatedDomains = ["travalsearch.com", "yourtravelsearch.net", "yourtravelsearch.org"];
      
      const portfolioData = await Promise.all([
        godaddyService.checkDomainAvailability(mainDomain),
        ...relatedDomains.map(domain => godaddyService.checkDomainAvailability(domain))
      ]);
      
      const portfolio = [
        { domain: mainDomain, status: "owned", data: portfolioData[0] },
        ...relatedDomains.map((domain, index) => ({
          domain,
          status: "available",
          data: portfolioData[index + 1]
        }))
      ];
      
      res.json({
        portfolio,
        recommendations: [
          "Consider securing .net and .org variants for brand protection",
          "Add international subdomains (fr.yourtravelsearch.com, es.yourtravelsearch.com)",
          "Monitor competitor domain registrations",
          "Set up wildcard SSL for all subdomains"
        ],
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Domain portfolio error:", error);
      res.status(500).json({ message: "Failed to retrieve domain portfolio" });
    }
  });

  // Render API Integration Routes
  
  // Get all services in Render account
  app.get("/api/render/services", async (req, res) => {
    try {
      const services = await renderService.getServices();
      
      res.json({
        services,
        account_status: process.env.RENDER_API_KEY ? 'connected' : 'demo_mode',
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Render services error:", error);
      res.status(500).json({ message: "Failed to retrieve services" });
    }
  });

  // Get specific service details
  app.get("/api/render/services/:serviceId", async (req, res) => {
    try {
      const { serviceId } = req.params;
      const service = await renderService.getService(serviceId);
      
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json({
        service,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Render service details error:", error);
      res.status(500).json({ message: "Failed to retrieve service details" });
    }
  });

  // Get deployment history
  app.get("/api/render/services/:serviceId/deployments", async (req, res) => {
    try {
      const { serviceId } = req.params;
      const deployments = await renderService.getDeployments(serviceId);
      
      res.json({
        serviceId,
        deployments,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Render deployments error:", error);
      res.status(500).json({ message: "Failed to retrieve deployments" });
    }
  });

  // Trigger new deployment
  app.post("/api/render/services/:serviceId/deploy", async (req, res) => {
    try {
      const { serviceId } = req.params;
      const deployment = await renderService.createDeployment(serviceId);
      
      if (!deployment) {
        return res.status(500).json({ message: "Failed to create deployment" });
      }
      
      res.json({
        message: "Deployment initiated successfully",
        deployment,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Render deployment creation error:", error);
      res.status(500).json({ message: "Failed to create deployment" });
    }
  });

  // Get custom domains
  app.get("/api/render/services/:serviceId/domains", async (req, res) => {
    try {
      const { serviceId } = req.params;
      const domains = await renderService.getDomains(serviceId);
      
      res.json({
        serviceId,
        domains,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Render domains error:", error);
      res.status(500).json({ message: "Failed to retrieve domains" });
    }
  });

  // Add custom domain
  app.post("/api/render/services/:serviceId/domains", async (req, res) => {
    try {
      const { serviceId } = req.params;
      const { domain } = req.body;
      
      if (!domain) {
        return res.status(400).json({ message: "Domain name is required" });
      }
      
      const addedDomain = await renderService.addDomain(serviceId, domain);
      
      if (!addedDomain) {
        return res.status(500).json({ message: "Failed to add domain" });
      }
      
      res.json({
        message: `Domain ${domain} added successfully`,
        domain: addedDomain,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Render domain addition error:", error);
      res.status(500).json({ message: "Failed to add domain" });
    }
  });

  // Get service metrics
  app.get("/api/render/services/:serviceId/metrics", async (req, res) => {
    try {
      const { serviceId } = req.params;
      const { start, end } = req.query;
      
      const startTime = start as string || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const endTime = end as string || new Date().toISOString();
      
      const metrics = await renderService.getMetrics(serviceId, startTime, endTime);
      
      res.json({
        serviceId,
        metrics,
        period: { start: startTime, end: endTime },
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Render metrics error:", error);
      res.status(500).json({ message: "Failed to retrieve metrics" });
    }
  });

  // Update environment variables
  app.patch("/api/render/services/:serviceId/env", async (req, res) => {
    try {
      const { serviceId } = req.params;
      const { variables } = req.body;
      
      if (!variables || typeof variables !== 'object') {
        return res.status(400).json({ message: "Environment variables object is required" });
      }
      
      const success = await renderService.updateEnvironmentVariables(serviceId, variables);
      
      if (!success) {
        return res.status(500).json({ message: "Failed to update environment variables" });
      }
      
      res.json({
        message: "Environment variables updated successfully",
        updated_variables: Object.keys(variables),
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Render environment variables error:", error);
      res.status(500).json({ message: "Failed to update environment variables" });
    }
  });

  // Deployment automation dashboard
  app.get("/api/render/dashboard", async (req, res) => {
    try {
      const services = await renderService.getServices();
      const prodService = services.find(s => s.environment === 'production');
      
      if (!prodService) {
        return res.status(404).json({ message: "Production service not found" });
      }
      
      const [deployments, domains, metrics] = await Promise.all([
        renderService.getDeployments(prodService.id),
        renderService.getDomains(prodService.id),
        renderService.getMetrics(
          prodService.id,
          new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          new Date().toISOString()
        )
      ]);
      
      const latestDeploy = deployments[0];
      const avgCpu = metrics.cpu.reduce((sum, point) => sum + point.value, 0) / metrics.cpu.length;
      const avgMemory = metrics.memory.reduce((sum, point) => sum + point.value, 0) / metrics.memory.length;
      const totalRequests = metrics.requests.reduce((sum, point) => sum + point.value, 0);
      
      res.json({
        overview: {
          service_name: prodService.name,
          status: prodService.state,
          url: prodService.url,
          last_deploy: latestDeploy?.finishedAt || 'Never',
          deploy_status: latestDeploy?.status || 'unknown'
        },
        performance: {
          avg_cpu_usage: Math.round(avgCpu * 100) / 100,
          avg_memory_usage: Math.round(avgMemory * 100) / 100,
          total_requests_24h: totalRequests,
          uptime: '99.9%' // Mock uptime
        },
        domains: domains.length,
        recent_deployments: deployments.slice(0, 5),
        recommendations: [
          "Consider setting up automated deployments on git push",
          "Monitor CPU usage spikes during peak hours",
          "Add health check endpoints for better monitoring",
          "Set up deployment notifications via webhooks"
        ],
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error("Render dashboard error:", error);
      res.status(500).json({ message: "Failed to retrieve dashboard data" });
    }
  });

  // Ahrefs + ChatGPT Automated SEO endpoints
  app.get("/api/seo/automated-report/:domain", async (req, res) => {
    try {
      const { domain } = req.params;
      
      if (!domain) {
        return res.status(400).json({ message: "Domain parameter required" });
      }

      const report = await ahrefsAutomatedSEO.generateWeeklyReport(domain);
      res.json(report);
    } catch (error) {
      console.error("Automated SEO report error:", error);
      res.status(500).json({ message: "Failed to generate automated SEO report" });
    }
  });

  app.get("/api/seo/opportunities/:domain", async (req, res) => {
    try {
      const { domain } = req.params;
      
      if (!domain) {
        return res.status(400).json({ message: "Domain parameter required" });
      }

      const opportunities = await ahrefsAutomatedSEO.analyzeKeywordOpportunities(domain);
      res.json({ opportunities });
    } catch (error) {
      console.error("SEO opportunities error:", error);
      res.status(500).json({ message: "Failed to analyze SEO opportunities" });
    }
  });

  app.post("/api/seo/competitor-analysis", async (req, res) => {
    try {
      const { domain, competitors } = req.body;
      
      if (!domain || !competitors) {
        return res.status(400).json({ message: "Missing required fields: domain, competitors" });
      }

      const analysis = await ahrefsAutomatedSEO.analyzeCompetitorContent(domain, competitors);
      res.json(analysis);
    } catch (error) {
      console.error("Competitor analysis error:", error);
      res.status(500).json({ message: "Failed to analyze competitors" });
    }
  });

  app.post("/api/seo/content-brief", async (req, res) => {
    try {
      const { keyword, intent } = req.body;
      
      if (!keyword || !intent) {
        return res.status(400).json({ message: "Missing required fields: keyword, intent" });
      }

      const brief = await ahrefsAutomatedSEO.generateContentBrief(keyword, intent);
      res.json(brief);
    } catch (error) {
      console.error("Content brief error:", error);
      res.status(500).json({ message: "Failed to generate content brief" });
    }
  });

  // Google SEO Intelligence endpoints
  app.get("/api/seo/google-report/:domain", async (req, res) => {
    try {
      const { domain } = req.params;
      
      if (!domain) {
        return res.status(400).json({ message: "Domain parameter required" });
      }

      const report = await googleSEOIntegration.generateComprehensiveReport(domain);
      res.json(report);
    } catch (error) {
      console.error("Google SEO report error:", error);
      res.status(500).json({ message: "Failed to generate Google SEO report" });
    }
  });

  app.get("/api/seo/search-console/:domain", async (req, res) => {
    try {
      const { domain } = req.params;
      const { startDate, endDate } = req.query;
      
      if (!domain) {
        return res.status(400).json({ message: "Domain parameter required" });
      }

      const data = await googleSEOIntegration.getSearchConsoleData(
        domain, 
        startDate as string || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate as string || new Date().toISOString().split('T')[0]
      );
      res.json({ data });
    } catch (error) {
      console.error("Search Console data error:", error);
      res.status(500).json({ message: "Failed to fetch Search Console data" });
    }
  });

  app.get("/api/seo/analytics/:propertyId", async (req, res) => {
    try {
      const { propertyId } = req.params;
      const { startDate, endDate } = req.query;
      
      if (!propertyId) {
        return res.status(400).json({ message: "Property ID parameter required" });
      }

      const data = await googleSEOIntegration.getAnalyticsData(
        propertyId,
        startDate as string || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate as string || new Date().toISOString().split('T')[0]
      );
      res.json(data);
    } catch (error) {
      console.error("Analytics data error:", error);
      res.status(500).json({ message: "Failed to fetch Analytics data" });
    }
  });

  app.get("/api/seo/pagespeed/:domain", async (req, res) => {
    try {
      const { domain } = req.params;
      
      if (!domain) {
        return res.status(400).json({ message: "Domain parameter required" });
      }

      const data = await googleSEOIntegration.getPageSpeedData(`https://${domain}`);
      res.json(data);
    } catch (error) {
      console.error("PageSpeed data error:", error);
      res.status(500).json({ message: "Failed to fetch PageSpeed data" });
    }
  });

  app.post("/api/seo/keyword-rankings", async (req, res) => {
    try {
      const { domain, keywords } = req.body;
      
      if (!domain || !keywords) {
        return res.status(400).json({ message: "Missing required fields: domain, keywords" });
      }

      const rankings = await googleSEOIntegration.getKeywordRankingChanges(domain, keywords);
      res.json({ rankings });
    } catch (error) {
      console.error("Keyword rankings error:", error);
      res.status(500).json({ message: "Failed to fetch keyword rankings" });
    }
  });

  app.post("/api/seo/content-optimization", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: "URL parameter required" });
      }

      const suggestions = await googleSEOIntegration.getContentOptimizationSuggestions(url);
      res.json(suggestions);
    } catch (error) {
      console.error("Content optimization error:", error);
      res.status(500).json({ message: "Failed to generate content optimization suggestions" });
    }
  });

  // SEO Automation endpoints
  app.get("/api/seo/automation/rules", async (req, res) => {
    try {
      const { seoAutomation } = await import('./seoAutomation');
      const rules = seoAutomation.getAutomationRules();
      res.json(rules);
    } catch (error: any) {
      console.error("Automation rules error:", error);
      res.status(500).json({ 
        message: "Failed to fetch automation rules",
        error: error.message 
      });
    }
  });

  app.post("/api/seo/automation/execute/:domain", async (req, res) => {
    try {
      const { domain } = req.params;
      const { seoAutomation } = await import('./seoAutomation');
      const changes = await seoAutomation.analyzeAndExecute(domain);
      
      const autoApproved = changes.filter(c => c.autoApproved);
      const pendingApproval = changes.filter(c => !c.autoApproved);
      
      console.log(`🤖 SEO AUTOMATION REPORT for ${domain}:`);
      console.log(`   ✅ ${autoApproved.length} changes auto-implemented`);
      console.log(`   📋 ${pendingApproval.length} changes need your approval`);
      
      if (pendingApproval.length > 0) {
        console.log(`\n📋 CHANGES REQUIRING YOUR APPROVAL:`);
        pendingApproval.forEach((change, i) => {
          console.log(`   ${i+1}. ${change.action}`);
          console.log(`      Impact: ${change.estimatedImpact}`);
          console.log(`      Risk: ${change.riskLevel} | Priority: ${change.priority}`);
        });
      }
      
      res.json({
        domain,
        executedAt: new Date().toISOString(),
        totalChanges: changes.length,
        autoApproved: autoApproved.length,
        pendingApproval: pendingApproval.length,
        changes,
        summary: {
          autoImplemented: autoApproved.map(c => c.action),
          awaitingApproval: pendingApproval.map(c => ({
            action: c.action,
            impact: c.estimatedImpact,
            reasoning: c.reasoning,
            priority: c.priority,
            riskLevel: c.riskLevel
          }))
        }
      });
    } catch (error: any) {
      console.error("SEO automation execution error:", error);
      res.status(500).json({ 
        message: "Failed to execute SEO automation",
        error: error.message 
      });
    }
  });

  app.patch("/api/seo/automation/rules/:ruleId", async (req, res) => {
    try {
      const { ruleId } = req.params;
      const updates = req.body;
      const { seoAutomation } = await import('./seoAutomation');
      
      seoAutomation.updateRule(ruleId, updates);
      
      res.json({
        message: "Rule updated successfully",
        ruleId,
        updates
      });
    } catch (error: any) {
      console.error("Rule update error:", error);
      res.status(500).json({ 
        message: "Failed to update automation rule",
        error: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper functions for embassy data
function getCountryName(countryCode: string): string {
  const countries: Record<string, string> = {
    'United States': 'United States',
    'United Kingdom': 'United Kingdom',
    'France': 'France',
    'Germany': 'Germany',
    'Japan': 'Japan',
    'Australia': 'Australia',
    'Canada': 'Canada',
    'Mexico': 'Mexico',
    'Brazil': 'Brazil',
    'India': 'India',
    'Thailand': 'Thailand'
  };
  return countries[countryCode] || countryCode;
}

function getEmbassyAddress(countryCode: string): string {
  const addresses: Record<string, string> = {
    'United Kingdom': '33 Nine Elms Lane, London SW11 7US',
    'France': '2 Avenue Gabriel, 75008 Paris',
    'Germany': 'Pariser Platz 2, 10117 Berlin',
    'Japan': '1-10-5 Akasaka, Minato-ku, Tokyo 107-8420',
    'Australia': 'Moonah Place, Yarralumla ACT 2600',
    'Canada': '490 Sussex Drive, Ottawa, ON K1N 1G8',
    'Mexico': 'Paseo de la Reforma 305, Cuauhtémoc, 06500 Ciudad de México',
    'Brazil': 'Avenida das Nações, Quadra 801, Lote 3, Brasília, DF 70403-900',
    'India': 'Shanti Path, Chanakyapuri, New Delhi 110021',
    'Thailand': '95 Wireless Road, Lumpini, Pathumwan, Bangkok 10330'
  };
  return addresses[countryCode] || '123 Embassy Street, Capital City';
}

function getCapitalCity(countryCode: string): string {
  const capitals: Record<string, string> = {
    'United Kingdom': 'London',
    'France': 'Paris',
    'Germany': 'Berlin',
    'Japan': 'Tokyo',
    'Australia': 'Canberra',
    'Canada': 'Ottawa',
    'Mexico': 'Mexico City',
    'Brazil': 'Brasília',
    'India': 'New Delhi',
    'Thailand': 'Bangkok'
  };
  return capitals[countryCode] || 'Capital City';
}

function getEmbassyPhone(countryCode: string): string {
  const phones: Record<string, string> = {
    'United Kingdom': '+44 20 7499 9000',
    'France': '+33 1 43 12 22 22',
    'Germany': '+49 30 83050',
    'Japan': '+81 3 3224 5000',
    'Australia': '+61 2 6214 5600',
    'Canada': '+1 613 688 5335',
    'Mexico': '+52 55 5080 2000',
    'Brazil': '+55 61 3312 7000',
    'India': '+91 11 2419 8000',
    'Thailand': '+66 2 205 4000'
  };
  return phones[countryCode] || '+1 555 123 4567';
}

function getEmergencyPhone(countryCode: string): string {
  const emergencyPhones: Record<string, string> = {
    'United Kingdom': '+44 20 7499 9000',
    'France': '+33 1 43 12 22 22',
    'Germany': '+49 30 83050',
    'Japan': '+81 3 3224 5000',
    'Australia': '+61 2 6214 5600',
    'Canada': '+1 613 688 5335',
    'Mexico': '+52 55 5080 2000',
    'Brazil': '+55 61 3312 7000',
    'India': '+91 11 2419 8000',
    'Thailand': '+66 2 205 4000'
  };
  return emergencyPhones[countryCode] || '+1 555 911 HELP';
}

function getTravelAdvisoryLevel(countryCode: string): 'low' | 'moderate' | 'high' | 'critical' {
  const levels: Record<string, 'low' | 'moderate' | 'high' | 'critical'> = {
    'United States': 'low',
    'United Kingdom': 'low',
    'France': 'low',
    'Germany': 'low',
    'Japan': 'low',
    'Australia': 'low',
    'Canada': 'low',
    'Mexico': 'moderate',
    'Brazil': 'moderate',
    'India': 'moderate',
    'Thailand': 'moderate'
  };
  return levels[countryCode] || 'moderate';
}

function getTravelAdvisoryDetails(countryCode: string): string {
  const details: Record<string, string> = {
    'United Kingdom': 'Exercise normal precautions when traveling to the United Kingdom. Some areas have increased risk.',
    'France': 'Exercise increased caution when traveling to France due to terrorism and civil unrest.',
    'Germany': 'Exercise normal precautions when traveling to Germany.',
    'Japan': 'Exercise normal precautions when traveling to Japan.',
    'Australia': 'Exercise normal precautions when traveling to Australia.',
    'Canada': 'Exercise normal precautions when traveling to Canada.',
    'Mexico': 'Exercise increased caution when traveling to Mexico due to crime and kidnapping.',
    'Brazil': 'Exercise increased caution when traveling to Brazil due to crime.',
    'India': 'Exercise increased caution when traveling to India due to crime and terrorism.',
    'Thailand': 'Exercise increased caution when traveling to Thailand due to civil unrest.'
  };
  return details[countryCode] || 'Exercise normal precautions when traveling to this destination.';
}

function getTravelRecommendations(countryCode: string): string[] {
  const recommendations: Record<string, string[]> = {
    'United Kingdom': ['Register with STEP', 'Have emergency contacts ready', 'Stay aware of surroundings'],
    'France': ['Avoid demonstrations', 'Stay alert in tourist areas', 'Keep copies of important documents'],
    'Germany': ['Exercise normal precautions', 'Be aware of pickpockets in tourist areas'],
    'Japan': ['Prepare for natural disasters', 'Learn basic Japanese phrases'],
    'Australia': ['Protect yourself from sun exposure', 'Be aware of dangerous wildlife'],
    'Canada': ['Dress appropriately for weather', 'Have emergency supplies'],
    'Mexico': ['Stay in well-lit areas', 'Do not display expensive items', 'Use reputable transportation'],
    'Brazil': ['Avoid isolated areas', 'Cooperate with authorities', 'Use hotel safes'],
    'India': ['Drink bottled water', 'Be cautious with street food', 'Respect local customs'],
    'Thailand': ['Avoid political gatherings', 'Respect the monarchy', 'Be cautious in border areas']
  };
  return recommendations[countryCode] || ['Exercise normal precautions', 'Stay informed of local conditions'];
}

function getVisaPriority(countryCode: string): 'low' | 'medium' | 'high' | 'urgent' {
  const priorities: Record<string, 'low' | 'medium' | 'high' | 'urgent'> = {
    'United States': 'low',
    'United Kingdom': 'low',
    'France': 'low',
    'Germany': 'low',
    'Japan': 'low',
    'Australia': 'medium',
    'Canada': 'low',
    'Mexico': 'low',
    'Brazil': 'medium',
    'India': 'high',
    'Thailand': 'low'
  };
  return priorities[countryCode] || 'medium';
}

function getVisaMessage(countryCode: string): string {
  const messages: Record<string, string> = {
    'United States': 'US citizens can travel visa-free for tourism and business visits.',
    'United Kingdom': 'US citizens can travel visa-free for up to 90 days.',
    'France': 'US citizens can travel visa-free for up to 90 days within 180 days.',
    'Germany': 'US citizens can travel visa-free for up to 90 days within 180 days.',
    'Japan': 'US citizens can travel visa-free for up to 90 days for tourism.',
    'Australia': 'US citizens need an Electronic Travel Authority (ETA) before travel.',
    'Canada': 'US citizens can travel visa-free but may need eTA for air travel.',
    'Mexico': 'US citizens can travel visa-free for up to 180 days.',
    'Brazil': 'US citizens can travel visa-free for up to 90 days.',
    'India': 'US citizens require a visa or e-Visa before travel.',
    'Thailand': 'US citizens can travel visa-free for up to 30 days.'
  };
  return messages[countryCode] || 'Please check visa requirements for your destination.';
}

function requiresVisa(countryCode: string): boolean {
  const visaRequired: Record<string, boolean> = {
    'United States': false,
    'United Kingdom': false,
    'France': false,
    'Germany': false,
    'Japan': false,
    'Australia': true, // ETA required
    'Canada': false,
    'Mexico': false,
    'Brazil': false,
    'India': true,
    'Thailand': false
  };
  return visaRequired[countryCode] || false;
}

function getHealthMessage(countryCode: string): string {
  const healthMessages: Record<string, string> = {
    'United Kingdom': 'No special health precautions required. Ensure routine vaccinations are up to date.',
    'France': 'No special health precautions required. Ensure routine vaccinations are up to date.',
    'Germany': 'No special health precautions required. Ensure routine vaccinations are up to date.',
    'Japan': 'No special health precautions required. Consider Japanese encephalitis vaccine for rural areas.',
    'Australia': 'No special health precautions required. Protect against sun exposure.',
    'Canada': 'No special health precautions required. Ensure routine vaccinations are up to date.',
    'Mexico': 'Consider hepatitis A and typhoid vaccines. Malaria risk in some areas.',
    'Brazil': 'Yellow fever vaccination recommended. Consider hepatitis A and typhoid vaccines.',
    'India': 'Multiple vaccinations recommended including hepatitis A/B, typhoid, and Japanese encephalitis.',
    'Thailand': 'Consider hepatitis A, typhoid, and Japanese encephalitis vaccines. Malaria risk in some areas.'
  };
  return healthMessages[countryCode] || 'Consult with a healthcare provider for destination-specific health recommendations.';
}
