import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { HowItWorks } from '../components/landing/HowItWorks';
import { CTA } from '../components/landing/CTA';
import { FAQ } from '../components/landing/FAQ';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: '#07070B' }}>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CTA />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
