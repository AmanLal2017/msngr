import { useState, useEffect } from 'react';

export const useMobileDetector = (breakpoint) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);
    
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};