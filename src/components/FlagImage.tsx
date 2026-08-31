import React from 'react';

interface FlagImageProps {
  countryCode: string;
  countryName?: string;
  className?: string;
}

export const FlagImage: React.FC<FlagImageProps> = ({
  countryCode,
  countryName,
  className = "w-full h-full object-cover"
}) => {
  const code = countryCode.toLowerCase();
  
  return (
    <img
      src={`/flags/${code}.svg`}
      alt={countryName ? `Flag of ${countryName}` : `Flag of ${countryCode}`}
      className={className}
      loading="lazy"
    />
  );
};
