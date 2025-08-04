import Link from 'next/link';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  backgroundGradient?: string;
  maxWidth?: string;
}

export default function PageLayout({ 
  children, 
  title,
  subtitle,
  showBackButton = false,
  backgroundGradient = "from-blue-50 to-indigo-100",
  maxWidth = "max-w-2xl"
}: PageLayoutProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundGradient}`}>
      <div className="container mx-auto px-4 py-16">
        <div className={`${maxWidth} mx-auto bg-white rounded-lg shadow-lg p-8`}>
          {(title || subtitle || showBackButton) && (
            <div className="text-center mb-8">
              <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                TripEase
              </Link>
              {title && (
                <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-gray-600">
                  {subtitle}
                </p>
              )}
            </div>
          )}
          
          {children}
          
          {showBackButton && (
            <div className="mt-8 text-center">
              <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
                ← Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}