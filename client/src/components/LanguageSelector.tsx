
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="language-selector">
      <Select
        value={language}
        onValueChange={(value) => setLanguage(value as 'en' | 'es')}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t('language.select')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t('language.english')}</SelectItem>
          <SelectItem value="es">{t('language.spanish')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
