"use client";

import { useEffect } from 'react';
import WOW from 'wowjs';
import { usePathname } from "next/navigation";


export default function WowInit() {
  const pathname = usePathname();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const wow = new WOW.WOW({
        live: false, // To prevent issues with dynamic content
        mobile:false
      });
      wow.init();
    }
  }, []);

  return null; // This component doesn't render anything to the DOM
}
