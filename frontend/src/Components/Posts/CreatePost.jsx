import React, { useState } from "react";
import { X } from "lucide-react";
import { createPost } from "../../api/posts";

export default function CreatePost({ token, onPostCreated }) {
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", description);
    if (image) formData.append("image", image);

    await createPost(token, formData);
    setDescription("");
    setImage(null);
    setPreview(null);
    onPostCreated(token);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 w-full my-3   mx-auto">
      <h2 className="text-lg font-semibold mb-2">Add Post</h2>

      <div className="border rounded-lg p-2">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="enter the post description"
          className="w-full resize-none outline-none p-2 text-gray-700"
          rows={2}
        />

        {preview && (
          <div className="relative mt-2">
            <img
              src={preview}
              alt="Preview"
              className="rounded-lg w-full object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-3">
        <label className="flex items-center gap-2 text-blue-600 cursor-pointer font-medium">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          
          Add Image
        </label>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white font-medium px-6 py-1.5 rounded-lg hover:bg-blue-700 transition"
        >
          Post
        </button>
      </div>
    </div>
  );
}
