// import { Inter } from "next/font/google";
// import "@/styles/globals.css";
// import { ToastContainer } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
// import { ThemeProvider } from "@components/Theme-provider";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Mailing System",
//   description: "Next app",
// };

// export default function RootLayout({ children }) {

//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body suppressHydrationWarning={true} className={inter.className}>
//       <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
//         {children}
//        <ToastContainer theme="dark"/>
//       </ThemeProvider> 
//       </body>
//     </html>
//   );
// }

// app/layout.js
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
          <div className="min-h-screen bg-surface text-on-surface transition-colors duration-300">
            {children}
          </div>
          <ToastContainer 
            theme="auto" // ✅ Perfect - automatically adapts to your theme
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            className="dark:!text-white" // Force text to be white in dark mode
            toastClassName="dark:!bg-gray-800 dark:!text-white" // Dark mode styling for toasts
          />
        </ThemeProvider> 
      </body>
    </html>
  );
}