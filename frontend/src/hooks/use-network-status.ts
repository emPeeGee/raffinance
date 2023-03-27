import { useState } from 'react';

export const useNetworkStatus = () => {
  // TODO: why always true ??? navigator.onLine
  const [isOnline, setIsOnline] = useState(true);

  window.addEventListener('online', () => {
    setIsOnline(true);
  });

  window.addEventListener('offline', () => {
    setIsOnline(false);
  });

  return { isOnline };
};
