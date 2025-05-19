import { Outlet } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './footer';
import { Toaster } from '@/components/ui/sonner';
import { createContext } from 'react';

export const AccountContext = createContext<string | null>(null);

export default function Layout() {
    return (
        <>
            <Navbar />
            <div className="mx-[15%] space-y-12 min-h-screen">
                <Outlet />
            </div>
            <Footer />
            <Toaster />
        </>
    );
}
