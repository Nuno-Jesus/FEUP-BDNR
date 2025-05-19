import {
    Product,
    Review,
} from '@/types/global.types';
import {
    Card,
    CardHeader,
    CardContent,
} from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Fragment, useState, ChangeEvent } from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MinusIcon, PlusIcon, ShoppingCartIcon } from 'lucide-react';
import { toast } from 'sonner';
import { addToCart, itemInCart, updateItemQuantity } from '@/utils/cart';
import { getCurrentUser } from '@/utils/user';
import useBackend from '@/services/api';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '../ui/carousel';

export default function ProductCard({ product }: { product: Product }) {
    const [reviews, setReviews] = useState(product.reviews);

    const handleReviewPost = (review: Review) => {
        setReviews([...reviews, review]);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Card className="p-4 gap-1 h-full hover:border-accent hover:cursor-pointer transition-all duration-150">
                    {
                        product.image ?
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full aspect-square rounded-lg"
                            />
                            :
                            <Skeleton className="w-full aspect-square" />
                    }
                    <CardHeader className="px-2">
                        <h3 className="text-md font-semibold overflow-hidden text-ellipsis line-clamp-2 pt-2">
                            {product.name}
                        </h3>
                        <div className="w-full text-sm text-muted-foreground">
                            {Object.keys(product.attributes).map((key: string, index: number) => (
                                <Fragment key={key}>
                                    {product.attributes[key as keyof Product]}
                                    {index != Object.keys(product.attributes).length - 1 && ' - '}
                                </Fragment>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="px-2 flex gap-2">
                        <p
                            className={`text-2xl font-bold text-accent mt-3
                                ${product.discount > 0 ? 'line-through text-lg text-white' : ''}`}
                        >
                            {product.price}
                            {' €'}
                        </p>
                        {
                            product.discount > 0 &&
                            <p className="text-2xl font-bold text-accent mt-3">
                                {(product.price - (product.price * (product.discount / 100))).toFixed(2)}
                                {' €'}
                            </p>
                        }
                    </CardContent>
                </Card>
            </DialogTrigger>

            <DialogContent
                className="min-w-[800px] max-w-[800px] max-h-[80vh]
                overflow-y-auto overflow-x-hidden
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-accent/50
                [&::-webkit-scrollbar-thumb]:rounded-full
                hover:[&::-webkit-scrollbar-thumb]:bg-accent"
            >
                <div className="w-[750px]">
                    <div className="flex flex-row gap-6 mb-6 w-fit">
                        {
                            product.image ?
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-64 aspect-square flex-shrink-0 rounded-lg"
                                />
                                :
                                <Skeleton className="aspect-square w-64 max-w-80 flex-shrink-0 rounded-lg" />
                        }
                        <div className="flex flex-col justify-between w-full">
                            <ProductDialogHeader product={product} />
                            <ProductDialogActions product={product} />
                        </div>
                    </div>

                    <h1 className="text-xl font-semibold">Technical Specifications</h1>
                    <ProductSpecsTable product={product} />

                    <h1 className="font-semibold text-xl my-6">Similar products</h1>
                    <ProductsSuggestions product={product} />
                    <ProductReviewArea product={product} handlePublishReview={handleReviewPost} />

                    <div className="mt-6">
                        <h4 className="font-semibold mb-2">Reviews</h4>
                        <div className="space-y-2">
                            {reviews.map((r, i) => (
                                <Fragment key={i}>
                                    <ProductReview
                                        review={r}
                                    />
                                    {i != reviews.length - 1 && <Separator />}
                                </Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function ProductDialogHeader({ product }: { product: Product }) {
    const stocks = {
        'in stock': product.stock > 10,
        'limited stock': product.stock > 0 && product.stock <= 10,
        'out of stock': product.stock === 0,
        'unknown': typeof product.stock !== 'number',
    };

    const { data, loading, error } = useBackend(`${product.id}/review/average`);

    if (error) {
        toast.error('Error fetching average rating', {
            description: error.message,
        });
    }

    return (
        <DialogHeader>
            <DialogTitle className="break-words">
                {product.name}
            </DialogTitle>
            <DialogDescription className="break-words flex-col flex">
                <div className="flex gap-2">
                    <p
                        className={`text-2xl font-bold text-accent mt-3
                            ${product.discount > 0 ? 'line-through text-lg text-white' : ''}`}
                    >
                        {product.price}
                        {' €'}
                    </p>
                    {
                        product.discount > 0 &&
                        <p className="text-2xl font-bold text-accent mt-3">
                            {(product.price - (product.price * (product.discount / 100))).toFixed(2)}
                            {' €'}
                        </p>
                    }
                </div>
                {
                    !loading && data.averageRating ?
                        <span className="mt-2 text-sm">
                            {`${data.averageRating.toFixed(1)} / 5.0`}
                        </span>
                        :
                        <span className="mt-2 text-sm">
                            This product was not reviewed yet.
                        </span>
                }
                {stocks['in stock'] && (
                    <span className="mt-2 text-sm">
                        {`${product.stock} units in stock.`}
                    </span>
                )}
                {stocks['limited stock'] && (
                    <span className="mt-2 text-yellow-600 text-sm">
                        {`Only ${product.stock} left in stock! Hurry up!`}
                    </span>
                )}
                {stocks['out of stock'] && (
                    <span className="mt-2 text-red-600 text-sm">
                        {'Out of stock.'}
                    </span>
                )}
                {stocks['unknown'] && (
                    <span className="mt-2 text-sm">Stock information unavailable.</span>
                )}
            </DialogDescription>
        </DialogHeader>
    );
}

function ProductDialogActions({ product }: { product: Product }) {
    const [quantity, setQuantity] = useState(1);

    const handleAddToCart = () => {
        if (itemInCart(product)) {
            updateItemQuantity(product, quantity);
            toast('Cart updated', {
                description: `${product.name} quantity updated to ${quantity}.`,
            });
        } else {
            addToCart(product, quantity);
            toast('Product added to cart', {
                description: `${quantity} ${product.name} was added to your cart.`,
            });
        }
    };

    return (
        <div className="flex w-full gap-2">
            <div className="flex items-center border border-muted rounded-lg">
                <Button
                    variant="ghost"
                    className="w-fit cursor-pointer"
                    onClick={() => setQuantity((prev) => prev == product.stock ? prev : prev + 1)}
                >
                    <PlusIcon className="w-4 h-4" />
                </Button>
                <span className="text-sm h-full w-10 flex items-center justify-center">
                    {quantity}
                </span>
                <Button
                    variant="ghost"
                    className="w-fit cursor-pointer"
                    onClick={() => setQuantity((prev) => prev == 0 ? 0 : prev - 1)}
                >
                    <MinusIcon className="w-4 h-4" />
                </Button>
            </div>
            <div className="w-full">
                <Button
                    className="w-full cursor-pointer bg-accent hover:bg-accent/80"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || quantity > product.stock}
                >
                    <ShoppingCartIcon className="w-4 h-4" />
                    Add to cart
                </Button>
            </div>
        </div>
    );
}

function ProductSpecsTable({ product }: { product: Product }) {
    const baseProductKeys = ['id', 'name', 'price', 'image', 'discount', 'category', 'stock'];

    return (
        <Table className="mt-4">
            <TableHeader>
                <TableRow>
                    <TableHead className="px-0 font-semibold">Specification</TableHead>
                    <TableHead className="px-0 font-semibold">Value</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Object.keys(product.attributes).map((key: string) => {
                    if (baseProductKeys.includes(key))
                        return (<></>);
                    return (
                        <TableRow key={key}>
                            <TableCell className="px-0 capitalize">
                                {key.split('_').join(' ')}
                            </TableCell>
                            <TableCell className="px-0">
                                {product.attributes[key as keyof Product]}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

function ProductsSuggestions({ product }: { product: Product }) {
    const { data, loading, error } = useBackend(`${product.id}/similar`);

    if (error) {
        toast.error('Error fetching suggestions', {
            description: error.message,
        });
    }

    const cards = loading
        ? Array(10).map((_) => (
            <Skeleton key={i} className="w-full aspect-square rounded-lg" />
        ))
        : data.map((p) => (
            <CarouselItem key={p.id} className="basis-1/3">
                <ProductCard product={p} />
            </CarouselItem>
        ));


    return (
        <Carousel className="w-full">
            <CarouselContent>
                {cards}
            </CarouselContent>
        </Carousel>
    );
}

function ProductReviewArea({
    product,
    handlePublishReview,
}: {
    product: Product,
    handlePublishReview: (review: Review) => void
}) {
    const [review, setReview] = useState({
        user: `${getCurrentUser()?.firstName} ${getCurrentUser()?.lastName}`,
        title: '',
        text: '',
        date: new Date().toISOString().split('T')[0],
        score: 5,
    });

    const currentUser = getCurrentUser();
    const hasUserReviewed = product.reviews.some((r) => `${currentUser?.firstName} ${currentUser?.lastName}` === r.user);

    const handlePublish = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/${product.id}/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(review),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            handlePublishReview(review);
        } catch (err) {
            toast.error('Error posting review', {
                description: err.message,
            });
        }
    };

    return (
        <div className="mt-2 space-y-3">
            <Separator />
            <h1 className="font-semibold text-xl my-6">Leave a review</h1>
            <div className="flex flex-col sm:flex-row gap-2 items-center">
                <span className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((sq) => (
                        <button
                            key={sq}
                            type="button"
                            className={`w-5 h-5 rounded-xs border border-accent focus:outline-none cursor-pointer
                                ${review.score >= sq ? 'bg-accent' : 'bg-transparent'}`}
                            onClick={() => setReview({ ...review, score: sq })}
                        />
                    ))}
                </span>
                <label htmlFor="review" className="text-muted-foreground text-xs">
                    {review.score}
                    {' / 5'}
                </label>
            </div>
            <Label htmlFor="title" className="text-muted-foreground">
                Title
            </Label>
            <Input
                className="rounded-xs"
                placeholder="e.g. Surpassed my expectations!"
                value={review.title}
                name="title"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setReview({ ...review, title: e.target.value })}
            />
            <Label htmlFor="review" className="text-muted-foreground">
                Description
            </Label>
            <Textarea
                className="mt-4 rounded-xs"
                placeholder="e.g. I'm so happy with this product! It's amazing!"
                value={review.text}
                name="review"
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setReview({ ...review, text: e.target.value })}
            />
            <Button
                className="mt-2 px-4 py-1 bg-accent text-white rounded"
                disabled={!review.text.length || !review.title.length || hasUserReviewed}
                onClick={handlePublish}
            >
                Publish
            </Button>
        </div>
    );
}

function ProductReview({ review }: { review: Review }) {
    return (
        <>
            <div className="py-2 flex justify-between items-center">
                <div className="flex flex-col gap-1 mb-1 w-full">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">
                            {review.user}
                            {' - '}
                            {review.date.split('T')[0]}
                        </span>
                        <span className="flex items-center gap-0.5 ml-2">
                            {[1, 2, 3, 4, 5].map((sq) => (
                                review.score >= sq ?
                                    <span
                                        key={sq}
                                        className={'inline-block w-3 h-3 rounded-xs bg-accent'}
                                    />
                                    :
                                    <span
                                        key={sq}
                                        className={'inline-block w-3 h-3 rounded-xs border border-accent'}
                                    />
                            ))}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">
                            {review.title}
                        </h3>
                        <p className="text-sm">
                            {review.text}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
