import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import BasicTweenAnimations from "./components/BasicTweenAnimations";
import StaggersAnimations from "./components/StaggersAnimations";
import InteractiveButton from "./projects/InteractiveButtons";
import PageLoadAnimation from "./projects/PageLoadAnimations";
import LoadingSpin from "./projects/LoadingSpin";
import NotificationSystem from "./projects/NotificationSystem";

gsap.registerPlugin(useGSAP);

const App = () => {
  return (
    <main>
      {/* <BasicTweenAnimations /> */}
      {/* <StaggersAnimations /> */}
      {/* <InteractiveButton /> */}
      {/* <PageLoadAnimation /> */}
      {/* <LoadingSpin /> */}
      <NotificationSystem />
    </main>
  );
};
export default App;
