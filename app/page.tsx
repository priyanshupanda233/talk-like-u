'use client';

import { useState } from 'react';
import LoginPage from '@/components/login-page';
import MainApp from '@/components/main-app';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (user: string) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <div>
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <MainApp username={username} onLogout={handleLogout} />
      )}
    </div>
  );
}
