import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById, cancelOrder } from '../api/ordersApi';
import OrderDetails from '../components/OrderDetails';
import { Sun, Moon } from 'lucide-react';

const OrderDetailsPage = () => {
  const { orderId } = useParams();

  const [orderRecord, setOrderRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('dokkan_theme');
    return savedTheme !== null ? JSON.parse(savedTheme) : false;
  });







  const handleThemeToggle = () => {
    setIsDarkMode((prevState) => {
      const updatedTheme = !prevState;
      localStorage.setItem('dokkan_theme', JSON.stringify(updatedTheme));
      return updatedTheme;
    });
  };

  const fetchOrderDetails = async () => {
    if (!orderId) {
      setErrorMessage('Enter a valid order ID in the URL to view order details');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const apiResponse = await getOrderById(orderId);
      const rawOrder =
        apiResponse.data?.data ||
        apiResponse.data?.order ||
        apiResponse.data;

      if (!rawOrder) {
        throw new Error('Order data not found');
      }

      const activeStatus = rawOrder.status || 'Pending';

      const statusStages = [
        'Pending',
        'Confirmed',
        'Processing',
        'Shipped',
        'Delivered',
      ];






      const formattedSteps = statusStages.map((stageTitle, idx) => ({
        id: stageTitle,
        label: stageTitle,
        completed: idx < 2,
      }));

      const productList =
        rawOrder.cartItems ||
        rawOrder.items ||
        rawOrder.orderItems ||
        [];

      const formattedItems = productList.map((prod, idx) => {
        const itemPrice =
          prod.price ||
          prod.product?.price ||
          0;

        const itemQty =
          prod.quantity ||
          prod.qty ||
          1;

        return {
          id: prod._id || prod.id || idx,
          name:
            prod.product?.title ||
            prod.product?.name ||
            prod.title ||
            prod.name ||
            'Item',
          quantity: itemQty,
          price: `EGP ${itemPrice}`,
          totalPrice: `EGP ${itemPrice * itemQty}`,
        };
      });

      const shippingInfo =
        rawOrder.shippingAddress ||
        rawOrder.shipping ||
        {};

      const userInfo = rawOrder.user || {};

      setOrderRecord({
        id: rawOrder._id || rawOrder.id || orderId,
        status: activeStatus,
        steps: formattedSteps,
        items: formattedItems,

        shippingAddress: {
          name:
            shippingInfo.fullName ||
            shippingInfo.name ||
            userInfo.name ||
            'N/A',

          street:
            shippingInfo.details ||
            shippingInfo.street ||
            shippingInfo.address ||
            'N/A',

          cityState:
            [
              shippingInfo.city,
              shippingInfo.governorate,
              shippingInfo.country,
            ]
              .filter(Boolean)
              .join(', ') || 'N/A',

          phone:
            shippingInfo.phone ||
            userInfo.phone ||
            'N/A',
        },

        payment: {
          method:
            rawOrder.paymentMethodType ||
            rawOrder.paymentMethod ||
            'Cash',

          total: `EGP ${
            rawOrder.totalOrderPrice ||
            rawOrder.totalPrice ||
            0
          }`,

          date: rawOrder.createdAt
            ? new Date(rawOrder.createdAt).toLocaleDateString(
                'en-US',
                {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }
              )
            : 'N/A',
        },
      });
    } catch (err) {
      console.error('Error fetching order details:', err);
      setErrorMessage(
        err.response?.data?.message ||
          'Failed to load order details. Please try again later'
      );
    } finally {
      setIsLoading(false);
    }
  };




  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const handleOpenCancelModal = () => {
    setIsCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
  };

  const handleConfirmCancellation = async () => {
    try {
      setIsCancellingOrder(true);
      await cancelOrder(orderId);
      setIsCancelModalOpen(false);
      await fetchOrderDetails();
    } catch (err) {
      console.error('Failed to cancel order:', err);
      alert(
        err.response?.data?.message ||
          'Failed to cancel the order. Please try again later'
      );
    } finally {
      setIsCancellingOrder(false);
    }
  };


  
  if (isLoading) {
    return (
      <div className={`w-full min-h-screen flex items-center justify-center px-4 pt-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-[#EFE8DF] text-[#2C221E]'}`}>
        <p className="text-sm font-semibold animate-pulse text-center">
          Loading order details...
        </p>
      </div>
    );
  }

  if (errorMessage || !orderRecord) {
    return (
      <div className={`w-full min-h-screen flex flex-col items-center justify-center gap-4 p-4 pt-20 transition-colors duration-300 ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-[#EFE8DF] text-[#2C221E]'}`}>
        <p className="text-red-500 text-sm font-semibold text-center">
          {errorMessage}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans relative ${
        isDarkMode
          ? 'bg-[#121212] text-white'
          : 'bg-[#EFE8DF] text-[#2C221E]'
      }`}
    >
      <nav className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 sm:px-8 py-4 border-b transition-colors duration-300 ${
        isDarkMode ? 'bg-black/40 border-white/10 backdrop-blur-md' : 'bg-[#EFE8DF]/90 border-[#D8CCBD] backdrop-blur-md'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#C68B59] flex items-center justify-center text-white font-bold text-sm shadow-sm">
            <span className="text-xs">🛒</span>
          </div>
          <span className="font-bold tracking-wider text-base sm:text-lg">
            Dokkan
          </span>
        </div>

        <div className={`hidden md:flex items-center gap-1 border rounded-full px-3 py-1.5 shadow-inner transition-colors duration-300 ${
          isDarkMode ? 'bg-white/5 border-white/10' : 'bg-[#E6DDD0] border-[#D1C3B2]'
        }`}>
          <Link
            to="/"
            className="px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all opacity-70 hover:opacity-100"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all opacity-70 hover:opacity-100"
          >
            Shop
          </Link>
          <Link
            to="/my-orders"
            className={`relative px-4 py-1.5 text-xs sm:text-sm font-bold rounded-full transition-all ${
              isDarkMode
                ? 'text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.25)] border border-white/20'
                : 'text-[#2C221E] bg-white shadow-sm border border-[#D1C3B2]'
            }`}
          >
            {isDarkMode && <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-white rounded-full blur-[2px]" />}
            My Orders
          </Link>
          <Link
            to="/cart"
            className="px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all opacity-70 hover:opacity-100"
          >
            Carts
          </Link>
          <Link
            to="/wishlist"
            className="px-4 py-1.5 text-xs sm:text-sm font-medium rounded-full transition-all opacity-70 hover:opacity-100"
          >
            Wishlist
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleThemeToggle}
            className={`p-2.5 rounded-full border transition-all cursor-pointer shadow-sm flex items-center justify-center ${
              isDarkMode 
                ? 'bg-white/10 hover:bg-white/20 border-white/10 text-amber-400' 
                : 'bg-[#E6DDD0] hover:bg-[#DCD2C3] border-[#D1C3B2] text-[#2C221E]'
            }`}
            title="Toggle Dark/Light Mode"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#2C221E]" />
            )}
          </button>

          <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors duration-300 ${
            isDarkMode ? 'bg-white/10 border-white/10 text-white' : 'bg-[#E6DDD0] border-[#D1C3B2] text-[#2C221E]'
          }`}>
            <span>Admin</span>
          </div>
        </div>
      </nav>

      <div className="px-3 pt-28 pb-8 sm:px-4 sm:pt-32 sm:pb-10 md:px-8 md:pt-36 md:pb-12 flex justify-center items-start">
        <OrderDetails
          orderData={orderRecord}
          onCancel={handleOpenCancelModal}
          isCancelling={isCancellingOrder}
          isDarkMode={isDarkMode}
        />
      </div>

      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4">
          <div
            className={`rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border transition-colors duration-300 ${
              isDarkMode
                ? 'bg-[#1e1e1e] text-white border-white/10'
                : 'bg-[#EFE8DF] text-[#2C221E] border-[#D1C3B2]'
            }`}
          >
            <h3 className="text-lg sm:text-xl font-bold mb-2">
              Cancel Order?
            </h3>

            <p className={`text-xs sm:text-sm mb-6 leading-relaxed font-medium ${isDarkMode ? 'text-white/80' : 'text-[#6B574B]'}`}>
              Are you sure you want to cancel this order?
              This action cannot be undone.
            </p>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <button
                onClick={handleCloseCancelModal}
                className={`w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors cursor-pointer border ${
                  isDarkMode ? 'bg-white/10 hover:bg-white/20 border-white/10 text-white' : 'bg-[#E6DDD0] hover:bg-[#DCD2C3] border-[#D1C3B2] text-[#2C221E]'
                }`}
                disabled={isCancellingOrder}
              >
                Keep Order
              </button>

              <button
                onClick={handleConfirmCancellation}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                disabled={isCancellingOrder}
              >
                {isCancellingOrder ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;