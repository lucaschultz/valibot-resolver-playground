import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Valibot Resolver",
  description: "A Valibot resolver for React Hook Form",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`h-full text-gray-800 ${inter.className} bg-white`}>
        <nav className="bg-gray-50 border-b border-gray-200 h-16 flex items-center justify-center px-4 fixed top-0 left-0 right-0">
          <div className="w-full max-w-4xl flex gap-1 md:gap-4 items-baseline overflow-hidden">
            <span className="text-md md:text-2xl leading-relaxed font-bold text-gray-700 whitespace-nowrap mr-2">
              Valibot Resolver
            </span>
            <a
              className="text-sm md:text-lg whitespace-nowrap hover:bg-gray-200 px-1.5 py-0.5 rounded"
              href="https://github.com/fabian-hiller/valibot"
            >
              Valibot
            </a>
            <a
              className="text-sm md:text-lg whitespace-nowrap hover:bg-gray-200 px-1.5 py-0.5 rounded"
              href="https://github.com/react-hook-form/react-hook-form"
            >
              React Hook Form
            </a>
          </div>
        </nav>
        <main className="pt-16 w-full max-w-4xl mx-auto px-4 flex flex-col items-center gap-4 h-full overflow-y-scroll overflow-x-hidden ">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
