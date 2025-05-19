import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Fragment } from 'react';
import { useLocation } from 'react-router-dom';

export default function Breadcrumbs() {
    const paths = useLocation().pathname.split('/');
    const breadcrumbs = paths.map((path) => ({
        label: path.slice(0, 1).toUpperCase() + path.slice(1),
        href: `/${path}`,
    }));

    return (
        <Breadcrumb className="mt-6">
            <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => {
                    if (breadcrumb.label === '') {
                        return (
                            <BreadcrumbItem key={breadcrumb.label}>
                                <BreadcrumbLink href="/">
                                    Home
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        );
                    }
                    if (index === breadcrumbs.length - 1) {
                        return (
                            <Fragment key={breadcrumb.label}>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="font-bold">
                                        {breadcrumb.label}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </Fragment>
                        );
                    }

                    return (
                        <Fragment key={breadcrumb.label}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href={breadcrumb.href}>
                                    {breadcrumb.label}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
