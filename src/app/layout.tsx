import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store-context";
import { Preloader } from "@/components/Preloader";

export const metadata: Metadata = {
  title: "BAMO | Haute Parfumerie & Extraits de Parfum",
  description:
    "Maison de haute parfumerie créant des extraits d'exception à la tenue inégalée. Livraison express et paiement en espèces à la livraison au Maroc.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F6F2EC] text-[#111111] font-poppins">
        <StoreProvider>
          <Preloader />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
