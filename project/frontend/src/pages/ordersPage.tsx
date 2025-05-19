import Breadcrumbs from '@/components/custom/navigation/breadcrumbs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from '@/components/ui/table';
import useBackend from '@/services/api';
import { Order, Product } from '@/types/global.types';
import { getCurrentUser } from '@/utils/user';
import { toast } from 'sonner';

export default function OrdersPage() {
    const userID = getCurrentUser()?.id;
    const { data, loading, error } = useBackend(`${userID}/orders`);

    if (loading)
        return <Skeleton className="w-full h-full" />;
    if (error)
        toast.error(error);

    return (
        <OrderPageContainer orders={data} />
    );
}

function OrderPageContainer({ orders }: { orders: Order[] }) {
    return (
        <>
            <div className="flex flex-col gap-4">
                <Breadcrumbs />
                <Separator />
            </div>
            <p className="text-2xl font-bold mb-2">Order history</p>
            <p className="text-muted-foreground">
                You have&nbsp;
                <strong>
                    {orders.length}
                </strong>
                &nbsp;past orders.
            </p>
            {
                orders.map((order: Order, index: number) => (
                    <OrderEntry key={index} order={order} index={orders.length - index} />
                ))
            }
        </>
    );
}

function OrderEntry({
    order,
    index,
}: {
    order: Order,
    index: number
}) {
    const total = order.items.reduce((acc, product) => acc + (product.price * product.quantity!), 0);

    return (
        <div className="flex flex-col gap-4 bg-muted p-8 rounded-lg">
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <p className="text-2xl font-bold">
                        Order&nbsp;#
                        {index}
                    </p>
                    <p className="text-muted-foreground">
                        Order placed at&nbsp;
                        {order.date.split('T')[1].split('.')[0].split(':').slice(0, 2).join(':')}
                        &nbsp;on&nbsp;
                        {order.date.split('T')[0]}
                    </p>
                </div>
                <div className="flex flex-col gap-2 text-accent font-bold text-3xl">
                    {total.toFixed(2)}
                    {' €'}
                </div>
            </div>
            <div className="flex flex-col bg-black/30 w-full rounded-lg p-4">
                <p className="text-lg font-bold">
                    Delivery Address
                </p>
                <p>
                    {order.address.street}
                    ,&nbsp;
                    {order.address.city}
                    ,&nbsp;
                    {order.address.state}
                    ,&nbsp;
                    {order.address.zip}
                </p>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center font-bold">Image</TableHead>
                        <TableHead className="text-center font-bold">Product</TableHead>
                        <TableHead className="text-center font-bold">Quantity</TableHead>
                        <TableHead className="text-center font-bold">Price / Unit</TableHead>
                        <TableHead className="text-center font-bold">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        order.items.map((product: Product) => (
                            <TableRow key={product.id}>
                                <TableCell className="flex justify-center items-center">
                                    {
                                        product.image ?
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-24 h-24 rounded-lg"
                                            />
                                            :
                                            <Skeleton className="w-24 h-24" />
                                    }
                                </TableCell>
                                <TableCell className="text-center">
                                    {product.name}
                                </TableCell>
                                <TableCell className="text-center">
                                    {product.quantity}
                                </TableCell>
                                <TableCell className="text-center">
                                    {product.price}
                                    {' €'}
                                </TableCell>
                                    <TableCell className="text-center">
                                        {(product.price * product.quantity!).toFixed(2)}
                                        {' €'}
                                    </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    );
}
