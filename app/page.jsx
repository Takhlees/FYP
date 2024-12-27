import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import Home from "@components/Home";
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Home />
        </div>
      </main>
      <Footer />
    </div>
  );
}
