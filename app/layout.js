import { Inter } from "next/font/google";
import "@styles/globals.css";
import AuthProvider from "./AuthProvider";
// import { SessionProvider } from "@node_modules/next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mailing System",
  description: "Next app",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={inter.className}>
      <AuthProvider>
        {children}
      </AuthProvider>
      </body>
    </html>
  );
}

