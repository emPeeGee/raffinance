import { Iconify, SupportedIcons } from './common/Iconify/Iconify';
import LanguagePicker from './common/LangPicker/LangPicker';
import { ToggleColor } from './common/ToggleColor/ToggleColor';
import { AppShell } from './layout/AppShell/AppShell';
import { Footer } from './layout/Footer/Footer';
import Header from './layout/Header/Header';
import Navbar from './layout/Navbar/Navbar';
import { NotFound } from './layout/NotFound/NotFound';
// import Logo from './layout/Logo/Logo';
import { Offline } from './layout/Offline/Offline';
import { Anchor } from './navigation/Anchor/Anchor';
import { ProtectedRoute } from './navigation/ProtectedRoute/ProtectedRoute';

export {
  AppShell,
  Footer,
  Header,
  NotFound,
  // Logo,
  Anchor,
  ProtectedRoute,
  Offline,
  Navbar,
  ToggleColor,
  LanguagePicker,
  Iconify
};
export type { SupportedIcons };
