import "./globals.css";
import React from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "S-Store",
  description: "Site store management system",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="layout">
          <Sidebar />
          <div className="main">
            <Navbar />
            <div className="content">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
