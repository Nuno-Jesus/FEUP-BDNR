import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from '@/components/ui/carousel';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import { Product } from '@/types/global.types';
import ProductCard from '@/components/custom/productCard';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

const API_BASE_URL = 'http://localhost:5000/api';
export default function HomePage() {
    const [discountedProducts, setDiscountedProducts] = useState<Product[]>([]);
    const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const [discountedResponse, lowStockResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/products/search`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ discount: true }),
                    }),
                    fetch(`${API_BASE_URL}/products/low-stock`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }),
                ]);

                if (!discountedResponse.ok || !lowStockResponse.ok) {
                    throw new Error('Failed to fetch products');
                }

                const [discountedData, lowStockData] = await Promise.all([
                    discountedResponse.json(),
                    lowStockResponse.json(),
                ]);

                setDiscountedProducts(discountedData.data);
                setLowStockProducts(lowStockData.data);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('An error occurred'));
                console.error('Failed to fetch products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (error) {
        toast.error('Failed to fetch products');
    }

    if (loading) {
        return <Skeleton className="w-full h-full" />;
    }

    return (
        <>
            <HomePageMainCarousel />

            <h1 className="text-3xl font-bold">In discount</h1>
            <HomePageProductsCarousel products={discountedProducts} />

            <h1 className="text-3xl font-bold">Low on stock</h1>
            <HomePageProductsCarousel products={lowStockProducts} />
        </>
    );
}

function HomePageMainCarousel() {
    const [api, setApi] = useState<CarouselApi>();
    const [count, setCount] = useState(0);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api)
          return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
      }, [api]);

    return (
        <div className="flex-column justify-center mt-12">
            <Carousel
                className="w-[100%]"
                setApi={setApi}
                plugins={[
                    Autoplay({
                        delay: 4000,
                    }),
                ]}
            >
                <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem key={index}>
                            <Card className="w-[100%] py-0 overflow-hidden">
                                <CardContent className="flex h-[400px] items-center justify-center p-0">
                                    <img src="/carousel/1.png" alt="Carousel 1" className="w-full h-full object-cover" />
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
            <div className="flex justify-center items-center text-muted-foreground mt-4">
                {current}
                &nbsp;/&nbsp;
                {count}
            </div>
        </div>
    );
}

function HomePageProductsCarousel({ products }: { products: Product[] }) {
    return (
        <Carousel className="w-[100%]">
            <CarouselContent>
                {products.map((p, index) => (
                    <CarouselItem key={index} className="basis-1/5">
                        <ProductCard product={p} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}
