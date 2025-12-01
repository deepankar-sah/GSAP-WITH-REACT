import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import BasicTweenAnimations from "./components/BasicTweenAnimations";
import StaggersAnimations from "./components/StaggersAnimations";
import InteractiveButton from "./projects/InteractiveButtons";
import PageLoadAnimation from "./projects/PageLoadAnimations";

gsap.registerPlugin(useGSAP);

const App = () => {
  return (
    <main>
      {/* <BasicTweenAnimations /> */}
      {/* <StaggersAnimations /> */}
      {/* <InteractiveButton /> */}
      <PageLoadAnimation />
    </main>
  );
};
export default App;
