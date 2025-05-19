import Breadcrumbs from '@/components/custom/navigation/breadcrumbs';
import { Product } from '@/types/global.types';
import { clearCart, getCart, removeFromCart, updateItemQuantity } from '@/utils/cart';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MinusIcon, PlusIcon, TrashIcon } from 'lucide-react';
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableCell,
    TableBody,
} from '@/components/ui/table';
import { CartSummary } from '@/components/custom/cartSummary';
import { toast } from 'sonner';

export default function CartPage() {
    const cart = getCart();
    const [cartItems, setCartItems] = useState(cart);

    function handleQuantityChange() {
        setCartItems(getCart());
    }

    function handleClearCart() {
        clearCart();
        setCartItems(getCart());
        toast.success('Cart cleared', {
            description: 'Your cart has been cleared successfully!',
        });
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                <Breadcrumbs />
                <Separator />
            </div>

            <p className="text-2xl font-bold mb-2">Your cart</p>
            <p className="text-muted-foreground">
                You have&nbsp;
                <strong>
                    {cart.length}
                </strong>
                &nbsp;items in your cart.
            </p>
            {
                cart.length > 0 &&
                (
                    <div className="flex gap-12">
                        <CartTable items={cartItems} onQuantityChange={handleQuantityChange} />
                        <div className="flex flex-col gap-2">
                            <CartSummary className="w-128 h-fit" />
                            <div className="flex justify-between gap-2 mt-2">
                                <Button className="py-4 w-[48%]">
                                    <a href="/checkout">
                                        Checkout
                                    </a>
                                </Button>
                                <Button
                                    variant="destructive"
                                    className="py-4 w-[48%]"
                                    onClick={handleClearCart}
                                    disabled={cartItems.length === 0}
                                >
                                    Clear Cart
                                </Button>
                            </div>
                        </div>
                    </div>
                    )
            }
        </>
    );
}

function CartTable({
    className,
    items,
    onQuantityChange,
}: {
    className?: string,
    items: { product: Product, quantity: number }[],
    onQuantityChange: () => void
}) {
    return (
        <Table className={className}>
            <TableHeader>
                <TableRow>
                    <TableHead className="text-center font-bold">Image</TableHead>
                    <TableHead className="text-center font-bold">Product</TableHead>
                    <TableHead className="text-center font-bold">Quantity</TableHead>
                    <TableHead className="text-center font-bold">Price / Unit</TableHead>
                    <TableHead className="text-center font-bold">Total</TableHead>
                    <TableHead className="text-center font-bold">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    items.map((item: { product: Product, quantity: number }) => (
                        <CartItem key={item.product.id} item={item} onQuantityChange={onQuantityChange} />
                    ))
                }
            </TableBody>
        </Table>
    );
}

function CartItem({
    item, onQuantityChange: onProductUpdate }: { item: { product: Product, quantity: number }, onQuantityChange: () => void }) {
    const [quantity, setQuantity] = useState(item.quantity);

    useEffect(() => {
        updateItemQuantity(item.product, quantity);
        onProductUpdate();
    }, [quantity]);

    const handleRemove = () => {
        removeFromCart(item.product);
        onProductUpdate();
    };

    return (
        <TableRow key={item.product.id}>
            <TableCell className="flex justify-center items-center">
                {
                    item.product.image ?
                        <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-24 h-24 rounded-lg"
                        />
                        :
                        <Skeleton className="w-24 h-24" />
                }
            </TableCell>
            <TableCell className="text-center">
                {item.product.name}
            </TableCell>
            <TableCell className="">
                <div className="mx-auto w-fit flex items-center justify-center border border-muted rounded-lg">
                    <Button
                        variant="ghost"
                        className="w-fit cursor-pointer"
                        onClick={() => setQuantity((prev) => prev == item.product.stock ? prev : prev + 1)}
                    >
                        <PlusIcon className="w-4 h-4" />
                    </Button>
                    <span className="text-sm h-full w-10 flex items-center justify-center">
                        {quantity}
                    </span>
                    <Button
                        variant="ghost"
                        className="w-fit cursor-pointer"
                        onClick={() => setQuantity((prev) => prev == 1 ? 1 : prev - 1)}
                    >
                        <MinusIcon className="w-4 h-4" />
                    </Button>
                </div>
            </TableCell>
            <TableCell className="text-center">
                {item.product.price}
                {' €'}
            </TableCell>
            <TableCell className="text-center">
                {(item.product.price * item.quantity).toFixed(2)}
                {' €'}
            </TableCell>
            <TableCell className="text-center">
                <Button variant="destructive" className="w-fit cursor-pointer" onClick={handleRemove}>
                    <TrashIcon className="w-4 h-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
}
