import { Product } from '@/types/global.types';
import { getCurrentUser } from './user';

export function getCart() {
    const userID = getCurrentUser().id;
    const cart = localStorage.getItem(`cart-${userID}`);
    return cart ? JSON.parse(cart) : [];
}

export function addToCart(product: Product, quantity: number) {
    const userID = getCurrentUser().id;
    const cart = getCart();
    cart.push({ product, quantity });
    localStorage.setItem(`cart-${userID}`, JSON.stringify(cart));
}

export function removeFromCart(product: Product) {
    const userID = getCurrentUser().id;
    const cart = getCart();
    cart.splice(cart.findIndex((item: { product: Product }) => item.product.id === product.id), 1);
    localStorage.setItem(`cart-${userID}`, JSON.stringify(cart));
}

export function clearCart() {
    const userID = getCurrentUser().id;
    localStorage.removeItem(`cart-${userID}`);
}

export function itemInCart(product: Product) {
    const cart = getCart();
    return cart.some((item: { product: Product }) => item.product.id === product.id);
}

export function updateItemQuantity(product: Product, quantity: number) {
    const userID = getCurrentUser().id;
    const cart = getCart();
    const index = cart.findIndex((item: {product: Product}) => item.product.id === product.id);
    cart[index].quantity = quantity;
    localStorage.setItem(`cart-${userID}`, JSON.stringify(cart));
}
