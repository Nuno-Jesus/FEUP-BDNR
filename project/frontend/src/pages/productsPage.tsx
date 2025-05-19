import Breadcrumbs from '@/components/custom/navigation/breadcrumbs';
import ProductCard from '@/components/custom/productCard';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/global.types';
import SearchFilterDialog from '@/components/custom/dialogs/searchFilterDialog';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { useLocation } from 'react-router-dom';
import useBackend from '@/services/api';
import { COMPONENT_CATEGORIES } from '@/utils/macros';
import Pagination from '@/components/custom/navigation/pagination';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    pageSize: number;
}

interface FilterState {
    min: number;
    max: number;
    categories: string[];
    sortBy: string | undefined;
    sortOrder: string | undefined;
    discount: boolean;
}

export default function ProductsPage() {
    const location = useLocation();
    const category = new URLSearchParams(location.search).get('category');
    const page = new URLSearchParams(location.search).get('page');
    const search = new URLSearchParams(location.search).get('search');

    const [filter, setFilter] = useState({
        min: undefined,
        max: undefined,
        categories: category ? [category] : [],
        sortBy: undefined,
        sortOrder: undefined,
        discount: undefined,
    });

    const body = {
        categories: filter.categories.length > 0 ? filter.categories : undefined,
        page: page ? parseInt(page, 10) : undefined,
        minPrice: filter.min,
        maxPrice: filter.max,
        sortBy: filter.sortBy,
        sortOrder: filter.sortOrder,
        discount: filter.discount,
        name: search,
    };

    const { data, loading, error } = useBackend('products/search', {
        method: 'POST',
        body: JSON.stringify(body),
    });

    if (error) {
        console.error(error);
    }

    return (loading
        ? <div>Loading...</div>
        : <ProductsPageContainer
            products={data?.data as Product[]}
            title={filter.categories === COMPONENT_CATEGORIES ? 'All Products' : 'Custom Search'}
            pagination={data?.pagination}
            filter={filter}
            setFilter={setFilter}
          />
    );
}

function ProductsPageContainer({
    products,
    title,
    pagination,
    filter,
    setFilter,
}: {
    products: Product[]
    title: string
    pagination: PaginationProps
    filter: FilterState
    setFilter: (filter: FilterState) => void
}) {
    const minPrice = 0;
    const maxPrice = 1000;

    return (
        <>
            <div className="flex flex-col gap-4">
                <Breadcrumbs />
                <Separator />
            </div>
            <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                    <strong className="text-2xl font-semibold capitalize">
                        {title}
                    </strong>
                    <div className="text-muted-foreground w-full">
                        Your search resulted in
                        <strong>
                            {` ${pagination.totalCount} `}
                        </strong>
                        products.
                    </div>
                </div>
                <SearchFilterDialog
                    trigger={<Button className="hover:cursor-pointer">Filter Results</Button>}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    categories={COMPONENT_CATEGORIES}
                    value={filter}
                    onChange={(newFilter) => setFilter({ ...filter, ...newFilter })}
                    onClear={() => setFilter({
                        min: minPrice,
                        max: maxPrice,
                        categories: [],
                        sortBy: 'price',
                        sortOrder: 'desc',
                        discount: false,
                    })}
                />
            </div>

            <Pagination pagination={pagination} />

            <div className="grid grid-cols-4 gap-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
            <Separator orientation="horizontal" />
            <Pagination pagination={pagination} />
        </>
    );
}
