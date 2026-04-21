import { ContactSection } from "@/app/components/landing/ContactSection";
import { Features } from "@/app/components/landing/Features";
import { Footer } from "@/app/components/landing/Footer";
import { HelpCenter } from "@/app/components/landing/HelpCenter";
import { Hero } from "@/app/components/landing/Hero";
import { Navbar } from "@/app/components/landing/Navbar";

export default function Home() {
  return (
    <div className="bg-zinc-50 text-zinc-900">
      <Navbar />
      <Hero />
      <Features />
      <HelpCenter />
      <ContactSection />
      <Footer />
    </div>
  );
}
