import { useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";

const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      quote:
        "The Mark Global transformed our entire digital presence. Our engagement increased by 400% in just three months. They don't just deliver results—they exceed expectations.",
      name: "Sarah Chen",
      title: "CEO, Luxe Fashion Co.",
      initials: "SC",
    },
    {
      quote:
        "Working with this team felt like having an in-house digital department. Their strategic approach to our Meta campaigns generated the highest ROI we've ever seen.",
      name: "Michael Torres",
      title: "Marketing Director, TechFlow",
      initials: "MT",
    },
    {
      quote:
        "From branding to website development, they handled everything with precision and creativity. Our new identity has completely elevated our market position.",
      name: "Emily Watson",
      title: "Founder, GreenLife",
      initials: "EW",
    },
  ];

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,_hsl(160_84%_39%_/_0.05)_0%,_transparent_70%)]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
            Testimonials
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Trusted by <span className="gradient-text">industry leaders</span>
          </h2>
        </div>

        {/* Testimonial Card */}
        <div
          className={`max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <div className="relative p-8 md:p-12 rounded-3xl bg-card/50 border border-border/50 backdrop-blur-sm">
            {/* Quote Icon */}
            <div className="absolute -top-6 left-8 md:left-12">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_30px_hsl(160_84%_39%_/_0.4)]">
                <Quote className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="pt-4">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    index === activeIndex
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4 absolute inset-0 pointer-events-none"
                  }`}
                >
                  <p className="text-xl md:text-2xl text-foreground leading-relaxed mb-8 font-light">
                    "{testimonial.quote}"
                  </p>

                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_20px_hsl(160_84%_39%_/_0.3)]">
                        <span className="font-display font-bold text-primary-foreground">
                          {testimonial.initials}
                        </span>
                      </div>
                      {/* Glow Ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-glow-pulse" />
                    </div>

                    <div>
                      <div className="font-display font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-muted-foreground text-sm">
                        {testimonial.title}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Indicators */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "bg-primary w-8"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
