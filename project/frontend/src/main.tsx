import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage.tsx';
import ProductsPage from './pages/productsPage.tsx';
import CartPage from './pages/cartPage.tsx';
import CheckoutPage from './pages/checkoutPage.tsx';
import OrdersPage from './pages/ordersPage.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<OrdersPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
