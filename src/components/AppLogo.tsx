import Image from 'next/image';
import logoImage from '../../public/LOGO.png';

interface AppLogoProps {
  className?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export default function AppLogo({
  className = 'h-14 md:h-20 w-auto object-contain rounded-md shadow-sm',
  alt = 'Xtracity Hostels Logo',
  width = 260,
  height = 40,
}: AppLogoProps) {
  return (
    <Image
      src={logoImage}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority
      placeholder="blur"
    />
  );
}
