export interface DesignImage {
  image_id: number;
  project_id: number | null;
  room_id: number | null;
  image_url: string;
  alt_text: string | null;
  uploaded_at: string;
}

export interface CreateImagePayload {
  image_url: string;
  project_id?: number;
  room_id?: number;
  alt_text?: string;
}
