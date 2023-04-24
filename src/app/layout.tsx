import './globals.css';
import { Source_Sans_Pro } from 'next/font/google';

const sansPro = Source_Sans_Pro({
  weight: ['200', '300', '400', '600', '700'],
  subsets: ['latin'],
});

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={sansPro.className}>{children}</body>
    </html>
  );
}
