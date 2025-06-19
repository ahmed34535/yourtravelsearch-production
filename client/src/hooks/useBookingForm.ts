import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { errorService, apiRequestWithErrorHandling } from '@/services/errorService';

// Form validation schema following industry standards
const passengerSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s-']+$/, 'First name contains invalid characters'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s-']+$/, 'Last name contains invalid characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .max(100, 'Email must not exceed 100 characters'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must not exceed 15 digits')
    .regex(/^\+?[\d\s-()]+$/, 'Please enter a valid phone number'),
  dateOfBirth: z.string()
    .min(1, 'Date of birth is required')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 0 && age <= 120;
    }, 'Please enter a valid date of birth'),
  passportNumber: z.string()
    .optional()
    .refine((passport) => {
      if (!passport) return true;
      return /^[A-Z0-9]{6,12}$/.test(passport);
    }, 'Passport number must be 6-12 alphanumeric characters'),
});

const bookingFormSchema = z.object({
  passenger: passengerSchema,
  paymentMethod: z.enum(['credit-card', 'debit-card', 'paypal'], {
    required_error: 'Please select a payment method',
  }),
  specialRequests: z.string()
    .max(500, 'Special requests must not exceed 500 characters')
    .optional(),
  agreeToTerms: z.boolean()
    .refine(val => val === true, 'You must agree to the terms and conditions'),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

interface UseBookingFormProps {
  bookingType: 'flight' | 'hotel' | 'package';
  itemId: string;
  onSuccess?: (bookingReference: string) => void;
}

interface BookingState {
  isSubmitting: boolean;
  error: string | null;
  bookingReference: string | null;
}

export function useBookingForm({ bookingType, itemId, onSuccess }: UseBookingFormProps) {
  const { toast } = useToast();
  const [bookingState, setBookingState] = useState<BookingState>({
    isSubmitting: false,
    error: null,
    bookingReference: null,
  });

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      passenger: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        passportNumber: '',
      },
      paymentMethod: undefined,
      specialRequests: '',
      agreeToTerms: false,
    },
    mode: 'onBlur', // Validate on blur for better UX
  });

  const submitBooking = useCallback(async (data: BookingFormData) => {
    setBookingState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const bookingPayload = {
        type: bookingType,
        itemId: parseInt(itemId),
        passengerDetails: JSON.stringify(data.passenger),
        paymentMethod: data.paymentMethod,
        specialRequests: data.specialRequests || null,
        totalPrice: await calculateTotalPrice(bookingType, itemId),
      };

      const response = await apiRequestWithErrorHandling<{ bookingReference: string }>(
        '/api/bookings',
        {
          method: 'POST',
          body: JSON.stringify(bookingPayload),
        }
      );

      const bookingReference = response.bookingReference;
      
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      
      setBookingState({
        isSubmitting: false,
        error: null,
        bookingReference,
      });

      toast({
        title: 'Booking Confirmed',
        description: `Your booking has been confirmed. Reference: ${bookingReference}`,
      });

      onSuccess?.(bookingReference);
    } catch (error) {
      await errorService.logError(error as Error, {
        component: 'BookingForm',
        action: 'submitBooking',
      });

      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred while processing your booking';

      setBookingState({
        isSubmitting: false,
        error: errorMessage,
        bookingReference: null,
      });

      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: errorMessage,
      });
    }
  }, [bookingType, itemId, onSuccess, toast]);

  const resetBooking = useCallback(() => {
    setBookingState({
      isSubmitting: false,
      error: null,
      bookingReference: null,
    });
    form.reset();
  }, [form]);

  return {
    form,
    bookingState,
    submitBooking,
    resetBooking,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
  };
}

// Helper function to calculate total price based on booking type
async function calculateTotalPrice(bookingType: string, itemId: string): Promise<number> {
  try {
    const response = await fetch(`/api/${bookingType}s/${itemId}`);
    if (!response.ok) throw new Error('Failed to fetch item details');
    
    const item = await response.json();
    const basePrice = parseFloat(item.price || item.pricePerNight || '0');
    
    // Add taxes and fees (simplified calculation)
    const taxRate = 0.08; // 8% tax
    const serviceFee = 25; // Fixed service fee
    
    return Math.round((basePrice * (1 + taxRate) + serviceFee) * 100) / 100;
  } catch (error) {
    console.error('Error calculating total price:', error);
    throw new Error('Unable to calculate booking total');
  }
}