
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define translations
const translations = {
  en: {
    auth: {
      welcome: 'Welcome',
      loginOrRegister: 'Sign in to your account or create a new one',
      login: 'Login',
      register: 'Register',
      username: 'Username',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      usernamePlaceholder: 'Enter your username',
      passwordPlaceholder: 'Enter your password',
      confirmPasswordPlaceholder: 'Confirm your password',
      loginButton: 'Sign in',
      registerButton: 'Create account'
    },
    validation: {
      usernameMin: 'Username must be at least 3 characters',
      passwordMin: 'Password must be at least 6 characters',
      passwordsMatch: 'Passwords must match'
    },
    language: {
      select: 'Language'
    },
    sidebar: {
      dashboard: 'Dashboard',
      settings: 'Settings',
      logout: 'Logout'
    }
  },
  es: {
    auth: {
      welcome: 'Bienvenido',
      loginOrRegister: 'Inicia sesión o crea una cuenta nueva',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      username: 'Usuario',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      usernamePlaceholder: 'Ingresa tu usuario',
      passwordPlaceholder: 'Ingresa tu contraseña',
      confirmPasswordPlaceholder: 'Confirma tu contraseña',
      loginButton: 'Iniciar Sesión',
      registerButton: 'Crear cuenta'
    },
    validation: {
      usernameMin: 'El usuario debe tener al menos 3 caracteres',
      passwordMin: 'La contraseña debe tener al menos 6 caracteres',
      passwordsMatch: 'Las contraseñas deben coincidir'
    },
    language: {
      select: 'Idioma'
    },
    sidebar: {
      dashboard: 'Panel',
      settings: 'Configuración',
      logout: 'Cerrar Sesión'
    }
  }
};

type Language = 'en' | 'es';
type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let translation: any = translations[language];
    
    for (const k of keys) {
      if (translation[k] === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
      translation = translation[k];
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
