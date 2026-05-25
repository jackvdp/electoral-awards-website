import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from './NextLink';

interface RegisterLinkProps {
  title: string;
  className?: string;
}

const RegisterLink: FC<RegisterLinkProps> = ({ title, className }) => {
  const router = useRouter();
  const [href, setHref] = useState('/register');
  
  useEffect(() => {
    // Only run on client-side to avoid mismatch
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath !== '/' && currentPath !== '/register') {
        setHref(`/register?redirect=${encodeURIComponent(currentPath)}`);
      }
    }
  }, []);
  
  return (
    <NextLink 
      title={title} 
      href={href} 
      className={className}
    />
  );
};

export default RegisterLink;