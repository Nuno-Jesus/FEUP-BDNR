import { CartSummary } from '@/components/custom/cartSummary';
import { Button } from '@/components/ui/button';
import Breadcrumbs from '@/components/custom/navigation/breadcrumbs';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
    Form,
    FormItem,
    FormMessage,
    FormControl,
    FormLabel,
    FormField,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { getCurrentUser } from '@/utils/user';
import { clearCart, getCart } from '@/utils/cart';
import { Product } from '@/types/global.types';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
    firstName: z.string().min(1).max(64),
    lastName: z.string().max(64),
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zip: z.string().regex(/^\d{4}-\d{3}$/),
});

export default function CheckoutPage() {
    return (
        <>
            <div className="flex flex-col gap-4">
                <Breadcrumbs />
                <Separator />
            </div>
            <div>
                <p className="text-2xl font-bold mb-2">Checkout</p>
                <p className="text-muted-foreground">Enter your address details to complete your purchase.</p>
            </div>
            <div className="flex justify-between gap-12">
                <CheckoutForm />
                <CartSummary className="w-104 h-fit" />
            </div>
        </>
    );
}

function CheckoutForm() {
    const user = getCurrentUser();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: user?.firstName,
            lastName: user?.lastName,
            street: '',
            city: '',
            state: '',
            zip: '',
        },
    });

    const navigate = useNavigate();

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        const handleBuy = async () => {
            try {
                const userID = getCurrentUser()?.id;
                const cart = getCart();
                const response = await fetch(`http://localhost:5000/api/${userID}/buy`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        items: cart.map((item: { product: Product, quantity: number }) => ({
                            ...item.product,
                            quantity: item.quantity,
                        })),
                        address: {
                            street: data.street,
                            city: data.city,
                            state: data.state,
                            zip: data.zip,
                        },
                    }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                toast.success('Success', {
                    description: 'Your order has been placed successfully!',
                });

                navigate('/orders');
                clearCart();
            } catch (err) {
                toast.error('Error buying products', {
                    description: err.message,
                });
            }
        };

        handleBuy();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 w-[60%] items-end">
                <div className="flex gap-8 w-full items-start">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder={`e.g. ${user?.firstName}`} {...field} className="px-4 py-6" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder={`e.g. ${user?.lastName}`} {...field} className="px-4 py-6" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="street"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Street</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Rua da Alegria, 123" {...field} className="px-4 py-6" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-8 w-full items-start">
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Porto" {...field} className="px-4 py-6" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Gondomar" {...field} className="px-4 py-6" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="zip"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Zip</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 4435-123" {...field} className="px-4 py-6" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" className="w-fit px-12 py-6 text-md font-bold bg-accent text-accent-foreground">
                    Submit
                </Button>
            </form>
        </Form>
    );
}
