import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { UserPlus, User } from "lucide-react";
import SuccessView from "../../components/SuccessView";
import API_BASE_URL from "../../config/api";

const AdminManager = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...formData, role: "admin" }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
      } else {
        setErrorMsg(data.detail || "Error adding admin.");
      }
    } catch (err) {
      setErrorMsg("Network error.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-secondary mb-8">
          Admin Manager
        </h1>
        {success ? (
          <SuccessView
            title="Admin Created!"
            message={`${formData.name} was securely added as an Admin.`}
            onContinue={() => {
              setSuccess(false);
              setFormData({ name: "", email: "", password: "" });
            }}
          />
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <UserPlus /> Instantiate System Administrator
            </h2>
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                {errorMsg}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-secondary text-white py-4 rounded-lg font-bold hover:bg-gray-800 mt-6"
              >
                {loading ? "Registering Array..." : "Create Admin Role"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminManager;
