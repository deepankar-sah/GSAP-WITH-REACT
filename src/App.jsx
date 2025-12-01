import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import BasicTweenAnimations from "./components/BasicTweenAnimations";
import StaggersAnimations from "./components/StaggersAnimations";

gsap.registerPlugin(useGSAP);

const App = () => {
  return (
    <main>
      {/* <BasicTweenAnimations /> */}
      <StaggersAnimations />
    </main>
  );
};
export default App;
