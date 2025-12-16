import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

const Portfolio = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  const projects = [
    {
      title: "Luxe Fashion Rebrand",
      category: "Branding & Web Design",
      metric: "+340% engagement",
      color: "from-emerald-500/20 to-teal-500/20",
    },
    {
      title: "TechFlow SaaS Campaign",
      category: "Meta Ads & Social",
      metric: "2.4x ROAS",
      color: "from-green-500/20 to-emerald-500/20",
    },
    {
      title: "GreenLife E-commerce",
      category: "Full Digital Strategy",
      metric: "+520% revenue",
      color: "from-teal-500/20 to-cyan-500/20",
    },
    {
      title: "FinanceHub Platform",
      category: "Product Design & Dev",
      metric: "98% user satisfaction",
      color: "from-emerald-500/20 to-green-500/20",
    },
  ];

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-secondary/30" />
      <div className="absolute top-0 left-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_0%_50%,_hsl(160_84%_39%_/_0.08)_0%,_transparent_60%)]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="max-w-2xl">
            <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
              Portfolio
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Results that speak{" "}
              <span className="gradient-text">for themselves</span>
            </h2>
          </div>
          <Button variant="glow" size="lg" className="group w-fit">
            See Our Work in Action
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${project.color} transition-all duration-500 group-hover:scale-110`}
              />
              <div className="absolute inset-0 bg-card/80 backdrop-blur-sm" />

              {/* Content */}
              <div className="relative p-8 md:p-10 h-full min-h-[280px] flex flex-col justify-between">
                <div>
                  <span className="text-primary text-sm font-medium mb-3 block">
                    {project.category}
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between">
                  <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                    <span className="text-primary font-semibold text-sm">
                      {project.metric}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center border border-border/50 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                    <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary-foreground transition-colors duration-300" />
                  </div>
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(160_84%_39%_/_0.15)_0%,_transparent_70%)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
