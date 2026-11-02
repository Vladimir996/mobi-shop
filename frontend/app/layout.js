import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: {
    default: 'MobiShop – Mobilni telefoni i oprema',
    template: '%s | MobiShop',
  },
  description: 'Online prodavnica mobilnih telefona: Apple, Samsung, Xiaomi, Google, Motorola.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="sr">
      <body>
        <CartProvider>
          <Header />
          <main className="main">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
