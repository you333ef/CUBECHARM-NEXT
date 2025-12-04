"use client";
import { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type ContactFormData = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

const ContactSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Name + Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>

      {/* Phone + Subject */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[3, 4].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-12 w-full bg-gray-200 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>

      {/* Message */}
      <div className="space-y-3">
        <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
        <div className="h-32 w-full bg-gray-200 rounded-xl animate-pulse" />
      </div>

      {/* Button */}
      <div className="text-center mt-8 pt-6 border-t border-[#e5e7eb]">
        <div className="w-40 h-10 bg-gray-200 mx-auto rounded-full animate-pulse" />
      </div>
    </div>
  );
};

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Contact form submitted:", data);
      toast.success("Message sent successfully!", {
        description: "We'll get back to you as soon as possible.",
        icon: <FaCheckCircle className="text-green-500" />,
      });
      reset();
    } catch {
      toast.error("Failed to send message", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] overflow-y-auto font-sans pt-20 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-[#0a0a0f] mb-2">Contact Us</h1>
          <p className="text-[#6b7280]">
            We'd love to hear from you. Send us a message!
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 lg:p-10 border border-[#e5e7eb] backdrop-blur-sm">
          {!isLoading ? (
            <ContactSkeleton />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="flex items-center gap-2 font-semibold text-[#0a0a0f] text-sm mb-3">
                    <FaUser className="w-4 h-4 text-[#3b82f6]" />
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    placeholder="Enter your full name"
                    className="w-full px-5 py-4 border-2 border-[#e5e7eb] rounded-xl text-center bg-white text-[#0a0a0f] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#3b82f6]"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-2 text-center">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 font-semibold text-[#0a0a0f] text-sm mb-3">
                    <FaEnvelope className="w-4 h-4 text-[#3b82f6]" />
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                    placeholder="your.email@example.com"
                    className="w-full px-5 py-4 border-2 border-[#e5e7eb] rounded-xl text-center bg-white"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-2 text-center">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone + Subject */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="flex items-center gap-2 font-semibold text-[#0a0a0f] text-sm mb-3">
                    <FaPhone className="w-4 h-4 text-[#3b82f6]" />
                    Phone Number{" "}
                    <span className="text-[#9ca3af] text-xs">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    {...register("phone", {
                      minLength: { value: 10, message: "Too short" },
                    })}
                    placeholder="01117254520"
                    className="w-full px-5 py-4 border-2 border-[#e5e7eb] rounded-xl text-center bg-white"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-2 text-center">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 font-semibold text-[#0a0a0f] text-sm mb-3">
                    <FaPaperPlane className="w-4 h-4 text-[#3b82f6]" />
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("subject", {
                      required: "Subject is required",
                      minLength: {
                        value: 3,
                        message: "Subject must be at least 3 characters",
                      },
                    })}
                    placeholder="What is this about?"
                    className="w-full px-5 py-4 border-2 border-[#e5e7eb] rounded-xl text-center bg-white"
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-xs mt-2 text-center">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="group">
                <label className="flex items-center gap-2 font-semibold text-[#0a0a0f] text-sm mb-3">
                  <FaPaperPlane className="w-4 h-4 text-[#3b82f6]" />
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("message", {
                    required: "Message is required",
                    minLength: {
                      value: 10,
                      message: "Message must be at least 10 characters",
                    },
                  })}
                  placeholder="Write your message here..."
                  rows={6}
                  className="w-full px-5 py-4 border-2 border-[#e5e7eb] rounded-xl bg-white resize-none"
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-2 text-center">
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="text-center mt-8 pt-6 border-t border-[#e5e7eb]">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#3b82f6] hover:bg-[#60a5fa] text-white px-10 py-4 rounded-full font-semibold uppercase shadow-md transition-all duration-300 disabled:opacity-50 flex items-center gap-2 mx-auto"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-6 bg-[#f3f4f6] rounded-2xl p-6 text-center text-[#6b7280] text-sm">
          We typically respond within 24 hours. For urgent matters, please call us directly.
        </div>
      </div>

      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © 2025 CUBECHARM. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="/about" className="text-gray-600 hover:text-[#3b82f6] text-sm font-medium transition-colors duration-200">
                About
              </a>
              <a href="/privacy" className="text-gray-600 hover:text-[#3b82f6] text-sm font-medium transition-colors duration-200">
                Privacy
              </a>
              <a href="/contact" className="text-gray-600 hover:text-[#3b82f6] text-sm font-medium transition-colors duration-200">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
