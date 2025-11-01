import { API_URL } from "../constant/constant";
import api from "./auth";

export async function getPosts(token) {
  const { data } = await api.get("/posts/post/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function createPost(token, formData) {
  const { data } = await api.post("/posts/post/", formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function deletePost(token, postId) {
  const { data } = await api.delete("/posts/post/", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: { id: postId }, 
  });
  return data;
}

export async function toggleLike(token, postId) {
  const { data } = await api.post(`/posts/${postId}/like/`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}


export const toggleDislike = async (token, postId) => {
  const res = await fetch(`${API_URL}/posts/${postId}/dislike/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};
