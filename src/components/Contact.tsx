import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone, Send, Linkedin, Twitter, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: "Address",
      value: "Delhi, India",
    },
    {
      icon: Mail,
      label: "Email",
      value: "info@themarkglobal.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 88607 70099",
    },
  ];

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-secondary/30" />
      <div className="absolute bottom-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_100%_100%,_hsl(160_84%_39%_/_0.08)_0%,_transparent_60%)]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block">
            Contact Us
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Let's start your{" "}
            <span className="gradient-text">success story</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Have a project in mind? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Name</label>
                <Input
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Message</label>
                <Textarea
                  placeholder="Tell us about your project..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="min-h-[150px] bg-card/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 resize-none"
                  required
                />
              </div>

              <Button variant="hero" size="lg" className="w-full group">
                Let's Work Together
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div
            className={`space-y-8 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            {/* Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  className="group flex items-start gap-4 p-4 rounded-xl bg-card/30 border border-border/50 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:shadow-[0_0_20px_hsl(160_84%_39%_/_0.2)] transition-all duration-300">
                    <info.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">{info.label}</div>
                    <div className="text-foreground font-medium">{info.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="pt-6 border-t border-border/50">
              <div className="text-sm text-muted-foreground mb-4">Follow us</div>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-12 h-12 rounded-xl bg-card/50 border border-border/50 flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 hover:shadow-[0_0_20px_hsl(160_84%_39%_/_0.2)] transition-all duration-300 group"
                  >
                    <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
