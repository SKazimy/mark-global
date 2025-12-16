import logo from "@/assets/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer className="relative py-12 border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <a href="#" className="flex items-center group">
            <img 
              src={logo} 
              alt="The Mark Global" 
              className="h-10 w-auto object-contain brightness-0 invert transition-all duration-300 group-hover:drop-shadow-[0_0_8px_hsl(160_84%_39%)] group-hover:brightness-100 group-hover:[filter:invert(1)_sepia(1)_saturate(5)_hue-rotate(100deg)]"
            />
          </a>

          {/* Links */}
          <div className="flex items-center gap-6">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-muted-foreground text-sm">
            © {currentYear} The Mark Global. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
