import { useRef, useState } from "react";
import gsap from "gsap";

function InteractiveButton() {
  // Step 1: Button element ke liye ref
  const buttonRef = useRef(null);

  // Step 2: State for tracking button clicks
  const [clickCount, setClickCount] = useState(0);

  // Step 3: Click handler function
  const handleButtonClick = () => {
    // Click count badhao
    setClickCount((prevCount) => prevCount + 1);

    // Animation timeline create karo
    const tl = gsap.timeline();

    // Sequence of animations
    tl.to(buttonRef.current, {
      scale: 0.8, // Button 80% size ho jayega (compress hoga)
      duration: 0.1, // Very fast animation
      ease: "power2.in", // Fast start, slow end
    })
      .to(buttonRef.current, {
        scale: 1.2, // Button 120% size ho jayega (expand hoga)
        duration: 0.2, // Thoda slow
        ease: "power2.out", // Slow start, fast end
      })
      .to(buttonRef.current, {
        scale: 1, // Original size pe wapas aayega
        duration: 0.1, // Fast return
        ease: "power2.inOut", // Smooth transition
      });

    // Extra effect based on click count
    if ((clickCount + 1) % 3 === 0) {
      // Har 3rd click pe special effect
      gsap.to(buttonRef.current, {
        rotation: 360, // Full rotation
        duration: 0.5,
        ease: "back.out(1.7)", // Bounce effect at the end
      });
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        style={{
          padding: "15px 30px",
          fontSize: "18px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "background-color 0.3s", // CSS transition for hover
        }}
        // Hover effect using CSS
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#45a049";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#4CAF50";
        }}
      >
        Click Me! ({clickCount} clicks)
      </button>
    </div>
  );
}

export default InteractiveButton;
