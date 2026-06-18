import { describe, it, expect } from "vitest";
import { generateSlug, isValidSlug } from "./slug";

describe("generateSlug", () => {
  it("מחזיר slug באורך 8 ללא תווים מבלבלים", () => {
    for (let i = 0; i < 100; i++) {
      const slug = generateSlug();
      expect(slug).toHaveLength(8);
      expect(slug).toMatch(/^[a-z2-9]+$/);
      expect(slug).not.toMatch(/[01oil]/);
    }
  });

  it("מייצר ערכים שונים", () => {
    const set = new Set(Array.from({ length: 200 }, () => generateSlug()));
    expect(set.size).toBeGreaterThan(195);
  });
});

describe("isValidSlug", () => {
  it("מקבל slug תקין", () => {
    expect(isValidSlug(generateSlug())).toBe(true);
  });
  it("דוחה אורך/תווים שגויים", () => {
    expect(isValidSlug("abc")).toBe(false);
    expect(isValidSlug("abcdefg1")).toBe(false); // מכיל 1
    expect(isValidSlug("ABCDEFGH")).toBe(false); // אותיות גדולות
  });
});
