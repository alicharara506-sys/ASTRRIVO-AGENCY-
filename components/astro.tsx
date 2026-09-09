import type { CSSProperties } from 'react';
import Image from 'next/image';

export function Astro({ className = '', pose = 0 }: { className?: string; pose?: number }) {
  return <div className={`astro ${className}`} style={{ '--astro-pose': `${pose}deg` } as CSSProperties}>
    <Image src="/assets/universe.webp" width={1536} height={1024} alt="Astro, ASTRIVO’s friendly astronaut navigator" loading="lazy" unoptimized />
  </div>;
}

export function PlanetArt({ crop }: { crop: number[] }) {
  const [x, y, width, height] = crop;
  return <span className="planet-art" aria-hidden="true"><Image src="/assets/universe.webp" width={1536} height={1024} loading="lazy" unoptimized alt="" style={{ width: `${1536 / width * 100}%`, maxWidth: 'none', left: `${-x / width * 100}%`, top: `${-y / height * 100}%` }} /></span>;
}
