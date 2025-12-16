"use client"
import React, { useState } from "react";

import { 
  MdBedroomParent, 
  MdLiving, 
  MdKitchen, 
  MdBathtub,
  MdSquareFoot,
  MdLocationOn
} from "react-icons/md";
import { FaBed, FaToilet } from "react-icons/fa";
import { BiArea } from "react-icons/bi";
import { toast } from "sonner";
import { useParams, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
const bedroomImg = "/images/BEDROOM1.jpg";
const livingImg = "/images/Living.jpg";
const kitchenImg = "/images/Kitchen.jpg";
 const bathroomImg ="/images/bathroom.jpg";
// Data for rooms Fake 
const rooms = [
  {
    id: 1,
    name: "Bedroom",
    nameEn: "Bedroom",
    icon: MdBedroomParent,
    image: bedroomImg,
    description: "Spacious master bedroom with modern design and natural lighting",
    features: ["King-size bed", "Large wardrobe", "Private balcony"]
  },
  {
    id: 2,
    name: "Living Room",
    nameEn: "Living Room",
    icon: MdLiving,
    image: livingImg,
    description: "Luxury living room with a wide and comfortable space",
    features: ["Modern sofa", "65-inch TV", "LED lighting"]
  },
  {
    id: 3,
    name: "Kitchen",
    nameEn: "Kitchen",
    icon: MdKitchen,
    image: kitchenImg,
    description: "Fully modern kitchen with high-quality appliances",
    features: ["Natural marble", "Modern electric appliances", "Kitchen island"]
  },
  {
    id: 4,
    name: "Bathroom",
    nameEn: "Bathroom",
    icon: MdBathtub,
    image: bathroomImg,
    description: "Luxury bathroom with relaxing spa design",
    features: ["Elegant bathtub", "Glass shower", "Hidden lighting"]
  }
];

const ProMode = () => {
  //  هنحتاجه  بعدين يكبير 
   const { id } = useParams<{ id: string }>();
  
//   State Use to track selected room
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]);
  
//  Function to handle room change
//  متحددة علي Index 0  في الArray يعني تفاصيل ال Objext الأول بس هي اللي هتكون ظاهرة 
  const handleRoomChange = (room: typeof rooms[0]) => {
    setSelectedRoom(room);
  };
  const NAVIGATE=useRouter()
  const TO_Message=()=>{
    NAVIGATE.push('/userportal/messaes')

  }
  const TO_Details=()=>{
    NAVIGATE.push(`/userportal/proModewep/${id}`)

  }
 const path = usePathname();
