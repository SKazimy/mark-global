import { useEffect, useRef, useState } from "react";
import { Target, Lightbulb, TrendingUp } from "lucide-react";

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const values = [
    {
      icon: Target,
      title: "Precision",
      description: "Data-driven strategies that hit the mark every time.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Cutting-edge solutions that set trends, not follow them.",
    },
    {
      icon: TrendingUp,
      title: "Growth",
      description: "Measurable results that accelerate your success.",
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_100%_50%,_hsl(160_84%_39%_/_0.05)_0%,_transparent_60%)]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
              About Us
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              We craft digital experiences that{" "}
              <span className="gradient-text">inspire action</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              At The Mark Global, we believe every brand has a story worth telling. 
              Our team of strategists, designers, and digital experts work in harmony 
              to amplify your voice across the digital landscape. We don't just market—we 
              create connections that convert.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              With a proven track record of transforming businesses through innovative 
              digital strategies, we're committed to delivering measurable results that 
              drive real growth. Your success is our blueprint.
            </p>
          </div>

          {/* Right - Value Cards */}
          <div className="grid gap-6">
            {values.map((value, index) => (
              <div
                key={value.title}
                className={`group p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-500 ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:shadow-[0_0_20px_hsl(160_84%_39%_/_0.3)] transition-all duration-500">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
