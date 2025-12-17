'use client';

import { SiteLayout } from '@/layouts/SiteLayout';
import {
    FooterData,
    HomeActivity,
    HomeCoreValue,
    HomePartner,
    HomeProject,
    HomeSection,
    HomeStat,
    NavigationMenu,
} from '@/types/cms';
import { Head } from '@inertiajs/react';

// Sections
import { AboutSection } from './home/sections/AboutSection';
import { ActivitiesSection } from './home/sections/ActivitiesSection';
import { CalendarShopSection } from './home/sections/CalendarShopSection';
import { CommunityBanner } from './home/sections/CommunityBanner';
import { CoreValues } from './home/sections/CoreValues';
import { FeaturedEvents } from './home/sections/FeaturedEvents';
import { FounderMessageSection } from './home/sections/FounderMessageSection';
import { HeroSection } from './home/sections/HeroSection';
import { MapSection } from './home/sections/MapSection';
import { MediaGallery } from './home/sections/MediaGallery';
import { PartnersAndNewsSection } from './home/sections/PartnersAndNewsSection';
import { PresidentMessage } from './home/sections/PresidentMessage';
import { ProjectsSection } from './home/sections/ProjectsSection';
import { SDGGoals } from './home/sections/SDGGoals';
import { TopMarquee } from './home/sections/TopMarquee';

interface HomeProps {
    navigationMenus: NavigationMenu[];
    footerData: FooterData;
    homeSections: HomeSection[];
    stats: HomeStat[];
    activities: HomeActivity[];
    projects: HomeProject[];
    partners: HomePartner[];
    coreValues: HomeCoreValue[];
}

export default function Home(props: HomeProps) {
    const {
        stats,
        activities,
        projects,
        partners,
        coreValues,
        navigationMenus,
        footerData,
    } = props;

    return (
        <SiteLayout navigationMenus={navigationMenus} footerData={footerData}>
            <Head title="Home" />
            <TopMarquee />
            <HeroSection stats={stats} />
            <AboutSection />
            <SDGGoals />
            <FeaturedEvents />
            <CommunityBanner />
            <ActivitiesSection activities={activities} />
            <ProjectsSection projects={projects} />
            <PartnersAndNewsSection partners={partners} />
            <MapSection />
            <CoreValues values={coreValues} />
            <CalendarShopSection />
            <MediaGallery />
            <FounderMessageSection />
            <PresidentMessage />
        </SiteLayout>
    );
}
