import { COMPONENTS } from '@/utils/macros';
import Switcher from '../ui/switcher';
import { Input } from '../ui/input';
import { SearchCommandDialog } from '../custom/dialogs/commandDialog';
import { PackageOpen, PackageSearch, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { User } from '@/types/global.types';
import useBackend from '@/services/api';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
    const { data, loading, error } = useBackend('users');

    if (error) {
        console.error('Failed to fetch users:', error);
    }

    return (<NavbarContainer users={data} loading={loading} />);
}

export function NavbarContainer({ users, loading }: { users: User[], loading: boolean }) {
    return (
        <TooltipProvider>
            <div className="flex items-center justify-between w-full p-3 px-[15%] bg-muted gap-4">
                <div className="text-xl font-bold mr-5 text-wrap w-70 tems-center gap-2">
                    <a href="/">
                        <img src="/logo.svg" alt="BDNR Logo" />
                    </a>
                </div>
                <Separator orientation="vertical" className="h-full" />
                <div className="flex justify-start items-center gap-4 w-[100%]">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="">
                                <a href={'/products'}>
                                    <PackageSearch />
                                </a>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Browse products</p>
                        </TooltipContent>
                    </Tooltip>
                    <SearchBar />
                </div>
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="">
                                <a href={'/cart'}>
                                    <ShoppingCart />
                                </a>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Your cart</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="">
                                <a href={'/orders'}>
                                    <PackageOpen />
                                </a>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Orders history</p>
                        </TooltipContent>
                    </Tooltip>
                    {!loading && users.length > 0 && (
                        <Switcher
                            data={users}
                            title="Accounts"
                        />
                    )}
                </div>
            </div>
        </TooltipProvider>
    );
}

function SearchBar() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery) {
            navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="relative w-full">
            <Input
                placeholder="Search"
                className="w-full bg-white h-[44px] shadow-none"
                onKeyDown={handleSearch}
                onChange={(e) => setSearchQuery(e.target.value.trim())}
            />
            <div className="text-muted-foreground absolute right-[10px] top-[10px]">
                <kbd
                    className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border\
                    bg-muted px-1.5 font-mono text-[12px] font-medium text-muted-foreground opacity-100"
                >
                    <span className="text-lg">
                    ⌘
                    </span>
                    K
                </kbd>
            </div>
            <SearchCommandDialog
                entries={COMPONENTS}
            />
        </div>
    );
}
