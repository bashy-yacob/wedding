// ============================================================================
// og.ts — עזר משותף ל-OG images (ImageResponse).
// ImageResponse אינו תומך ב-next/font, ולכן טוענים TTF עברי ישירות מ-Google Fonts
// לפי הטקסט שמופיע בפועל בתמונה (subsetting).
// ============================================================================

/** טוען פונט Frank Ruhl Libre (700) לטקסט נתון, או null אם נכשל. */
export async function loadHebrewFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const family = "Frank+Ruhl+Libre:wght@700";
    const url = `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(
      text,
    )}`;
    const css = await (
      await fetch(url, {
        headers: {
          // נדרש כדי לקבל קישור ל-TTF (ולא woff2) שתואם ל-ImageResponse
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/537.36",
        },
      })
    ).text();
    const match = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
    if (!match) return null;
    return await (await fetch(match[1])).arrayBuffer();
  } catch {
    return null;
  }
}
