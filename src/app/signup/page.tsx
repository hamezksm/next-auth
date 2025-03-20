"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface SignupData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export default function Signup() {
    const [form, setForm] = useState<SignupData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setPasswordError("");
        
        // Client-side password validation
        if (form.password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }
        
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form), // confirmPassword is not included here
            });

            const data = await response.json();
            
            if (response.ok) {
                router.push("/login?registered=true");
            } else {
                setError(data.message || "Signup failed. Please try again.");
            }
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
                    <p className="text-gray-600 mt-2">Join our community today</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                {passwordError && (
                    <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm">
                        {passwordError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2" htmlFor="firstName">
                                First Name
                            </label>
                            <input
                                id="firstName"
                                type="text"
                                required
                                placeholder="John"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                                value={form.firstName}
                                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2" htmlFor="lastName">
                                Last Name
                            </label>
                            <input
                                id="lastName"
                                type="text"
                                required
                                placeholder="Doe"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                                value={form.lastName}
                                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            placeholder="your@email.com"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Must be at least 8 characters long
                        </p>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-2" htmlFor="confirmPassword">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-black"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-lg text-white font-medium transition-colors mt-2 ${
                            isLoading ? "bg-purple-400" : "bg-purple-600 hover:bg-purple-700"
                        }`}
                    >
                        {isLoading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <div className="text-center mt-8">
                    <p className="text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login" className="text-purple-600 font-medium hover:text-purple-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
