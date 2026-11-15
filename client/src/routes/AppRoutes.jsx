import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Pages
import { LandingPage } from '../pages/LandingPage';
import { ProtectionDashboard } from '../pages/ProtectionDashboard';
import { MessageAnalyzer } from '../pages/MessageAnalyzer';
import { QrAnalyzer } from '../pages/QrAnalyzer';
import { UrlChecker } from '../pages/UrlChecker';
import { UnifiedResults } from '../pages/UnifiedResults';
import { FraudResponseCenter } from '../pages/FraudResponseCenter';
import { FraudAwareness } from '../pages/FraudAwareness';
import { ProfileSettings } from '../pages/ProfileSettings';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { PrivacyPolicy } from '../pages/PrivacyPolicy';
import { TermsConditions } from '../pages/TermsConditions';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Main Public & Protected Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProtectionDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/analyze/message" element={<MessageAnalyzer />} />
        <Route path="/analyze/qr" element={<QrAnalyzer />} />
        <Route path="/analyze/url" element={<UrlChecker />} />
        <Route path="/results/:sessionId" element={<UnifiedResults />} />
        <Route path="/incident-center" element={<FraudResponseCenter />} />
        <Route path="/awareness" element={<FraudAwareness />} />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          }
        />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Auth Layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
};
