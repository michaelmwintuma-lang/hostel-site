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
    <div className={`flex items-center overflow-hidden rounded-md shadow-sm bg-white ${className?.replace('rounded-md shadow-sm', '')}`}>
      <Image
        src={logoImage}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-contain transform scale-[1.03] translate-y-[2%]"
        priority
        placeholder="blur"
        style={{ clipPath: 'inset(0 0 10% 0)' }}
      />
    </div>
  );
}
