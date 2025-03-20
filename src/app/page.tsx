"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Home() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex flex-col items-center justify-center text-white">
      {/* HEADER */}
      <header className="absolute top-0 left-0 w-full p-5 flex justify-between items-center bg-opacity-10 bg-white backdrop-blur-lg shadow-lg">
        <h1 className="text-3xl font-bold ml-5">NextAuth App</h1>
        <div className="relative">
          <button
            className="bg-white text-purple-700 px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Get Started
          </button>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 bg-white text-purple-700 rounded-lg shadow-xl overflow-hidden"
            >
              <button
                className="block w-full px-6 py-3 text-left hover:bg-purple-100"
                onClick={() => router.push("/signup")}
              >
                Sign Up
              </button>
              <button
                className="block w-full px-6 py-3 text-left hover:bg-purple-100"
                onClick={() => router.push("/login")}
              >
                Login
              </button>
            </motion.div>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl font-extrabold"
        >
          Secure Authentication, Simplified.
        </motion.h1>
        <p className="mt-4 text-lg max-w-xl">
          Experience seamless authentication with our modern, secure, and fast system.
        </p>
      </main>
    </div>
  );
}
