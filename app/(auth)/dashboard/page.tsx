"use client";

import { getAuthToken } from "@/lib/cookie";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import DrinkCustomizer from "@/components/DrinkCustomizer";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { MenuItem } from "@/types/menu";

const categories = ["Coffee", "Matcha", "Smoothies", "Bubble Tea", "Tea"];

// CartItem type
interface CartItem {
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: "Small" | "Medium" | "Large";
  temperature: "Hot" | "Iced";
  sugar: "No Sugar" | "Less Sugar" | "Normal" | "Extra Sugar";
  milk: "None" | "Oat milk" | "Soy milk" | "Almond milk";
}

const hardcodedMenu: MenuItem[] = [
  // Coffee
  { _id: "hc1", name: "Cappuccino", price: 250, image: "/images/cappuccino.jpg", category: "Coffee", isAvailable: true },
  { _id: "hc2", name: "Americano", price: 150, image: "/images/americano.jpg", category: "Coffee", isAvailable: true },
  { _id: "hc3", name: "Espresso", price: 100, image: "/images/espresso.jpg", category: "Coffee", isAvailable: true },
  { _id: "hc4", name: "Latte", price: 200, image: "/images/latte.jpg", category: "Coffee", isAvailable: true },
  { _id: "hc5", name: "Iced Macchiato", price: 295, image: "/images/iced-macchiato.jpg", category: "Coffee", isAvailable: true },
  { _id: "hc6", name: "Ristretto", price: 125, image: "/images/ristretto.webp", category: "Coffee", isAvailable: true },
  { _id: "hc7", name: "Turkish Coffee", price: 230, image: "/images/turkish-coffee.jpg", category: "Coffee", isAvailable: true },
  { _id: "hc8", name: "Dalgona", price: 210, image: "/images/dalgona.jpg", category: "Coffee", isAvailable: true },
  { _id: "hc9", name: "Mocha", price: 185, image: "/images/mocha.webp", category: "Coffee", isAvailable: true },
  { _id: "hc10", name: "Irish Coffee", price: 250, image: "/images/irish-coffee.jpg", category: "Coffee", isAvailable: true },
  { _id: "hc11", name: "Espresso Con Pana", price: 190, image: "/images/espresso-conpana.jpg", category: "Coffee", isAvailable: true },
  { _id: "hc12", name: "Affogato", price: 140, image: "/images/affogato.webp", category: "Coffee", isAvailable: true },

  // Matcha
  { _id: "hc13", name: "Matcha Latte", price: 300, image: "/images/matcha-latte.avif", category: "Matcha", isAvailable: true },
  { _id: "hc14", name: "Matcha Hot Chocolate", price: 350, image: "/images/matcha-hot-choc.jpg", category: "Matcha", isAvailable: true },
  { _id: "hc15", name: "Vanilla Matcha", price: 380, image: "/images/vanilla-matcha.jpg", category: "Matcha", isAvailable: true },
  { _id: "hc16", name: "Strawberry Matcha", price: 370, image: "/images/strawberry-matcha.png", category: "Matcha", isAvailable: true },
  { _id: "hc17", name: "Coconut Matcha Cloud", price: 400, image: "/images/coconut-matcha-cloud.jpg", category: "Matcha", isAvailable: true },
  { _id: "hc18", name: "Honey Matcha", price: 390, image: "/images/honey-matcha.jpg", category: "Matcha", isAvailable: true },
  { _id: "hc19", name: "Mango Matcha Latte", price: 420, image: "/images/mango-matcha-latte.webp", category: "Matcha", isAvailable: true },

  // Smoothies
  { _id: "hc20", name: "Mango Smoothie", price: 255, image: "/images/mango-smoothie.png", category: "Smoothies", isAvailable: true },
  { _id: "hc21", name: "Kiwi Smoothie", price: 275, image: "/images/kiwi-smoothie.avif", category: "Smoothies", isAvailable: true },
  { _id: "hc22", name: "Apple Smoothie", price: 200, image: "/images/apple-smoothie.png", category: "Smoothies", isAvailable: true },
  { _id: "hc23", name: "Pineapple Smoothie", price: 250, image: "/images/pineapple-smoothie.png", category: "Smoothies", isAvailable: true },
  { _id: "hc24", name: "Watermelon Smoothie", price: 205, image: "/images/watermelon-smoothie.png", category: "Smoothies", isAvailable: true },
  { _id: "hc25", name: "Banana Smoothie", price: 195, image: "/images/banana-smoothie.webp", category: "Smoothies", isAvailable: true },
  { _id: "hc26", name: "Strawberry Smoothie", price: 215, image: "/images/strawberry-smoothie.png", category: "Smoothies", isAvailable: true },
  { _id: "hc27", name: "Blueberry Smoothie", price: 280, image: "/images/blueberry-smoothie.webp", category: "Smoothies", isAvailable: true },
  { _id: "hc28", name: "Cherry Smoothie", price: 290, image: "/images/cherry-smoothie.avif", category: "Smoothies", isAvailable: true },

  // Bubble Tea
  { _id: "hc29", name: "Taro Bubble Tea", price: 200, image: "/images/taro-bubble.jpg", category: "Bubble Tea", isAvailable: true },
  { _id: "hc30", name: "Chocolate Bubble Tea", price: 200, image: "/images/chocolate-bubble.png", category: "Bubble Tea", isAvailable: true },
  { _id: "hc31", name: "Mango Bubble Tea", price: 200, image: "/images/mango-bubble.png", category: "Bubble Tea", isAvailable: true },
  { _id: "hc32", name: "Strawberry Bubble Tea", price: 200, image: "/images/strawberry-bubble.png", category: "Bubble Tea", isAvailable: true },
  { _id: "hc33", name: "HoneyDew Bubble Tea", price: 200, image: "/images/honeydew-bubble.jpg", category: "Bubble Tea", isAvailable: true },
  { _id: "hc34", name: "Coconut Bubble Tea", price: 200, image: "/images/coconut-bubble.webp", category: "Bubble Tea", isAvailable: true },
  { _id: "hc35", name: "Matcha Bubble Tea", price: 200, image: "/images/matcha-bubble.jpg", category: "Bubble Tea", isAvailable: true },

  // Tea
  { _id: "hc36", name: "Black Tea", price: 60, image: "/images/blacktea.jpg", category: "Tea", isAvailable: true },
  { _id: "hc37", name: "Chamomile Tea", price: 100, image: "/images/chamomiletea.avif", category: "Tea", isAvailable: true },
  { _id: "hc38", name: "Ginger Tea", price: 95, image: "/images/gingertea.webp", category: "Tea", isAvailable: true },
  { _id: "hc39", name: "Green Tea", price: 70, image: "/images/greentea.png", category: "Tea", isAvailable: true },
  { _id: "hc40", name: "Hibiscus Tea", price: 100, image: "/images/hibiscustea.jpg", category: "Tea", isAvailable: true },
  { _id: "hc41", name: "Lemon Tea", price: 65, image: "/images/lemontea.jpg", category: "Tea", isAvailable: true },
  { _id: "hc42", name: "Spearmint Tea", price: 110, image: "/images/spearminttea.jpg", category: "Tea", isAvailable: true },
  { _id: "hc43", name: "Milk Tea", price: 65, image: "/images/milktea.jpg", category: "Tea", isAvailable: true },
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
  const [customizingDrink, setCustomizingDrink] = useState<MenuItem | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetchedMenu, setFetchedMenu] = useState<MenuItem[]>([]);

  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  const toggleCart = () => setShowCart(prev => !prev);
  const allMenuItems = [...hardcodedMenu, ...fetchedMenu];

  // Only show available drinks
