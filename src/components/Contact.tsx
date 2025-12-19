import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, Phone, Send, Linkedin, Twitter, Instagram, Loader2, Undo2, Redo2, X, Sparkles, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { functions } from "@/lib/firebase";
import { httpsCallable } from "firebase/functions";
import { useServiceContext, SERVICE_KEYWORDS } from "@/contexts/ServiceContext";

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  
  const { 
    selectedServices, 
    clearServices,
    removeService,
    addService,
    pushToHistory, 
    undo, 
    redo, 
    canUndo, 
    canRedo,
  } = useServiceContext();
  
  const [lastProcessedServices, setLastProcessedServices] = useState<string[]>([]);
  const [originalManualMessage, setOriginalManualMessage] = useState<string>(""); // Store user's original typed message
  const [isEnhanced, setIsEnhanced] = useState(false); // Track if message has been enhanced

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate message from selected services (when clicking cards first)
  const generateServiceMessage = useCallback((services: string[]) => {
    if (services.length === 0) return "";
    if (services.length === 1) {
      return `Hi, I'm interested in your ${services[0]} service. I'd love to learn more about how you can help my business.`;
    }
    const lastService = services[services.length - 1];
    const otherServices = services.slice(0, -1).join(", ");
    return `Hi, I'm interested in your ${otherServices} and ${lastService} services. I'd love to learn more about how you can help my business.`;
  }, []);

  // Enhance message - format featured services nicely, keep remaining content
  const enhanceMessage = useCallback((originalMessage: string, services: string[]) => {
    if (services.length === 0) return originalMessage;
    
    // Get service message for featured services
    const serviceMessage = generateServiceMessage(services);
    
    // Extract non-service content from original message
    let remainingContent = originalMessage.toLowerCase();
    
    // Remove detected service keywords from the message to find remaining content
    Object.entries(SERVICE_KEYWORDS).forEach(([service, keywords]) => {
      if (services.includes(service)) {
        keywords.forEach(keyword => {
          remainingContent = remainingContent.replace(new RegExp(keyword, 'gi'), '');
        });
      }
    });
    
    // Clean up the remaining content
    remainingContent = remainingContent
      .replace(/\s+/g, ' ')  // normalize whitespace
      .replace(/[,.\s]+$/g, '')  // remove trailing punctuation/spaces
      .replace(/^[,.\s]+/g, '')  // remove leading punctuation/spaces
      .trim();
    
    // If there's meaningful remaining content (more than just filler words), append it
    const fillerWords = ['i', 'need', 'want', 'help', 'with', 'and', 'also', 'looking', 'for', 'a', 'the', 'some', 'my', 'me', 'please', 'can', 'you'];
    const meaningfulWords = remainingContent.split(' ').filter(word => 
      word.length > 2 && !fillerWords.includes(word.toLowerCase())
    );
    
    if (meaningfulWords.length > 2) {
      // There's additional meaningful content - append original message
      return `${serviceMessage}\n\nAdditional notes: ${originalMessage.trim()}`;
    }
    
    return serviceMessage;
  }, [generateServiceMessage]);

  // Detect services from message text - hyperactive: adds AND removes tags
  const detectServicesFromMessage = useCallback((message: string) => {
    const lowerMessage = message.toLowerCase();
    
    Object.entries(SERVICE_KEYWORDS).forEach(([service, keywords]) => {
      const hasKeyword = keywords.some(keyword => lowerMessage.includes(keyword));
      const isSelected = selectedServices.includes(service);
      
      if (hasKeyword && !isSelected) {
        // Add tag when keyword detected
        addService(service);
      } else if (!hasKeyword && isSelected) {
        // Remove tag when keyword no longer present
        removeService(service);
      }
    });
  }, [selectedServices, addService, removeService]);

  // Update message when selected services change (only for card clicks when no manual text)
  useEffect(() => {
    // Only auto-generate message when clicking cards first (no manual message stored)
    if (!originalManualMessage && selectedServices.length > lastProcessedServices.length) {
      const newMessage = generateServiceMessage(selectedServices);
      pushToHistory(newMessage);
      setFormData(prev => ({ ...prev, message: newMessage }));
      setLastProcessedServices(selectedServices);
    }
    
    // When all services removed and no manual message, clear
    if (!originalManualMessage && selectedServices.length === 0 && lastProcessedServices.length > 0) {
      setFormData(prev => ({ ...prev, message: "" }));
      setLastProcessedServices([]);
    }
  }, [selectedServices, lastProcessedServices, generateServiceMessage, pushToHistory, originalManualMessage]);

  const handleUndo = () => {
    const previousMessage = undo();
    if (previousMessage !== null) {
      setFormData(prev => ({ ...prev, message: previousMessage }));
    }
  };

  const handleRedo = () => {
    const nextMessage = redo();
    if (nextMessage !== null) {
      setFormData(prev => ({ ...prev, message: nextMessage }));
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newMessage = e.target.value;
    setFormData({ ...formData, message: newMessage });
    
    // Store original message if user is typing manually and we haven't stored one yet
    if (!originalManualMessage && newMessage.trim() && selectedServices.length === 0) {
      setOriginalManualMessage(newMessage);
    } else if (originalManualMessage && !isEnhanced) {
      // Update original message if not enhanced yet
      setOriginalManualMessage(newMessage);
    }
    
    // Reset enhanced state if user edits
    if (isEnhanced) {
      setIsEnhanced(false);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // If message is cleared, reset everything
    if (newMessage.trim() === "") {
      clearServices();
      setOriginalManualMessage("");
      setIsEnhanced(false);
      setLastProcessedServices([]);
      return;
    }
    
    // Live detect services as user types - hyperactive detection
    typingTimeoutRef.current = setTimeout(() => {
      detectServicesFromMessage(newMessage);
    }, 150);
  };

  // Handle removing a service tag
  const handleRemoveService = (service: string) => {
    removeService(service);
    const newServices = selectedServices.filter(s => s !== service);
    
    // Always update message based on remaining services
    if (newServices.length > 0) {
      const newMessage = generateServiceMessage(newServices);
      setFormData(prev => ({ ...prev, message: newMessage }));
      setLastProcessedServices(newServices);
    } else {
      // No services left - clear everything
      setFormData(prev => ({ ...prev, message: "" }));
      setLastProcessedServices([]);
      setOriginalManualMessage("");
      setIsEnhanced(false);
    }
  };

  // Handle enhance arrangement - format message like card selection
  const handleEnhanceArrangement = () => {
    if (selectedServices.length > 0 && originalManualMessage) {
      const enhancedMessage = enhanceMessage(originalManualMessage, selectedServices);
      setFormData(prev => ({ ...prev, message: enhancedMessage }));
      pushToHistory(enhancedMessage);
      setIsEnhanced(true);
    }
  };

  // Handle clearing everything (message + tags)
  const handleClearAll = () => {
    clearServices();
    setLastProcessedServices([]);
    setFormData(prev => ({ ...prev, message: "" }));
    setOriginalManualMessage("");
    setIsEnhanced(false);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call Firebase function directly and wait for response
      const submitContact = httpsCallable(functions, "submitContactForm");
      const result = await submitContact({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      const data = result.data as { success: boolean; message: string };
      
      if (data.success) {
        toast({
          title: "Message sent successfully!",
          description: "Check your email for confirmation. We'll get back to you within 24 hours.",
        });
        setFormData({ name: "", email: "", message: "" });
        clearServices();
        setLastProcessedServices([]);
        setOriginalManualMessage("");
        setIsEnhanced(false);
      }
    } catch (error: unknown) {
      console.error("=== CONTACT FORM ERROR ===");
      console.error("Full error object:", error);
      console.error("Error JSON:", JSON.stringify(error, null, 2));
      if (error && typeof error === "object") {
        console.error("Error code:", (error as { code?: string }).code);
        console.error("Error message:", (error as { message?: string }).message);
        console.error("Error details:", (error as { details?: unknown }).details);
      }
      console.error("==========================");
      
      // Extract error message from Firebase function error
      let errorMessage = "Please try again later or contact us directly via email.";
      if (error && typeof error === "object" && "message" in error) {
        const firebaseError = error as { message: string; code?: string };
        if (firebaseError.message.includes("Failed to send email")) {
          errorMessage = "Failed to send confirmation email. Please try again.";
        }
      }
      
      toast({
        title: "Something went wrong",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
      value: "info@themarkglobal.co.in",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 88607 70991",
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
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Message</label>
                  <div className="flex items-center gap-1">
                    {/* Rearrange button - next to undo */}
                    {originalManualMessage && !isEnhanced && selectedServices.length > 0 && (
                      <button
                        type="button"
                        onClick={handleEnhanceArrangement}
                        className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                        title="Rearrange message"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs">Rearrange</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleUndo}
                      disabled={!canUndo}
                      className={`p-1.5 rounded-md transition-all duration-200 ${
                        canUndo 
                          ? "text-muted-foreground hover:text-foreground hover:bg-muted/50" 
                          : "text-muted-foreground/30 cursor-not-allowed"
                      }`}
                      title="Undo"
                    >
                      <Undo2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleRedo}
                      disabled={!canRedo}
                      className={`p-1.5 rounded-md transition-all duration-200 ${
                        canRedo 
                          ? "text-muted-foreground hover:text-foreground hover:bg-muted/50" 
                          : "text-muted-foreground/30 cursor-not-allowed"
                      }`}
                      title="Redo"
                    >
                      <Redo2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      disabled={!formData.message && selectedServices.length === 0}
                      className={`p-1.5 rounded-md transition-all duration-200 ${
                        formData.message || selectedServices.length > 0
                          ? "text-muted-foreground hover:text-red-500 hover:bg-red-500/10" 
                          : "text-muted-foreground/30 cursor-not-allowed"
                      }`}
                      title="Clear all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <Textarea
                  placeholder="Tell us about your project..."
                  value={formData.message}
                  onChange={handleMessageChange}
                  className="min-h-[150px] bg-card/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 resize-none"
                  required
                />
                {selectedServices.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {/* All service tags - same style, all removable */}
                    {selectedServices.map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => handleRemoveService(service)}
                        className="group/tag inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 cursor-pointer transition-all duration-200"
                      >
                        <span>{service}</span>
                        <X className="w-3 h-3 opacity-0 group-hover/tag:opacity-100 transition-opacity duration-200" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button variant="hero" size="lg" className="w-full group" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Let's Work Together
                    <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  </>
                )}
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
                    <div className="text-foreground font-medium">
                      {info.label === 'Email' ? (
                        <a href={`mailto:${info.value}`} className="underline hover:text-primary transition-colors duration-200">{info.value}</a>
                      ) : (
                        info.value
                      )}
                    </div>
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
