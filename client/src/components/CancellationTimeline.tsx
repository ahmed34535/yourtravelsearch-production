import { CheckCircle, Clock, X } from 'lucide-react';

interface TimelineItemProps {
  hasDot?: boolean;
  dotColor?: 'green' | 'orange' | 'red' | 'grey';
  lineColorLeft?: 'green' | 'orange' | 'red' | 'grey';
  lineColorRight?: 'green' | 'orange' | 'red' | 'grey';
  label?: string;
  description?: string;
  aboveDot?: string | React.ReactNode;
}

interface CancellationTimelineItem {
  before: string;
  refund_amount: string;
  refund_currency: string;
}

interface CancellationTimelineProps {
  cancellationTimeline: CancellationTimelineItem[];
  totalAmount: string;
  currency: string;
  checkInDate: string;
  bookingDate?: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  hasDot = false,
  dotColor = 'grey',
  lineColorLeft = 'grey',
  lineColorRight = 'grey',
  label,
  description,
  aboveDot
}) => {
  const getDotIcon = () => {
    switch (dotColor) {
      case 'green':
        return <CheckCircle className="h-4 w-4 text-green-600 fill-current" />;
      case 'orange':
        return <Clock className="h-4 w-4 text-orange-600 fill-current" />;
      case 'red':
        return <X className="h-4 w-4 text-red-600 fill-current" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    }
  };

  const getLineColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-400';
      case 'orange':
        return 'bg-orange-400';
      case 'red':
        return 'bg-red-400';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="flex flex-col items-center relative min-w-0 flex-1">
      {/* Above dot content */}
      {aboveDot && (
        <div className="mb-2 text-xs text-gray-600 text-center whitespace-nowrap">
          {aboveDot}
        </div>
      )}
      
      {/* Timeline line and dot */}
      <div className="flex items-center w-full h-1 relative">
        {/* Left line */}
        <div className={`h-1 flex-1 ${getLineColor(lineColorLeft)}`} />
        
        {/* Dot */}
        {hasDot && (
          <div className="relative z-10 flex items-center justify-center">
            {getDotIcon()}
          </div>
        )}
        
        {/* Right line */}
        <div className={`h-1 flex-1 ${getLineColor(lineColorRight)}`} />
      </div>
      
      {/* Below dot content */}
      <div className="mt-2 text-center">
        {label && (
          <div className="font-semibold text-sm text-gray-900">{label}</div>
        )}
        {description && (
          <div className="text-xs text-gray-600 mt-1">{description}</div>
        )}
      </div>
    </div>
  );
};

