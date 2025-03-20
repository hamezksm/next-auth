"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSettings, FiUser, FiLogOut, FiBell, FiGrid } from "react-icons/fi";

interface UserData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export default function Dashboard() {
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState("overview");
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
            return;
        }

        const fetchUserData = async () => {
            try {
                const res = await fetch("/api/user/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const data = await res.json();
                setUser(data.user);
            } catch (error) {
                console.error("Error fetching user data:", error);
                localStorage.removeItem("token");
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const initiateLogout = () => {
        setShowLogoutModal(true);
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const confirmLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                await fetch("/api/auth/logout", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            localStorage.removeItem("token");
            router.push("/login");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation Bar */}
            <nav className="bg-white px-6 py-4 shadow-md">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
                            NextAuth
                        </h1>
                        <div className="hidden md:flex space-x-4">
                            <button
                                onClick={() => setActiveSection("overview")}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    activeSection === "overview"
                                        ? "bg-purple-100 text-purple-700"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveSection("analytics")}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    activeSection === "analytics"
                                        ? "bg-purple-100 text-purple-700"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                Analytics
                            </button>
                            <button
                                onClick={() => setActiveSection("settings")}
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    activeSection === "settings"
                                        ? "bg-purple-100 text-purple-700"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                Settings
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 rounded-full hover:bg-gray-100">
                            <FiBell className="h-5 w-5 text-gray-600" />
                        </button>
                        <div className="relative">
                            <button className="flex items-center space-x-2 focus:outline-none">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-semibold">
                                    {user?.firstName?.charAt(0)}
                                </div>
                                <span className="hidden md:block font-medium text-gray-700">
                                    {user?.firstName} {user?.lastName}
                                </span>
                            </button>
                        </div>
                        <button
                            onClick={initiateLogout}
                            className="p-2 rounded-full hover:bg-gray-100"
                            title="Logout"
                        >
                            <FiLogOut className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-br from-purple-600 to-blue-500 rounded-xl p-6 mb-8 text-white shadow-lg">
                    <h2 className="text-2xl font-bold">
                        Welcome back, {user?.firstName}!
                    </h2>
                    <p className="mt-1 text-purple-100">
                        Here&apos;s what&apos;s happening with your account
                        today.
                    </p>
                </div>

                {/* Dashboard Content Sections */}
                {activeSection === "overview" && (
                    <>
                        {/* Stats Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Total Logins
                                        </p>
                                        <h3 className="text-3xl font-bold text-gray-800 mt-1">
                                            24
                                        </h3>
                                    </div>
                                    <div className="p-3 bg-purple-100 rounded-full">
                                        <FiUser className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <p className="text-xs text-green-600 flex items-center">
                                        <span>↑ 14% from last month</span>
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Security Score
                                        </p>
                                        <h3 className="text-3xl font-bold text-gray-800 mt-1">
                                            85%
                                        </h3>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <FiSettings className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div
                                            className="bg-blue-600 h-2.5 rounded-full"
                                            style={{ width: "85%" }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Active Sessions
                                        </p>
                                        <h3 className="text-3xl font-bold text-gray-800 mt-1">
                                            1
                                        </h3>
                                    </div>
                                    <div className="p-3 bg-indigo-100 rounded-full">
                                        <FiGrid className="h-6 w-6 text-indigo-600" />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <p className="text-xs text-gray-600 flex items-center">
                                        <span>
                                            Last login: Today at 10:24 AM
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Account Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Account Information
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Full Name
                                        </p>
                                        <p className="mt-1 text-gray-900">
                                            {user?.firstName} {user?.lastName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Email Address
                                        </p>
                                        <p className="mt-1 text-gray-900">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            User ID
                                        </p>
                                        <p className="mt-1 text-gray-900">
                                            {user?.id}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">
                                            Account Created
                                        </p>
                                        <p className="mt-1 text-gray-900">
                                            March 19, 2025
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    <button className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 font-medium transition-colors">
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeSection === "analytics" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Analytics
                        </h3>
                        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                            <p className="text-gray-500">
                                Analytics data will be displayed here
                            </p>
                        </div>
                    </div>
                )}

                {activeSection === "settings" && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Settings
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-md font-medium text-gray-800">
                                    Account Security
                                </h4>
                                <div className="mt-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-700">
                                                Change Password
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Last changed 30 days ago
                                            </p>
                                        </div>
                                        <button className="text-purple-600 hover:text-purple-800 font-medium">
                                            Update
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-700">
                                                Two-Factor Authentication
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Not enabled
                                            </p>
                                        </div>
                                        <button className="text-purple-600 hover:text-purple-800 font-medium">
                                            Enable
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-200">
                                <h4 className="text-md font-medium text-gray-800">
                                    Notifications
                                </h4>
                                <div className="mt-4 space-y-4">
                                    <div className="flex items-center">
                                        <input
                                            id="email-notifications"
                                            name="email-notifications"
                                            type="checkbox"
                                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                            defaultChecked
                                        />
                                        <label
                                            htmlFor="email-notifications"
                                            className="ml-3 text-gray-700"
                                        >
                                            Email Notifications
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="marketing-emails"
                                            name="marketing-emails"
                                            type="checkbox"
                                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                        />
                                        <label
                                            htmlFor="marketing-emails"
                                            className="ml-3 text-gray-700"
                                        >
                                            Marketing Emails
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Logout Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Confirm Logout
                        </h3>
                        <p className="text-gray-600">
                            Are you sure you want to logout?
                        </p>
                        <div className="flex items-center justify-end space-x-4">
                            <button
                                onClick={cancelLogout}
                                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 font-medium transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
