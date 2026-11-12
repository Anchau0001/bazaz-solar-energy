/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Product, Category, Customer, Sale, BusinessSettings } from './types/index.ts';
import { api } from './services/api.ts';

// Common Components
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { FloatingWhatsApp } from './components/FloatingWhatsApp.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { ReceiptModal } from './components/ReceiptModal.tsx';
import { DownloadAPKModal } from './components/DownloadAPKModal.tsx';

// Public Website Components
import { HeroSection } from './components/PublicWebsite/HeroSection.tsx';
import { ProductCatalogue } from './components/PublicWebsite/ProductCatalogue.tsx';
import { ServicesSection } from './components/PublicWebsite/ServicesSection.tsx';
import { SolarLoadCalculator } from './components/PublicWebsite/SolarLoadCalculator.tsx';
import { FeaturedProjects } from './components/PublicWebsite/FeaturedProjects.tsx';
import { AboutUsSection } from './components/PublicWebsite/AboutUsSection.tsx';
import { ContactAndMapSection } from './components/PublicWebsite/ContactAndMapSection.tsx';
import { FaqAndTestimonials } from './components/PublicWebsite/FaqAndTestimonials.tsx';
import { CustomerInquiryModal } from './components/PublicWebsite/CustomerInquiryModal.tsx';

// Staff & Admin Portals
import { StaffLayout } from './components/StaffPortal/StaffLayout.tsx';
import { AdminLayout } from './components/AdminPortal/AdminLayout.tsx';

function MainApp() {
  const { user, isAdmin, isStaff } = useAuth();
  const [currentView, setCurrentView] = useState<'public' | 'staff' | 'admin'>('public');

  // Shared Data
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isDownloadAPKModalOpen, setIsDownloadAPKModalOpen] = useState(false);
  const [inquiryInitialContext, setInquiryInitialContext] = useState('');
  const [selectedReceiptSale, setSelectedReceiptSale] = useState<Sale | null>(null);

  const loadInitialData = async () => {
    try {
      const [prodData, catData, custData, settingsData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getCustomers().catch(() => []),
        api.getSettings()
      ]);
      setProducts(prodData);
      setCategories(catData);
      setCustomers(custData);
      setSettings(settingsData);
    } catch (err) {
      console.error('Failed to load initial store data:', err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('resetToken')) {
        setIsAuthModalOpen(true);
      }
    }
  }, []);

  // Handle smooth scroll to section on public page
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenInquiry = (productName?: string, refNumber?: string) => {
    if (productName) {
      setInquiryInitialContext(refNumber ? `${productName} (${refNumber})` : productName);
    } else {
      setInquiryInitialContext('');
    }
    setIsInquiryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased selection:bg-amber-400 selection:text-slate-900">
      {/* Universal Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigateView={view => setCurrentView(view)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenDownloadAPK={() => setIsDownloadAPKModalOpen(true)}
        onScrollToSection={handleScrollToSection}
      />

      {/* View Switcher: Public Website vs Staff Portal vs Admin Dashboard */}
      {currentView === 'staff' && (
        <StaffLayout
          products={products}
          customers={customers}
          onOpenReceipt={sale => setSelectedReceiptSale(sale)}
          onNavigateToPublic={() => setCurrentView('public')}
          onRefreshData={loadInitialData}
        />
      )}

      {currentView === 'admin' && settings && (
        <AdminLayout
          products={products}
          categories={categories}
          customers={customers}
          settings={settings}
          onOpenReceipt={sale => setSelectedReceiptSale(sale)}
          onNavigateToPublic={() => setCurrentView('public')}
          onRefreshData={loadInitialData}
        />
      )}

      {currentView === 'public' && (
        <main className="flex-1">
          {/* Hero Section */}
          <HeroSection
            onExploreProducts={() => handleScrollToSection('products-catalogue')}
            onRequestQuote={() => handleOpenInquiry()}
            onOpenCalculator={() => handleScrollToSection('load-calculator')}
            onContactUs={() => handleScrollToSection('contact-us')}
            onDownloadAPK={() => setIsDownloadAPKModalOpen(true)}
          />

          {/* Interactive Solar Load Calculator & System Sizing */}
          <SolarLoadCalculator
            onOpenInquiry={summary => {
              setInquiryInitialContext(summary);
              setIsInquiryModalOpen(true);
            }}
          />

          {/* Searchable & Filterable Product Catalogue with Specs & Comparison */}
          <ProductCatalogue
            products={products}
            categories={categories}
            onOpenInquiry={(pName, pRef) => handleOpenInquiry(pName, pRef)}
          />

          {/* Services Showcase */}
          <ServicesSection
            onRequestService={sName => handleOpenInquiry(sName)}
          />

          {/* Featured Projects & Real Installations in Zaria / Kaduna */}
          <FeaturedProjects
            onRequestQuote={projContext => handleOpenInquiry(projContext)}
          />

          {/* About Us: Company History, Mission, Vision, Core Values */}
          <AboutUsSection />

          {/* FAQs & Verified Customer Testimonials */}
          <FaqAndTestimonials />

          {/* Showroom Location, Contact Info, and Google Maps */}
          <ContactAndMapSection
            onOpenInquiry={() => handleOpenInquiry()}
          />
        </main>
      )}

      {/* Public Footer */}
      {currentView === 'public' && (
        <Footer
          onScrollToSection={handleScrollToSection}
          onOpenInquiry={() => handleOpenInquiry()}
          onDownloadAPK={() => setIsDownloadAPKModalOpen(true)}
        />
      )}

      {/* Floating WhatsApp Action Button */}
      {currentView === 'public' && (
        <FloatingWhatsApp />
      )}

      {/* Customer Enquiry Modal */}
      <CustomerInquiryModal
        isOpen={isInquiryModalOpen}
        initialProductOrService={inquiryInitialContext}
        onClose={() => setIsInquiryModalOpen(false)}
      />

      {/* Download Android APK & PWA Modal */}
      <DownloadAPKModal
        isOpen={isDownloadAPKModalOpen}
        onClose={() => setIsDownloadAPKModalOpen(false)}
      />

      {/* Staff & Admin Login Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessRedirect={role => {
          setCurrentView(role === 'admin' ? 'admin' : 'staff');
        }}
      />

      {/* Official Sales Receipt Modal */}
      {selectedReceiptSale && (
        <ReceiptModal
          sale={selectedReceiptSale}
          settings={settings || undefined}
          onClose={() => setSelectedReceiptSale(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
