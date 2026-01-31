"use client";

import { useParams } from "next/navigation";

export default function EditUserPage() {
  const params = useParams();
  const id = params.id;

  return (
    <div className="max-w-xl mx-auto p-6 bg-[#c2b5a4] rounded-xl shadow-md mt-8">
      <h1 className="text-xl font-semibold mb-4">Edit User Page</h1>
      <p className="text-lg">Editing User ID: <span className="font-bold">{id}</span></p>
    </div>
  );
}
