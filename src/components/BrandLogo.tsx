type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
};

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export default function BrandLogo({ size = 'md', showText = true }: BrandLogoProps) {
  return (
    <span className="inline-flex items-center gap-2">
      <img src="/logo.svg" alt="EcoDiab logo" className={`${sizeClasses[size]} rounded-md`} />
      {showText ? <span className="font-bold">EcoDiab</span> : null}
    </span>
  );
}
