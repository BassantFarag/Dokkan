import React from 'react';
import { Check, Package } from 'lucide-react';

const OrderDetails = ({ orderData = {}, onCancel, isCancelling }) => {
  const { steps = [], status = '' } = orderData;
  const isOrderCancelled = status.toLowerCase() === 'cancelled';

  const currentStepIndex = orderData.currentStepIndex ?? 1;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 sm:space-y-6 transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 px-1">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-brand-primary">
            Order Details
          </h1>
          <p className="text-sm sm:text-base mt-2 break-all font-medium text-brand-secondary">
            Order #{orderData.id}
          </p>
        </div>

        <span
          className={`self-start sm:self-auto px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap uppercase ${
            isOrderCancelled
              ? 'bg-red-500/20 text-red-500 border border-red-500/30'
              : 'bg-brand-card text-brand-primary border border-brand-border'
          }`}
        >
          {status}
        </span>
      </div>

      {/* Order Progress Tracker */}
      {!isOrderCancelled && steps.length > 0 && (
        <div className="border border-brand-border rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm overflow-hidden backdrop-blur-md bg-brand-card text-brand-primary transition-colors duration-300">
          <h2 className="text-lg sm:text-xl font-semibold mb-8 sm:mb-10 text-brand-primary">
            Order Progress
          </h2>

          <div className="relative flex justify-between items-start w-full px-1 sm:px-2">
            {steps.map((stepItem, idx) => {
              const isCompleted = idx <= currentStepIndex;

              return (
                <div
                  key={stepItem.id || idx}
                  className="relative flex-1 flex flex-col items-center min-w-0"
                >
                  {/* Connecting Line */}
                  {idx < steps.length - 1 && (
                    <div
                      className={`absolute top-4 sm:top-5 left-1/2 w-full h-[2px] sm:h-[3px] -translate-y-1/2 transition-colors duration-300 -z-0 ${
                        idx < currentStepIndex
                          ? 'bg-brand-gold'
                          : 'bg-brand-secondary/30'
                      }`}
                    />
                  )}

                  {/* Step Circle */}
                  <div
                    className={`relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isCompleted
                        ? 'bg-brand-gold border-2 border-brand-gold shadow-md text-brand-main'
                        : 'border-2 border-brand-border bg-brand-main text-brand-secondary'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
                    ) : (
                      <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-brand-secondary/40" />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[11px] sm:text-xs mt-2 font-medium transition-colors text-center leading-tight whitespace-nowrap ${
                      isCompleted
                        ? 'text-brand-primary font-bold'
                        : 'text-brand-secondary'
                    }`}
                  >
                    {stepItem.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Items Section */}
      <div className="border border-brand-border rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm backdrop-blur-md bg-brand-card text-brand-primary transition-colors duration-300">
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
          <Package className="w-5 h-5 shrink-0" />
          <h3 className="text-lg sm:text-xl font-semibold">
            Items
          </h3>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {orderData.items?.map((productItem) => (
            <div
              key={productItem.id}
              className="flex items-center justify-between gap-3 py-3 border-b border-brand-border last:border-b-0"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-semibold p-1 text-center shrink-0 leading-tight border border-brand-border bg-brand-main text-brand-primary">
                  Item
                </div>
                <div>
                  <p className="text-sm font-semibold mb-0.5">{productItem.name}</p>
                  <p className="text-xs sm:text-sm break-words font-medium text-brand-secondary">
                    Qty: {productItem.quantity} × {productItem.price}
                  </p>
                </div>
              </div>

              <span className="text-sm sm:text-base font-bold whitespace-nowrap">
                {productItem.totalPrice}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping & Payment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Shipping Address */}
        <div className="border border-brand-border rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm backdrop-blur-md bg-brand-card text-brand-primary transition-colors duration-300">
          <h3 className="text-lg sm:text-xl font-semibold mb-4">
            Shipping Address
          </h3>

          <div className="text-xs sm:text-sm space-y-1.5 break-words font-medium text-brand-secondary">
            <p className="font-bold text-brand-primary">
              {orderData.shippingAddress?.name}
            </p>
            <p>{orderData.shippingAddress?.street}</p>
            <p>{orderData.shippingAddress?.cityState}</p>
            <p>{orderData.shippingAddress?.phone}</p>
          </div>
        </div>

        {/* Payment Details */}
        <div className="border border-brand-border rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm flex flex-col justify-between backdrop-blur-md bg-brand-card text-brand-primary transition-colors duration-300">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              Payment
            </h3>
            <p className="text-xs sm:text-sm capitalize font-medium text-brand-secondary">
              {orderData.payment?.method}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-brand-border flex justify-between items-baseline gap-3">
            <span className="text-xs sm:text-sm font-medium text-brand-secondary">
              Total
            </span>
            <span className="text-base sm:text-lg font-bold whitespace-nowrap">
              {orderData.payment?.total}
            </span>
          </div>
        </div>
      </div>

      {/* Cancel Action */}
      {!isOrderCancelled && (
        <div className="flex justify-start pt-1 sm:pt-2">
          <button
            onClick={onCancel}
            disabled={isCancelling}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isCancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;