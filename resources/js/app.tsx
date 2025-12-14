import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { initializeTheme } from './hooks/use-appearance';
import { queryClient } from './lib/query-client';

const appName = import.meta.env.VITE_APP_NAME || 'E-Club';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <QueryClientProvider client={queryClient}>
                    <App {...props} />
                </QueryClientProvider>
            </StrictMode>,
        );
    },
    progress: {
        color: '#FFE400', // Primary yellow color
    },
});

// This will set light / dark mode on load...
initializeTheme();
