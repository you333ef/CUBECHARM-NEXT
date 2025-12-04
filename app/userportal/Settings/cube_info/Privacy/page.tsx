"use client"
// start skeleton section
import { FaShieldAlt, FaBookOpen, FaCamera, FaUsers } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect, useState } from "react";

const Privacy = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f9fc] to-[#e8f0fe]">
      {/* Hero Section */}
      <div className="px-6 py-16 md:py-24 text-center">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <>
              <Skeleton height={40} width={300} className="mx-auto mb-6" />
              <Skeleton height={20} count={3} width={"80%"} className="mx-auto" />
            </>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Privacy &<br />Security Policy
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                At CUBECHARM, we prioritize your privacy and security. Our commitment to trust ensures your data is protected with the highest standards of care and responsibility.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 pb-16 space-y-12">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
                <Skeleton height={30} width={250} className="mb-6" />
                <Skeleton count={3} height={20} />
              </div>
            ))
          : (
            <>
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] text-white p-3 rounded-xl">
                    <FaShieldAlt className="text-2xl" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Protecting Your Data</h2>
                </div>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>
                    We use advanced encryption and SSL/TLS protocols to keep your data secure at all times.
                    Your information is never shared without consent, and our team follows strict privacy policies.
                    Regular audits ensure ongoing protection and trust for every user.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] text-white p-3 rounded-xl">
                    <FaBookOpen className="text-2xl" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Post Approval Process</h2>
                </div>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>
                    All posts are reviewed swiftly to ensure they meet our standards and community values.
                    This process prevents spam or harmful content and keeps the platform smooth for everyone.
                    Your cooperation helps maintain a safe and respectful space.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] text-white p-3 rounded-xl">
                    <FaCamera className="text-2xl" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Reasons for Post Rejection</h2>
                </div>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>
                    Posts may be rejected for misleading visuals, inappropriate or duplicate content,
                    copyright issues, unauthorized ads, or illegal material. Review our community rules
                    before posting to ensure smooth approval.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] text-white p-3 rounded-xl">
                    <FaUsers className="text-2xl" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Community and Safety Standards</h2>
                </div>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>
                    CUBECHARM promotes a kind, inclusive, and professional community. Report any unsafe behavior
                    so our team can act fast to keep everyone protected. Violations may lead to suspension or removal.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] text-white p-3 rounded-xl">
                    <FaShieldAlt className="text-2xl" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Your Rights and Control</h2>
                </div>
                <div className="text-gray-700 leading-relaxed space-y-4">
                  <p>
                    You can access, edit, or delete your data anytime. Manage privacy settings or unsubscribe easily.
                    Contact support if you have questions or want to report unauthorized use.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] rounded-2xl shadow-xl p-8 md:p-10 text-center text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Questions About Privacy?</h3>
                <p className="text-lg mb-6 opacity-95">
                  Our support team is here to clarify privacy and security policies anytime you need.
                </p>
                <button
                  className="bg-white text-[#3b82f6] font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={() => (window.location.href = "/contact")}
                >
                  Contact Us
                </button>
              </div>
            </>
          )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © 2025 CUBECHARM. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="/about"
                className="text-gray-600 hover:text-[#3b82f6] text-sm font-medium transition-colors duration-200"
              >
                About
              </a>
              <a
                href="/privacy"
                className="text-gray-600 hover:text-[#3b82f6] text-sm font-medium transition-colors duration-200"
              >
                Privacy
              </a>
              <a
                href="/contact"
                className="text-gray-600 hover:text-[#3b82f6] text-sm font-medium transition-colors duration-200"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
