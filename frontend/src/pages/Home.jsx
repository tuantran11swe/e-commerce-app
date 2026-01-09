import BestSeller from "../components/BestSeller";
import Hero from "../components/Hero";
import LatestCollections from "../components/LatestCollections";
import Newletter from "../components/Newletter";
import OutPolicy from "../components/OutPolicy";

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollections />
      <BestSeller />
      <OutPolicy />
      <Newletter />
    </div>
  );
};

export default Home;
