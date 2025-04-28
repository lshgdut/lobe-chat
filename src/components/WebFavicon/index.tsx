import Image from 'next/image';
import React, { useState } from 'react';

interface WebFaviconProps {
  alt?: string;
  size?: number;
  title?: string;
  url: string;
}

const WebFavicon = ({ url, title, alt, size = 14 }: WebFaviconProps) => {
  const urlObj = new URL(url);
  const host = urlObj.hostname;

  const [imgSrc, setImgSrc] = useState(`//${host}/favicon.ico`);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  const fallbackSources = [
    `https://f1.allesedv.com/${size}/${host}`,
    `https://icons.duckduckgo.com/ip3/${host}.ico`,
    `https://www.google.com/s2/favicons?host=${host}&sz=${size}`,
  ];

  const handleError = () => {
    const nextIndex = fallbackIndex + 1;
    if (nextIndex < fallbackSources.length) {
      setFallbackIndex(nextIndex);
      setImgSrc(fallbackSources[nextIndex]);
    }
  };

  return (
    <Image
      alt={alt || title || url}
      height={size}
      onError={handleError}
      src={imgSrc}
      style={{ borderRadius: 4 }}
      unoptimized
      width={size}
    />
  );
};

export default WebFavicon;
