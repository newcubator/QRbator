export type QRCodeType = "url" | "vcard" | "text" | "email" | "wifi";

export interface QRCodeEntry {
  id: string;
  name: string;
  content: string;
  type: QRCodeType;
  tags: string[];
  createdAt: string;
  description?: string;
}
