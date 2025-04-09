"use client";
import { useAuthStore } from "../store/authStore";

export default function UserProfile() {
  const user = useAuthStore((state) => state.user);

  return (
    <div>{user ? <p>Welcome, {user.email}</p> : <p>Please log in.</p>}</div>
  );
}
