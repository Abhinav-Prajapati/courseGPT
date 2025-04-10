"use client";
import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(error.message);
    } else {
      router.push("/course");
    }
  };

  const loginAsDemoUser = () => {
    setEmail("demo@example.com");
    setPassword("demo123");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-sky-100 to-indigo-200 dark:from-gray-900 dark:to-gray-950 p-4 transition-colors">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        Sign in to{" "}
        <span className="text-indigo-600 dark:text-indigo-400">CourseGPT</span>
      </h1>
      <Card className="w-full max-w-sm shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/30 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Login</CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
            Welcome back! Please enter your credentials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Log In
            </Button>
            <Button type="button" variant="outline" onClick={loginAsDemoUser}>
              Login as Demo User
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
