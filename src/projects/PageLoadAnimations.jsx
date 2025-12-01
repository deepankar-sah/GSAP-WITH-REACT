import { useRef, useEffect } from "react";
import gsap from "gsap";

function PageLoadAnimation() {
  // Multiple elements ke liye alag-alag refs
  const headerRef = useRef(null);
  const subtitleRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Step 2: Timeline create karo for sequence
    const pageLoadTimeline = gsap.timeline({
      defaults: {
        // Default settings for all animations in this timeline
        ease: "power2.out",
        duration: 0.8,
      },
    });

    // Step 3: Sequence define karo
    pageLoadTimeline
      // Header animation - pehle yeh hoga
      .from(headerRef.current, {
        y: -100, // Upar se niche aayega
        opacity: 0, // Invisible se visible hoga
        duration: 1, // Override default duration
      })
      // Subtitle animation - header ke baad immediately
      .from(
        subtitleRef.current,
        {
          x: -50, // Left se right mein aayega
          opacity: 0,
          delay: 0.2, // Thoda extra wait after header
        },
        "-=0.5"
      ) // Overlap: 0.5 seconds pehle start hoga
      // Content animation - subtitle ke saath hi
      .from(
        contentRef.current,
        {
          y: 30, // Niche se upar aayega
          opacity: 0,
          stagger: 0.1, // Multiple lines stagger honge
        },
        "-=0.3"
      ) // 0.3 seconds overlap
      // Image animation - content ke baad
      .from(imageRef.current, {
        scale: 0, // Zero size se start
        rotation: -180, // Counter-clockwise rotation
        opacity: 0,
      })
      // Button animation - last mein
      .from(buttonRef.current, {
        y: 50, // Niche se upar aayega
        opacity: 0,
        ease: "bounce.out", // Bounce effect at the end
      });
  }, []); // Empty dependency array = sirf ek baar run hoga

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header Section */}
      <h1
        ref={headerRef}
        style={{
          fontSize: "3rem",
          marginBottom: "10px",
        }}
      >
        Welcome to Our Website
      </h1>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        style={{
          fontSize: "1.2rem",
          color: "#666",
          marginBottom: "30px",
        }}
      >
        Amazing animations with GSAP + React
      </p>

      {/* Content with multiple lines */}
      <div ref={contentRef}>
        <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
          This is the first line of content that will animate with stagger
          effect.
        </p>
        <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
          This is the second line that follows the first one.
        </p>
        <p style={{ marginBottom: "15px", lineHeight: "1.6" }}>
          And this is the third line completing the content section.
        </p>
      </div>

      {/* Image */}
      <div
        ref={imageRef}
        style={{
          width: "200px",
          height: "150px",
          backgroundColor: "#4CAF50",
          margin: "30px auto",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "1.1rem",
        }}
      >
        Animated Image
      </div>

      {/* Button */}
      <div style={{ textAlign: "center" }}>
        <button
          ref={buttonRef}
          style={{
            padding: "12px 24px",
            fontSize: "1rem",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

export default PageLoadAnimation;
