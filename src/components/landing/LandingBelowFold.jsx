import StatsBar from './StatsBar';
import RelationshipNav from './RelationshipNav';
import CategoryGrid from './CategoryGrid';
import HowItWorks from './HowItWorks';
import DemoVideo from './DemoVideo';
import TwoWaysToBloom from './TwoWaysToBloom';
import LandingFooter from './LandingFooter';

// Below-fold assembly per 2026-05-17 homepage plan:
// 1. StatsBar (existing) — quick proof
// 2. RelationshipNav (NEW) — Hallmark aisle: For Mom / For Dad / etc.
// 3. CategoryGrid (existing) — occasion-first secondary nav
// 4. HowItWorks (existing, now mounted) — 3-step explainer for the
//    "what is this product" question Google Ads flagged
// 5. DemoVideo (existing, now mounted) — recipient experience clip
//    (placeholder until Ak films a real phone-receiving-bloom video)
// 6. TwoWaysToBloom (existing) — pricing tiers
// 7. LandingFooter (existing)

export default function LandingBelowFold() {
  return (
    <>
      <StatsBar />
      <RelationshipNav />
      <CategoryGrid />
      <HowItWorks />
      <DemoVideo />
      <TwoWaysToBloom />
      <LandingFooter />
    </>
  );
}
