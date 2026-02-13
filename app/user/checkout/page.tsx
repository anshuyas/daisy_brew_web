"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { getAuthToken } from "@/lib/cookie";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useNotification } from "@/context/NotificationContext";
import toast from "react-hot-toast";

interface UserData {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart } = useCart();
  const { addNotification } = useNotification();

  const [user, setUser] = useState<UserData>({});
  const [deliveryOption, setDeliveryOption] = useState<"pickup" | "delivery">("delivery");
  const [timeOption, setTimeOption] = useState<"asap" | "later">("asap");
  const [scheduledTime, setScheduledTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("cod");
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getAuthToken();
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:5050/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  const handleConfirmOrder = async () => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Please login first");
      return;
    }
    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsSubmitting(true);

    try {
      // Place order
      const orderData = {
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size || undefined,
          temperature: item.temperature || undefined,
        })),
        total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
        deliveryOption,
        timeOption,
        scheduledTime: timeOption === "later" && scheduledTime ? new Date(scheduledTime) : null,
        paymentMethod,
        customerDetails: {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          address: user.address,
        },
      };

      const resOrder = await axios.post(
        "http://localhost:5050/api/orders",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const orderIdShort = resOrder.data._id.slice(-6);

      const resNotif = await axios.post(
        "http://localhost:5050/api/notifications",
        { message: `Your order #${orderIdShort} is confirmed` },
        { headers: { Authorization: `Bearer ${token}` } }
        );
        
       // Save notification via context 
      addNotification(resNotif.data);

      // Show toast
      toast.success(`Your order #${orderIdShort} is confirmed!`);

      // Clear cart
      localStorage.removeItem("cart");

      // Redirect to dashboard
      router.push("/dashboard");

    } catch (error: any) {
      console.error("Order failed:", error.response?.data || error.message);
      toast.error("Failed to place order: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-linear-to-b from-[#f5f0e6] to-[#f0e0d0] p-6">
      <h1 className="text-4xl font-bold text-[#4B2E2B] text-center mb-8">Checkout</h1>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
        {/* LEFT: User & Options */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-[#4B2E2B]">Your Details</h2>
            <input type="text" placeholder="Full Name" value={user.fullName || ""} onChange={e => setUser(prev => ({ ...prev, fullName: e.target.value }))} className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-[#8A7356] outline-none" />
            <input type="email" placeholder="Email" value={user.email || ""} onChange={e => setUser(prev => ({ ...prev, email: e.target.value }))} className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-[#8A7356] outline-none" />
            <input type="text" placeholder="Phone Number" value={user.phone || ""} onChange={e => setUser(prev => ({ ...prev, phone: e.target.value }))} className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-[#8A7356] outline-none" />
            {deliveryOption === "delivery" && <input type="text" placeholder="Delivery Address" value={user.address || ""} onChange={e => setUser(prev => ({ ...prev, address: e.target.value }))} className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-[#8A7356] outline-none" />}
          </div>

          {/* Order Options */}
          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-[#4B2E2B] mb-6">Order Options</h2>
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
              <div>
                <p className="text-gray-600 mb-1 font-medium">Method</p>
                <div className="flex space-x-2">
                  {["delivery", "pickup"].map(opt => (
                    <button key={opt} onClick={() => setDeliveryOption(opt as "delivery" | "pickup")} className={`px-3 py-1 rounded-full text-sm font-medium border transition ${deliveryOption === opt ? "bg-[#4B2E2B] text-white border-[#4B2E2B]" : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"}`}>
                      {opt === "delivery" ? "Delivery" : "Pickup"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-gray-600 mb-1 font-medium">Time</p>
                <div className="flex space-x-2">
                  {["asap", "later"].map(opt => (
                    <button key={opt} onClick={() => setTimeOption(opt as "asap" | "later")} className={`px-3 py-1 rounded-full text-sm font-medium border transition ${timeOption === opt ? "bg-[#4B2E2B] text-white border-[#4B2E2B]" : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"}`}>
                      {opt === "asap" ? "As Soon As Possible (Now-15 min)" : "Schedule"}
                    </button>
                  ))}
                </div>
                {timeOption === "later" && <input type="datetime-local" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} className="w-full mt-2 p-2 border rounded-xl text-sm focus:ring-2 focus:ring-[#8A7356] outline-none" />}
              </div>

              <div>
                <p className="text-gray-600 mb-1 font-medium">Payment</p>
                <div className="flex space-x-2">
                  {["cod", "online"].map(opt => (
                    <button key={opt} onClick={() => setPaymentMethod(opt as "cod" | "online")} className={`px-3 py-1 rounded-full text-sm font-medium border transition ${paymentMethod === opt ? "bg-[#4B2E2B] text-white border-[#4B2E2B]" : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"}`}>
                      {opt === "cod" ? "Cash on Delivery" : "Online"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Cart Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-[#4B2E2B]">Your Order</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {cart.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <p className="font-medium text-[#4B2E2B]">{item.name} x {item.quantity}</p>
                      <p className="text-gray-500 text-sm">{item.size}, {item.temperature}</p>
                    </div>
                  </div>
                  <p className="font-bold text-[#4B2E2B]">Rs. {item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 font-bold text-xl">
              <span>Total</span>
              <span>Rs. {cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span>
            </div>
            <button
              disabled={isSubmitting}
              onClick={handleConfirmOrder}
              className="w-full mt-4 py-4 bg-[#4B2E2B] text-white font-bold rounded-2xl shadow-lg hover:bg-[#6B4F4B] transition text-xl disabled:opacity-50"
            >
              {isSubmitting ? "Placing Order..." : "Confirm Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