export const CancellationTimeline: React.FC<CancellationTimelineProps> = ({
  cancellationTimeline,
  totalAmount,
  currency,
  checkInDate,
  bookingDate = new Date().toISOString()
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const formatAmount = (amount: string, curr: string) => {
    return `${curr}${parseFloat(amount).toFixed(2)}`;
  };

  const getRefundType = (refundAmount: string, totalAmt: string) => {
    const refund = parseFloat(refundAmount);
    const total = parseFloat(totalAmt);
    
    if (refund === total) return 'full';
    if (refund > 0) return 'partial';
    return 'none';
  };

  const renderTimelineItems = () => {
    const items: React.ReactNode[] = [];
    
    // Booking start
    items.push(
      <TimelineItem
        key="booking"
        hasDot={true}
        dotColor="green"
        lineColorLeft="grey"
        lineColorRight={cancellationTimeline.length > 0 ? "green" : "grey"}
        label="Booking"
        description={formatAmount(totalAmount, currency)}
        aboveDot={
          <div>
            <div>{formatDate(bookingDate)}</div>
            <div>{formatTime(bookingDate)}</div>
          </div>
        }
      />
    );

    // Process cancellation timeline
    cancellationTimeline.forEach((item, index) => {
      const refundType = getRefundType(item.refund_amount, totalAmount);
      const isLast = index === cancellationTimeline.length - 1;
      const nextColor = isLast ? "red" : 
        getRefundType(cancellationTimeline[index + 1]?.refund_amount || "0", totalAmount) === 'full' ? "green" :
        getRefundType(cancellationTimeline[index + 1]?.refund_amount || "0", totalAmount) === 'partial' ? "orange" : "red";

      // Timeline section
      items.push(
        <TimelineItem
          key={`section-${index}`}
          hasDot={false}
          lineColorLeft={refundType === 'full' ? "green" : refundType === 'partial' ? "orange" : "red"}
          lineColorRight={refundType === 'full' ? "green" : refundType === 'partial' ? "orange" : "red"}
          label={refundType === 'full' ? "Full refund" : refundType === 'partial' ? "Partial refund" : "No refund"}
          description={formatAmount(item.refund_amount, item.refund_currency)}
        />
      );

      // Deadline dot
      items.push(
        <TimelineItem
          key={`deadline-${index}`}
          hasDot={true}
          dotColor={refundType === 'full' ? "green" : refundType === 'partial' ? "orange" : "red"}
          lineColorLeft={refundType === 'full' ? "green" : refundType === 'partial' ? "orange" : "red"}
          lineColorRight={nextColor}
          label="Deadline"
          aboveDot={
            <div>
              <div>{formatDate(item.before)}</div>
              <div>{formatTime(item.before)}</div>
            </div>
          }
        />
      );
    });

    // Check if we need a no-refund section
    const lastItem = cancellationTimeline[cancellationTimeline.length - 1];
    if (lastItem && new Date(lastItem.before) < new Date(checkInDate)) {
      items.push(
        <TimelineItem
          key="no-refund"
          hasDot={false}
          lineColorLeft="red"
          lineColorRight="red"
          label="No refund"
          description="Non-refundable"
        />
      );
    }

    // Check-in
    items.push(
      <TimelineItem
        key="checkin"
        hasDot={true}
        dotColor="grey"
        lineColorLeft="red"
        lineColorRight="grey"
        label="Check-in"
        description="at the hotel"
        aboveDot={
          <div>
            <div>{formatDate(checkInDate)}</div>
          </div>
        }
      />
    );

    return items;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Cancellation policy</h3>
      
      {/* Policy summary */}
      <div className="space-y-3">
        {cancellationTimeline.map((item, index) => {
          const refundType = getRefundType(item.refund_amount, totalAmount);
          const icon = refundType === 'full' ? 
            <CheckCircle className="h-5 w-5 text-green-600" /> :
            refundType === 'partial' ? 
            <Clock className="h-5 w-5 text-orange-600" /> :
            <X className="h-5 w-5 text-red-600" />;
          
          return (
            <div key={index} className="flex items-start gap-3">
              {icon}
              <div>
                <div className="font-medium">
                  {refundType === 'full' ? 'Full refund' : 
                   refundType === 'partial' ? 'Partial refund' : 'No refund'} — 
                  {refundType !== 'none' ? (
                    <span> If you cancel before {formatDate(item.before)}, {formatTime(item.before)}</span>
                  ) : (
                    <span> After {formatDate(item.before)}, {formatTime(item.before)}</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  {refundType !== 'none' ? 
                    `You will be refunded ${formatAmount(item.refund_amount, item.refund_currency)}.` :
                    'you will not be refunded.'
                  }
                </div>
              </div>
            </div>
          );
        })}
        
        {/* No refund after last deadline */}
        {cancellationTimeline.length > 0 && (
          <div className="flex items-start gap-3">
            <X className="h-5 w-5 text-red-600" />
            <div>
              <div className="font-medium">
                No refund — After {formatDate(cancellationTimeline[cancellationTimeline.length - 1].before)}, {formatTime(cancellationTimeline[cancellationTimeline.length - 1].before)}
              </div>
              <div className="text-sm text-gray-600">
                you will not be refunded.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Visual timeline */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-stretch gap-2 overflow-x-auto min-h-24">
          {renderTimelineItems()}
        </div>
      </div>
    </div>
  );
};