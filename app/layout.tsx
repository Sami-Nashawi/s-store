import LayoutClient from "@/components/LayoutClient";

export const metadata = {
  title: "My App",
  description: "A simple MUI + Next.js layout",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
