import { useEffect, useRef } from "react";
import gsap from "gsap";

const LoadingSpin = () => {
  const dotsRef = useRef([]);

  const addToRef = (element) => {
    if (element && !dotsRef.current.includes(element)) {
      dotsRef.current.push(element);
    }
  };

  useEffect(() => {
    gsap.to(dotsRef.current, {
      y: 20,
      duration: 0.3,
      //   delay: 0.7,
      stagger: 0.3,
      repeat: -1,
      yoyo: true,
      ease: "power1.in",
    });
  }, []);

  return (
    <main
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        overflowX: "hidden",
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
        gap: 20,
      }}
    >
      {[1, 2, 3].map((dots) => (
        <div
          ref={addToRef}
          key={dots}
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
            backgroundColor: "teal",
          }}
        ></div>
      ))}
    </main>
  );
};
export default LoadingSpin;
