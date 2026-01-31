"use client";

export default function UserProfilePage() {
  return (
    <div className="max-w-xl mx-auto p-6 bg-[#c2b5a4] rounded-xl shadow-md mt-8">
      <h1 className="text-xl font-semibold mb-4">User Profile</h1>
      <p>This is the logged-in user's profile page.</p>

      <div className="mt-4 space-y-2">
        <p><strong>Email:</strong> user@example.com</p>
        <p><strong>Role:</strong> user</p>
      </div>

      <button className="mt-4 px-4 py-2 bg-[#3c2825] text-[#FAF5EE] rounded-md hover:opacity-90">
        Update Profile
      </button>
    </div>
  );
}
