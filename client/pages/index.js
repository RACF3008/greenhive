import Hero from '../components/home/Hero/Hero';
import Features from '../components/home/Features/Features';

const LandingPage = ({ currentUser }) => {
  return (
    <main>
      <Hero />
      <Features />
    </main>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default LandingPage;
