import React, { createContext, useContext, useState, ReactNode } from 'react';

// Traducciones
const translations = {
  en: {
    auth: {
      welcome: 'Welcome',
      loginOrRegister: 'Login or create an account',
      login: 'Login',
      register: 'Register',
      email: 'Email',
      emailPlaceholder: 'Enter your email',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      name: 'Name',
      namePlaceholder: 'Enter your name',
      submit: 'Submit',
      loginSuccess: 'Login successful',
      registerSuccess: 'Registration successful'
    },
    sidebar: {
      dashboard: 'Dashboard',
      inventory: 'Inventory',
      billing: 'Billing',
      settings: 'Settings',
      logout: 'Logout'
    },
    // Otras traducciones en inglés
  },
  es: {
    auth: {
      welcome: 'Bienvenido',
      loginOrRegister: 'Inicia sesión o crea una cuenta',
      login: 'Iniciar sesión',
      register: 'Registrarse',
      email: 'Correo electrónico',
      emailPlaceholder: 'Ingresa tu correo electrónico',
      password: 'Contraseña',
      passwordPlaceholder: 'Ingresa tu contraseña',
      name: 'Nombre',
      namePlaceholder: 'Ingresa tu nombre',
      submit: 'Enviar',
      loginSuccess: 'Inicio de sesión exitoso',
      registerSuccess: 'Registro exitoso'
    },
    sidebar: {
      dashboard: 'Panel principal',
      inventory: 'Inventario',
      billing: 'Facturación',
      settings: 'Configuración',
      logout: 'Cerrar sesión'
    },
    // Otras traducciones en español
  }
};

type Language = 'en' | 'es';
type TranslationKey = keyof typeof translations.en | keyof typeof translations.es;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Función para obtener traducción
  const t = (key: string) => {
    const keys = key.split('.');
    let translation: any = translations[language];

    for (const k of keys) {
      if (translation[k] === undefined) {
        return key; // Devuelve la clave si no existe traducción
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

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};