const availableMenuItems = allMenuItems.filter(item => item.isAvailable !== false);

  const handleAddToCart = (drink: MenuItem, options?: Partial<CartItem>) => {
    const cartItem: CartItem = {
      name: drink.name,
      price: drink.price,
      image: drink.image,
      quantity: options?.quantity || 1,
      size: options?.size || "Medium",
      temperature: options?.temperature || "Hot",
      sugar: options?.sugar || "Normal",
      milk: options?.milk || "None",
    };
    addToCart(cartItem);
    setCustomizingDrink(null);
  };

  // Fetch user info
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

  // Fetch menu from backend and merge with hardcoded
  useEffect(() => {
  const fetchMenu = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/menu"); 
      const backendMenu: MenuItem[] = res.data.data.map((item: any) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        image: `http://localhost:5050${item.image}`, 
        category: item.category,
        isAvailable: item.isAvailable ?? true,
      }));
      setFetchedMenu(backendMenu);
    } catch (err) {
      console.error("Failed to fetch menu:", err);
    }
  };

  fetchMenu();
}, []);

  // Filter menu items by category and search term
 const filteredMenuItems = allMenuItems.filter(item => 
  (item.isAvailable ?? true) &&
  item.category === activeCategory &&
  item.name.toLowerCase().includes(searchTerm.toLowerCase())
);

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          {filteredMenuItems.map(item => (
            <div
              key={item._id || item.name + item.price}
                className={`bg-[#FFFFFF] text-black rounded-2xl p-4 flex flex-col items-center ${
                  (item.isAvailable ?? true) === false ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <img
                  src={item.image.startsWith("http") ? item.image : item.image}
                  alt={item.name}
                  className="w-36 h-32 object-cover mb-2 rounded-xl"
                />
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="mb-2">Rs. {item.price}</p>
                {(item.isAvailable ?? true) === false ? (
                  <span className="text-red-600 font-bold">Out of Stock</span>
                ) : (
                  <button
                    className="bg-[#4B2E2B] text-white px-4 py-1 rounded-full"
                    onClick={() => setCustomizingDrink(item)}
              >
                +
              </button>
                )}
            </div>
          ))}
        </div>
      </main>

      {/* Drink Customizer Modal */}
      {customizingDrink && (
        <DrinkCustomizer
          drink={customizingDrink}
          onClose={() => setCustomizingDrink(null)}
          onAddToCart={(drinkOptions) => handleAddToCart(customizingDrink, drinkOptions)}
        />
      )}

      {/* Cart Modal */}
    {showCart && (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-[#FAF5EE] w-150 max:w-225 h-[85vh] p-8 rounded-2xl flex flex-col space-y-4 shadow-lg">
          
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#4B2E2B]">Your Cart</h2>
        <button onClick={toggleCart} className="text-gray-500 hover:text-gray-800 text-xl">✕</button>
      </div>

      {/* Cart Items */}
      <div className="flex flex-col space-y-4 max-h-125 overflow-y-auto">
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
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="px-2 py-1 bg-gray-200 rounded-full hover:bg-gray-300"
                        disabled={item.quantity <= 1}
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
