import React from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { Outlet } from 'react-router-dom';
import AIChatbot from '../common/AIChatbot';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background-light font-body text-text">
            <Header />
            {/* Main Content Area */}
            <main className="flex-grow container mx-auto px-4 py-8">
                {/* Outlet renders the child routes */}
                <Outlet />
            </main>
            <Footer />
            <AIChatbot />
        </div>
    );
};

export default MainLayout;
