import * as React from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState<boolean>(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    const updateMatches = () => {
      setMatches(mediaQuery.matches);
    };

    // Set initial value
    updateMatches();
    
    // Add listener
    mediaQuery.addEventListener("change", updateMatches);
    
    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", updateMatches);
    };
  }, [query]);

  return matches;
}

// For backward compatibility, also export as useIsMobile
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}