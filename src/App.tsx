import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CTABanner from "./components/CTABanner";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <CTABanner />
      <Contact />
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
