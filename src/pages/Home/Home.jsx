import HeroSection from './sections/HeroSection';
import FeatureStrip from './sections/FeatureStrip';
import CollectionsSection from './sections/CollectionsSection';
import BestSellersSection from './sections/BestSellersSection';
import ArrivalSection from './sections/ArrivalSection';
import MoodSection from './sections/MoodSection';
import StorySection from './sections/StorySection';
import LookbookSection from './sections/LookbookSection';
import TestimonialsSection from './sections/TestimonialsSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureStrip />
      <CollectionsSection />
      <BestSellersSection />
      <ArrivalSection />
      <MoodSection />
      <StorySection />
      <LookbookSection />
      <TestimonialsSection />
    </>
  );
}
