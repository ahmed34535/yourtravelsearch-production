/**
 * 3D Secure Challenge Component
 * 
 * Simulates Duffel's createThreeDSecureSession function and challenge flow.
 * This provides a complete testing environment for 3DS authentication.
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, CheckCircle, AlertTriangle, X, Clock } from 'lucide-react';

interface TestBooking {
  id: string;
  type: 'flight' | 'hotel' | 'package';
  amount: number;
  currency: string;
  description: string;
}

interface ThreeDSecureChallengeProps {
  cardId: string;
  booking: TestBooking;
  onCompleted: (sessionId: string) => void;
  onError: (error: any) => void;
}

interface ChallengeState {
  status: 'initializing' | 'challenge_required' | 'challenge_active' | 'completed' | 'failed';
  requiresChallenge: boolean;
  challengeUrl?: string;
  sessionId?: string;
  timeRemaining: number;
}

export function ThreeDSecureChallenge({ cardId, booking, onCompleted, onError }: ThreeDSecureChallengeProps) {
  const [challengeState, setChallengeState] = useState<ChallengeState>({
    status: 'initializing',
    requiresChallenge: false,
    timeRemaining: 300 // 5 minutes
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  // Determine if card requires challenge based on card ID patterns
  const requiresChallenge = () => {
    // Based on test card numbers from DuffelCardForm
    return cardId.includes('challenge') || Math.random() > 0.3; // 70% chance for testing
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency
    }).format(amount / 100);
  };

  // Initialize 3DS session
  useEffect(() => {
    const initializeSession = async () => {
      setProgressValue(20);
      
      try {
        // Simulate Duffel createThreeDSecureSession API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setProgressValue(50);

        const needsChallenge = requiresChallenge();
        const sessionId = `tds_${Date.now().toString(36)}_${Math.random().toString(36).substring(2)}`;

        if (needsChallenge) {
          setChallengeState({
            status: 'challenge_required',
            requiresChallenge: true,
            challengeUrl: `https://acs.testbank.com/challenge/${sessionId}`,
            sessionId,
            timeRemaining: 300
          });
          setProgressValue(75);
        } else {
          setChallengeState({
            status: 'completed',
            requiresChallenge: false,
            sessionId,
            timeRemaining: 300
          });
          setProgressValue(100);
          onCompleted(sessionId);
        }
      } catch (error) {
        setChallengeState(prev => ({ ...prev, status: 'failed' }));
        onError(error);
      }
    };

    initializeSession();
  }, [cardId]);

  // Countdown timer for challenge
  useEffect(() => {
    if (challengeState.status === 'challenge_active' && challengeState.timeRemaining > 0) {
      const timer = setInterval(() => {
        setChallengeState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);

      return () => clearInterval(timer);
    } else if (challengeState.timeRemaining <= 0) {
      setChallengeState(prev => ({ ...prev, status: 'failed' }));
      onError(new Error('3DS challenge timeout'));
    }
  }, [challengeState.status, challengeState.timeRemaining]);

  const startChallenge = () => {
    setChallengeState(prev => ({ ...prev, status: 'challenge_active' }));
    setProgressValue(90);
  };

  const submitVerificationCode = async () => {
    setIsProcessing(true);

    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Test verification logic - use 111-111 for success as per Duffel docs
      if (verificationCode === '111-111' || verificationCode === '111111') {
        setChallengeState(prev => ({ ...prev, status: 'completed' }));
        setProgressValue(100);
        onCompleted(challengeState.sessionId!);
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (error) {
      setChallengeState(prev => ({ ...prev, status: 'failed' }));
      onError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = () => {
    switch (challengeState.status) {
      case 'initializing':
        return <Badge variant="outline" className="bg-blue-50">Initializing</Badge>;
      case 'challenge_required':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Challenge Required</Badge>;
      case 'challenge_active':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700">Active Challenge</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Authenticated</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Session Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              3D Secure Authentication
            </CardTitle>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Authentication Progress</span>
              <span>{progressValue}%</span>
            </div>
            <Progress value={progressValue} className="w-full" />
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Transaction Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Merchant:</span>
                <span>TravelHub (Test)</span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-semibold">{formatAmount(booking.amount, booking.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Booking Type:</span>
                <span className="capitalize">{booking.type}</span>
              </div>
              <div className="flex justify-between">
                <span>Card ID:</span>
                <span className="font-mono text-xs">{cardId}</span>
              </div>
              {challengeState.sessionId && (
                <div className="flex justify-between">
                  <span>Session ID:</span>
                  <span className="font-mono text-xs">{challengeState.sessionId}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Challenge Flow */}
      {challengeState.status === 'challenge_required' && (
        <Card className="border-yellow-200">
          <CardHeader className="bg-yellow-50">
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Authentication Required
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Alert className="mb-4">
              <Shield className="w-4 h-4" />
              <AlertDescription>
                Your bank requires additional verification for this transaction. 
                Click below to start the secure authentication process.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={startChallenge}
              className="w-full"
              size="lg"
            >
              Start 3D Secure Challenge
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Active Challenge */}
      {challengeState.status === 'challenge_active' && (
        <Card className="border-orange-200">
          <CardHeader className="bg-orange-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Enter Verification Code
              </CardTitle>
              <span className="text-sm font-mono text-orange-700">
                {formatTime(challengeState.timeRemaining)}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Test Payment to TravelHub</strong> for{' '}
                <strong>{formatAmount(booking.amount, booking.currency)}</strong>
              </p>
              <p className="text-sm text-blue-700">
                Enter a valid verification code to verify the payment.
              </p>
            </div>

            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Test Mode:</strong> Use code <code className="bg-green-100 px-1 rounded">111-111</code> for successful authentication.
                Any other code will simulate a failed challenge.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <Label htmlFor="verificationCode">Verification Code</Label>
                <Input
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={7}
                  className="text-center text-lg font-mono"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={submitVerificationCode}
                  disabled={!verificationCode || isProcessing}
                  className="flex-1"
                >
                  {isProcessing ? 'Verifying...' : 'Verify'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setChallengeState(prev => ({ ...prev, status: 'failed' }));
                    onError(new Error('User cancelled 3DS challenge'));
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed State */}
      {challengeState.status === 'completed' && (
        <Card className="border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-green-800 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Authentication Successful
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                3D Secure authentication completed successfully. The payment is now ready to be processed.
              </AlertDescription>
            </Alert>

            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Authentication Details</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="text-green-600 font-medium">ready_for_payment</span>
                </div>
                <div className="flex justify-between">
                  <span>Session ID:</span>
                  <span className="font-mono text-xs">{challengeState.sessionId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Authentication Method:</span>
                  <span>3DS 2.0</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Failed State */}
      {challengeState.status === 'failed' && (
        <Card className="border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-800 flex items-center gap-2">
              <X className="w-5 h-5" />
              Authentication Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Alert className="bg-red-50 border-red-200">
              <X className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                3D Secure authentication failed. Please try again or use a different payment method.
              </AlertDescription>
            </Alert>

            <Button
              onClick={() => {
                setChallengeState({
                  status: 'initializing',
                  requiresChallenge: false,
                  timeRemaining: 300
                });
                setVerificationCode('');
                setProgressValue(0);
              }}
              variant="outline"
              className="w-full mt-4"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}