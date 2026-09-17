import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { STRINGS } from "../data/strings";
import { Storage } from "../storage/storage";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await Storage.getLanguage();
      setLang(saved === "hi" ? "hi" : "en");
      setReady(true);
    })();
  }, []);

  const toggleLanguage = useCallback(() => {
    setLang((prev) => {
      const next = prev === "en" ? "hi" : "en";
      Storage.setLanguage(next);
      return next;
    });
  }, []);

  const t = useMemo(() => STRINGS[lang], [lang]);

  const value = useMemo(
    () => ({ lang, t, toggleLanguage, ready }),
    [lang, t, toggleLanguage, ready]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
