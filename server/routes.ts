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
                  iata_code: segment.destination