
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant={language === 'es' ? "default" : "outline"} 
        size="sm"
        onClick={() => setLanguage('es')}
      >
        ES
      </Button>
      <Button 
        variant={language === 'en' ? "default" : "outline"} 
        size="sm"
        onClick={() => setLanguage('en')}
      >
        EN
      </Button>
    </div>
  );
}
