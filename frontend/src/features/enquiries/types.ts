export interface Enquiry {
  enquiry_id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  project_id: number | null;
  submitted_at: string;
}

export type CreateEnquiryPayload = Omit<Enquiry, "enquiry_id" | "submitted_at">;
