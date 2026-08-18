'use client';

import {
  FaPaintRoller,
  FaTools,
  FaHardHat,
  FaBolt,
  FaLeaf,
  FaBroom,
  FaFaucet,
  FaFire,
  FaShieldAlt,
  FaBoxOpen,
  FaScrewdriver,
  FaLightbulb,
} from 'react-icons/fa';
import { getImageUrl } from '@/lib/utils';

interface CategoryIconProps {
  nombre: string;
  slug?: string;
  imagenUrl?: string;
  size?: number;
  className?: string;
}

export default function CategoryIcon({ nombre, slug = '', imagenUrl, size = 28, className = '' }: CategoryIconProps) {
  if (imagenUrl && imagenUrl.trim().length > 0) {
    return (
      <img
        src={getImageUrl(imagenUrl)}
        alt={nombre}
        className={`object-cover rounded-lg ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  const nameNormalized = (nombre || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const slugNormalized = (slug || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // Match icon based on category name or slug
  if (nameNormalized.includes('pintur') || slugNormalized.includes('pintur')) {
    return <FaPaintRoller size={size} className={className} />;
  }
  if (nameNormalized.includes('calefac') || slugNormalized.includes('calefac')) {
    return <FaFire size={size} className={className} />;
  }
  if (nameNormalized.includes('electr') || slugNormalized.includes('electr') || nameNormalized.includes('iluminac')) {
    return <FaBolt size={size} className={className} />;
  }
  if (nameNormalized.includes('jardin') || slugNormalized.includes('jardin') || nameNormalized.includes('planta')) {
    return <FaLeaf size={size} className={className} />;
  }
  if (nameNormalized.includes('construc') || slugNormalized.includes('construc') || nameNormalized.includes('obra')) {
    return <FaHardHat size={size} className={className} />;
  }
  if (nameNormalized.includes('herramient') || slugNormalized.includes('herramient')) {
    return <FaTools size={size} className={className} />;
  }
  if (nameNormalized.includes('limpieza') || slugNormalized.includes('limpieza') || nameNormalized.includes('quimic')) {
    return <FaBroom size={size} className={className} />;
  }
  if (nameNormalized.includes('sanitari') || slugNormalized.includes('sanitari') || nameNormalized.includes('plomer') || nameNormalized.includes('bano')) {
    return <FaFaucet size={size} className={className} />;
  }
  if (nameNormalized.includes('fijacion') || nameNormalized.includes('tornill') || nameNormalized.includes('bulon')) {
    return <FaScrewdriver size={size} className={className} />;
  }

  return <FaTools size={size} className={className} />;
}
