import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800"],
  variable: "--font-body-ar",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-heading-ar",
  display: "swap",
});

export const metadata = {
  title: "دراسة حول إدراك جودة الأخبار الرقمية",
  description:
    "استبيان أكاديمي باللغة العربية حول تقييم جودة الأخبار الطبية الرقمية",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${tajawal.variable} ${cairo.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
