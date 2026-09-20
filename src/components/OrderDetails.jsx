import React from 'react';
import { Check, Package } from 'lucide-react';

const OrderDetails = ({ orderData, onCancel, isCancelling, isDarkMode }) => {
  const { steps = [], status } = orderData;
  const isOrderCancelled = status?.toLowerCase() === 'cancelled';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5 sm:space-y-6 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 px-1">
        <div className="min-w-0">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#2C221E]'}`}>
            Order Details
          </h1>
          <p className={`text-sm sm:text-base mt-2 break-all font-medium ${isDarkMode ? 'text-white/70' : 'text-[#6B574B]'}`}>
            Order #{orderData.id}
          </p>
        </div>

        <span
          className={`self-start sm:self-auto px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap uppercase ${
            isOrderCancelled
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : isDarkMode
              ? 'bg-white/10 text-white border border-white/20'
              : 'bg-[#D3C5B4] text-[#4A3B32] border border-[#B5A493]'
          }`}
        >
          {status}
        </span>
      </div>





      {!isOrderCancelled && (
        <div className={`border rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm overflow-hidden backdrop-blur-md transition-colors duration-300 ${
          isDarkMode ? 'bg-[#1a1a1a]/60 border-white/10 text-white' : 'bg-[#E6DDD0] border-[#D1C3B2] text-[#2C221E]'
        }`}>
          <h2 className={`text-lg sm:text-xl font-semibold mb-8 sm:mb-10 ${isDarkMode ? 'text-white' : 'text-[#2C221E]'}`}>
            Order Progress
          </h2>

          <div className="relative flex justify-between items-start w-full px-1 sm:px-2">
            {steps.map((stepItem, idx) => {
              const isCompleted = idx < 2;
              const hasPreviousFinished = idx > 0 && idx - 1 < 2;

              return (
                <div
                  key={stepItem.id || idx}
                  className="relative flex-1 flex flex-col items-center min-w-0"
                >
                  {idx > 0 && (
                    <div
                      className={`absolute top-4 sm:top-5 h-[2px] sm:h-[3px] -translate-y-1/2 rounded-full transition-all duration-500 ${
                        hasPreviousFinished && isCompleted
                          ? isDarkMode ? 'bg-white/80' : 'bg-[#4A3B32]'
                          : isDarkMode ? 'bg-white/20' : 'bg-[#4A3B32]/25'
                      }`}
                      style={{
                        left: '-50%',
                        right: '50%',
                      }}
                    />
                  )}

                  <div
                    className={`relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isCompleted
                        ? isDarkMode 
                          ? 'bg-white text-black border-2 border-white shadow-md' 
                          : 'bg-[#4A3B32] border-2 border-[#4A3B32] shadow-md text-white'
                        : isDarkMode 
                          ? 'border-2 border-white/30 bg-transparent text-white/40' 
                          : 'border-2 border-[#4A3B32]/40 bg-[#E6DDD0]'
                    }`}
                  >
                    {isCompleted ? (
                      <Check
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        strokeWidth={3.5}
                      />
                    ) : (
                      <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${isDarkMode ? 'bg-white/30' : 'bg-[#4A3B32]/40'}`} />
                    )}
                  </div>

                  <span
                    className={`text-[11px] sm:text-sm mt-2 sm:mt-3 font-medium transition-colors text-center leading-tight whitespace-nowrap ${
                      isCompleted 
                        ? isDarkMode ? 'text-white font-bold' : 'text-[#2C221E] font-bold' 
                        : isDarkMode ? 'text-white/60' : 'text-[#6B574B]'
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

      <div className={`border rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm backdrop-blur-md transition-colors duration-300 ${
        isDarkMode ? 'bg-[#1a1a1a]/60 border-white/10 text-white' : 'bg-[#E6DDD0] border-[#D1C3B2] text-[#2C221E]'
      }`}>
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
              className={`flex items-center justify-between gap-3 py-3 border-b last:border-b-0 ${
                isDarkMode ? 'border-white/10' : 'border-[#D1C3B2]'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-semibold p-1 text-center shrink-0 leading-tight border ${
                  isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-[#D1C3B2] bg-[#F4EFE6] text-[#2C221E]'
                }`}>
                  Item
                </div>
                <div>
                  <p className="text-sm font-semibold mb-0.5">{productItem.name}</p>
                  <p className={`text-xs sm:text-sm break-words font-medium ${isDarkMode ? 'text-white/70' : 'text-[#6B574B]'}`}>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`border rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm backdrop-blur-md transition-colors duration-300 ${
          isDarkMode ? 'bg-[#1a1a1a]/60 border-white/10 text-white' : 'bg-[#E6DDD0] border-[#D1C3B2] text-[#2C221E]'
        }`}>
          <h3 className="text-lg sm:text-xl font-semibold mb-4">
            Shipping Address
          </h3>

          <div className={`text-xs sm:text-sm space-y-1.5 break-words font-medium ${isDarkMode ? 'text-white/70' : 'text-[#6B574B]'}`}>
            <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-[#2C221E]'}`}>
              {orderData.shippingAddress?.name}
            </p>
            <p>{orderData.shippingAddress?.street}</p>
            <p>{orderData.shippingAddress?.cityState}</p>
            <p>{orderData.shippingAddress?.phone}</p>
          </div>
        </div>

        <div className={`border rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm flex flex-col justify-between backdrop-blur-md transition-colors duration-300 ${
          isDarkMode ? 'bg-[#1a1a1a]/60 border-white/10 text-white' : 'bg-[#E6DDD0] border-[#D1C3B2] text-[#2C221E]'
        }`}>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              Payment
            </h3>
            <p className={`text-xs sm:text-sm capitalize font-medium ${isDarkMode ? 'text-white/70' : 'text-[#6B574B]'}`}>
              {orderData.payment?.method}
            </p>
          </div>

          <div className={`mt-6 pt-4 border-t flex justify-between items-baseline gap-3 ${
            isDarkMode ? 'border-white/10' : 'border-[#D1C3B2]'
          }`}>
            <span className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-white/70' : 'text-[#6B574B]'}`}>
              Total
            </span>
            <span className="text-base sm:text-lg font-bold whitespace-nowrap">
              {orderData.payment?.total}
            </span>
          </div>
        </div>
      </div>

      {!isOrderCancelled && (
        <div className="flex justify-start pt-1 sm:pt-2">
          <button
            onClick={onCancel}
            disabled={isCancelling}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;