import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from '@/components/ui/pagination';

interface PaginationProps {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
}

export default function PaginationButtons({ pagination }: { pagination: PaginationProps }) {
    const { currentPage, totalPages } = pagination;

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationLink href="?page=1" isActive={currentPage === 1}>
                        1
                    </PaginationLink>
                </PaginationItem>

                {currentPage > 3 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {Array.from({ length: 2 }, (_, i) => currentPage - (2 - i))
                    .filter((p) => p > 1)
                    .map((p) => (
                        <PaginationItem key={p}>
                            <PaginationLink href={`?page=${p}`}>
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                {currentPage !== 1 && currentPage !== totalPages && (
                    <PaginationItem>
                        <PaginationLink href={`?page=${currentPage}`} isActive>
                            {currentPage}
                        </PaginationLink>
                    </PaginationItem>
                )}

                {Array.from({ length: 2 }, (_, i) => currentPage + (i + 1))
                    .filter((p) => p < totalPages)
                    .map((p) => (
                        <PaginationItem key={p}>
                            <PaginationLink href={`?page=${p}`}>
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                {currentPage < totalPages - 2 && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}

                {totalPages > 1 && (
                    <PaginationItem>
                        <PaginationLink href={`?page=${totalPages}`} isActive={currentPage === totalPages}>
                            {totalPages}
                        </PaginationLink>
                    </PaginationItem>
                )}
            </PaginationContent>
        </Pagination>
    );
}
