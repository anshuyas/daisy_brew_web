"use client";

import { motion } from "framer-motion";

export default function HomePage() {
  const drinkCategories = [
    { name: "Coffee", emoji: "☕" },
    { name: "Matcha", emoji: "🍵" },
    { name: "Smoothies", emoji: "🥤" },
    { name: "Bubble Tea", emoji: "🧋" },
    { name: "Tea", emoji: "🫖" },
  ];

  const featuredDrinks = [
    { name: "Cappuccino", img: "/images/cappuccino.jpg" },
    { name: "Vanilla Matcha", img: "/images/vanilla-matcha.jpg" },
    { name: "Strawberry Bubble Tea", img: "/images/strawberry-bubble.png" },
    { name: "Mango Smoothie", img: "/images/mango-smoothie.png" },
  ];

  return (
    <main className="bg-[#faf7f2] text-[#2e1f1c] overflow-hidden relative">

     <section className="relative min-h-screen flex flex-col justify-center items-center bg-linear-to-b from-[#4B2E2B] via-[#8B5E3C] to-[#D9C7A5] overflow-hidden">
  <motion.div
    className="absolute top-10 left-10 w-24 h-24 bg-white/20 rounded-full blur-3xl"
    animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
    transition={{ duration: 6, repeat: Infinity }}
  />
  <motion.div
    className="absolute top-1/4 right-20 w-32 h-32 bg-white/15 rounded-full blur-3xl"
    animate={{ y: [0, 25, 0], x: [0, -15, 0] }}
    transition={{ duration: 8, repeat: Infinity }}
  />
  <motion.div
    className="absolute bottom-20 left-1/3 w-28 h-28 bg-white/10 rounded-full blur-3xl"
    animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
    transition={{ duration: 7, repeat: Infinity }}
  />

  {["☕", "🍵", "🥤", "🧋", "🫖"].map((emoji, i) => {
  const top = Math.random() * 80 + 5; 
  const left = Math.random() * 80 + 5; 

  const driftX = (Math.random() - 0.5) * 40; 
  const driftY = -20 - Math.random() * 40; 

  return (
    <motion.div
      key={i}
      className="absolute text-4xl md:text-5xl pointer-events-none"
      initial={{ opacity: 0, y: 0, x: 0 }}
      animate={{
        y: [0, driftY, 0],
        x: [0, driftX, 0],
        rotate: [0, 9, -7, 0], 
        opacity: [0, 1, 0.7, 0],
      }}
      transition={{
        duration: 6 + Math.random() * 4, 
        repeat: Infinity,
        delay: Math.random() * 3,      
      }}
      style={{
        top: `${top}%`,
        left: `${left}%`,
      }}
    >
      {emoji}
    </motion.div>
  );
})}
  <motion.div
    className="relative text-center px-6 max-w-4xl z-10"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
  >
    <motion.h1
      className="text-6xl md:text-7xl font-extrabold text-white mb-4 tracking-tight drop-shadow-2xl"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      Daisy Brew
    </motion.h1>

    <motion.p
      className="text-2xl md:text-3xl text-white font-light mb-6 italic drop-shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    >
      More than coffee. A whole vibe.
    </motion.p>

    <motion.p
      className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed drop-shadow-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.8 }}
    >
      From rich espresso to creamy matcha, refreshing smoothies, bubble tea, and teas — discover handcrafted drinks made to brighten your day.
    </motion.p>

    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <motion.a
        href="/register"
        className="px-10 py-4 rounded-full bg-transparent border-2 border-white text-white font-semibold shadow-2xl hover:scale-105 hover:bg-white hover:text-[#4B2E2B] transition duration-300"
        whileHover={{ scale: 1.08 }}
      >
        Join Daisy Club
      </motion.a>
    </div>
  </motion.div>
</section>

      <section className="py-24 px-6 md:px-24">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">Our Drinks</h2>
          <p className="text-lg text-gray-600">Crafted for every mood and moment.</p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-10">
          {drinkCategories.map((item, i) => (
            <motion.div
              key={i}
              className="bg-white p-10 rounded-3xl shadow-lg text-center cursor-pointer hover:-translate-y-3 hover:shadow-2xl transition duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-5xl mb-4">{item.emoji}</div>
              <h3 className="text-xl font-semibold">{item.name}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-[#f1e7dc] py-24 px-6 md:px-24">
        <motion.div className="text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-bold mb-4">Customer Favorites</h2>
          <div className="w-24 h-1 bg-[#4B2E2B] mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-10">
          {featuredDrinks.map((item, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-3xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <img src={item.img} alt={item.name} className="h-72 w-full object-cover" />
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
                <motion.a
                  href="/register"
                  className="inline-block mt-4 px-6 py-2 bg-[#4B2E2B] text-white rounded-full hover:bg-[#6B4F4B] transition duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  Order Now
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-linear-to-r from-[#8B5E3C] via-[#BFA68B] to-[#D9C7A5] text-white py-20 text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6">Ready to Sip Something Amazing?</h2>
          <p className="text-lg mb-10 text-white/90">
            Order now and enjoy your favorite drinks delivered fresh.
          </p>
          <motion.a
            href="/register"
            className="px-12 py-4 bg-white text-[#4B2E2B] font-bold rounded-full shadow-xl hover:scale-105 transition duration-300"
            whileHover={{ scale: 1.05 }}
          >
            Start Ordering
          </motion.a>
        </motion.div>
      </section>

      <footer className="bg-[#2b1b19] text-white py-12 text-center">
        <h3 className="text-2xl font-semibold mb-4">Daisy Brew</h3>
        <p className="text-white/70">Coffee • Matcha • Smoothies • Bubble Tea • Tea</p>
        <p className="mt-6 text-sm text-white/50">© {new Date().getFullYear()} Daisy Brew. All rights reserved.</p>
      </footer>
    </main>
  );
}