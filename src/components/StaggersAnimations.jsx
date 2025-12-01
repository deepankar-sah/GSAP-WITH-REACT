import { useEffect, useRef } from "react";
import gsap from "gsap";

const StaggersAnimations = () => {
  const boxesRef = useRef([]);

  const addToRefs = (element) => {
    if (element && !boxesRef.current.includes(element)) {
      boxesRef.current.push(element);
    }
  };

  useEffect(() => {
    gsap.to(boxesRef.current, {
      y: 100, // Sab boxes 100px niche move karenge
      rotation: 180, // Sab boxes 180 degrees rotate karenge
      opacity: 0.7, // Sab boxes 70% transparent ho jayenge
      duration: 1,
      stagger: {
        amount: 2,
        from: "start",
      },
      ease: "bounce.out",
    });
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h3>Multiple Animations with stagger effects</h3>
      {[1, 2, 3, 4, 5].map((boxNumber) => (
        <div
          key={boxNumber}
          ref={addToRefs}
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: `hsl(${boxNumber * 60}, 70%, 50%)`, // Different colors
            margin: "10px",
            borderRadius: "4px",
            display: "inline-block",
          }}
        >
          {boxNumber}
        </div>
      ))}
    </main>
  );
};
export default StaggersAnimations;
