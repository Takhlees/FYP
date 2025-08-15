import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
          <div className="min-h-screen bg-surface text-on-surface transition-colors duration-300">
            {children}
          </div>
        </ThemeProvider>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          limit={3}
          className="!z-[9999]"
          toastClassName="!max-w-[90vw] sm:!max-w-md"
        />
      </body>
    </html>
  );
}