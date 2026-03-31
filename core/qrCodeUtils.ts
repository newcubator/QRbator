import Papa from "papaparse";

import type { QRCodeEntry, QRCodeType } from "./qrCode";

export const MAX_QR_CONTENT_LENGTH = 5000;

const QR_CODE_TYPES: QRCodeType[] = ["url", "vcard", "text", "email", "wifi"];
const CSV_FIELDS = [
  "id",
  "name",
  "content",
  "description",
  "createdAt",
  "tags",
  "type",
] as const;
const PROTOCOL_PREFIX_REGEX = /^[a-z][a-z0-9+.-]*:/i;

export const isQRCodeType = (value?: string): value is QRCodeType => {
  return Boolean(value && QR_CODE_TYPES.includes(value as QRCodeType));
};

export const inferQRCodeTypeFromContent = (content: string): QRCodeType => {
  const trimmedContent = content.trim();

  if (!trimmedContent) {
    return "text";
  }

  if (/^BEGIN:VCARD/i.test(trimmedContent)) {
    return "vcard";
  }

  if (/^mailto:/i.test(trimmedContent)) {
    return "email";
  }

  if (/^WIFI:/i.test(trimmedContent)) {
    return "wifi";
  }

  if (
    /^https?:\/\//i.test(trimmedContent) ||
    /^[a-z0-9.-]+\.[a-z]{2,}(?:[/:?#]|$)/i.test(trimmedContent)
  ) {
    return "url";
  }

  return "text";
};

export const resolveQRCodeType = (
  type?: string,
  content?: string,
): QRCodeType => {
  if (isQRCodeType(type)) {
    return type;
  }

  if (content) {
    return inferQRCodeTypeFromContent(content);
  }

  return "text";
};

export const normalizeOpenableUrl = (value: string): string => {
  const trimmedValue = value.trim();

  if (!trimmedValue || PROTOCOL_PREFIX_REGEX.test(trimmedValue)) {
    return trimmedValue;
  }

  return `https://${trimmedValue}`;
};

export const serializeQRCodesToCsv = (qrCodes: QRCodeEntry[]): string => {
  return Papa.unparse({
    fields: [...CSV_FIELDS],
    data: qrCodes.map((qrCode) => [
      qrCode.id,
      qrCode.name,
      qrCode.content,
      qrCode.description ?? "",
      qrCode.createdAt,
      qrCode.tags.join(";"),
      qrCode.type,
    ]),
  });
};

export const parseQRCodesFromCsv = (content: string): QRCodeEntry[] => {
  const results = Papa.parse<Record<string, string>>(content, {
    header: true,
    skipEmptyLines: true,
  });

  return results.data
    .map((row, index) => {
      const entryContent = row.content ?? "";
      const entryName = row.name ?? "";
      const createdAt = row.createdAt || new Date().toISOString();

      if (!entryName || !entryContent) {
        return null;
      }

      return {
        id: row.id || `imported-${Date.now()}-${index}`,
        name: entryName,
        content: entryContent,
        type: resolveQRCodeType(row.type, entryContent),
        description: row.description || undefined,
        createdAt,
        tags: row.tags ? row.tags.split(";").filter(Boolean) : [],
      } satisfies QRCodeEntry;
    })
    .filter((entry): entry is QRCodeEntry => entry !== null);
};
