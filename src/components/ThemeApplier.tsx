import { useEffect } from 'react';
import { useStore } from '../store';

export default function ThemeApplier() {
  const activeTheme = useStore((s) => s.activeTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [activeTheme]);

  return null;
}
