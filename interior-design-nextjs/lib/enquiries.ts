import { query } from "@/lib/db";

export interface Enquiry {
  enquiry_id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  project_id: number | null;
  submitted_at: string;
}

export async function createEnquiry(data: {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  project_id?: number | null;
}): Promise<number> {
  const result = await query<any>(
    `INSERT INTO enquiries (name, email, phone, message, project_id)
     VALUES (?, ?, ?, ?, ?)`,
    [
      data.name,
      data.email,
      data.phone ?? null,
      data.message,
      data.project_id ?? null,
    ]
  );

  return result.insertId;
}

export async function getAllEnquiries(): Promise<Enquiry[]> {
  return await query<Enquiry[]>(
    `SELECT enquiry_id, name, email, phone, message, project_id, submitted_at
     FROM enquiries
     ORDER BY submitted_at DESC`
  );
}

export async function getEnquiryById(
  enquiryId: number
): Promise<Enquiry | null> {
  const rows = await query<Enquiry[]>(
    `SELECT enquiry_id, name, email, phone, message, project_id, submitted_at
     FROM enquiries
     WHERE enquiry_id = ?`,
    [enquiryId]
  );

  return rows.length ? rows[0] : null;
}

export async function deleteEnquiry(enquiryId: number): Promise<boolean> {
  const result = await query<any>(
    `DELETE FROM enquiries WHERE enquiry_id = ?`,
    [enquiryId]
  );

  return result.affectedRows > 0;
}
