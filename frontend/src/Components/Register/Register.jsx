import { useState, useRef } from "react";
import axios from "axios";
import randomImage from "../../../public/user.png";
import { API_URL } from "../../constant/constant";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
    password2: "",
    date_of_birth: "",
    profile_picture: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(randomImage);

  const changeInput = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleProfileChangeInput = () => {
    profileRef.current.click();
  };

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        profile_picture: file,
      });
      setPreviewImage(URL.createObjectURL(file));
      setErrors({ ...errors, profile: null });
    }
  };

  const handleForm = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!form.profile_picture) {
      return setErrors({ profile: "Profile picture is required" });
    }
    if (form.password !== form.password2) {
      return setErrors({ password: "Passwords do not match" });
    }

    const formData = new FormData();
    formData.append("full_name", form.full_name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("password2", form.password2);
    formData.append("date_of_birth", form.date_of_birth);
    formData.append("profile_picture", form.profile_picture);

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/signup/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("User registered successfully!");
      setForm({
        username: "",
        full_name: "",
        email: "",
        password: "",
        password2: "",
        date_of_birth: "",
        profile_picture: null,
      });
      setPreviewImage(randomImage);
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      navigate("/dashboard");
    } catch (err) {
      const backendErrors = err.response?.data || { general: "Registration failed" };
      setErrors(backendErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-300 flex flex-col items-center justify-center gap-4 py-12">
      <h1 className="text-black font-semibold text-3xl">Join Social Network</h1>
      <form
        onSubmit={handleForm}
        className="w-[80%] sm:w-[65%] md:w-[55%] lg:w-[35%] bg-white px-4 py-8 flex-col items-center rounded-md shadow-md"
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="h-[6rem] w-[6rem] rounded-full bg-gray-300 overflow-hidden">
            <img
              src={previewImage}
              alt="profile"
              className="h-full w-full object-cover rounded-full"
            />
          </div>
          <input
            type="file"
            name="profile_picture"
            className="hidden"
            ref={profileRef}
            onChange={handleProfileChange}
            accept="image/*"
          />
          <button
            type="button"
            className="text-sm py-1 px-3 text-blue-700 font-semibold rounded-md border border-blue-700 hover:bg-blue-50"
            onClick={handleProfileChangeInput}
          >
            Upload Profile Picture
          </button>
          {errors.profile && <p className="text-red-500 text-sm">{errors.profile}</p>}
          {errors.profile_picture && (
            <p className="text-red-500 text-sm">{errors.profile_picture[0]}</p>
          )}
        </div>

        <div className="mt-4 w-full">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            required
            onChange={changeInput}
            className="mt-1 block w-full px-3 py-2 border border-indigo-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name[0]}</p>}
        </div>

        <div className="mt-4 w-full">
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={form.date_of_birth}
            onKeyDown={(e) => e.preventDefault()}
            required
            onChange={changeInput}
            className="mt-1 block w-full px-3 py-2 border border-indigo-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {errors.date_of_birth && (
            <p className="text-red-500 text-sm">{errors.date_of_birth[0]}</p>
          )}
        </div>

        <div className="mt-4 w-full">
          <label className="block text-sm font-medium text-gray-700">Email address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            required
            onChange={changeInput}
            className="mt-1 block w-full px-3 py-2 border border-indigo-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email[0]}</p>}
        </div>

        <div className="mt-4 w-full flex flex-row gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              required
              onChange={changeInput}
              className="mt-1 block w-full px-3 py-2 border border-indigo-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">
                {Array.isArray(errors.password) ? errors.password[0] : errors.password}
              </p>
            )}
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">Re-Password</label>
            <input
              type="password"
              name="password2"
              value={form.password2}
              required
              onChange={changeInput}
              className="mt-1 block w-full px-3 py-2 border border-indigo-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.password2 && (
              <p className="text-red-500 text-sm">{errors.password2[0]}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 py-2 w-full bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-70"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {errors.general && (
          <p className="text-red-500 text-sm mt-2">{errors.general}</p>
        )}
      </form>
    </div>
  );
}
