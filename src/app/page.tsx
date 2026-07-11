import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Journey from "@/components/Journey";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Chat from "@/components/Chat";
import Contact from "@/components/Contact";
import PixelPal from "@/components/PixelPal";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main" className="flex-1">
        <Hero />
        <Marquee />
        <About />
        <Journey />
        <Projects />
        <Skills />
        <Chat />
        <Contact />
      </main>
      <PixelPal />
    </>
  );
}
