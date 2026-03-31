import type { QRCodeEntry } from "@/core/qrCode";
import {
  inferQRCodeTypeFromContent,
  normalizeOpenableUrl,
  parseQRCodesFromCsv,
  serializeQRCodesToCsv,
} from "@/core/qrCodeUtils";

describe("qrCodeUtils", () => {
  test("infers a supported app qr code type from scanned content", () => {
    expect(inferQRCodeTypeFromContent("https://example.com")).toBe("url");
    expect(inferQRCodeTypeFromContent("mailto:test@example.com")).toBe("email");
    expect(inferQRCodeTypeFromContent("WIFI:S:Office;T:WPA;P:secret;H:false;")).toBe(
      "wifi",
    );
    expect(inferQRCodeTypeFromContent("plain text note")).toBe("text");
  });

  test("normalizes openable urls by adding a https protocol when missing", () => {
    expect(normalizeOpenableUrl("example.com")).toBe("https://example.com");
    expect(normalizeOpenableUrl("https://example.com")).toBe(
      "https://example.com",
    );
    expect(normalizeOpenableUrl("mailto:test@example.com")).toBe(
      "mailto:test@example.com",
    );
  });

  test("round-trips qr codes through csv without dropping the type or breaking quoted content", () => {
    const entries: QRCodeEntry[] = [
      {
        id: "1",
        name: "Quoted",
        content: 'hello, "world"\nnext line',
        type: "text",
        description: "desc",
        createdAt: "2026-03-31T12:00:00.000Z",
        tags: ["alpha", "beta"],
      },
    ];

    const csv = serializeQRCodesToCsv(entries);

    expect(csv).toContain("type");

    const parsed = parseQRCodesFromCsv(csv);
    expect(parsed).toEqual(entries);
  });
});
