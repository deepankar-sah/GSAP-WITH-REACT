import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import BasicTweenAnimations from "./components/BasicTweenAnimations";

gsap.registerPlugin(useGSAP);

const App = () => {
  return (
    <main>
      <BasicTweenAnimations />
    </main>
  );
};
export default App;
