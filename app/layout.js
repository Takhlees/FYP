import { Inter } from "next/font/google";
import "@styles/globals.css";
import AuthProvider from "./AuthProvider";
// import { SessionProvider } from "@node_modules/next-auth/react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
       <ToastContainer theme="dark"/>
      </body>
    </html>
  );
}

