import '../styles/globals.css';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }: any) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <>
      {/* 🌙 ダークモード切り替えボタン */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-4 right-4 z-50 p-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-full shadow transition"
      >
        {isDark ? '☀️ Light' : '🌙 Dark'}
      </button>

      {/* 各ページの中身 */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

