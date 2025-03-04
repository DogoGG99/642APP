
import React, { createContext, useState, ReactNode, useContext } from 'react';

type Language = 'es' | 'en';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// Diccionarios de traducción
const translations: Record<Language, Record<string, string>> = {
  es: {
    'login.title': 'Iniciar Sesión',
    'login.username': 'Usuario',
    'login.password': 'Contraseña',
    'login.submit': 'Entrar',
    'register.title': 'Registrarse',
    'register.submit': 'Crear Cuenta',
    // Agrega más traducciones según necesites
  },
  en: {
    'login.title': 'Login',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.submit': 'Sign In',
    'register.title': 'Register',
    'register.submit': 'Create Account',
    // Agrega más traducciones según necesites
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');
  
  // Función para obtener la traducción
  const t = (key: string): string => {
    return translations[language][key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
