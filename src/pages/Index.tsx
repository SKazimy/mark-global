import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Testimonials from "@/components/Testimonials";
import CTABanner from "@/components/CTABanner";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    document.title = "The Mark Global | Digital Marketing Excellence";
    
    // Add meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "The Mark Global - Empowering your brand in the digital age. Premium digital marketing, branding, web development, and AI automation services.");
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = "The Mark Global - Empowering your brand in the digital age. Premium digital marketing, branding, web development, and AI automation services.";
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Testimonials />
      <CTABanner />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
