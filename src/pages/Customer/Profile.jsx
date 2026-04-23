import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, Save } from "lucide-react";
import SuccessView from "../../components/SuccessView";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const res = await updateUser(formData);
    if (res.success) {
      setSuccess(true);
    } else {
      setErrorMsg(res.error);
    }
    setLoading(false);
  };

  if (success) {
    return <SuccessView title="Profile Updated" message="Your information has been successfully updated!" onContinue={() => setSuccess(false)} />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-secondary mb-6 text-center">My Profile</h2>
        {errorMsg && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{errorMsg}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2 mt-6"
          >
            {loading ? "Saving..." : <><Save size={18} /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Profile;
