import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    'auth.welcome': 'Welcome',
    'auth.loginOrRegister': 'Sign in to your account or create a new one',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.submit': 'Submit',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.dontHaveAccount': 'Don\'t have an account?',
    'auth.createAccount': 'Create Account',
    'auth.name': 'Name',
    'auth.confirmPassword': 'Confirm Password',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.signIn': 'Sign In',
    'nav.dashboard': 'Dashboard',
    'nav.settings': 'Settings',
    'nav.profile': 'Profile',
    'language.select': 'Select Language',
    'language.english': 'English',
    'language.spanish': 'Spanish'
  },
  es: {
    'auth.welcome': 'Bienvenido',
    'auth.loginOrRegister': 'Inicia sesión en tu cuenta o crea una nueva',
    'auth.login': 'Iniciar Sesión',
    'auth.register': 'Registrarse',
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.submit': 'Enviar',
    'auth.forgotPassword': '¿Olvidaste tu contraseña?',
    'auth.dontHaveAccount': '¿No tienes una cuenta?',
    'auth.createAccount': 'Crear Cuenta',
    'auth.name': 'Nombre',
    'auth.confirmPassword': 'Confirmar Contraseña',
    'auth.alreadyHaveAccount': '¿Ya tienes una cuenta?',
    'auth.signIn': 'Iniciar Sesión',
    'nav.dashboard': 'Panel',
    'nav.settings': 'Configuración',
    'nav.profile': 'Perfil',
    'language.select': 'Seleccionar Idioma',
    'language.english': 'Inglés',
    'language.spanish': 'Español'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}