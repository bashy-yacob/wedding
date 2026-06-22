// קישור יצירת קשר עם בשי. במקום mailto: (שדורש אפליקציית מייל מוגדרת
// במכשיר — ולכן "לא עושה כלום" בהרבה מחשבים) אנחנו פותחים ישירות חלון
// כתיבת מייל של Gmail בדפדפן, עם הכתובת/נושא/גוף מוכנים. נפתח בטאב חדש.
export const CONTACT_EMAIL = "bashy3309@gmail.com";

export function gmailComposeUrl({
  subject,
  body,
}: {
  subject: string;
  body: string;
}): string {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: CONTACT_EMAIL,
    su: subject,
    body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

// פנייה על בניית אתר — משותף לצ'יפ הפינתי ולבאנר הפוטר.
export const BUILD_CONTACT_URL = gmailComposeUrl({
  subject: "מעוניין/ת באתר",
  body: "הי בשי,\nראיתי את האתר ואשמח לדבר על בניית אתר עבורי.\n\nקצת על מה שאני מחפש/ת:\n",
});
