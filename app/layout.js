import { Geist, Geist_Mono } from "next/font/google";
import ThemeRegistry from "./ThemeRegistry"; // adjust path if needed

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "inn2Data"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head/>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
