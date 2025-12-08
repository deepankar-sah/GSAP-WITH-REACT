import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import BasicTweenAnimations from "./components/BasicTweenAnimations";
import StaggersAnimations from "./components/StaggersAnimations";
import InteractiveButton from "./projects/InteractiveButtons";
import PageLoadAnimation from "./projects/PageLoadAnimations";
import LoadingSpin from "./projects/LoadingSpin";
import NotificationSystem from "./projects/NotificationSystem";
import BasicScrollAnimation from "./components/BasicScrollAnimations";
import ScrollTimelineAnimation from "./components/ScrollTimelineAnimations";
import AdvancedTimeline from "./components/AdvancedTimeline";
import DragAndDropPhysics from "./components/DragAndDropAnimations";
import SVGMorphingAnimation from "./components/SVGMorphingAnimations";
import BasicSplitText from "./components/BasicSplitText";
import InteractiveSplitText from "./components/InteractiveSplitText";
import ScrollSplitText from "./components/ScrollSplitText";
import ECommerceProductPage from "./projects/ECommerceProductPage";
import ModernPortfolio from "./projects/ModernPortFolio";
import InteractiveDashboard from "./projects/InteractiveDashboard";
import AdvancedAnimationSystem from "./components/AdvancedCustomAnimations";

gsap.registerPlugin(useGSAP);

const App = () => {
  return (
    <main>
      {/* <BasicTweenAnimations /> */}
      {/* <StaggersAnimations /> */}
      {/* <InteractiveButton /> */}
      {/* <PageLoadAnimation /> */}
      {/* <LoadingSpin /> */}
      {/* <NotificationSystem /> */}
      {/* <BasicScrollAnimation /> */}
      {/* <ScrollTimelineAnimation /> */}
      {/* <AdvancedTimeline /> */}
      {/* <DragAndDropPhysics /> */}
      {/* <SVGMorphingAnimation /> */}
      {/* <BasicSplitText /> */}
      {/* <InteractiveSplitText /> */}
      {/* <ScrollSplitText /> */}
      {/* <ECommerceProductPage /> */}
      {/* <ModernPortfolio /> */}
      {/* <InteractiveDashboard /> */}
      <AdvancedAnimationSystem />
    </main>
  );
};
export default App;
