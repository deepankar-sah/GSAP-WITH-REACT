import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function ScrollTimelineAnimation() {
  const containerRef = useRef(null);
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const pinElementRef = useRef(null);

  useEffect(() => {
    // Saare purane triggers clear karo
    ScrollTrigger.refresh();
    ScrollTrigger.getAll().forEach((t) => t.kill());

    // Main timeline banao
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current, // Yeh container trigger hoga
        start: "top top", // Container ka top jab viewport ke top pe ho
        end: "+=3000", // 3000 pixels scroll tak chale
        scrub: 1, // Smooth scrubbing
        pin: true, // Container ko pin karo (fix karo) scroll ke time
        anticipatePin: 1, // Smooth pinning
        markers: true, // Debug markers
      },
    });

    // Section 1 Animation
    tl.to(section1Ref.current, {
      x: 300, // Right move
      rotation: 90,
      duration: 1,
    })
      // Section 2 Animation
      .to(section2Ref.current, {
        y: 200, // Down move
        scale: 1.5,
        duration: 1,
      })
      // Section 3 Animation
      .to(section3Ref.current, {
        x: -300, // Left move
        rotation: -90,
        duration: 1,
      });

    // Pin element separately
    gsap.to(pinElementRef.current, {
      scrollTrigger: {
        trigger: pinElementRef.current,
        start: "top center",
        end: "+=500",
        pin: true, // Element screen mein fix rahega
        pinSpacing: false, // Extra space add nahi karega
        markers: true,
      },
      backgroundColor: "#FF6B6B", // Color change
      duration: 1,
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div>
      {/* Introduction Section */}
      <div
        style={{ height: "100vh", padding: "40px", backgroundColor: "#f0f0f0" }}
      >
        <h1>Scroll Timeline Demo</h1>
        <p>Niche scroll karo aur dekho animations ka sequence!</p>
      </div>

      {/* Main Animation Container */}
      <div
        ref={containerRef}
        style={{
          height: "100vh",
          backgroundColor: "#333",
          position: "relative",
        }}
      >
        {/* Section 1 */}
        <div
          ref={section1Ref}
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: "#4ECDC4",
            position: "absolute",
            top: "50px",
            left: "50px",
          }}
        >
          Section 1
        </div>

        {/* Section 2 */}
        <div
          ref={section2Ref}
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: "#FFD166",
            position: "absolute",
            top: "200px",
            left: "50px",
          }}
        >
          Section 2
        </div>

        {/* Section 3 */}
        <div
          ref={section3Ref}
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: "#06D6A0",
            position: "absolute",
            top: "350px",
            left: "50px",
          }}
        >
          Section 3
        </div>
      </div>

      {/* Pin Element Section */}
      <div style={{ height: "800px", position: "relative" }}>
        <div
          ref={pinElementRef}
          style={{
            width: "150px",
            height: "150px",
            backgroundColor: "#118AB2",
            position: "absolute",
            top: "100px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          I'll Pin Here!
        </div>
      </div>

      {/* End Spacer */}
      <div style={{ height: "100vh" }} />
    </div>
  );
}

export default ScrollTimelineAnimation;
