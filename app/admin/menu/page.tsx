"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import api from "@/lib/api/axios";

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
}

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [form, setForm] = useState<{
    name: string;
    price: string;
    category: string;
    image: File | null;
    preview?: string;
  }>({ name: "", price: "", category: "Coffee", image: null });

  const [filterCategory, setFilterCategory] = useState<string>("All");

  // Fetch menu items
  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/menu");
      setMenuItems(res.data.data);
    } catch (err) {
      console.error("Failed to fetch menu", err);
      alert("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Delete menu item
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    try {
      await api.delete(`/admin/menu/${id}`);
      setMenuItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete menu item");
    }
  };

  // Open modal for Add or Edit
  const openModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setForm({
        name: item.name,
        price: item.price.toString(),
        category: item.category,
        image: null,
        preview: `http://localhost:5050/uploads/${item.image}`,
      });
    } else {
      setEditingItem(null);
      setForm({ name: "", price: "", category: "Coffee", image: null });
    }
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    if (name === "image" && files) {
      setForm((prev) => ({ ...prev, image: files[0], preview: URL.createObjectURL(files[0]) }));
    } else if (name === "price") {
        if (/^\d*\.?\d*$/.test(value)) {
        setForm((prev) => ({ ...prev, price: value }));
      }    
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit Add/Edit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.price) {
      alert("Price is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", Number(form.price).toString());
    formData.append("category", form.category);
    if (form.image) formData.append("image", form.image);

    try {
      if (editingItem) {
        await api.put(`/admin/menu/${editingItem._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Menu item updated successfully");
      } else {
        await api.post("/admin/menu", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Menu item added successfully");
      }
      setIsModalOpen(false);
      fetchMenu();
    } catch (err) {
      console.error(err);
      alert("Failed to save menu item");
    }
  };

  // Toggle availability
  const toggleAvailability = async (item: MenuItem) => {
    try {
      const res = await api.patch(`/admin/menu/${item._id}/availability`, {
        isAvailable: !item.isAvailable,
      });
      setMenuItems((prev) =>
        prev.map((i) =>
          i._id === item._id ? { ...i, isAvailable: res.data.isAvailable } : i
        )
      );
    } catch (err) {
      console.error("Failed to update availability", err);
      alert("Failed to toggle availability");
    }
  };

  const filteredMenu = menuItems.filter((item) =>
    filterCategory === "All" ? true : item.category === filterCategory
  );

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#fff5eb] p-8">
      <h1 className="text-3xl text-[#3c2825] text-center font-bold mb-4">Menu Management</h1>

      <div className="flex justify-between mb-4">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="All">All Categories</option>
          <option value="Coffee">Coffee</option>
          <option value="Matcha">Matcha</option>
          <option value="Smoothies">Smoothies</option>
          <option value="Bubble Tea">Bubble Tea</option>
          <option value="Tea">Tea</option>
        </select>

        <button
          onClick={() => openModal()}
          className="bg-green-600 text-white px-4 py-2 rounded hover:opacity-90"
        >
          + Add Menu Item
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {filteredMenu.map((item) => {
          const filename = item.image.split("/").pop();
          return (
            <div key={item._id} className="bg-white rounded-xl shadow p-4">
              <img
                src={`http://localhost:5050/uploads/${filename}`}
                alt={item.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h2 className="font-semibold text-lg">{item.name}</h2>
              <p className="text-sm text-gray-600">Rs. {item.price}</p>
              <p className="text-sm text-gray-500 mb-2">{item.category}</p>

              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={item.isAvailable}
                  onChange={() => toggleAvailability(item)}
                  className="accent-green-600"
                />
                <span className="text-sm">Available</span>
              </label>

              <div className="flex gap-2">
                <button
                  onClick={() => openModal(item)}
                  className="flex-1 bg-blue-600 text-white py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex-1 bg-red-600 text-white py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">
              {editingItem ? "Edit Menu Item" : "Add Menu Item"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
                className="px-3 py-2 border rounded"
              />
              <input
                type="text"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                step="any"
                min={0}
                required
                className="px-3 py-2 border rounded"
              />
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="px-3 py-2 border rounded"
              >
                <option value="Coffee">Coffee</option>
                <option value="Matcha">Matcha</option>
                <option value="Smoothies">Smoothies</option>
                <option value="Bubble Tea">Bubble Tea</option>
                <option value="Tea">Tea</option>
              </select>

              {/* Custom File Input */}
              <label className="flex items-center gap-3 px-3 py-2 border rounded cursor-pointer bg-gray-50 hover:bg-gray-100">
                <span>{form.image ? form.image.name : "Choose Image"}</span>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                />
              </label>

              <button
                type="submit"
                className="bg-[#4B2E2B] text-white py-2 rounded hover:opacity-90"
              >
                {editingItem ? "Update" : "Add"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}