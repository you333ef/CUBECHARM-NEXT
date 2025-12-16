"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { BedDouble, Sofa, Utensils, Bath, Square, Bed } from "lucide-react";

type Room = {
  id: number;
  name: string;
  nameEn: string;
  image: string;
  description: string;
  features: string[];
};

const iconMap: Record<number, any> = {
  1: BedDouble,
  2: Sofa,
  3: Utensils,
  4: Bath,
};

export default function InteractiveWrapper({ rooms, initialRoom }: { rooms: Room[]; initialRoom: Room }) {
  const [selectedRoom, setSelectedRoom] = useState<Room>(initialRoom);
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();

  const handleRoomChange = (room: Room) => {
    setSelectedRoom(room);
  };

  const toMessage = () => {
    router.push('/userportal/messaes');
  };

  const toDetails = () => {
    if (id) {
      router.push(`/userportal/proModewep/${id}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="order-1 lg:order-2">
        <div className="bg-[#ffffff] rounded-2xl shadow-lg overflow-hidden sticky top-6">
          <div className="relative bg-[#f8f9fa] flex items-center justify-center min-h-[350px] md:min-h-[450px] lg:min-h-[550px]">
            <Image
              src={selectedRoom.image}
              alt={selectedRoom.nameEn}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain transition-all duration-500"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#000000dd] via-[#00000066] to-transparent p-4 md:p-6">
              <h2 className="text-[#ffffff] text-xl md:text-2xl lg:text-3xl font-bold">
                {selectedRoom.nameEn}
              </h2>
              <p className="text-[#ffffffcc] mt-1 text-sm md:text-base">{selectedRoom.name}</p>
            </div>
          </div>
          <div className="p-3 md:p-4 bg-[#f8f9fa] border-t border-[#e0e0e0]">
            <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {rooms.map((room) => {
                const Icon = iconMap[room.id];
                return (
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
                    <Image
                      src={room.image}
                      alt={room.nameEn}
                      width={96}
                      height={80}
                      className="w-20 h-16 md:w-24 md:h-20 object-cover"
                    />
                    <div className="absolute inset-0 bg-[#00000033] flex items-center justify-center">
                      <Icon className="text-[#ffffff] text-xl md:text-2xl" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="order-2 lg:order-1">
        <div className="bg-[#ffffff] rounded-2xl shadow-lg p-6 md:p-8">
          <div className="mb-6 pb-6 border-b border-[#e0e0e0]">
            <h1 className="text-3xl md:text-4xl font-bold text-[#2c3e50] mb-3">
              Apartment for sale
            </h1>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-[#3b82f6]">60,000</span>
              <span className="text-xl text-[#7f8c8d]">EGP</span>
            </div>
          </div>
          <div className="mb-6 pb-6 border-b border-[#e0e0e0]">
            <h3 className="text-xl font-semibold text-[#2c3e50] mb-4">Basic information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-[#f8f9fa] rounded-lg">
                <Square className="text-3xl text-[#3498db]" />
                <div>
                  <p className="text-sm text-[#7f8c8d]">Area</p>
                  <p className="font-bold text-[#2c3e50]">150 M</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#f8f9fa] rounded-lg">
                <Bed className="text-3xl text-[#e74c3c]" />
                <div>
                  <p className="text-sm text-[#7f8c8d]">Bedrooms</p>
                  <p className="font-bold text-[#2c3e50]">3</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#f8f9fa] rounded-lg">
                <Bath className="text-3xl text-[#9b59b6]" />
                <div>
                  <p className="text-sm text-[#7f8c8d]">Bathrooms</p>
                  <p className="font-bold text-[#2c3e50]">2</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-[#2c3e50] mb-4">Choose a room To View</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {rooms.map((room) => {
                const Icon = iconMap[room.id];
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
          <div className="mb-6 pb-6 border-b border-[#e0e0e0]">
            <h3 className="text-xl font-semibold text-[#3b82f6] mb-3">
              About <span className="text-[#3b82f6]">{selectedRoom.name}</span>
            </h3>
            <p className="text-[#7f8c8d] leading-relaxed mb-4">
              {selectedRoom.description}
            </p>
            <div className="space-y-2">
              <p className="font-medium text-[#2c3e50]">Features:</p>
              <ul className="space-y-2">
                {selectedRoom.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-[#7f8c8d]">
                    <div className="w-2 h-2 bg-[#3b82f6] rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-[#2c3e50] mb-3">Full description</h3>
            <p className="text-[#7f8c8d] leading-relaxed">
              A luxurious apartment with a modern design in a prime location in Cairo. 
              It features spacious areas and excellent natural lighting. 
              All rooms are equipped with the latest technologies and high-end finishes. 
              Perfect for families and individuals seeking comfort and luxury.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={toMessage}
              className="w-full py-4 bg-[#3b82f6] text-[#ffffff] rounded-xl font-bold text-lg hover:bg-[#0c4197] transition-all shadow-md hover:shadow-lg"
            >
              Contact the seller
            </button>
            <button
              onClick={toDetails}
              className="w-full py-4 bg-[#3b82f6] text-[#ffffff] rounded-xl font-bold text-lg hover:bg-[#0c4197] transition-all shadow-md hover:shadow-lg"
            >
              See More Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}