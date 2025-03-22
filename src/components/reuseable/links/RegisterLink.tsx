import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from './NextLink';

interface RegisterLinkProps {
  title: string;
  className?: string;
  dataAttributes?: Record<string, string>;
}

const RegisterLink: FC<RegisterLinkProps> = ({ title, className, dataAttributes = {} }) => {
  const router = useRouter();
  const [href, setHref] = useState('/register');
  
  useEffect(() => {
    // Only run on client-side to avoid mismatch
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      // Only add redirect for non-home pages
      if (currentPath !== '/') {
        setHref(`/register?redirect=${encodeURIComponent(currentPath)}`);
      }
    }
  }, []);

  // Convert data attributes to the correct format
  const dataProps: any = {};
  Object.entries(dataAttributes).forEach(([key, value]) => {
    dataProps[`data-${key}`] = value;
  });
  
  return (
    <NextLink 
      title={title} 
      href={href} 
      className={className}
      {...dataProps}
    />
  );
};

export default RegisterLink;