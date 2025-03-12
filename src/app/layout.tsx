import 'src/global.css';

// ----------------------------------------------------------------------

import type { Viewport } from 'next';

import Providers from 'src/app/providers';
import { CONFIG } from 'src/config-global';
import { primary } from 'src/shared/theme/core/palette';
import { ThemeProvider } from 'src/shared/theme/theme-provider';
import { getInitColorSchemeScript } from 'src/shared/theme/color-scheme-script';

import { Snackbar } from 'src/shared/components/snackbar';
import { ProgressBar } from 'src/shared/components/progress-bar';
import { MotionLazy } from 'src/shared/components/animate/motion-lazy';
import { detectSettings } from 'src/shared/components/settings/server';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/shared/components/settings';

import { CheckoutProvider } from 'src/shared/sections/context/checkout-provider';

import { AuthProvider } from 'src/auth/context/jwt'; // ✅ Import the new Providers component
// ----------------------------------------------------------------------

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primary.main,
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const settings = CONFIG.isStaticExport ? defaultSettings : await detectSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {getInitColorSchemeScript}
        <Providers>
          <AuthProvider>
            <SettingsProvider
              settings={settings}
              caches={CONFIG.isStaticExport ? 'localStorage' : 'cookie'}
            >
              <ThemeProvider>
                <MotionLazy>
                  <CheckoutProvider>
                    <Snackbar />
                  </CheckoutProvider>
                  <ProgressBar />
                  <SettingsDrawer />
                  {children}
                </MotionLazy>
              </ThemeProvider>
            </SettingsProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
