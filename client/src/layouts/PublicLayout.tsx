import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow bg-white flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </main>
            <Footer />
        </div>
    );
}
