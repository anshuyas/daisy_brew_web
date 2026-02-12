"use client";

import { getAuthToken } from "@/lib/cookie";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import DrinkCustomizer from "@/components/DrinkCustomizer";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

const categories = ["Coffee", "Matcha", "Smoothies", "Bubble Tea", "Tea"];

const menuItems = [
  { name: "Cappuccino", price: 250, image: "/images/cappuccino.jpg" },
  { name: "Americano", price: 150, image: "/images/americano.jpg" },
  { name: "Espresso", price: 100, image: "/images/espresso.jpg" },
  { name: "Latte", price: 200, image: "/images/latte.jpg" },
  { name: "Iced Macchiato", price: 295, image: "/images/iced-macchiato.jpg" },
  { name: "Ristretto", price: 125, image: "/images/ristretto.webp" },
  { name: "Turkish Coffee", price: 230, image: "/images/turkish-coffee.jpg" },
  { name: "Dalgona", price: 210, image: "/images/dalgona.jpg" },
  { name: "Mocha", price: 185, image: "/images/mocha.webp" },
  { name: "Irish Coffee", price: 250, image: "/images/irish-coffee.jpg" },
  { name: "Espresso Con Pana", price: 190, image: "/images/espresso-conpana.jpg" },
  { name: "Affogato", price: 140, image: "/images/affogato.webp" },
];

interface UserData {
  _id: string;
  email: string;
  fullName?: string;
  role: string;
}

export default function DashboardPage() {
  const [activeCategory, setActiveCategory] = useState("Coffee");
  const [user, setUser] = useState<UserData | null>(null);
  const [customizingDrink, setCustomizingDrink] = useState<typeof menuItems[0] | null>(null);
  const [showCart, setShowCart] = useState(false);
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();

  const router = useRouter();

  const toggleCart = () => setShowCart(prev => !prev);

  const handleAddToCart = (drink: any) => {
     const cartItem = {
    ...drink,
    image: drink.image, 
    quantity: drink.quantity || 1,
  };
    addToCart(cartItem); 
    setCustomizingDrink(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = getAuthToken();
      if (!token) return;

      try {
        const response = await axios.get("http://localhost:5050/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex bg-[#8A7356]">
      {/* Sidebar */}
      <aside className="w-25 bg-[#F7D196] flex flex-col items-center py-8 space-y-20">
        <div className="w-12 h-12 bg-[#DCCDB3] rounded-full flex items-center justify-center">
          <img src="/images/logo.png" alt="Logo" className="w-12 h-12" />
        </div>
        <Link href="/dashboard" className="text-2xl">🏠</Link>
        <Link href="/user/orders" className="text-2xl">📋</Link>
        <Link href="/user/notification" className="text-2xl">🔔</Link>
        <Link href="/user/profile" className="text-2xl">👤</Link>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-[#8B7356] text-white flex flex-col">
        {/* Greeting and Cart Icon */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl">
            Good to see you, {user?.fullName || "Username"}!
          </h2>
          <button onClick={toggleCart} className="text-3xl">🛒</button>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex justify-end-safe">
          <div className="flex items-center bg-[#FAF5EE] rounded-full px-6 py-2 w-full md:w-70 text-black">
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent outline-none"
            />
            <button className="ml-2">🔍</button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex space-x-4 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full ${
                activeCategory === cat ? "bg-[#4B2E2B] text-white" : "bg-[#FAF5EE] text-black"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1">
          {menuItems
            .filter(item => item.name.includes(activeCategory) || activeCategory === "Coffee")
            .map(item => (
              <div
                key={item.name}
                className="bg-[#FFFFFF] text-black rounded-2xl p-4 flex flex-col items-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-36 h-32 object-cover mb-2 rounded-xl"
                />
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="mb-2">Rs. {item.price}</p>
                <button
                  className="bg-[#4B2E2B] text-white px-4 py-1 rounded-full"
                  onClick={() => setCustomizingDrink(item)}
                >
                  +
                </button>
              </div>
            ))}
        </div>
      </main>

      {/* Drink Customizer Modal */}
      {customizingDrink && (
        <DrinkCustomizer
          drink={customizingDrink}
          onClose={() => setCustomizingDrink(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart Modal */}
{showCart && (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <div className="bg-[#FAF5EE] w-150 max:w-[900px] h-[85vh] p-8 rounded-2xl flex flex-col space-y-4 shadow-lg">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#4B2E2B]">Your Cart</h2>
        <button onClick={toggleCart} className="text-gray-500 hover:text-gray-800 text-xl">✕</button>
      </div>

      {/* Cart Items */}
      <div className="flex flex-col space-y-4 max-h-[500px] overflow-y-auto">
        {cart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty</p>
        ) : (
          cart.map((item, index) => (
            <div key={index} className="flex items-center bg-white rounded-xl shadow p-3 space-x-3">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
              <div className="flex-1 flex flex-col">
                <p className="font-semibold text-[#4B2E2B]">{item.name}</p>
                <p className="text-gray-500 text-sm">{item.size}, {item.temperature}</p>
                <p className="text-gray-500 text-sm">{item.sugar}, {item.milk}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (item.quantity > 1) {
                      updateQuantity(index, item.quantity - 1);
                    }
                  }}
                  className="px-2 py-1 bg-gray-200 rounded-full hover:bg-gray-300"
                >-</button>

                <span className="w-5 text-center">{item.quantity}</span>

                <button
                   onClick={() => updateQuantity(index, item.quantity + 1)}
                  className="px-2 py-1 bg-gray-200 rounded-full hover:bg-gray-300"
                >+</button>
              </div>

              <button
                onClick={() => removeFromCart(index)}
                className="text-red-500 hover:text-red-700 text-xl ml-2"
              >
                🗑
              </button>

              <p className="font-semibold text-[#4B2E2B] ml-2">Rs. {item.price * item.quantity}</p>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <button
          onClick={() => router.push("/user/checkout")}
          className="mt-4 w-full py-3 bg-[#4B2E2B] text-white font-semibold rounded-xl hover:bg-[#6B4F4B] transition"
        >
          Checkout
        </button>
      )}
    </div>
  </div>
)}

    </div>
  );
}
