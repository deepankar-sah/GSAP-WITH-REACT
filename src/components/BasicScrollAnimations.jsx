import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Important: GSAP mein ScrollTrigger register karna zaroori hai
gsap.registerPlugin(ScrollTrigger);

function BasicScrollAnimation() {
  // Multiple elements ke liye refs
  const box1Ref = useRef(null);
  const box2Ref = useRef(null);
  const box3Ref = useRef(null);

  useEffect(() => {
    // Cleanup function - pehle ke sab ScrollTriggers ko kill karo
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Animation 1: Box 1 - Jab scroll karenge tab fade in hoga
    gsap.to(box1Ref.current, {
      scrollTrigger: {
        trigger: box1Ref.current, // Yeh element trigger point hai
        start: "top 80%", // Animation start hoga jab element ka top screen ke 80% pe hoga
        end: "top 20%", // Animation end hoga jab element ka top screen ke 20% pe hoga
        scrub: true, // Scroll ke saath-saath animation chalega
        markers: true, // Debug ke liye markers show karega (production mein false karna)
        toggleActions: "play none none reverse", // Play forward, reverse backward
      },
      x: 200, // Right side mein 200px move karega
      opacity: 1, // Full visible ho jayega
      duration: 1, // Animation duration
      ease: "power2.out",
    });

    // Animation 2: Box 2 - Different animation style
    gsap.from(box2Ref.current, {
      scrollTrigger: {
        trigger: box2Ref.current,
        start: "top 75%", // Thoda pehle start hoga
        end: "top 25%",
        scrub: 1, // Smooth scrub (1 second lag)
        markers: true,
      },
      y: 100, // Niche se upar aayega
      rotation: 180, // Rotate hoga
      scale: 1.5, // Bada ho jayega
      duration: 2,
    });

    // Animation 3: Box 3 - Sequence with scroll
    gsap.to(box3Ref.current, {
      scrollTrigger: {
        trigger: box3Ref.current,
        start: "top bottom", // Jab element bottom se top pe aaye
        end: "bottom top", // Jab element top se bottom pe jaye
        scrub: true,
        markers: true,
      },
      x: 300,
      rotation: 360,
      ease: "none", // No easing - linear animation
    });

    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Scroll Animations Demo</h2>

      {/* Spacer - Scroll karne ke liye space */}
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h3>Scroll karo niche! 👇</h3>
      </div>

      {/* Animated Box 1 */}
      <div
        ref={box1Ref}
        style={{
          width: "150px",
          height: "150px",
          backgroundColor: "#FF6B6B",
          margin: "100px auto",
          opacity: 0.3, // Start mein transparent
          borderRadius: "10px",
        }}
      >
        Box 1 - Fade In on Scroll
      </div>

      {/* Spacer */}
      <div style={{ height: "100vh" }} />

      {/* Animated Box 2 */}
      <div
        ref={box2Ref}
        style={{
          width: "150px",
          height: "150px",
          backgroundColor: "#4ECDC4",
          margin: "100px auto",
          borderRadius: "10px",
        }}
      >
        Box 2 - Scale & Rotate
      </div>

      {/* Spacer */}
      <div style={{ height: "100vh" }} />

      {/* Animated Box 3 */}
      <div
        ref={box3Ref}
        style={{
          width: "150px",
          height: "150px",
          backgroundColor: "#FFD166",
          margin: "100px auto",
          borderRadius: "10px",
        }}
      >
        Box 3 - Continuous Move
      </div>

      {/* More space for scrolling */}
      <div style={{ height: "100vh" }} />
    </div>
  );
}

export default BasicScrollAnimation;
