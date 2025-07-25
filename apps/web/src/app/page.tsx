import Header from "../components/sections/Header";
import Navigation from "../components/sections/Navigation";
import Hero from "../components/sections/Hero";
import Logos from "../components/sections/Logos";
import Features from "../components/sections/Features";
import About from "../components/sections/About";
import FAQs from "../components/sections/FAQs/FAQs";
import Testimonials from "../components/sections/Tesimonials/Testimonials";
import Footer from "../components/sections/Footer";

function App() {
  return (
    <>
      <Header>
        <Navigation />
        <Hero />
      </Header>
      <Logos />
      <Features />
      <FAQs />
      <Testimonials />
      <Footer />
    </>
  );
}

export default App;
