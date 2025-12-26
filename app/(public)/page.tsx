export default function HomePage() {
  return (
    <main
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/bg.jpg')",
      }}
    >
      {/* Beige overlay */}
      <div className="absolute inset-0 bg-[#F5F0E6]/20"></div>

      {/* Content */}
      <div className="relative flex min-h-screen items-center justify-center px-12">
        <div className="max-w-md text-right ml-150">
          <h1 className="text-4xl font-bold mb-4 text-brown-900">
            Welcome to Daisy Brew!
          </h1>

         <p className="text-lg text-brown-700 mb-20 italic text-center max-w-sm mx-auto">
            "Crafting comfort in every cup."
          </p>

          <div className="flex gap-4 justify-center">
            <a
              href="/login"
              className="px-6 py-3 rounded-full border-2 bg-brown-800 text-beige font-semibold shadow-lg hover:bg-brown-900 hover:scale-105 transition"
            >
              Login
            </a>

            <a
              href="/register"
              className="px-6 py-3 rounded-full border-2 border-brown-800 text-brown-900 font-semibold hover:bg-brown-800 hover:text-beige hover:scale-105 transition"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
