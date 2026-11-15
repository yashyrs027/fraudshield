import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { EmergencyBanner } from '../components/layout/EmergencyBanner';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A192F] text-slate-100">
      <EmergencyBanner />
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
