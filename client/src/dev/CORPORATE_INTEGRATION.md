# Corporate Payment Integration Guide

This document outlines the complete implementation of Duffel's corporate card payment system with `secure_corporate_payment` exception using API v2 specifications.

## Implementation Overview

### ✅ Complete Corporate Payment Flow (API v2)
1. **Customer User Management** via `/identity/customer/users` and `/identity/customer/user_groups`
2. **PCI-Compliant Card Storage** via `api.duffel.cards`
3. **Secure Corporate 3DS Session** with `secure_corporate_payment` exception
4. **Order Creation** with `three_d_secure_session_id` and Customer User association

### ✅ Access Points
- **Corporate Environment**: `http://localhost:5000/dev/corporate-checkout`
- **Standard Environment**: `http://localhost:5000/dev/checkout-test`

## Technical Implementation

### API Endpoints Used

#### Customer User Group Creation
```
POST https://api.duffel.com/identity/customer/user_groups
Authorization: Bearer <ACCESS_TOKEN>
Duffel-Version: v2

{
  "name": "Corporate Travel Group"
}
```

#### Customer User Creation
```
POST https://api.duffel.com/identity/customer/users
Authorization: Bearer <ACCESS_TOKEN>
Duffel-Version: v2

{
  "email": "corporate.user@company.com",
  "phone_number": "+44 20 1234 5678",
  "given_name": "Corporate",
  "family_name": "User",
  "group_id": "usg_00009hthhsUZ8W4LxQgkjb"
}
```

#### Card Storage
```
POST https://api.duffel.cards/payments/cards
Authorization: Bearer <ACCESS_TOKEN>
Duffel-Version: v2

{
  "data": {
    "address_city": "London",
    "address_country_code": "GB",
    "address_line_1": "1 Corporate Plaza",
    "address_line_2": "Floor 10",
    "address_postal_code": "EC2A 4RQ",
    "address_region": "London",
    "expiry_month": "03",
    "expiry_year": "30",
    "name": "Corporate Travel Account",
    "number": "4111110116638870",
    "cvc": "123",
    "multi_use": false
  }
}
```

#### Secure Corporate 3DS Session
```
POST https://api.duffel.com/payments/three_d_secure_sessions
Authorization: Bearer <ACCESS_TOKEN>
Duffel-Version: v2

{
  "data": {
    "card_id": "tcd_00009hthhsUZ8W4LxQgkjb",
    "resource_id": "off_00009htYpSCXrwaB9DnUm0",
    "services": [{"id": "sea_00003hthlsHZ8W4LxXjkzo", "quantity": 1}],
    "multi_use": false,
    "exception": "secure_corporate_payment"
  }
}
```

#### Order Creation (API v2 with Customer Users)
```
POST https://api.duffel.com/air/orders
Authorization: Bearer <ACCESS_TOKEN>
Duffel-Version: v2

{
  "data": {
    "users": ["icu_0000AgZitpOnQtd3NQxjwO"],
    "selected_offers": ["off_00009htYpSCXrwaB9DnUm0"],
    "services": [{"id": "sea_00003hthlsHZ8W4LxXjkzo", "quantity": 1}],
    "passengers": [{
      "user_id": "icu_0000AgZitpOnQtd3NQxjwO",
      "title": "mr",
      "given_name": "Corporate",
      "family_name": "Traveller",
      "born_on": "1990-01-01",
      "email": "corporate@company.com",
      "phone_number": "+44 20 1234 5678",
      "gender": "m",
      "identity_documents": [{
        "unique_identifier": "75209451",
        "type": "passport",
        "issuing_country_code": "GB",
        "expires_on": "2030-06-25"
      }]
    }],
    "payments": [{
      "type": "balance",
      "currency": "GBP",
      "amount": "125000",
      "three_d_secure_session_id": "3ds_00004htsssTG8W4LxQgrtp"
    }],
    "metadata": {
      "corporate_booking": "true",
      "booking_environment": "secure_corporate"
    }
  }
}
```

## Corporate Test Cards

### Ready for Payment Cards
- **Visa**: `4111110116638870` → Direct payment (no challenge)
- **Mastercard**: `5555550130659057` → Direct payment (no challenge)
- **American Express**: `378282246310005` → Direct payment (no challenge)

### Failed Payment Cards
- **Visa**: `4242424242424242` → Payment fails with corporate exception
- **Mastercard**: `5555555555554444` → Payment fails with corporate exception

## Security Features

### ✅ Corporate Environment Requirements
- Secure employee login required
- PCI DSS Level 1 compliance
- Corporate card authentication bypass
- TMC/OBT integration ready

### ✅ PCI Compliance
- Card data never touches your servers
- Secure API endpoints for card storage
- Minimal PCI compliance requirements (SAQ-A)
- No raw card data logging or exposure

## Code Architecture

### Components
- `CorporateCardForm.tsx` - PCI-compliant corporate card capture
- `CorporateCheckoutEnvironment.tsx` - Complete corporate booking flow
- `CorporateAPIService.ts` - Production-ready API integration

### Service Integration
```typescript
import { corporateAPI } from '@/dev/services/CorporateAPIService';

// Store corporate card
const cardResponse = await corporateAPI.storeCard(cardData);

// Create secure session
const sessionResponse = await corporateAPI.createSecureCorporateSession({
  card_id: cardResponse.data.id,
  resource_id: offerId,
  services: [],
  multi_use: false,
  exception: 'secure_corporate_payment'
});

// Complete order
const orderResponse = await corporateAPI.createCorporateOrder({
  offerId: offerId,
  threeDSecureSessionId: sessionResponse.data.id
});
```

## Go-Live Checklist

### Development Ready ✅
- [x] Corporate card form with validation
- [x] PCI-compliant card storage simulation
- [x] Secure corporate 3DS session handling
- [x] Order creation with session ID
- [x] Complete error handling
- [x] Test card scenarios

### Production Requirements
- [ ] Duffel API key approval
- [ ] Corporate environment verification
- [ ] PCI compliance assessment
- [ ] Secure login implementation
- [ ] Employee access controls

## Testing Scenarios

### Corporate Payment Flow
1. Select corporate booking
2. Enter corporate card details (or use test cards)
3. Process card via api.duffel.cards
4. Create 3DS session with secure_corporate_payment
5. Complete order with session ID

### Expected Outcomes
- **Ready Cards**: Direct payment without user challenge
- **Failed Cards**: Corporate payment rejection
- **Individual Cards**: May still require 3DS challenge

## API Key Integration

When Duffel approves your API keys:

1. Update `CorporateAPIService.ts`:
```typescript
const corporateAPI = new CorporateAPIService('your_live_api_key');
```

2. The service automatically switches to live mode
3. All endpoints use production Duffel APIs
4. Components work without modification

## Notes

- Corporate cards bypass user authentication challenges
- Individual employee cards may still require 3DS
- Secure environment declaration is mandatory
- All card data is processed through Duffel's PCI infrastructure