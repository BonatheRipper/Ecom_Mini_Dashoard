import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Ordershared from "../components/Ordershared";
import { useStateContext } from "../../context/Statecontext";
import { PaystackButton } from "react-paystack";
import { useState } from "react";
const Paystack = () => {
  const { user, orderPay, successPay, paymentDispatch } = useStateContext();
  const navigate = useNavigate();
  const [paystackey, setPaystackey] = useState();
  const { orderId } = useParams();
  useEffect(() => {
    const getOrder = async () => {
      try {
        paymentDispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${user.token}` },
        });
        paymentDispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (e) {
        paymentDispatch({ type: "FETCH_FAIL", payload: e });
      }
    };
    if (!user) {
      navigate("/login");
    }
    if (
      !orderPay._id ||
      successPay ||
      (orderPay._id && orderPay._id) !== orderId
    ) {
      getOrder();
      if (successPay) {
        paymentDispatch({ type: "PAY_RESET" });
      }
    } else {
      const loadGateWayKey = async () => {
        const { data: gatewayKey } = await axios.get(
          `/api/keys/${orderPay.PaymentMethod.toLowerCase()}`,
          {
            headers: { authorization: `Bearer ${user.token}` },
          }
        );
        setPaystackey(gatewayKey);
      };
      loadGateWayKey();
    }
  }, [orderPay, user, successPay, orderId, navigate, paymentDispatch]);
  console.log(orderPay, user);
  const componentProps = {
    email: user.email,
    amount: orderPay.totalPrice * 100,
    metadata: {
      name: orderPay.ShippingDetails ? orderPay.ShippingDetails.Fname : "",
      username: user.username,
    },
    publicKey: paystackey || "pk_test_3f37de2c084b51042eef9bb9aec6394c111abe20",
    text: "Pay Now (paystack)",
    onSuccess: () => onPayStackApprove(),
    onClose: () => alert("Wait! You need this oil, don't go!!!!"),
  };
  console.log(componentProps);
  function onPayStackApprove() {
    const updateOrder = async () => {
      try {
        paymentDispatch({ type: "PAY_REQUEST" });

        const { data } = await axios.put(
          `/api/orders/${orderId}/pay`,
          {
            email_address: user.email,
            update_time: `${Date.now()}`,
            status: "Paid",
            id: orderPay._id,
          },
          {
            headers: { authorization: `Bearer ${user.token}` },
          }
        );
        paymentDispatch({ type: "PAY_SUCCESS", payload: data });
        alert("order is paid");
        navigate(`/order/${orderId}`);
      } catch (e) {
        paymentDispatch({ type: "PAY_FAIL", payload: e });
      }
    };
    updateOrder();
  }

  function btn() {
    return (
      <PaystackButton
        className="w-full cursor-pointer hover:bg-c-gold p-4 hover:text-c-green bg-transparent border text-c-gold border-c-gold"
        {...componentProps}
      />
    );
  }
  return <Ordershared order={orderPay} button={btn()} />;
};

export default Paystack;
