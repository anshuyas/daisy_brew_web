export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-beige px-4">
      <h1 className="text-4xl font-bold mb-4 text-brown-900">Welcome to Daisy Brew ☕</h1>
      <p className="text-lg text-brown-700 mb-6">Order your favorite beverages online with ease!</p>
      <div className="flex gap-4">
        <a href="/login" className="px-4 py-2 bg-brown-800 text-beige rounded hover:opacity-90">Login</a>
        <a href="/register" className="px-4 py-2 bg-brown-600 text-beige rounded hover:opacity-90">Sign Up</a>
      </div>
    </main>
  );
}
