"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import ThemeProvider from "@/components/ThemeProvider";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdmin  = pathname.startsWith("/admin");

  return (
    <ThemeProvider>
      <PageLoader />
      {!isAdmin && <Navbar />}
      <main>{children}</main>
      {!isAdmin && <Footer />}
    </ThemeProvider>
  );
}