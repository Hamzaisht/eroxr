import { useEffect } from 'react';

export const AppViewport = () => {
  useEffect(() => {
    // Set viewport meta tag for mobile optimization
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
    } else {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(meta);
    }

    // Add status bar styling for iOS
    const statusBarMeta = document.createElement('meta');
    statusBarMeta.name = 'apple-mobile-web-app-status-bar-style';
    statusBarMeta.content = 'black-translucent';
    document.head.appendChild(statusBarMeta);

    // Make it feel more app-like
    const webAppMeta = document.createElement('meta');
    webAppMeta.name = 'apple-mobile-web-app-capable';
    webAppMeta.content = 'yes';
    document.head.appendChild(webAppMeta);

    return () => {
      // Cleanup if needed
    };
  }, []);

  return null;
};