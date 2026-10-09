// components/CarImageDisplay.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getCarImage, CarImageResult } from "../utils/wikimediaImage";

interface CarImageDisplayProps {
  year: string;
  brand: string;
  model: string;
}

export default function CarImageDisplay({ year, brand: brand, model}: CarImageDisplayProps) {
  const [imageResult, setImageResult] = useState<CarImageResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getCarImage(year, brand, model).then((result) => {
      if (!isMounted) return;
      setImageResult(result);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [year, brand, model]);

  if (loading) {
    return (
      <div className="w-full h-64 bg-gray-100 animate-pulse rounded-md flex items-center justify-center text-gray-400 text-sm">
        Loading image for {year} {brand} {model} front...
      </div>
    );
  }

  if (!imageResult) {
    return (
      <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-md text-center text-sm text-gray-500">
        No image found for {year} {brand} {model} front.
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Container wraps standard img element to enforce safe presentation layout */}
      <div className="relative w-full h-64 rounded-md overflow-hidden border border-gray-200 shadow-sm">
        <Image
          src={imageResult.imageUrl}
          alt={`${year} ${brand} ${model}`}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>

      {/* Display image attribution and license information */}
      <div className="mt-2 text-[11px] text-gray-400 text-right space-x-2">
        <span>
          Photo:{" "}
          <a
            href={imageResult.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            {imageResult.artistHtml}
          </a>
          <span className="mx-1">{imageResult.searchQuery}</span>
        </span>
        <span></span>
        <span>
          License:{" "}
          <a
            href={imageResult.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-600"
          >
            {imageResult.licenseName}
          </a>
        </span>
      </div>
    </div>
  );
}
