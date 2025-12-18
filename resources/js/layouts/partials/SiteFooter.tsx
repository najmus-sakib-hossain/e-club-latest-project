import Footer from '@/components/footer';
import { FooterData } from '@/types/cms';

export const SiteFooter = ({ footerData }: { footerData: FooterData }) => (
    <Footer footerData={footerData} />
);
