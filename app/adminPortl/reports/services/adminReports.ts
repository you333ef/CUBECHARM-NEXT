import api from "@/app/AuthLayout/refresh";
import axios from "axios";

export type RawReportItem = {
  id: number;
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  reportType: string;
  referenceId: number | null;
  postId: number | null;
  reason: string;
  description: string | null;
  status: string | null;
  reviewedBy: string | null;
  reviewedByName: string | null;
  reviewedAt: string | null;
  createdAt: string
 
};

export type MappedReport = {
  id: string;
  title: string;
  num_reports: number;
  reason: string;
  date: string;
  createdAt: string; 
  status: string;
  propertyId?: string;
  referenceId?: string;
  raw?: RawReportItem;
};

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};


export const getReports = async (
  baseUrl: string,
  accessToken: string | null,
  page = 1,
  pageSize = 20,
  sort?: "latest" | "oldest"
) => {

  const sortParam = sort ? `&sort=${encodeURIComponent(sort)}` : "";

  const url = `/admin/reports?page=${page}&pageSize=${pageSize}${sortParam}`;
  const res = await api.get(url);
  const data = res.data;

  const items: RawReportItem[] = (data?.data?.items ?? []) as RawReportItem[];

  const mapped: MappedReport[] = items.map((item) => ({
    id: String(item.id),
    title: `${item.reportType} #${item.referenceId}`,
    num_reports: 1,
    reason: item.reason,
    date: formatDate(item.createdAt),
    createdAt: item.createdAt,
    status: item.status ?? "Pending",
    propertyId: (item as any).propertyId ?? undefined,
    referenceId: item.referenceId !== null ? String(item.referenceId) : undefined,
    raw: item,
  }));

  return {
    items: mapped,
    page: data?.data?.page ?? page,
    pageSize: data?.data?.pageSize ?? pageSize,
    totalCount: data?.data?.totalCount ?? mapped.length,
    totalPages: data?.data?.totalPages ?? 1,
    hasPreviousPage: data?.data?.hasPreviousPage ?? false,
    hasNextPage: data?.data?.hasNextPage ?? false,
  };
};
