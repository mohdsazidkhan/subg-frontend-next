import { useState, useEffect } from 'react';

const useSSR = () => {
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  return isSSR;
};

export default useSSR;