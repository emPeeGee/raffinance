import ro from 'assets/flags/ro.svg';
import ru from 'assets/flags/ru.svg';
import uk from 'assets/flags/uk.svg';

export type SupportedLanguages = 'ro' | 'en' | 'ru';

export interface Language {
  label: string;
  value: SupportedLanguages;
  image: string;
}

export const languages: Language[] = [
  { label: 'English', value: 'en', image: uk },
  { label: 'Romanian', value: 'ro', image: ro },
  { label: 'Russian', value: 'ru', image: ru }
];
