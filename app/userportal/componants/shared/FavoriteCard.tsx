import { FaHeart } from "react-icons/fa";
import Link from "next/link";
import Image from "./Image";

const FavoriteCard = () => {
  return (
    <div className="p-4 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4 mb-1">
    
      <Link 
      href="/property/1" 
        className="flex items-center space-x-4 flex-1"
    >
        <div className="flex-shrink-0">
          <Image
            className="h-20 w-20 object-cover rounded-lg"
            src="https://cdn.dubaiimmobilier.fr/wp-content/uploads/2024/06/Sky-High-Luxury.webp"
            alt="Granite slabs"
            loading="lazy"
          />
        </div>
        <div className="flex-1">
          <div className="text-lg font-medium text-black">
            Luxury Appartment
          </div>
          <p className="text-gray-500">6 000 EGP</p>
        </div>
      </Link>

     
      <button
        type="button"
        className="text-red-500 hover:text-red-700 focus:outline-none"
        onClick={() => console.log("Added to favorites")}
      >
        <FaHeart size={23} />
      </button>
    </div>
  );
};

export default FavoriteCard;
