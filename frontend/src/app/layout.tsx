import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Customer Inquiry Management System",
  description: "Enterprise customer inquiry tracking and workflow system"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="header-nav">
          <div className="header-container">
            <Link href="/inquiries" className="brand">
              <div className="brand-icon">CI</div>
              <span>InquiryDesk</span>
            </Link>
            <nav className="nav-links">
              <Link href="/inquiries" className="nav-link">
                Dashboard
              </Link>
              <Link href="/inquiries/new" className="nav-link">
                + New Inquiry
              </Link>
              <Link href="/login" className="nav-link">
                Agent Login
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
