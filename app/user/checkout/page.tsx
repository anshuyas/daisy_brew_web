"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { getAuthToken } from "@/lib/cookie";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useNotification } from "@/context/NotificationContext";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import coffeeAnimation from "@/public/animations/coffee_success.json";

interface UserData {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface CartItem {
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  temperature?: string;
  sugar?: string;
  milk?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart: cartContext } = useCart();
  const { addNotification } = useNotification();

  const [user, setUser] = useState<UserData>({});
  const [deliveryOption, setDeliveryOption] = useState<"pickup" | "delivery">("delivery");
  const [addressError, setAddressError] = useState("");
  const [timeOption, setTimeOption] = useState<"asap" | "later">("asap");
  const [scheduledTime, setScheduledTime] = useState("");
  const [paymentMethod] = useState<"cod">("cod");
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  // For Buy Now single item
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    const fetchUser = async () => {
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

  // Parse "Buy Now" item from query
  useEffect(() => {
    const itemParam = searchParams.get("item");
    if (itemParam) {
      try {
        const parsed: CartItem = JSON.parse(decodeURIComponent(itemParam));
        setBuyNowItem(parsed);
      } catch (err) {
        console.error("Failed to parse Buy Now item:", err);
      }
    }
  }, [searchParams]);

  const checkoutItems = buyNowItem ? [buyNowItem] : cartContext;

  const handleConfirmOrder = async () => {
    const token = getAuthToken();
    if (!token) {
      toast.error("Please login first");
      return;
    }

    if (!checkoutItems || checkoutItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

     if (deliveryOption === "delivery" && !user.address?.trim()) {
      setAddressError("Delivery address is required.");
      toast.error("Please enter delivery address");
      return;
    }

    setAddressError("");

    setIsSubmitting(true);

    try {
      const orderData = {
        items: checkoutItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size || undefined,
          temperature: item.temperature || undefined,
          sugar: item.sugar || undefined,
          milk: item.milk || undefined,
        })),
        total: checkoutItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
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

      // Create notification
      const resNotif = await axios.post(
        "http://localhost:5050/api/notifications",
        { message: `Your order #${orderIdShort} is confirmed` },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      addNotification(resNotif.data);

      toast.success(`Your order #${orderIdShort} is confirmed!`);

      if (!buyNowItem) localStorage.removeItem("cart");

setShowSuccess(true);
setAnimationFinished(false);
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
            {deliveryOption === "delivery" && (
              <div>
                <input
                  type="text"
                  placeholder="Delivery Address"
                  value={user.address || ""}
                  onChange={e => {
                    setUser(prev => ({ ...prev, address: e.target.value }));
                    setAddressError("");
                  }}
                  className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-[#8A7356] outline-none ${
                    addressError ? "border-red-500" : ""
                  }`}
                />
                {addressError && (
                  <p className="text-red-500 text-sm mt-1">{addressError}</p>
                )}
              </div>
            )}
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
                <button
                  className="px-3 py-1 rounded-full text-sm font-medium border bg-[#4B2E2B] text-white border-[#4B2E2B]"
                >
                  Cash on Delivery
                </button>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Cart / Buy Now Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-[#4B2E2B]">Your Order</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {checkoutItems.map((item, i) => (
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
              <span>Rs. {checkoutItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span>
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
      {showSuccess && (
  <div data-testid="order-success" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-[#d6c3a3] rounded-3xl p-8 text-center shadow-2xl w-[90%] max-w-md">

      {/* Coffee Animation */}
      <div className="w-56 mx-auto">
        <Lottie
          animationData={coffeeAnimation}
          loop={false}
          onComplete={() => setAnimationFinished(true)}
        />
      </div>

      {animationFinished && (
        <div className="mt-4 animate-fadeIn">
          <h2 className="text-2xl font-bold text-[#141111]">
            Your order has been placed!
          </h2>

          <button
            onClick={() => {
              setShowSuccess(false);
              router.push("/dashboard");
            }}
            className="mt-6 px-8 py-3 bg-[#f3eceed5] text-black font-semibold rounded-full hover:bg-[#6B4F4B] transition"
          >
            OK
          </button>
        </div>
      )}
    </div>
  </div>
)}
    </div>
  );
}
