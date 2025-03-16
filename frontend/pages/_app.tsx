import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import '../styles/styles.css'; 
import Menu from '../components/Menu';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLoginPage = router.pathname === '/login';
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const authUserString = localStorage.getItem('authUser');
    if (!authUserString) {
      router.push('/login');
    }
  }, [router]);

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <React.StrictMode>
      <Router>
        {!isLoginPage && <Menu />}
        <Component {...pageProps} />
      </Router>
    </React.StrictMode>
  );
}

export default MyApp;