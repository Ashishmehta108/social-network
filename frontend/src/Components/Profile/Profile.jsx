import { useEffect, useState } from "react";
import { API_URL, MEDIA_URL } from "../../constant/constant";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const API = API_URL;
  const [user, setUser] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;
    const fetchProfile = async () => {
      const res = await fetch(`${API}/profile/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setFormData(data);
      } else {
        console.error("Failed to fetch profile");
      }
    };
    fetchProfile();
  }, []);

  const handleFieldEdit = (field) => setEditingField(field);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (field) => {
    const token = localStorage.getItem("access");
    if (!token) return;

    const value = formData[field];
    if (!value) return;

    setLoading(true);
    const form = new FormData();
    form.append(field, value);

    try {
      const res = await fetch(`${API}/profile/`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        console.error("Profile update failed:", data);
        alert("Error updating profile: " + JSON.stringify(data));
        return;
      }

      setUser(data);
      setFormData(data);
      setEditingField(null);
    } catch (err) {
      console.error("Error saving profile:", err);
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("access");
    if (!token) return;

    setLoading(true);
    const form = new FormData();
    form.append("profile_picture", file);

    try {
      const res = await fetch(`${API}/profile/`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        console.error("Profile picture update failed:", data);
        alert("Error updating picture: " + JSON.stringify(data));
        return;
      }

      setUser(data);
      setFormData(data);
    } catch (err) {
      console.error("Error uploading file:", err);
      setLoading(false);
    }
  };

  const logout = async () => {
    const token = localStorage.getItem("access");
    const res = await fetch(`${API}/logout/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      credentials: "include",
      body: JSON.stringify({ refresh: localStorage.getItem("refresh") }),
    });
    if (res.ok) {
      localStorage.clear();
      navigate("/");
    }
  };

  if (!user)
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="w-full flex sticky top-10 justify-center">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-sm text-center">
        <div className="relative inline-block">
          <img
            src={
              formData.profile_picture instanceof File
                ? URL.createObjectURL(formData.profile_picture)
                : user.profile_picture
                  ? MEDIA_URL + user.profile_picture
                  : "/user.png"
            }
            alt="Profile"
            className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-gray-300"
          />
          <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer">
            <Pencil size={14} className="text-gray-600" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        <div className="mt-4 flex justify-center items-center gap-2">
          {editingField === "full_name" ? (
            <input
              type="text"
              name="full_name"
              value={formData.full_name || ""}
              onChange={handleChange}
              onBlur={() => handleSave("full_name")}
              className="border rounded-md px-2 py-1 text-center text-sm"
              autoFocus
            />
          ) : (
            <>
              <h2 className="text-lg font-semibold">{user.full_name || "No Name"}</h2>
              <button
                onClick={() => handleFieldEdit("full_name")}
                className="text-gray-500 hover:text-gray-700"
              >
                <Pencil size={14} />
              </button>
            </>
          )}
        </div>

        <p className="text-gray-500 text-sm mt-1">{user.email}</p>

        <div className="bg-gray-50 rounded-lg py-2 mt-3 flex justify-center items-center gap-2">
          {editingField === "date_of_birth" ? (
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth || ""}
              onChange={handleChange}
              onBlur={() => handleSave("date_of_birth")}
              className="border rounded-md px-2 py-1 text-center text-sm"
              autoFocus
            />
          ) : (
            <>
              <span className="text-gray-700 text-sm">
                DOB –{" "}
                {user.date_of_birth
                  ? new Date(user.date_of_birth).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  : "Not Set"}
              </span>
              <button
                onClick={() => handleFieldEdit("date_of_birth")}
                className="text-gray-500 hover:text-gray-700"
              >
                <Pencil size={14} />
              </button>
            </>
          )}
        </div>

        {loading && (
          <p className="text-xs text-gray-400 mt-2">Saving changes...</p>
        )}

        <button
          onClick={logout}
          className="mt-4 text-blue-600 hover:underline text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
