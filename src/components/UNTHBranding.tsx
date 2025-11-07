import React from 'react';

// University of Nigeria Teaching Hospital Enugu Logo
// Since we couldn't fetch the actual logo, I'll create a placeholder that can be replaced with the actual logo
export const UNTHLogo = () => (
  <div className="flex items-center space-x-3">
    <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
      <span className="text-white font-bold text-lg">UNTH</span>
    </div>
    <div className="text-left">
      <div className="text-lg font-bold text-clinical-dark">UNTH</div>
      <div className="text-xs text-clinical">Ituku/Ozalla, Enugu</div>
    </div>
  </div>
);

// Hospital branding configuration
export const hospitalBranding = {
  name: "University of Nigeria Teaching Hospital",
  shortName: "UNTH",
  location: "Ituku/Ozalla, Enugu",
  fullAddress: "University of Nigeria Teaching Hospital, Ituku/Ozalla, Enugu, Nigeria",
  phone: "+234 703 132 2008",
  email: "info@unth.edu.ng",
  website: "https://unth.edu.ng",
  emergencyNumber: "0703 132 2008",
  colors: {
    primary: "#0E9F6E", // Green - medical/health color
    secondary: "#DC2626", // Red - emergency/alert color
    accent: "#1E40AF" // Blue - professional color
  },
  motto: "Service to Humanity",
  established: "1970"
};