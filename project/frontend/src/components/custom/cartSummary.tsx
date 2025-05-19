import { getCart } from '@/utils/cart';
import { Card, CardTitle, CardHeader, CardContent } from '../ui/card';
import { Product } from '@/types/global.types';
import { Separator } from '@radix-ui/react-separator';
import { Skeleton } from '../ui/skeleton';

export function CartSummary({ className }: { className?: string }) {
    const cart = getCart();
    const total = cart
        .reduce((acc: number, item: { product: Product, quantity: number }) =>
            acc + (item.product.price * item.quantity), 0)
        .toFixed(2);

    return (
        <Card className={`${className}`}>
            <CardHeader>
                <CardTitle>Cart Summary</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-2">
                    {
                        cart.map((item: { product: Product, quantity: number }) => (
                            <CartItem key={item.product.name} item={item} />
                        ))
                    }
                    <Separator />
                    <div className="flex justify-between">
                        <p className="font-bold">Subtotal</p>
                        <p className="font-bold">
                            {total}
                            {' €'}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function CartItem({ item }: { item: { product: Product, quantity: number } }) {
    return (
        <div key={item.product.name}className="flex justify-between my-1">
            <div className="flex items-start gap-2">
                {
                    item.product.image ?
                        <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 rounded"
                        />
                        :
                        <Skeleton className="w-16 h-16 rounded" />
                }
                <div>
                    {item.product.name}
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                        {Object.entries(item.product.attributes).map(([key, value]) => (
                            <div key={key} className="capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim().split('_').join(' ')}
                                {' - '}
                                {value}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
            <p>
                {item.quantity}
                {' x '}
                {item.product.price}
                {' €'}
            </p>
        </div>
    );
}
