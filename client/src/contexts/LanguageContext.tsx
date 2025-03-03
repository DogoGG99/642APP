import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const translations = {
  en: {
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.loginButton': 'Login',
    'auth.registerButton': 'Register',
    'auth.switchToRegister': 'Need an account? Register',
    'auth.switchToLogin': 'Already have an account? Login',

    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.clients': 'Clients',
    'nav.inventory': 'Inventory',
    'nav.reservations': 'Reservations',
    'nav.bills': 'Bills',
    'nav.logout': 'Logout',

    // Clients
    'clients.title': 'Clients',
    'clients.name': 'Name',
    'clients.email': 'Email',
    'clients.phone': 'Phone',
    'clients.add': 'Add Client',
    'clients.edit': 'Edit Client',
    'clients.delete': 'Delete Client',

    // Inventory
    'inventory.title': 'Inventory',
    'inventory.name': 'Name',
    'inventory.description': 'Description',
    'inventory.quantity': 'Quantity',
    'inventory.price': 'Price',
    'inventory.add': 'Add Item',
    'inventory.edit': 'Edit Item',
    'inventory.delete': 'Delete Item',

    // Reservations
    'reservations.title': 'Reservations',
    'reservations.client': 'Client',
    'reservations.date': 'Date',
    'reservations.status': 'Status',
    'reservations.notes': 'Notes',
    'reservations.add': 'Add Reservation',
    'reservations.edit': 'Edit Reservation',
    'reservations.delete': 'Delete Reservation',

    // Bills
    'bills.title': 'Bills',
    'bills.client': 'Client',
    'bills.amount': 'Amount',
    'bills.status': 'Status',
    'bills.date': 'Date',
    'bills.add': 'Add Bill',
    'bills.edit': 'Edit Bill',
    'bills.delete': 'Delete Bill',

    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.actions': 'Actions',
    'common.search': 'Search',
    'common.language': 'Language',
  },
  es: {
    // Auth
    'auth.login': 'Iniciar Sesión',
    'auth.register': 'Registrarse',
    'auth.username': 'Usuario',
    'auth.password': 'Contraseña',
    'auth.loginButton': 'Iniciar Sesión',
    'auth.registerButton': 'Registrarse',
    'auth.switchToRegister': '¿Necesitas una cuenta? Regístrate',
    'auth.switchToLogin': '¿Ya tienes una cuenta? Inicia sesión',

    // Navigation
    'nav.dashboard': 'Panel',
    'nav.clients': 'Clientes',
    'nav.inventory': 'Inventario',
    'nav.reservations': 'Reservas',
    'nav.bills': 'Facturas',
    'nav.logout': 'Cerrar Sesión',

    // Clients
    'clients.title': 'Clientes',
    'clients.name': 'Nombre',
    'clients.email': 'Correo',
    'clients.phone': 'Teléfono',
    'clients.add': 'Añadir Cliente',
    'clients.edit': 'Editar Cliente',
    'clients.delete': 'Eliminar Cliente',

    // Inventory
    'inventory.title': 'Inventario',
    'inventory.name': 'Nombre',
    'inventory.description': 'Descripción',
    'inventory.quantity': 'Cantidad',
    'inventory.price': 'Precio',
    'inventory.add': 'Añadir Artículo',
    'inventory.edit': 'Editar Artículo',
    'inventory.delete': 'Eliminar Artículo',

    // Reservations
    'reservations.title': 'Reservas',
    'reservations.client': 'Cliente',
    'reservations.date': 'Fecha',
    'reservations.status': 'Estado',
    'reservations.notes': 'Notas',
    'reservations.add': 'Añadir Reserva',
    'reservations.edit': 'Editar Reserva',
    'reservations.delete': 'Eliminar Reserva',

    // Bills
    'bills.title': 'Facturas',
    'bills.client': 'Cliente',
    'bills.amount': 'Monto',
    'bills.status': 'Estado',
    'bills.date': 'Fecha',
    'bills.add': 'Añadir Factura',
    'bills.edit': 'Editar Factura',
    'bills.delete': 'Eliminar Factura',

    // Common
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.actions': 'Acciones',
    'common.search': 'Buscar',
    'common.language': 'Idioma',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get the language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es') 
      ? savedLanguage 
      : 'en';
  });

  useEffect(() => {
    // Save language to localStorage when it changes
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};