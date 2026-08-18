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
  FaShieldCat,
  FaBoxOpen,
  FaScrewdriver,
  FaLightbulb,
} from 'react-icons/fa6';
import { getImageUrl } from '@/lib/utils';

interface CategoryIconProps {
  nombre: string;
  slug?: string;
  imagenUrl?: string;
  size?: number;
  className?: string;
}

export default function CategoryIcon({ nombre, slug = '', imagenUrl, size = 28, className = '' }: CategoryIconProps) {
  if (imagenUrl) {
    return (
      <img
        src={getImageUrl(imagenUrl)}
        alt={nombre}
        className={`object-cover rounded-lg ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  const nameLower = (nombre || '').toLowerCase();
  const slugLower = (slug || '').toLowerCase();

  // Match icon based on category name or slug
  if (nameLower.includes('pintur') || slugLower.includes('pintur')) {
    return <FaPaintRoller size={size} className={className} />;
  }
  if (nameLower.includes('calefac') || slugLower.includes('calefac')) {
    return <FaFire size={size} className={className} />;
  }
  if (nameLower.includes('electr') || slugLower.includes('electr') || nameLower.includes('iluminac')) {
    return <FaBolt size={size} className={className} />;
  }
  if (nameLower.includes('jardin') || slugLower.includes('jardin') || nameLower.includes('planta')) {
    return <FaLeaf size={size} className={className} />;
  }
  if (nameLower.includes('construc') || slugLower.includes('construc') || nameLower.includes('obra')) {
    return <FaHardHat size={size} className={className} />;
  }
  if (nameLower.includes('herramient') || slugLower.includes('herramient')) {
    return <FaTools size={size} className={className} />;
  }
  if (nameLower.includes('limpieza') || slugLower.includes('limpieza') || nameLower.includes('quimic')) {
    return <FaBroom size={size} className={className} />;
  }
  if (nameLower.includes('sanitari') || slugLower.includes('sanitari') || nameLower.includes('plomer') || nameLower.includes('baño')) {
    return <FaFaucet size={size} className={className} />;
  }
  if (nameLower.includes('fijacion') || nameLower.includes('tornill') || nameLower.includes('bulon')) {
    return <FaScrewdriver size={size} className={className} />;
  }

  return <FaTools size={size} className={className} />;
}
