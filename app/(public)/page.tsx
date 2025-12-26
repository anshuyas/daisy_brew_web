export default function HomePage() {
  return (
    <main
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/background.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-12 md:px-24 py-20">
        <div className="max-w-2xl ml-12 md:ml-100 text-center">
          <div className="mb-6">
            <h1 className="text-6xl md:text-7xl font-bold mb-4 text-white drop-shadow-lg">
              Daisy Brew
            </h1>
            <div className="h-1 w-24 mx-auto bg-linear-to-r from-[#8B5E3C] via-[#BFA68B] to-[#D9C7A5] rounded-full"></div>
          </div>

          <p className="text-2xl md:text-3xl text-white font-light italic mb-8 drop-shadow-md leading-relaxed">
            "Crafting comfort in every cup."
          </p>

          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-xl mx-auto drop-shadow-md leading-relaxed">
            Experience the warmth of handcrafted beverages, made with love and the finest ingredients. Your perfect cup awaits.
          </p>

          <a
            href="/login"
            className="inline-block px-10 py-4 rounded-full bg-linear-to-r from-[#8B5E3C] via-[#BFA68B] to-[#D9C7A5] text-white font-bold text-lg shadow-2xl hover:shadow-[#BFA68B]/50 hover:scale-105 transition-all duration-300 drop-shadow-lg"
          >
            Get Started
          </a>
        </div>
      </div>
    </main>
  );
}
