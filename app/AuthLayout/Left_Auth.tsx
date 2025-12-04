'use client ';
import { useRouter } from "next/navigation";

const Left_Auth = () => {
  const router=useRouter()
  const Help=():void=>{
  router.push  ('/Help')


  }
  return (
    <div className="flex flex-col justify-center items-start h-full w-full p-10 bg-white text-[#111827] relative overflow-hidden">
    
      <div className="relative z-10 max-w-lg">
        <h1 className="text-4xl font-extrabold leading-tight mb-6 text-[#111827]">
          Experience Properties <br /> in Full Dimension
        </h1>
        <p className="text-lg text-[#6B7280] mb-8">
          Explore immersive <span className="font-semibold">360° virtual tours</span> 
          and detailed 2D floor plans. <br />
          Find your perfect space with next-gen real estate technology.
        </p>

       
        <button onClick={Help} className="px-6 py-3 rounded-xl bg-[#4B3CF5] text-white font-semibold shadow-lg transform transition duration-300 hover:scale-105 hover:bg-[#362BBD]">
          Help Demo
        </button>
      </div>
    </div>
  )
}

export default Left_Auth;
