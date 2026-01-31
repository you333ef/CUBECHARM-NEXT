import { useEffect, useContext } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import AuthContext from "@/app/providers/AuthContext";
import { AdMedia } from "./useAdMedia.logic";

export type FormData = {
  category: string;
  size: string;
  width: string;
  length: string;
  city: string;
  address: string;
  title: string;
  price: string;
  description: string;
  listingType: "rent" | "sale";
  currency: string;
  negotiable?: boolean;
  phone?: string;
  locationLink: string;
};

interface UseAdFormProps {
  isUpdate: boolean;
  propertyId?: string | null;
  onMediaSync?: (data: any[]) => void;
}

interface UseAdFormReturn extends UseFormReturn<FormData> {
  isUpdate: boolean;
  isProModeFlow: boolean;
  handleSubmit: any;
  onSubmit: (data: FormData) => Promise<number | undefined>;
}

export const useAdForm = ({ isUpdate, propertyId, onMediaSync }: UseAdFormProps): UseAdFormReturn => {
  const form = useForm<FormData>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { baseUrl } = useContext(AuthContext)!;
  const source = searchParams.get("source");
  const isProModeFlow = source === "new_upload_with_pro_mode";

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  const baseURL = "http://localhost:5000";

  // Fetch property data for update
  useEffect(() => {
    if (!isUpdate || !token || !propertyId) return;

    const fetchProperty = async () => {
      try {
        const res = await axios.get(`${baseUrl}/Property/${propertyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = res.data.data;

        // Parse location into city and address
        const locationParts = data.location?.split(",") || [];
        const city = locationParts[0]?.trim() || "";

        form.reset({
          title: data.title ?? "",
          description: data.description ?? "",
          category: "",
          listingType: data.listingType === "Sale" ? "sale" : "rent",
          price: String(data.price ?? ""),
          currency: data.currency ?? "USD",
          negotiable: data.negotiable ?? false,
          size: String(data.size ?? ""),
          width: String(data.width ?? ""),
          length: String(data.length ?? ""),
          city: city,
          address: data.location ?? "",
          locationLink: "",
          phone: "",
        });

        // Sync media
        if (onMediaSync) {
          onMediaSync(data.media || []);
        }
      } catch (error) {
        toast.error("Failed to load property data");
        console.error(error);
      }
    };

    fetchProperty();
  }, [isUpdate, propertyId, token, baseUrl, form, onMediaSync]);

  // Submit handler
  const onSubmit = async (data: FormData): Promise<number | undefined> => {
    if (!token) {
      toast.error("Unauthorized");
      return;
    }

    const payload = {
      title: data.title,
      description: data.description,
      listingType: data.listingType === "sale" ? "Sale" : "Rent",
      price: data.price,
      currency: data.currency,
      negotiable: data.negotiable ?? false,
      totalArea: Number(data.size),
      areaUnit: "sqm",
      bedrooms: 0,
      bathrooms: 0,
      width: Number(data.width),
      length: Number(data.length),
      isActive: !isProModeFlow,
      location: {
        country: "United States",
        city: data.city,
        address: data.address,
        latitude: 0,
        longitude: 0,
      },
    };

    try {
      if (isUpdate) {
        // UPDATE property
        await axios.patch(`${baseUrl}/Property/${propertyId}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        toast.success("Announcement updated successfully");
        router.push("/");
        return Number(propertyId);
      }

      // CREATE property
      const res = await axios.post(
        `${baseUrl}/Property`,
        {
          ...payload,
          categoryId: Number(data.category) || 1,
          yearBuilt: new Date().getFullYear(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const newPropertyId = res.data.data.propertyId;

      // Return ID for media upload, don't redirect yet
      toast.success("Announcement created successfully!");
      return newPropertyId;
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
      return;
    }
  };

  return {
    ...form,
    isUpdate,
    isProModeFlow,
    onSubmit,
  };
};
