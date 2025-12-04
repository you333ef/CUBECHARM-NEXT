"use client"
import { FaCube, FaTools, FaEye } from 'react-icons/fa';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';


const About = () => {
  const navigate = useRouter();
  const NAVI_TO_Register = (): void => {
    navigate.push('/auth/register');
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f9fc] to-[#e8f0fe]">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 space-y-12">
        <header className="text-center space-y-4 py-8">
          {loading ? (
            <>
              <Skeleton height={60} width={400} className="mx-auto mb-4" />
              <Skeleton height={25} width={300} className="mx-auto mb-6" />
              <Skeleton height={8} width={100} className="mx-auto rounded-full" />
            </>
          ) : (
            <>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
                About CUBECHARM
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
                A next-generation social platform for real estate.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] mx-auto rounded-full mt-6"></div>
            </>
          )}
        </header>

        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100 space-y-5"
            >
              <Skeleton height={35} width={220} className="mb-4" />
              <Skeleton count={4} height={22} />
            </div>
          ))
        ) : (
          <>
            <section className="bg-white rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] rounded-xl flex items-center justify-center shadow-md">
                  <FaCube className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Who We Are</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                We are CUBECHARM, a next-generation social platform for real estate where immersive experiences meet community engagement. Our mission is to revolutionize how people explore, share, and transact properties by combining social features and 360° visual content.
              </p>
            </section>

            <section className="bg-white rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] rounded-xl flex items-center justify-center shadow-md">
                  <FaTools className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">What We Do</h2>
              </div>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start gap-4 p-3 rounded-lg hover:bg-[#f7f9fc] transition-colors">
                  <span className="text-[#3b82f6] text-xl font-bold mt-0.5">•</span>
                  <span className="text-lg">Post and share properties with 360° views</span>
                </li>
                <li className="flex items-start gap-4 p-3 rounded-lg hover:bg-[#f7f9fc] transition-colors">
                  <span className="text-[#3b82f6] text-xl font-bold mt-0.5">•</span>
                  <span className="text-lg">Publish stories and updates</span>
                </li>
                <li className="flex items-start gap-4 p-3 rounded-lg hover:bg-[#f7f9fc] transition-colors">
                  <span className="text-[#3b82f6] text-xl font-bold mt-0.5">•</span>
                  <span className="text-lg">Follow members, like, and comment on posts</span>
                </li>
                <li className="flex items-start gap-4 p-3 rounded-lg hover:bg-[#f7f9fc] transition-colors">
                  <span className="text-[#3b82f6] text-xl font-bold mt-0.5">•</span>
                  <span className="text-lg">Showcase and sell real estate products</span>
                </li>
                <li className="flex items-start gap-4 p-3 rounded-lg hover:bg-[#f7f9fc] transition-colors">
                  <span className="text-[#3b82f6] text-xl font-bold mt-0.5">•</span>
                  <span className="text-lg">Explore listings and connect directly</span>
                </li>
              </ul>
            </section>

            <section className="bg-white rounded-2xl p-8 md:p-10 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] rounded-xl flex items-center justify-center shadow-md">
                  <FaEye className="text-white text-2xl" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Vision & Mission</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[#f7f9fc] to-[#e8f0fe] p-6 rounded-xl border border-[#3b82f6]/20">
                  <h3 className="font-bold text-gray-900 mb-3 text-xl flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#3b82f6] rounded-full"></span>
                    Vision
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    To become the leading platform merging exploration, interaction, and real estate transactions.
                  </p>
                </div>
                <div className="bg-gradient-to-br from-[#f7f9fc] to-[#e8f0fe] p-6 rounded-xl border border-[#3b82f6]/20">
                  <h3 className="font-bold text-gray-900 mb-3 text-xl flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#3b82f6] rounded-full"></span>
                    Mission
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    To empower users to discover, share, and trade real estate seamlessly in a social environment.
                  </p>
                </div>
              </div>
            </section>

            <section className="text-center space-y-6 py-10 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] rounded-2xl px-6 md:px-12 shadow-xl">
              <p className="text-white text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-medium">
                Follow us to stay updated and be the first to explore properties in 360° with CUBECHARM.
              </p>
              <button
                onClick={NAVI_TO_Register}
                className="bg-white text-[#3b82f6] rounded-xl px-8 py-4 text-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Join CUBECHARM
              </button>
            </section>
          </>
        )}
      </div>

      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">© 2025 CUBECHARM. All rights reserved.</p>
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

export default About;
