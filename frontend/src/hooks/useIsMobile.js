import { useEffect, useState } from "react";

const MOBILE_QUERY = "(max-width: 900px)";

export function useIsMobile(query = MOBILE_QUERY) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const sync = () => setIsMobile(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, [query]);

  return isMobile;
}
