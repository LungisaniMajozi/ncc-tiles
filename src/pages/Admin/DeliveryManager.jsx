import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2, MapPin } from "lucide-react";

const DeliveryManager = () => {
  const { user } = useAuth();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newTown, setNewTown] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/delivery/");
      if (res.ok) {
        const data = await res.json();
        setLocations(data);
      } else {
        setError("Failed to fetch locations");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (id, newPrice) => {
    setLocations((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, price: Number(newPrice) } : loc))
    );
  };

  const saveLocation = async (loc) => {
    try {
      const res = await fetch(`http://localhost:8000/api/delivery/${loc.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ town: loc.town, price: loc.price }),
      });
      if (res.ok) {
        alert("Saved successfully!");
      } else {
        const data = await res.json();
        alert(`Error: ${data.detail}`);
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const deleteLocation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location?")) return;
    try {
      const res = await fetch(`http://localhost:8000/api/delivery/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (res.ok) {
        setLocations((prev) => prev.filter((loc) => loc.id !== id));
      } else {
        alert("Failed to delete");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const addLocation = async (e) => {
    e.preventDefault();
    if (!newTown || newPrice === "") return;
    try {
      const res = await fetch("http://localhost:8000/api/delivery/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ town: newTown, price: Number(newPrice) }),
      });
      if (res.ok) {
        const data = await res.json();
        setLocations((prev) => [...prev, data].sort((a, b) => a.town.localeCompare(b.town)));
        setNewTown("");
        setNewPrice("");
      } else {
        const data = await res.json();
        alert(`Error: ${data.detail}`);
      }
    } catch (err) {
      alert("Network error");
    }
  };

  if (!user || user.role !== "admin") return <div>Unauthorized</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="text-gray-500 hover:text-primary transition">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-secondary">Delivery Rates Manager</h1>
              <p className="text-sm text-gray-500">Manage delivery towns and prices</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 grid md:grid-cols-3 gap-8">
        {/* Add New Form */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="font-bold text-secondary mb-4 flex items-center">
              <Plus className="mr-2 text-primary" size={20} />
              Add New Location
            </h2>
            <form onSubmit={addLocation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Town Name</label>
                <input
                  type="text"
                  required
                  value={newTown}
                  onChange={(e) => setNewTown(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  placeholder="e.g. Pretoria"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Price (R)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  placeholder="0.00"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add Location
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-bold text-secondary flex items-center">
                <MapPin className="mr-2 text-primary" size={20} />
                Current Locations
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading locations...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : (
              <div className="max-h-[600px] overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 sticky top-0 border-b">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Town</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Price (R)</th>
                      <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {locations.map((loc) => (
                      <tr key={loc.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-700">{loc.town}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={loc.price}
                            onChange={(e) => handlePriceChange(loc.id, e.target.value)}
                            className="w-24 px-2 py-1 border rounded focus:border-primary outline-none"
                          />
                        </td>
                        <td className="px-4 py-3 flex justify-end space-x-2">
                          <button
                            onClick={() => saveLocation(loc)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                            title="Save changes"
                          >
                            <Save size={18} />
                          </button>
                          <button
                            onClick={() => deleteLocation(loc.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {locations.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                          No locations found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryManager;