const ISPROMODE = path.includes("ADMINpro-mode");
const Report = path.includes("ADMINpro-Report");
//  لو في حالة ال Approval أو حالة ال Rejectd 
 
 

  

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
    
      
      {/* Header*/}
      <header className="bg-[#ffffff] shadow-sm py-4 px-6 border-b border-[#e0e0e0]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold  text-[#3b82f6]">PRO MODE</h1>
          <div className="flex items-center gap-2 text-[#7f8c8d]">
            <MdLocationOn className="text-xl" />
            <span className="hidden md:inline">Egypt ,Cairo</span>
          </div>
        </div>
      </header>

      {/* Main Layout*/}
      <div className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col items-center md:items-center lg:items-start justify-center md:justify-center lg:justify-start text-center md:text-center lg:text-left">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Right Side*/}
          <div className="order-1 lg:order-2">
            <div className="bg-[#ffffff] rounded-2xl shadow-lg overflow-hidden sticky top-6">
              {/* Main Image*/}
              <div className="relative bg-[#f8f9fa] flex items-center justify-center min-h-[350px] md:min-h-[450px] lg:min-h-[550px]">
                <img 
                  src={selectedRoom.image} 
                  alt={selectedRoom.nameEn}
                  className="w-full h-full max-h-[350px] md:max-h-[450px] lg:max-h-[550px] object-contain transition-all duration-500"
                />
               {/* Room title above the image */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#000000dd] via-[#00000066] to-transparent p-4 md:p-6">
                  <h2 className="text-[#ffffff] text-xl md:text-2xl lg:text-3xl font-bold">
                    {selectedRoom.nameEn}
                  </h2>
                  <p className="text-[#ffffffcc] mt-1 text-sm md:text-base">{selectedRoom.name}</p>
                </div>
              </div>
              
              {/* Thumbnails bar for rooms*/}
              <div className="p-3 md:p-4 bg-[#f8f9fa] border-t border-[#e0e0e0]">
                <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {rooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => handleRoomChange(room)}
                      className={`
                        flex-shrink-0 relative rounded-lg overflow-hidden 
                        transition-all duration-300 hover:scale-105
                        ${selectedRoom.id === room.id 
                          ? 'ring-3 md:ring-4 ring-[#3498db] shadow-lg' 
                          : 'opacity-70 hover:opacity-100'
                        }
                      `}
                    >
                      <img 
                        src={room.image} 
                        alt={room.nameEn}
                        className="w-20 h-16 md:w-24 md:h-20 object-cover"
                      />
                      <div className="absolute inset-0 bg-[#00000033] flex items-center justify-center">
                        <room.icon className="text-[#ffffff] text-xl md:text-2xl" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/*Left  Side*/}
          <div className="order-2 lg:order-1">
            <div className="bg-[#ffffff] rounded-2xl shadow-lg p-6 md:p-8">
              
              {/* Price +Address*/}
              <div className="mb-6 pb-6 border-b border-[#e0e0e0]">
                <h1 className="text-3xl md:text-4xl font-bold text-[#2c3e50] mb-3">
                 Apartment for sale
                </h1>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#3b82f6]">60,000</span>
                  <span className="text-xl text-[#7f8c8d]">EGP</span>
                </div>
              </div>

              {/*Main Info*/}
              <div className="mb-6 pb-6 border-b border-[#e0e0e0]">
                <h3 className="text-xl font-semibold text-[#2c3e50] mb-4">Basic information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-[#f8f9fa] rounded-lg">
                    <BiArea className="text-3xl text-[#3498db]" />
                    <div>
                      <p className="text-sm text-[#7f8c8d]">Area</p>
                      <p className="font-bold text-[#2c3e50]">150 M</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#f8f9fa] rounded-lg">
                    <FaBed className="text-3xl text-[#e74c3c]" />
                    <div>
                      <p className="text-sm text-[#7f8c8d]">Bedroom</p>
                      <p className="font-bold text-[#2c3e50]">3</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#f8f9fa] rounded-lg">
                    <FaToilet className="text-3xl text-[#9b59b6]" />
                    <div>
                      <p className="text-sm text-[#7f8c8d]">Bathrooms</p>
                      <p className="font-bold text-[#2c3e50]">2</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs  */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#2c3e50] mb-4">Choose a room To View</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {rooms.map((room) => {
                    const Icon = room.icon;
                    const isActive = selectedRoom.id === room.id;
                    
                    return (
                      <button
                        key={room.id}
                        onClick={() => handleRoomChange(room)}
                        className={`
                          flex flex-col items-center justify-center p-4 rounded-xl
                          transition-all duration-300 transform hover:scale-105
                          ${isActive 
                            ? 'bg-[#3b82f6] text-[#ffffff] shadow-lg' 
                            : 'bg-[#f8f9fa] text-[#7f8c8d] hover:bg-[#e8e9ea]'
                          }
                        `}
                      >
                        <Icon className="text-3xl mb-2" />
                        <span className="text-sm font-medium text-center">
                          {room.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Descriprion room Featcher Spectific*/}
              <div className="mb-6 pb-6 border-b border-[#e0e0e0]">
                <h3 className="text-xl font-semibold text-[#3b82f6] mb-3">
                  About <span className=" text-[#3b82f6] ">{selectedRoom.name}</span>
                </h3>
                <p className="text-[#7f8c8d] leading-relaxed mb-4">
                  {selectedRoom.description}
                </p>
                <div className="space-y-2">
                  <p className="font-medium text-[#2c3e50]">Features:</p>
                  <ul className="space-y-2">
                    {selectedRoom.features.map((feature, index) => (
                      <li 
                        key={index}
                        className="flex items-center gap-2 text-[#7f8c8d]"
                      >
                        <div className="w-2 h-2 bg-[#3b82f6] rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Descripion General */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#2c3e50] mb-3">Full description</h3>
                <p className="text-[#7f8c8d] leading-relaxed">
                    A luxurious apartment with a modern design in a prime location in Cairo. 
                    It features spacious areas and excellent natural lighting. 
                    All rooms are equipped with the latest technologies and high-end finishes. 
                    Perfect for families and individuals seeking comfort and luxury.
                  </p>

              </div>
         {/* Report Section */}
{Report && (
  <div className="flex flex-col gap-3">
    <button
      onClick={TO_Details}
      className="w-full py-4 bg-[#3b82f6] text-[#ffffff] rounded-xl font-bold text-lg hover:bg-[#0c4197] transition-all shadow-md hover:shadow-lg"
    >
      See More Details
    </button>
    <button
      onClick={handleBlock}
      className="w-full py-4 bg-[#07ba22] text-[#fff] rounded-xl font-bold text-lg hover:bg-[#07ba27] transition-all shadow-md hover:shadow-lg"
    >
      Block This User for 10 Days
    </button>
    <button
      onClick={handleDelete}
      className="w-full py-4 bg-[#dc2626] text-white rounded-xl font-bold text-lg hover:bg-[#991b1b] transition-all shadow-md hover:shadow-lg"
    >
      Delete This Post
    </button>
  </div>
)}

{/* Buttons Section - Hidden if Report exists */}
   <div className="flex flex-col gap-3">
      <button
        onClick={TO_Message}
        className="w-full py-4 bg-[#3b82f6] text-[#ffffff] rounded-xl font-bold text-lg hover:bg-[#0c4197] transition-all shadow-md hover:shadow-lg"
      >
        Contact the seller
      </button>
      <button
        onClick={TO_Details}
        className="w-full py-4 bg-[#3b82f6] text-[#ffffff] rounded-xl font-bold text-lg hover:bg-[#0c4197] transition-all shadow-md hover:shadow-lg"
      >
        See More Details
      </button>
    </div>

         
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProMode;
