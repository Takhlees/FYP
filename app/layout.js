import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "@components/Theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Doculus",
  description: "Advanced document management system for universities and administrative departments.",
  icons: {
    shortcut: '/web-logo.png',
    apple: [
      { url: '/web-logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning={true} className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="min-h-screen bg-surface text-on-surface transition-colors duration-300">
            {children}
          </div>
        </ThemeProvider>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          limit={3}
          className="!z-[99999]"
          toastClassName="!max-w-[90vw] sm:!max-w-md"
          style={{ zIndex: 99999 }}
        />
      </body>
    </html>
  );
}