import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">{t('common.language')}:</span>
      <Select
        value={language}
        onValueChange={(value) => setLanguage(value as 'en' | 'es')}
      >
        <SelectTrigger className="w-[100px] h-8">
          <SelectValue placeholder={language === 'en' ? 'English' : 'Español'} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="es">Español</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;