export const metadata = {
  title: "S Store",
  description: "the first store management system for contracting companies",
};
import "./globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
