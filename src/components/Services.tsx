import { useEffect, useRef, useState } from "react";
import {
  Share2,
  Target,
  Palette,
  Award,
  Globe,
  Bot,
  Check,
  Plus,
} from "lucide-react";
import { useServiceContext } from "@/contexts/ServiceContext";

const Services = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { selectedServices, toggleService } = useServiceContext();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      icon: Share2,
      title: "Social Media Marketing",
      description:
        "Strategic content creation and community management that builds authentic connections with your audience.",
    },
    {
      icon: Target,
      title: "Meta Ads & Paid Ads",
      description:
        "Data-driven advertising campaigns on Meta, Google, and beyond that maximize your ROI.",
    },
    {
      icon: Palette,
      title: "Product Design",
      description:
        "User-centric design solutions that transform complex ideas into intuitive digital experiences.",
    },
    {
      icon: Award,
      title: "Branding",
      description:
        "Comprehensive brand identity development that captures your essence and resonates with your market.",
    },
    {
      icon: Globe,
      title: "Website Development",
      description:
        "Modern, responsive websites built with cutting-edge technology for optimal performance.",
    },
    {
      icon: Bot,
      title: "Automation & AI Agents",
      description:
        "Intelligent automation solutions and AI-powered tools that streamline your operations.",
    },
  ];

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(160_84%_39%_/_0.03)_0%,_transparent_70%)]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
            Our Services
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything you need to{" "}
            <span className="gradient-text">dominate digital</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From strategy to execution, we offer comprehensive digital marketing
            solutions tailored to your unique business goals.
          </p>
          
          {/* Selected services indicator */}
          {selectedServices.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedServices.length} service{selectedServices.length > 1 ? "s" : ""} selected
              </span>
              <span className="text-muted-foreground/50">•</span>
              <a
                href="#contact"
                className="text-sm text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
              >
                Send inquiry →
              </a>
            </div>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const isSelected = selectedServices.includes(service.title);
            return (
              <div
                key={service.title}
                onClick={() => toggleService(service.title)}
                className={`group relative p-8 rounded-2xl bg-card/30 border backdrop-blur-sm overflow-hidden transition-all duration-700 cursor-pointer ${
                  isSelected 
                    ? "border-primary/60 bg-primary/5" 
                    : "border-border/50 hover:border-primary/40 hover:bg-card/50"
                } ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Selected/Add Indicator */}
                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isSelected 
                    ? "bg-primary" 
                    : "bg-muted/50 opacity-0 group-hover:opacity-100"
                }`}>
                  {isSelected ? (
                    <Check className="w-4 h-4 text-primary-foreground" />
                  ) : (
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,_hsl(160_84%_39%_/_0.1)_0%,_transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center group-hover:shadow-[0_0_30px_hsl(160_84%_39%_/_0.3)] transition-all duration-500">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="relative font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="relative text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                {/* Click hint */}
                <p className={`relative text-xs mt-4 transition-opacity duration-300 ${
                  isSelected 
                    ? "text-primary/70 opacity-100" 
                    : "text-muted-foreground/60 opacity-0 group-hover:opacity-100"
                }`}>
                  {isSelected 
                    ? "Click to remove from inquiry" 
                    : "Click to add to inquiry"}
                </p>

                {/* Bottom Border Glow */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
