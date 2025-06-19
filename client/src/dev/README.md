# Development Payment Testing Environment

This directory contains a complete isolated testing environment for Duffel Cards and 3D Secure integration. The system is designed to be completely separate from the main application and only accessible via direct navigation.

## Architecture

```
client/src/dev/
├── checkout-test/           # Main test environment
│   └── index.tsx           # Complete checkout flow testing
├── components/             # Isolated test components
│   ├── DuffelCardForm.tsx  # PCI-compliant card capture simulation
│   ├── ThreeDSecureChallenge.tsx  # 3DS authentication flow
│   └── PaymentTestScenarios.tsx   # Test data and scenarios
└── README.md              # This file
```

## Features

### ✅ Complete Duffel Cards Integration Simulation
- PCI-compliant card form with full validation
- Real-time card brand detection
- Comprehensive billing address collection
- Test card auto-fill shortcuts

### ✅ 3D Secure Authentication Flow
- Complete 3DS 2.0 challenge simulation
- Test verification codes (111-111 for success)
- Timeout handling and error states
- Progress tracking and session management

### ✅ Test Scenarios
- Official Duffel test card numbers
- Challenge vs non-challenge flows
- Success and failure simulation
- Copy-to-clipboard test data

### ✅ Booking Types
- Flight booking simulation
- Hotel booking simulation  
- Package booking simulation
- Multi-currency support

## Access

The test environment is accessible at:
```
http://localhost:5000/dev/checkout-test
```

**Important**: This route is completely isolated from the main application and requires direct navigation. It will not appear in any navigation menus.

## Test Cards

Based on official Duffel documentation:

| Card Type | Number | Scenario | CVC |
|-----------|--------|----------|-----|
| Visa Challenge | 4242424242424242 | 3DS Required | 123 |
| Visa No Challenge | 4111110116638870 | Direct Payment | 123 |
| Mastercard Challenge | 5555555555554444 | 3DS Required | 123 |
| Mastercard No Challenge | 5555550130659057 | Direct Payment | 123 |
| American Express | 378282246310005 | Variable | 1234 |

## 3DS Verification Codes

- `111-111` or `111111` → Successful authentication
- Any other code → Failed authentication

## Usage Flow

1. **Select Test Booking**: Choose from flight, hotel, or package scenarios
2. **Card Capture**: Enter card details or use test card shortcuts
3. **3DS Authentication**: Complete challenge if required
4. **Payment Processing**: Simulate final payment completion

## Technical Implementation

### Card Form Component
- Simulates @duffel/components DuffelCardForm
- Full form validation and error handling
- Card brand detection and formatting
- PCI compliance patterns

### 3DS Challenge Component
- Simulates createThreeDSecureSession functionality
- Challenge window simulation
- Session timeout handling
- Authentication result processing

### Payment Flow
- Complete end-to-end testing
- Error simulation and handling
- Success state management
- Session ID generation

## Integration Notes

This environment is designed to:
- Test all Duffel Cards functionality without API keys
- Validate UI/UX before going live
- Train team members on the payment flow
- Debug integration issues in isolation

When API keys are approved, components can be moved directly into the live booking flow with minimal changes.

## Security

- No real card data processing
- All test data is clearly marked
- Complete isolation from production code
- PCI compliance patterns implemented

## Development

To modify the test environment:
1. Edit components in `client/src/dev/components/`
2. Update test scenarios in `PaymentTestScenarios.tsx`
3. Modify booking types in `checkout-test/index.tsx`

All changes are automatically reflected via hot reload.