import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface ServiceContextType {
  selectedServices: string[];
  addService: (service: string) => void;
  removeService: (service: string) => void;
  toggleService: (service: string) => void;
  clearServices: () => void;
  messageHistory: string[];
  currentHistoryIndex: number;
  pushToHistory: (message: string) => void;
  undo: () => string | null;
  redo: () => string | null;
  canUndo: boolean;
  canRedo: boolean;
}

// Service keywords for detection
export const SERVICE_KEYWORDS: Record<string, string[]> = {
  "Social Media Marketing": ["social media", "instagram", "facebook", "linkedin", "twitter", "content marketing", "posts", "engagement", "followers", "smm"],
  "Meta Ads & Paid Ads": ["meta ads", "paid ads", "advertising", "ppc", "google ads", "facebook ads", "campaigns", "roi"],
  "Product Design": ["product design", "ui design", "ux design", "user interface", "user experience", "prototype", "mockup", "figma"],
  "Branding": ["brand", "branding", "logo", "brand identity", "rebrand", "visual identity"],
  "Website Development": ["website", "web development", "landing page", "frontend", "backend", "react", "web app"],
  "Automation & AI Agents": ["automation", "ai agent", "artificial intelligence", "chatbot", "automate", "machine learning"],
};

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider = ({ children }: { children: ReactNode }) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [messageHistory, setMessageHistory] = useState<string[]>([""]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);

  const addService = useCallback((service: string) => {
    setSelectedServices((prev) => {
      if (prev.includes(service)) return prev;
      return [...prev, service];
    });
  }, []);

  const removeService = useCallback((service: string) => {
    setSelectedServices((prev) => prev.filter((s) => s !== service));
  }, []);

  const toggleService = useCallback((service: string) => {
    setSelectedServices((prev) => {
      if (prev.includes(service)) {
        return prev.filter((s) => s !== service);
      }
      return [...prev, service];
    });
  }, []);

  const clearServices = useCallback(() => {
    setSelectedServices([]);
  }, []);

  const pushToHistory = useCallback((message: string) => {
    setMessageHistory((prev) => {
      const newHistory = prev.slice(0, currentHistoryIndex + 1);
      return [...newHistory, message];
    });
    setCurrentHistoryIndex((prev) => prev + 1);
  }, [currentHistoryIndex]);

  const undo = useCallback((): string | null => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      setCurrentHistoryIndex(newIndex);
      return messageHistory[newIndex];
    }
    return null;
  }, [currentHistoryIndex, messageHistory]);

  const redo = useCallback((): string | null => {
    if (currentHistoryIndex < messageHistory.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      setCurrentHistoryIndex(newIndex);
      return messageHistory[newIndex];
    }
    return null;
  }, [currentHistoryIndex, messageHistory]);

  const canUndo = currentHistoryIndex > 0;
  const canRedo = currentHistoryIndex < messageHistory.length - 1;

  return (
    <ServiceContext.Provider
      value={{
        selectedServices,
        addService,
        removeService,
        toggleService,
        clearServices,
        messageHistory,
        currentHistoryIndex,
        pushToHistory,
        undo,
        redo,
        canUndo,
        canRedo,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useServiceContext = () => {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error("useServiceContext must be used within a ServiceProvider");
  }
  return context;
};
