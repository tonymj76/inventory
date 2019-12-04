import toastr from 'toastr';
import request from 'helpers/request';
import OrderAPI from 'api/order';

const Paystack = {
  pay: (order, currentUser) => {
    const scriptElem = document.createElement('script');
    scriptElem.onload = () => {
      if (PaystackPop) {
        if (currentUser) {
          if (order.id && order.total_price) {
            const handler = PaystackPop.setup({
              key: process.env.PAYSTACK_TEST_PUBLIC_KEY,
              email: currentUser.email,
              amount: Number(order.total_price).toFixed(2) * 100,
              currency: 'NGN',
              ref: 'OCM'+Math.floor((Math.random() * 10000 *
              new Date().getTime()) + 1),
              // firstname: currentUser.first_name,
              // lastname: currentUser.last_name,

              metadata: {
                custom_fields: [
                  {
                    display_name: 'Order',
                    order_id: order.id,
                  },
                  {
                    display_name: 'User',
                    user_name: currentUser.user_name,
                  },
                ],
              },
              callback: function(response) {
                Paystack.verifyPaymentRef({
                  reference: response.reference,
                  order,
                }).then(() => {
                  toastr.success('Your order has been placed successfully!');
                  return Promise.resolve('Payment verified');
                }).catch((err) => {
                  OrderAPI.deleteOrder(order.id);
                  return Promise.reject(err, 'Payment unverified!!');
                });
              },
              onClose: function() {
                // console.log('window closed');
                // TODO: Confirm that order status is
                // paid, otherwise delete order
              },
            });

            handler.openIframe();
          } else {
            console.error('Order not found!!');
          }
        } else {
          console.error('Current user not found!!');
        }
      } else {
        toastr.warning('Paystack not available');
        // console.log('Paystack not available!!');
      }
    };

    scriptElem.src = 'https://js.paystack.co/v1/inline.js';

    document.head.appendChild(scriptElem);
  },

  verifyPaymentRef: (data) => {
    request({
      method: 'POST',
      url: '/order/verify_payment',
      data,
    }, true).then((res) => {
      // console.log(res);
      toastr.success('Order placed successfully', res);
    }).catch((err) => toastr.warning(err));
    // console.log(err));
  },
};

export default Paystack;
