import { Outlet } from 'react-router-dom';
import Header from '../common/Header/Header';
import Footer from '../common/Footer/Footer';
import MobileMenu from '../common/MobileMenu/MobileMenu';
import CartDrawer from '../cart/CartDrawer/CartDrawer';

export default function MainLayout() {
  return (
    <>
      <Header />
      <MobileMenu />
      <CartDrawer />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
