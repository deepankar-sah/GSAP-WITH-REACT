import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

function InteractiveSplitText() {
  const hoverTextRef = useRef(null);
  const randomTextRef = useRef(null);
  const [splitInstance, setSplitInstance] = useState(null);
  const [hoverActive, setHoverActive] = useState(false);

  useEffect(() => {
    // Cleanup previous splits
    // const splits = SplitText.getAll();
    // splits.forEach((split) => split.revert());

    // ========== HOVER TEXT SPLIT ==========
    if (hoverTextRef.current) {
      const splitText = new SplitText(hoverTextRef.current, {
        type: "chars",
        charsClass: "hover-char",
      });

      setSplitInstance(splitText);

      // Initial animation
      gsap.set(splitText.chars, {
        display: "inline-block", // Important for individual character animation
      });

      gsap.from(splitText.chars, {
        duration: 1,
        opacity: 0,
        y: 30,
        rotation: 10,
        stagger: {
          amount: 1,
          from: "random", // Random order mein animation
        },
        ease: "power3.out",
      });
    }

    // ========== RANDOM TEXT ANIMATION ==========
    if (randomTextRef.current) {
      const splitRandom = new SplitText(randomTextRef.current, {
        type: "chars",
        charsClass: "random-char",
      });

      // Continuous random animation
      const animateRandomChars = () => {
        gsap.to(splitRandom.chars, {
          duration: 0.3,
          y: () => gsap.utils.random(-20, 20), // Random Y position
          x: () => gsap.utils.random(-10, 10), // Random X position
          rotation: () => gsap.utils.random(-30, 30), // Random rotation
          scale: () => gsap.utils.random(0.8, 1.2), // Random scale
          opacity: () => gsap.utils.random(0.7, 1), // Random opacity
          stagger: {
            each: 0.02,
            from: "random",
          },
          ease: "power2.inOut",
          onComplete: animateRandomChars, // Loop mein rahega
        });
      };

      animateRandomChars();
    }

    // Cleanup
    return () => {
      const splits = SplitText.getAll();
      splits.forEach((split) => split.revert());
    };
  }, []);

  // Hover handlers
  const handleMouseEnter = () => {
    if (!splitInstance) return;

    setHoverActive(true);

    // Hover in animation
    gsap.to(splitInstance.chars, {
      duration: 0.3,
      y: -20, // Upar uth jayega
      scale: 1.2, // Bada ho jayega
      color: "#FF6B6B", // Color change
      rotation: () => gsap.utils.random(-15, 15), // Random rotation
      stagger: {
        each: 0.02,
        from: "center",
      },
      ease: "back.out(1.7)",
    });
  };

  const handleMouseLeave = () => {
    if (!splitInstance) return;

    setHoverActive(false);

    // Hover out animation
    gsap.to(splitInstance.chars, {
      duration: 0.5,
      y: 0, // Original position
      scale: 1, // Original size
      color: "#333", // Original color
      rotation: 0, // No rotation
      stagger: {
        each: 0.01,
        from: "edges", // Bahar se andar ki taraf
      },
      ease: "elastic.out(1, 0.5)",
    });
  };

  // Click handler for shuffle
  const shuffleText = () => {
    if (!splitInstance) return;

    // Shuffle animation
    const tl = gsap.timeline();

    tl.to(splitInstance.chars, {
      duration: 0.3,
      opacity: 0,
      y: 50,
      stagger: 0.01,
      ease: "power2.in",
    })
      .to(splitInstance.chars, {
        duration: 0,
        x: () => gsap.utils.random(-300, 300), // Random position
      })
      .to(splitInstance.chars, {
        duration: 0.5,
        opacity: 1,
        y: 0,
        x: 0,
        stagger: {
          each: 0.02,
          from: "random",
        },
        ease: "back.out(1.7)",
      });
  };

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1>Interactive Split Text Effects</h1>

      {/* Section 1: Hover Effect */}
      <section style={{ margin: "60px 0", textAlign: "center" }}>
        <h2 style={{ color: "#4ECDC4", marginBottom: "20px" }}>Hover Effect</h2>
        <div
          ref={hoverTextRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            fontSize: "4rem",
            fontWeight: "bold",
            cursor: "pointer",
            padding: "20px",
            backgroundColor: hoverActive ? "#f0f8ff" : "transparent",
            borderRadius: "10px",
            transition: "background-color 0.3s",
          }}
        >
          HOVER OVER ME
        </div>
        <div style={{ marginTop: "20px", color: "#666" }}>
          Status:{" "}
          <span
            style={{
              color: hoverActive ? "#4CAF50" : "#FF5722",
              fontWeight: "bold",
            }}
          >
            {hoverActive ? "HOVER ACTIVE" : "HOVER INACTIVE"}
          </span>
        </div>
        <button
          onClick={shuffleText}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Shuffle Text
        </button>
      </section>

      {/* Section 2: Random Animation */}
      <section style={{ margin: "60px 0", textAlign: "center" }}>
        <h2 style={{ color: "#FFD166", marginBottom: "20px" }}>
          Continuous Random Animation
        </h2>
        <div
          ref={randomTextRef}
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            padding: "30px",
            backgroundColor: "#fff8f0",
            borderRadius: "10px",
            display: "inline-block",
          }}
        >
          ALWAYS MOVING
        </div>
        <p
          style={{
            marginTop: "20px",
            color: "#666",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Har character continuously random positions, rotations, aur scales
          mein move kar raha hai. Yeh infinite loop mein chal raha hai.
        </p>
      </section>

      {/* Section 3: Effects Gallery */}
      <section style={{ margin: "60px 0" }}>
        <h2
          style={{
            color: "#9C27B0",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          Other Split Text Effects
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "30px",
          }}
        >
          {/* Effect 1: Typewriter */}
          <div
            style={{
              padding: "20px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ color: "#2196F3" }}>Typewriter Effect</h3>
            <div style={{ marginTop: "10px" }}>
              <TypewriterText text="Hello World!" />
            </div>
            <p style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
              Characters sequential appear hote hain typewriter ki tarah.
            </p>
          </div>

          {/* Effect 2: Wave Effect */}
          <div
            style={{
              padding: "20px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ color: "#FF5722" }}>Wave Effect</h3>
            <div style={{ marginTop: "10px" }}>
              <WaveText text="Wave Animation" />
            </div>
            <p style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
              Characters wave pattern mein up-down move karte hain.
            </p>
          </div>

          {/* Effect 3: Color Change */}
          <div
            style={{
              padding: "20px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ color: "#4CAF50" }}>Rainbow Effect</h3>
            <div style={{ marginTop: "10px" }}>
              <RainbowText text="Colorful Text" />
            </div>
            <p style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
              Har character ka alag color aur animation hai.
            </p>
          </div>
        </div>
      </section>

      {/* Code Explanation */}
      <div
        style={{
          marginTop: "40px",
          padding: "25px",
          backgroundColor: "#333",
          color: "white",
          borderRadius: "10px",
          fontFamily: "monospace",
          fontSize: "14px",
        }}
      >
        <h3>Key Code Snippets:</h3>
        <pre
          style={{
            backgroundColor: "#444",
            padding: "15px",
            borderRadius: "5px",
            overflowX: "auto",
            marginTop: "15px",
          }}
        >
          {`// Random position animation:
y: () => gsap.utils.random(-20, 20),
x: () => gsap.utils.random(-10, 10),
rotation: () => gsap.utils.random(-30, 30),

// Stagger patterns:
stagger: { each: 0.02, from: "random" }
stagger: { each: 0.01, from: "center" }
stagger: { each: 0.02, from: "edges" }

// Infinite loop animation:
onComplete: animateRandomChars`}
        </pre>
      </div>
    </div>
  );
}

// Helper Components
function TypewriterText({ text }) {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const split = new SplitText(textRef.current, { type: "chars" });

    gsap.from(split.chars, {
      duration: 0.1,
      opacity: 0,
      y: 20,
      stagger: {
        each: 0.05,
        repeat: -1,
        repeatDelay: 2,
        yoyo: true,
      },
      ease: "power2.out",
    });

    return () => split.revert();
  }, [text]);

  return (
    <div ref={textRef} style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
      {text}
    </div>
  );
}

function WaveText({ text }) {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const split = new SplitText(textRef.current, { type: "chars" });

    gsap.to(split.chars, {
      duration: 1,
      y: -20,
      stagger: {
        each: 0.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      },
      ease: "sine.inOut",
    });

    return () => split.revert();
  }, [text]);

  return (
    <div
      ref={textRef}
      style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#FF5722" }}
    >
      {text}
    </div>
  );
}

function RainbowText({ text }) {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const split = new SplitText(textRef.current, { type: "chars" });
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#FFD166",
      "#06D6A0",
      "#118AB2",
      "#9C27B0",
    ];

    gsap.set(split.chars, {
      color: (i) => colors[i % colors.length],
    });

    gsap.to(split.chars, {
      duration: 2,
      scale: 1.3,
      stagger: {
        each: 0.1,
        repeat: -1,
        yoyo: true,
        from: "start",
      },
      ease: "sine.inOut",
    });

    return () => split.revert();
  }, [text]);

  return (
    <div ref={textRef} style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
      {text}
    </div>
  );
}

export default InteractiveSplitText;
