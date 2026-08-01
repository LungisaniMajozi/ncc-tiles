import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, Save, Trash2, AlertTriangle } from "lucide-react";
import SuccessView from "../../components/SuccessView";

const Profile = () => {
  const { user, updateUser, deleteAccount } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || ""
  });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setErrorMsg("");
    const res = await deleteAccount();
    if (!res.success) {
      setErrorMsg(res.error);
      setShowConfirmDelete(false);
    }
    setDeleteLoading(false);
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
        
        {/* Danger Zone */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} /> Danger Zone
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Once you delete your account, there is no going back. Please be certain. You can only delete your account if all your orders are either completed or cancelled.
          </p>
          
          {showConfirmDelete ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-red-800 font-semibold mb-3">Are you absolutely sure?</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="flex-1 bg-red-600 text-white py-2 rounded font-semibold hover:bg-red-700 transition flex justify-center items-center"
                >
                  {deleteLoading ? "Deleting..." : "Yes, Delete Account"}
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  disabled={deleteLoading}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="w-full border-2 border-red-600 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-50 transition flex justify-center items-center gap-2"
            >
              <Trash2 size={18} /> Delete Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Profile;
