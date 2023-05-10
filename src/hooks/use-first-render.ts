import { useState, useEffect } from 'react';

export function useFirstRender() {
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  return isFirstRender;
}
