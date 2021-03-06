import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useStateContext } from "../context/Statecontext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const OrderHistory = () => {
  const { user } = useStateContext();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("/api/orders/history", {
          headers: { authorization: `Bearer ${user.token}` },
        });
        setOrders(data);
      } catch (e) {
        alert(e);
      }
    };

    fetchOrders();
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);
  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }
  function formatDate(date) {
    return [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join("/");
  }

  function handleOrderClick(orderId) {
    navigate(`${orderId}`);
  }
  return (
    <div className="my-20 p-10 w-full bg-[#F1FFFD]  items-center justify-center flex-col flex h-full py-24 px-4">
      <h2 className="text-center text-c-gold font-bold text-2xl mb-6 ">
        Order History
      </h2>
      <div
        onClick
        class="flex w-full lg:w-4/5 justify-center bg-c-gold items-center border px-4 lg:px-2 py-2 border-c-green"
      >
        <h3 class="flex items-center justify-center    text-c-green  font-bold text-lg flex-1">
          Order No.
        </h3>
        <h3 class="flex items-center justify-center    text-c-green  font-bold text-lg flex-1">
          Date
        </h3>
        <h3 class="flex items-center justify-center    text-c-green  font-bold text-lg flex-1">
          Amount
        </h3>
        <h3 class="flex items-center justify-center    text-c-green  font-bold text-lg flex-1">
          Status
        </h3>
      </div>

      {orders.map((order) => {
        return (
          <div
            key={order.orderNo}
            onClick={() => handleOrderClick(order._id)}
            class="flex w-full lg:w-4/5 py-2 justify-center  even:bg-c-gold items-center text-c-green text-base hover:cursor-pointer border-b border-x border-x-c-gold border-b-c-gold hover:bg-c-green hover:text-c-gold transition duration-300"
          >
            <h3 class="flex items-center justify-center  flex-1">
              {order.orderNo}
            </h3>
            <h3 class="flex items-center justify-center  flex-1">
              {formatDate(new Date(order.createdAt))}
            </h3>
            <h3 class="flex items-center justify-center  flex-1">
              ${order.totalPrice}
            </h3>
            <h3 class="flex items-center justify-center  flex-1">
              {order.isPaid ? "Paid" : "Unpaid"}
            </h3>
          </div>
        );
      })}
    </div>
  );
};

export default OrderHistory;
