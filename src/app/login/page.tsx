"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Changed from next/router
import Link from "next/link";

interface LoginData {
    email: string;
    password: string;
}

export default function Login() {
    const router = useRouter(); // Changed from Router
    const [form, setForm] = useState<LoginData>({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Login failed");
            }

            const data = await res.json();
            
            if (data.token) {
                localStorage.setItem("token", data.token);
                router.push("/dashboard"); // Changed from Router.push
            } else {
                setError(data.message || "Login failed");
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Login failed");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Sign in to your account
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            className="text-sm font-medium text-gray-700 block mb-2"
                            htmlFor="email"
                        >
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                            value={form.email}
                            onChange={(e) =>
                                setForm({ ...form, email: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <label
                                className="text-sm font-medium text-gray-700"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-purple-600 hover:text-purple-800"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            id="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                            value={form.password}
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${
                            isLoading
                                ? "bg-purple-400"
                                : "bg-purple-600 hover:bg-purple-700"
                        }`}
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <div className="text-center mt-8">
                    <p className="text-gray-600">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/signup"
                            className="text-purple-600 font-medium hover:text-purple-800"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
