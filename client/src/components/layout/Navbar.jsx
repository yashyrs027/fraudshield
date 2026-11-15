import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Shield,
  PhoneCall,
  Menu,
  X,
  User,
  Sun,
  Moon,
  Accessibility,
  Languages,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../common/Button';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme, seniorMode, toggleSeniorMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A192F]/90 backdrop-blur-md border-b border-[#233554]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-navy-950 shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Fraud<span className="text-teal-400">Shield</span>
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  IN
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
                AI Payment Defense
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/')
                  ? 'text-teal-400 bg-teal-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-slate-850'
              }`}
            >
              {t('nav.home')}
            </Link>

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/dashboard')
                    ? 'text-teal-400 bg-teal-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-850'
                }`}
              >
                {t('nav.dashboard')}
              </Link>
            )}

            <Link
              to="/analyze/message"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/analyze/message')
                  ? 'text-teal-400 bg-teal-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-slate-850'
              }`}
            >
              {t('nav.messageAnalyzer')}
            </Link>

            <Link
              to="/analyze/qr"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/analyze/qr')
                  ? 'text-teal-400 bg-teal-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-slate-850'
              }`}
            >
              {t('nav.qrAnalyzer')}
            </Link>

            <Link
              to="/analyze/url"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/analyze/url')
                  ? 'text-teal-400 bg-teal-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-slate-850'
              }`}
            >
              {t('nav.urlChecker')}
            </Link>

            <Link
              to="/incident-center"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/incident-center')
                  ? 'text-rose-400 bg-rose-500/10'
                  : 'text-rose-300 hover:text-rose-200 hover:bg-rose-950/40'
              }`}
            >
              {t('nav.incidentCenter')}
            </Link>

            <Link
              to="/awareness"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/awareness')
                  ? 'text-teal-400 bg-teal-500/10'
                  : 'text-slate-300 hover:text-white hover:bg-slate-850'
              }`}
            >
              {t('nav.awareness')}
            </Link>
          </nav>

          {/* Action Tools & Accessibility Controls */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* National 1930 Helpline Button */}
            <a
              href="tel:1930"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all shadow-sm"
              title="Call National Cyber Helpline"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>1930 Helpline</span>
            </a>

            {/* Senior Mode Toggle */}
            <button
              onClick={toggleSeniorMode}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                seniorMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/10'
                  : 'bg-[#112240] text-slate-400 border-[#233554] hover:text-slate-200'
              }`}
              title="Toggle Senior Citizen High-Contrast / Large Text Mode"
              aria-label="Toggle Senior Citizen Mode"
            >
              <Accessibility className="w-4 h-4" />
              <span className="hidden xl:inline">Senior Mode</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-xl bg-[#112240] text-slate-300 border border-[#233554] hover:border-teal-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Switch Language (English / हिन्दी)"
            >
              <Languages className="w-3.5 h-3.5 text-teal-400" />
              <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-[#112240] text-slate-300 border border-[#233554] hover:border-teal-500/40 transition-all"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-teal-400" />
              )}
            </button>

            {/* Auth State Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl bg-[#112240] border border-[#233554] hover:border-teal-500/40 text-xs font-bold text-slate-200"
                >
                  <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <span className="max-w-[90px] truncate">{user?.fullName?.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#112240] rounded-xl border border-[#233554] shadow-2xl py-1 z-50 animate-fade-in">
                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-[#1E3A8A]/50 hover:text-white"
                    >
                      {t('nav.dashboard')}
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-[#1E3A8A]/50 hover:text-white"
                    >
                      {t('nav.profile')}
                    </Link>
                    <hr className="border-[#233554] my-1" />
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('nav.logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    {t('nav.register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href="tel:1930"
              className="p-2 rounded-xl bg-rose-600/20 text-rose-300 border border-rose-500/40"
              title="Call 1930"
            >
              <PhoneCall className="w-4 h-4" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#112240] text-slate-300 border border-[#233554]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#233554] bg-[#0A192F] px-4 pt-2 pb-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#233554]/50">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-lg bg-[#112240] text-xs font-bold text-slate-200 border border-[#233554]"
            >
              {lang === 'en' ? 'हिन्दी में बदलें' : 'Switch to English'}
            </button>
            <button
              onClick={toggleSeniorMode}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                seniorMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                  : 'bg-[#112240] text-slate-200 border-[#233554]'
              }`}
            >
              Senior Mode: {seniorMode ? 'ON' : 'OFF'}
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-200 hover:bg-[#112240]"
            >
              {t('nav.home')}
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-200 hover:bg-[#112240]"
              >
                {t('nav.dashboard')}
              </Link>
            )}
            <Link
              to="/analyze/message"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-200 hover:bg-[#112240]"
            >
              {t('nav.messageAnalyzer')}
            </Link>
            <Link
              to="/analyze/qr"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-200 hover:bg-[#112240]"
            >
              {t('nav.qrAnalyzer')}
            </Link>
            <Link
              to="/analyze/url"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-200 hover:bg-[#112240]"
            >
              {t('nav.urlChecker')}
            </Link>
            <Link
              to="/incident-center"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-rose-300 hover:bg-rose-950/30"
            >
              {t('nav.incidentCenter')}
            </Link>
            <Link
              to="/awareness"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-200 hover:bg-[#112240]"
            >
              {t('nav.awareness')}
            </Link>
            {isAuthenticated ? (
              <div className="pt-2 border-t border-[#233554] space-y-2">
                <Link
                  to="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-200 hover:bg-[#112240] block"
                >
                  {t('nav.profile')}
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-rose-400 hover:bg-rose-950/40"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-[#233554] flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1"
                >
                  <Button variant="secondary" size="md" className="w-full">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1"
                >
                  <Button variant="primary" size="md" className="w-full">
                    {t('nav.register')}
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
