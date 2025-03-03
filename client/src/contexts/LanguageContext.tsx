import React, { createContext, useContext, useState, ReactNode } from 'react';

// Traducciones
const translations = {
  en: {
    'auth.welcome': 'Welcome',
    'auth.loginOrRegister': 'Login or create an account',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.usernamePlaceholder': 'Enter your username',
    'auth.passwordPlaceholder': 'Enter your password',
    'nav.dashboard': 'Dashboard',
    'nav.clients': 'Clients',
    'nav.inventory': 'Inventory',
    'nav.reservations': 'Reservations',
    'nav.bills': 'Bills',
    'language.select': 'Language',
    'language.english': 'English',
    'language.spanish': 'Spanish',
  },
  es: {
    'auth.welcome': 'Bienvenido',
    'auth.loginOrRegister': 'Inicia sesión o crea una cuenta',
    'auth.login': 'Iniciar sesión',
    'auth.register': 'Registrarse',
    'auth.username': 'Usuario',
    'auth.password': 'Contraseña',
    'auth.usernamePlaceholder': 'Ingrese su usuario',
    'auth.passwordPlaceholder': 'Ingrese su contraseña',
    'nav.dashboard': 'Panel',
    'nav.clients': 'Clientes',
    'nav.inventory': 'Inventario',
    'nav.reservations': 'Reservaciones',
    'nav.bills': 'Facturas',
    'language.select': 'Idioma',
    'language.english': 'Inglés',
    'language.spanish': 'Español',
  }
};

// Tipos
type Language = 'en' | 'es';
type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Crear contexto
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Proveedor de contexto
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  // Función de traducción
  const t = (key: string): string => {
    return translations[language][key as TranslationKey] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook para usar el contexto
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}