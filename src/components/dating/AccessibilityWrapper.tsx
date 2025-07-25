import { useEffect } from 'react';

// Simple keyboard shortcuts without external dependency

interface AccessibilityWrapperProps {
  children: React.ReactNode;
  onCreateAd?: () => void;
  onSearch?: () => void;
  onFilters?: () => void;
}

export function AccessibilityWrapper({ 
  children, 
  onCreateAd, 
  onSearch, 
  onFilters 
}: AccessibilityWrapperProps) {
  // Simple keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        onCreateAd?.();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f' && !e.shiftKey) {
        e.preventDefault();
        onSearch?.();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        onFilters?.();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [onCreateAd, onSearch, onFilters]);

  // Enhanced focus management
  useEffect(() => {
    const handleFocusVisible = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.body.classList.add('focus-visible');
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove('focus-visible');
    };

    document.addEventListener('keydown', handleFocusVisible);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleFocusVisible);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  // Skip to main content link
  const skipToMain = () => {
    const main = document.getElementById('main-content');
    if (main) {
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <a 
        href="#main-content" 
        className="skip-link focus-ring"
        onClick={(e) => {
          e.preventDefault();
          skipToMain();
        }}
      >
        Skip to main content
      </a>
      
      <div 
        id="main-content" 
        tabIndex={-1}
        role="main"
        aria-label="Dating profiles and interactions"
      >
        {children}
      </div>

      {/* Screen reader announcements */}
      <div 
        id="sr-announcements" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      />
      
      {/* Keyboard shortcuts help */}
      <div className="hidden" id="keyboard-shortcuts">
        <h2>Keyboard Shortcuts</h2>
        <ul>
          <li>Ctrl/Cmd + N: Create new ad</li>
          <li>Ctrl/Cmd + F: Search profiles</li>
          <li>Ctrl/Cmd + Shift + F: Toggle filters</li>
          <li>Tab: Navigate between elements</li>
          <li>Enter/Space: Activate buttons and links</li>
        </ul>
      </div>
    </>
  );
}

// Utility function to announce to screen readers
export function announceToScreenReader(message: string) {
  const announcements = document.getElementById('sr-announcements');
  if (announcements) {
    announcements.textContent = message;
    // Clear after announcement
    setTimeout(() => {
      announcements.textContent = '';
    }, 1000);
  }
}

// Enhanced focus trap for modals
export function useFocusTrap(isActive: boolean) {
  useEffect(() => {
    if (!isActive) return;

    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const closeButton = document.querySelector('[data-dialog-close]') as HTMLElement;
        closeButton?.click();
      }
    };

    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);
    
    // Focus first element when trap becomes active
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isActive]);
}