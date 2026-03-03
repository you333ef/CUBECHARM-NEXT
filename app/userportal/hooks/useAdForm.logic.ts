import { useEffect, useContext } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import api from "@/app/AuthLayout/refresh";

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
 const form = useForm<FormData>({
  defaultValues: {
    category: "",
    size: "",
    width: "",
    length: "",
    city: "",
    address: "",
    title: "",
    price: "",
    description: "",
    listingType: "rent",
    currency: "USD",
    negotiable: false,
    phone: "",
    locationLink: "",
  },
});
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = searchParams.get("source");
  const isProModeFlow = source === "new_upload_with_pro_mode";

  // Fetch property data for update
  useEffect(() => {
    if (!isUpdate || !propertyId) return;

    const fetchProperty = async () => {
      try {
        const res = await api.get(`/Property/${propertyId}`);

        const data = res.data.data;

        // Parse location into city and address
      const city = data.city ?? "";
      const address = data.address ?? "";
      const link = data.link ?? "";
      form.reset({
        title: data.title ?? "",
        description: data.description ?? "",
        category: "",
        listingType: data.listingType === "Sale" ? "sale" : "rent",
        price: String(data.price ?? ""),
        currency: data.currency ?? "USD",
        negotiable: data.negotiable ?? false,
        size: String(data.totalArea ?? data.size ?? ""),
        width: String(data.width ?? ""),
        length: String(data.length ?? ""),
        city: city,
        address: address,
        locationLink: link,
        phone: "",
});
       
        if (onMediaSync) {
          onMediaSync(data.media || []);
        }
      } catch (error) {
        toast.error("Failed to load property data");
        console.error(error);
      }
    };

    fetchProperty();
  }, [isUpdate, propertyId]);

  // Submit handler
  const onSubmit = async (data: FormData): Promise<number | undefined> => {
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
        link: data.locationLink || "",
      },
    };

    try {
      if (isUpdate) {
        // UPDATE property
        await api.patch(`/Property/${propertyId}`, payload);

        toast.success("Announcement updated successfully");
        router.push("/");
        return Number(propertyId);
      }

      // CREATE property
      const res = await api.post(`/Property`, {
        ...payload,
        categoryId: Number(data.category) || 1,
        yearBuilt: new Date().getFullYear(),
      });

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
