"use client";

import { CartItem } from "@/types/drink";
import { useState } from "react";
import { MenuItem } from "@/types/menu";

interface DrinkOption {
  quantity: number;
  size: "Small" | "Medium" | "Large";
  temperature: "Hot" | "Iced";
  sugar: "No Sugar" | "Less Sugar" | "Normal" | "Extra Sugar";
  milk: "None" | "Oat milk" | "Soy milk" | "Almond milk";
}

interface DrinkCustomizerProps {
  drink: MenuItem;
  onClose: () => void;
  onAddToCart: (drink: CartItem) => void;
}

export default function DrinkCustomizer({ drink, onClose, onAddToCart }: DrinkCustomizerProps) {
  // State
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<DrinkOption["size"]>("Medium");
  const [temperature, setTemperature] = useState<DrinkOption["temperature"]>("Hot");
  const [sugar, setSugar] = useState<DrinkOption["sugar"]>("Normal");
  const [milk, setMilk] = useState<DrinkOption["milk"]>("None");

  // Handlers
  const handleQuantity = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleChange = <K extends keyof DrinkOption>(key: K, value: DrinkOption[K]) => {
    switch (key) {
      case "size": setSize(value as DrinkOption["size"]); break;
      case "temperature": setTemperature(value as DrinkOption["temperature"]); break;
      case "sugar": setSugar(value as DrinkOption["sugar"]); break;
      case "milk": setMilk(value as DrinkOption["milk"]); break;
    }
  };

  const handleAddToCart = () => {
    onAddToCart({ name: drink.name, price: drink.price, image: drink.image, quantity, size, temperature, sugar, milk });
    onClose();
  };

  const themeColorMap: Record<string, string> = {
  Coffee: "bg-[#4B2E2B]",      
  Matcha: "bg-[#1A461E]",   
  Smoothies: "bg-orange-300",
  "Bubble Tea": "bg-purple-400",
  Tea: "bg-amber-300",
};
const themeColor = themeColorMap[drink.category] || "bg-gray-600";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-130 max-w-150 h-[95vh] p-8 flex flex-col space-y-3 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{drink.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>

        {/* Image */}
        <div className="flex justify-center items-center">
          <img
            src={drink.image}
            alt={drink.name}
            className="w-64 h-48 object-cover rounded-2xl"
          />
        </div>

        {/* Quantity */}
        <div className="flex items-center justify-between">
          <label className="font-medium">Quantity</label>
          <div className="flex items-center space-x-2">
            <button onClick={() => handleQuantity(-1)} className="px-3 py-1 bg-gray-200 rounded-full">-</button>
            <span>{quantity}</span>
            <button onClick={() => handleQuantity(1)} className="px-3 py-1 bg-gray-200 rounded-full">+</button>
          </div>
        </div>

        {/* Size */}
        <div>
          <label className="font-medium">Size</label>
          <div className="flex space-x-2 mt-1">
            {["Small", "Medium", "Large"].map(s => (
              <button
                key={s}
                className={`px-3 py-1 rounded-full border ${
                  size === s ? `${themeColor} text-white` : "bg-gray-100"
                }`}
                onClick={() => handleChange("size", s as DrinkOption["size"])}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Temperature */}
        <div>
          <label className="font-medium">Temperature</label>
          <div className="flex space-x-2 mt-1">
            {["Hot", "Iced"].map(t => (
              <button
                key={t}
                className={`px-3 py-1 rounded-full border ${
                  temperature === t ? `${themeColor} text-white` : "bg-gray-100"
                }`}
                onClick={() => handleChange("temperature", t as DrinkOption["temperature"])}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Sugar */}
        <div>
          <label className="font-medium">Sugar</label>
          <div className="flex space-x-2 mt-1 flex-wrap">
            {["No Sugar", "Less Sugar", "Normal", "Extra Sugar"].map(s => (
              <button
                key={s}
                className={`px-3 py-1 rounded-full border ${
                  sugar === s ? `${themeColor} text-white` : "bg-gray-100"
                }`}
                onClick={() => handleChange("sugar", s as DrinkOption["sugar"])}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Milk */}
        <div>
          <label className="font-medium">Milk</label>
          <div className="flex space-x-2 mt-1 flex-wrap">
            {["None", "Oat milk", "Soy milk", "Almond milk"].map(m => (
              <button
                key={m}
                className={`px-3 py-1 rounded-full border ${
                  milk === m ? `${themeColor} text-white` : "bg-gray-100"
                }`}
                onClick={() => handleChange("milk", m as DrinkOption["milk"])}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 mt-4">
          <button
            onClick={handleAddToCart}
            className={`flex-1 px-4 py-2 ${themeColor} text-white rounded-xl`}
          >
            Add to Cart
          </button>
          <button
            onClick={() => alert("Buy Now")}
            className={`flex-1 px-4 py-2 ${themeColor} text-white rounded-xl`}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
