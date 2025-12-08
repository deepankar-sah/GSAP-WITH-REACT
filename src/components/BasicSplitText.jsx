import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

function BasicSplitText() {
  const textRef = useRef(null);
  const charsRef = useRef(null);
  const wordsRef = useRef(null);
  const linesRef = useRef(null);

  useEffect(() => {
    // Cleanup pehle ke animations
    gsap.killTweensOf(".split-char, .split-word, .split-line");

    // ========== 1. CHARACTERS SPLIT ==========
    if (textRef.current) {
      const splitChars = new SplitText(textRef.current, {
        type: "chars", // Har character ko alag karega
        charsClass: "split-char", // CSS class har character pe
      });

      // Characters animation
      gsap.from(splitChars.chars, {
        duration: 0.5,
        opacity: 0,
        y: 50, // Niche se upar aayega
        rotationX: -90, // 3D rotation effect
        stagger: 0.02, // Har character 0.02s delay se
        ease: "back.out(1.7)", // Bounce effect
      });
    }

    // ========== 2. WORDS SPLIT ==========
    if (wordsRef.current) {
      const splitWords = new SplitText(wordsRef.current, {
        type: "words", // Har word ko alag karega
        wordsClass: "split-word",
      });

      // Words animation with different effect
      gsap.from(splitWords.words, {
        duration: 1,
        opacity: 0,
        x: -100, // Left se right mein aayega
        scale: 0, // Zero size se start
        rotation: 180, // Rotate hoga
        stagger: {
          each: 0.1, // Har word 0.1s gap se
          from: "center", // Beech se start karega
        },
        ease: "elastic.out(1, 0.5)",
      });
    }

    // ========== 3. LINES SPLIT ==========
    if (linesRef.current) {
      const splitLines = new SplitText(linesRef.current, {
        type: "lines", // Har line ko alag karega
        linesClass: "split-line",
      });

      // Lines animation
      gsap.from(splitLines.lines, {
        duration: 1.2,
        opacity: 0,
        y: 100, // Niche se upar aayega
        skewY: 10, // Skew effect
        stagger: 0.3, // Lines ke beech ka gap
        ease: "power3.out",
      });
    }

    // Cleanup function
    return () => {
      // SplitText instances ko revert karna important hai
      const splits = SplitText.getAll();
      splits.forEach((split) => split.revert());
    };
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>Split Text Animations</h1>

      {/* Section 1: Characters Split */}
      <section
        style={{
          margin: "60px 0",
          padding: "30px",
          backgroundColor: "#f8f9fa",
          borderRadius: "10px",
        }}
      >
        <h2 style={{ color: "#FF6B6B" }}>1. Characters Split</h2>
        <div
          ref={textRef}
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            lineHeight: "1.2",
          }}
        >
          ANIMATE EACH CHARACTER
        </div>
        <p style={{ marginTop: "20px", color: "#666" }}>
          Har letter alag-alag animate ho raha hai with 3D rotation effect.
        </p>
      </section>

      {/* Section 2: Words Split */}
      <section
        style={{
          margin: "60px 0",
          padding: "30px",
          backgroundColor: "#f0f8ff",
          borderRadius: "10px",
        }}
      >
        <h2 style={{ color: "#4ECDC4" }}>2. Words Split</h2>
        <div
          ref={wordsRef}
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            lineHeight: "1.4",
          }}
        >
          Every Single Word Animates Separately
        </div>
        <p style={{ marginTop: "20px", color: "#666" }}>
          Har word center se start karke bahar ki taraf expand ho raha hai.
        </p>
      </section>

      {/* Section 3: Lines Split */}
      <section
        style={{
          margin: "60px 0",
          padding: "30px",
          backgroundColor: "#fff8f0",
          borderRadius: "10px",
        }}
      >
        <h2 style={{ color: "#FFD166" }}>3. Lines Split</h2>
        <div
          ref={linesRef}
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            lineHeight: "1.5",
            maxWidth: "600px",
          }}
        >
          This is line one of the text.
          <br />
          This is the second line here.
          <br />
          And this is the third line.
        </div>
        <p style={{ marginTop: "20px", color: "#666" }}>
          Har line alag-alag animate ho rahi hai with skew effect.
        </p>
      </section>

      {/* Technical Details */}
      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#333",
          color: "white",
          borderRadius: "8px",
        }}
      >
        <h3>Technical Implementation:</h3>
        <ul>
          <li>
            <strong>Characters:</strong> type: "chars", stagger: 0.02
          </li>
          <li>
            <strong>Words:</strong> type: "words", stagger from: "center"
          </li>
          <li>
            <strong>Lines:</strong> type: "lines", stagger: 0.3
          </li>
          <li>
            <strong>Cleanup:</strong> SplitText.getAll().revert()
          </li>
        </ul>
      </div>
    </div>
  );
}

export default BasicSplitText;
