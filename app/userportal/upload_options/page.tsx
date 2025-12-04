'use client';

import { useContext, useState } from 'react';
import { FiUpload, FiFileText } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from "react-icons/fa";
import { BsPlusCircleFill } from "react-icons/bs";
import { HiSpeakerphone } from "react-icons/hi";
import { toast } from "sonner";
import AuthContext from '@/app/providers/AuthContext';

const UploadOptionPage = () => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string>('');
  const { role } = useContext(AuthContext)!;

  const checkRole = (): boolean => {
    if (!role) {
      toast.error('Register first to access this feature');
      router.push('/providers/UnAuthorized');
      return false;
    }
    return true;
  };

  const handleOptionClick = (
    option: string,
    path: string,
    navOptions?: { search?: string }
  ) => {
    if (!checkRole()) return;

    setSelectedOption(option);
    const fullPath = navOptions?.search ? `${path}?${navOptions.search}` : path;
    router.push(fullPath);
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col">
      <div className="px-4 sm:px-6 py-4 bg-white border-b border-[#e8eaed]"></div>

      <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4">

          <button
            onClick={() => {
              if (!checkRole()) return;
              setSelectedOption('post');
              setTimeout(() => {
                router.push('/userportal/activity?openPostModal=true');
                setSelectedOption('');
              }, 300);
            }}
            className="w-full p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-sm hover:shadow-md"
            style={{
              backgroundColor: selectedOption === 'post' ? '#e8f4ff' : '#ffffff',
              border: selectedOption === 'post' ? '2px solid #1e90ff' : '2px solid #e8eaed'
            }}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#1e90ff] flex items-center justify-center flex-shrink-0">
              <FiFileText size={22} className="text-white" />
            </div>
            <div className="flex-1 text-right min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-[#1a1a1a]">Upload Post</h3>
              <p className="text-xs sm:text-sm text-[#666666] mt-0.5">Share your content</p>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#f0f0f0] flex items-center justify-center flex-shrink-0">
              <FaArrowLeft className="text-[#666666] text-sm sm:text-base" />
            </div>
          </button>

          <button
            onClick={() =>
              handleOptionClick('store', '/userportal/profilee', { search: 'openStory=true' })
            }
            className="w-full p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-sm hover:shadow-md"
            style={{
              backgroundColor: selectedOption === 'store' ? '#e8fff4' : '#ffffff',
              border: selectedOption === 'store' ? '2px solid #10b981' : '2px solid #e8eaed'
            }}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#10b981] flex items-center justify-center flex-shrink-0">
              <BsPlusCircleFill size={22} className="text-white" />
            </div>
            <div className="flex-1 text-right min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-[#1a1a1a]">Upload Store</h3>
              <p className="text-xs sm:text-sm text-[#666666] mt-0.5">Add your products</p>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#f0f0f0] flex items-center justify-center flex-shrink-0">
              <FaArrowLeft className="text-[#666666] text-sm sm:text-base" />
            </div>
          </button>

          <button
            onClick={() => handleOptionClick('ad', '/userportal/createdad')}
            className="w-full p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-sm hover:shadow-md"
            style={{
              backgroundColor: selectedOption === 'ad' ? '#fff5e8' : '#ffffff',
              border: selectedOption === 'ad' ? '2px solid #f59e0b' : '2px solid #e8eaed'
            }}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#000] flex items-center justify-center flex-shrink-0">
              <HiSpeakerphone size={22} className="text-white" />
            </div>
            <div className="flex-1 text-right min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-[#1a1a1a]">Announcement</h3>
              <p className="text-xs sm:text-sm text-[#666666] mt-0.5">Broadcast a message</p>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#f0f0f0] flex items-center justify-center flex-shrink-0">
              <FaArrowLeft className="text-[#666666] text-sm sm:text-base" />
            </div>
          </button>

          <button
            onClick={() => handleOptionClick('pro', '/userportal/proMode')}
            className="w-full p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex items-center gap-3 sm:gap-4 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] shadow-sm hover:shadow-md"
            style={{
              backgroundColor: selectedOption === 'pro' ? '#eef2ff' : '#ffffff',
              border: selectedOption === 'pro' ? '2px solid #6366f1' : '2px solid #e8eaed'
            }}
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#6366f1] flex items-center justify-center flex-shrink-0">
              <FiUpload size={22} className="text-white" />
            </div>
            <div className="flex-1 text-right min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-[#1a1a1a]">Upload Pro Mode</h3>
              <p className="text-xs sm:text-sm text-[#666666] mt-0.5">Access advanced upload features</p>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#f0f0f0] flex items-center justify-center flex-shrink-0">
              <FaArrowLeft className="text-[#666666] text-sm sm:text-base" />
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};

export default UploadOptionPage;
