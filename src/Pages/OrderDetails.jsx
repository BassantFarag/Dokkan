import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById, cancelOrder } from '../api/ordersApi';
import OrderDetails from '../components/OrderDetails';

const OrderDetailsPage = () => {
  const { orderId } = useParams();

  const [orderRecord, setOrderRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancellingOrder, setIsCancellingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

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
      <div className="w-full min-h-screen flex items-center justify-center px-4 pt-20 bg-brand-main text-brand-primary transition-colors duration-300">
        <p className="text-sm font-semibold animate-pulse text-center">
          Loading order details...
        </p>
      </div>
    );
  }

  if (errorMessage || !orderRecord) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4 p-4 pt-20 bg-brand-main text-brand-primary transition-colors duration-300">
        <p className="text-red-500 text-sm font-semibold text-center">
          {errorMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-main text-brand-primary transition-colors duration-300 font-sans relative">
      
      {/* Main Content Area */}
      <div className="px-3 pt-24 pb-8 sm:px-4 sm:pt-28 sm:pb-10 md:px-8 md:pt-32 md:pb-12 flex justify-center items-start">
        <OrderDetails
          orderData={orderRecord}
          onCancel={handleOpenCancelModal}
          isCancelling={isCancellingOrder}
        />
      </div>

      {/* Cancel Order Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4">
          <div className="rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-brand-border bg-brand-card text-brand-primary transition-colors duration-300">
            <h3 className="text-lg sm:text-xl font-bold mb-2">
              Cancel Order?
            </h3>

            <p className="text-xs sm:text-sm mb-6 leading-relaxed font-medium text-brand-secondary">
              Are you sure you want to cancel this order?
              This action cannot be undone.
            </p>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <button
                onClick={handleCloseCancelModal}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-xl border border-brand-border bg-brand-main hover:bg-brand-card-hover text-brand-primary transition-colors cursor-pointer"
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