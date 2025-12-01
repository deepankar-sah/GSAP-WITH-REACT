import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import BasicTweenAnimations from "./components/BasicTweenAnimations";
import StaggersAnimations from "./components/StaggersAnimations";
import InteractiveButton from "./projects/InteractiveButtons";

gsap.registerPlugin(useGSAP);

const App = () => {
  return (
    <main>
      {/* <BasicTweenAnimations /> */}
      {/* <StaggersAnimations /> */}
      <InteractiveButton />
    </main>
  );
};
export default App;
