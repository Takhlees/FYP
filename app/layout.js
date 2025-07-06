import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from "@components/Theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mailing System",
  description: "Next app",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning={true} className={inter.className}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
       <ToastContainer theme="dark"/>
      </ThemeProvider> 
      </body>
    </html>
  );
}
