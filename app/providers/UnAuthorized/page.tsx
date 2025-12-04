"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const UnAuthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="text-center p-10 rounded-2xl shadow-lg border border-gray-200 max-w-md"
      >
        <h1 className="text-2xl font-bold text-blue-500 mb-4">Unauthorized Access</h1>
        <p className="text-black text-base mb-6">
          You need to register and log in to access the full features of this website.
        </p>

        <div className="flex gap-4 justify-center">
          <Link 
            href="/auth/register" 
            className="rounded-2xl px-6 py-2 text-white bg-blue-500"
          >
            Register
          </Link>

          <Link
            href="/"
            className="rounded-2xl px-6 py-2 text-black border border-black bg-white"
          >
            More to Explore
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default UnAuthorized;
