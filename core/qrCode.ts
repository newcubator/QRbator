export interface QRCodeEntry {
  id: string;
  name: string;
  content: string;
  type: "url" | "vcard" | "text" | "email" | "wifi";
  tags: string[];
  createdAt: string;
  description?: string;
}
