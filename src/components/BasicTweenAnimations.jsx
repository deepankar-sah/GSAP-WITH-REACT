import { useEffect, useRef } from "react";
import gsap from "gsap";

const BasicTweenAnimations = () => {
  const boxRef = useRef();

  useEffect(() => {
    gsap.to(boxRef.current, {
      x: 200,
      y: 100,
      duration: 2,
      delay: 1,
    });

    return () => {
      gsap.killTweensOf(boxRef.current);
    };
  });

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: "30px" }}>Basic tween animations</h1>
      <div
        ref={boxRef}
        style={{
          width: "100px",
          height: "100px",
          backgroundColor: "blue",
          borderRadius: "8px",
          margin: "20px",
        }}
      />
    </div>
  );
};
export default BasicTweenAnimations;
