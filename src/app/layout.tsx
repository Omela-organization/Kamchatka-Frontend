import '../styles/globals.css';
import Navigation from './components/Navigation/Navigation';
import type { Metadata } from "next";
import { Jost } from "next/font/google";

const jost = Jost({ 
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--jost",
});

export const metadata: Metadata = {
  title: "admin",
  description: "",
};

export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={jost.className}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
