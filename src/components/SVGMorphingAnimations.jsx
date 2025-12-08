import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

// MorphSVG plugin register karo (paid plugin - demo ke liye basic version)
gsap.registerPlugin(MorphSVGPlugin);

function SVGMorphingAnimation() {
  const circleRef = useRef(null);
  const squareRef = useRef(null);
  const triangleRef = useRef(null);
  const heartRef = useRef(null);
  const starRef = useRef(null);
  const [currentShape, setCurrentShape] = useState("circle");

  useEffect(() => {
    // Shapes array for morphing
    const shapes = {
      circle: circleRef.current,
      square: squareRef.current,
      triangle: triangleRef.current,
      heart: heartRef.current,
      star: starRef.current,
    };

    // Initial animation
    gsap.fromTo(
      circleRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1, 0.3)" }
    );
  }, []);

  const morphToShape = (shapeName) => {
    if (shapeName === currentShape) return;

    // Hide all shapes except current and target
    const allShapes = [circleRef, squareRef, triangleRef, heartRef, starRef];
    const currentShapeElement = shapes[currentShape];
    const targetShapeElement = shapes[shapeName];

    // Animation timeline
    const tl = gsap.timeline();

    // Step 1: Current shape fade out
    tl.to(currentShapeElement, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
    })
      // Step 2: Target shape fade in
      .to(
        targetShapeElement,
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        "-=0.1"
      ); // Overlap with previous animation

    // Step 3: Special effects based on shape
    switch (shapeName) {
      case "circle":
        tl.to(
          targetShapeElement,
          {
            rotation: 360,
            duration: 1,
            ease: "power2.inOut",
          },
          "+=0.2"
        );
        break;
      case "star":
        tl.to(
          targetShapeElement,
          {
            scale: 1.2,
            duration: 0.3,
            yoyo: true,
            repeat: 2,
            ease: "power2.inOut",
          },
          "+=0.2"
        );
        break;
      case "heart":
        tl.to(
          targetShapeElement,
          {
            y: -20,
            duration: 0.5,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
          },
          "+=0.2"
        );
        break;
    }

    setCurrentShape(shapeName);
  };

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
      }}
    >
      <h1>SVG Morphing Animation</h1>

      {/* Controls */}
      <div
        style={{
          marginBottom: "30px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {["circle", "square", "triangle", "heart", "star"].map((shape) => (
          <button
            key={shape}
            onClick={() => morphToShape(shape)}
            disabled={currentShape === shape}
            style={{
              padding: "10px 20px",
              backgroundColor: currentShape === shape ? "#666" : "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: currentShape === shape ? "default" : "pointer",
              textTransform: "capitalize",
            }}
          >
            {shape}
          </button>
        ))}
      </div>

      {/* Animation Area */}
      <div
        style={{
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Circle */}
        <svg
          ref={circleRef}
          width="200"
          height="200"
          style={{
            position: "absolute",
            opacity: currentShape === "circle" ? 1 : 0,
          }}
        >
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="#FF6B6B"
            stroke="#333"
            strokeWidth="2"
          />
          <text
            x="100"
            y="110"
            textAnchor="middle"
            fill="white"
            fontSize="20"
            fontWeight="bold"
          >
            Circle
          </text>
        </svg>

        {/* Square */}
        <svg
          ref={squareRef}
          width="200"
          height="200"
          style={{
            position: "absolute",
            opacity: currentShape === "square" ? 1 : 0,
          }}
        >
          <rect
            x="20"
            y="20"
            width="160"
            height="160"
            fill="#4ECDC4"
            stroke="#333"
            strokeWidth="2"
          />
          <text
            x="100"
            y="110"
            textAnchor="middle"
            fill="white"
            fontSize="20"
            fontWeight="bold"
          >
            Square
          </text>
        </svg>

        {/* Triangle */}
        <svg
          ref={triangleRef}
          width="200"
          height="200"
          style={{
            position: "absolute",
            opacity: currentShape === "triangle" ? 1 : 0,
          }}
        >
          <polygon
            points="100,20 180,180 20,180"
            fill="#FFD166"
            stroke="#333"
            strokeWidth="2"
          />
          <text
            x="100"
            y="130"
            textAnchor="middle"
            fill="#333"
            fontSize="20"
            fontWeight="bold"
          >
            Triangle
          </text>
        </svg>

        {/* Heart */}
        <svg
          ref={heartRef}
          width="200"
          height="200"
          style={{
            position: "absolute",
            opacity: currentShape === "heart" ? 1 : 0,
          }}
        >
          <path
            d="M100,180 C40,140 20,100 20,60 C20,30 50,10 80,10 C100,10 120,20 130,40 L140,50 L150,40 C160,20 180,10 200,10 C230,10 260,30 260,60 C260,100 240,140 180,180 L100,280 Z"
            fill="#FF4081"
            stroke="#333"
            strokeWidth="2"
          />
          <text
            x="100"
            y="90"
            textAnchor="middle"
            fill="white"
            fontSize="18"
            fontWeight="bold"
          >
            Heart
          </text>
        </svg>

        {/* Star */}
        <svg
          ref={starRef}
          width="200"
          height="200"
          style={{
            position: "absolute",
            opacity: currentShape === "star" ? 1 : 0,
          }}
        >
          <polygon
            points="100,20 120,80 180,80 130,110 150,170 100,130 50,170 70,110 20,80 80,80"
            fill="#9C27B0"
            stroke="#333"
            strokeWidth="2"
          />
          <text
            x="100"
            y="110"
            textAnchor="middle"
            fill="white"
            fontSize="20"
            fontWeight="bold"
          >
            Star
          </text>
        </svg>
      </div>

      {/* Current Shape Info */}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          display: "inline-block",
        }}
      >
        <h3>
          Current Shape:{" "}
          <span style={{ textTransform: "capitalize", color: "#2196F3" }}>
            {currentShape}
          </span>
        </h3>
        <div style={{ fontSize: "14px", color: "#666" }}>
          Click buttons above to morph between shapes
        </div>
      </div>

      {/* Animation Details */}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "#333",
          color: "white",
          borderRadius: "8px",
          textAlign: "left",
          maxWidth: "600px",
          margin: "30px auto",
        }}
      >
        <h3>Animation Sequence:</h3>
        <ol>
          <li>Current shape scales down and fades out (0.3s)</li>
          <li>New shape scales up with bounce effect (0.5s)</li>
          <li>
            Shape-specific animation:
            <ul>
              <li>
                <strong>Circle</strong>: 360° rotation
              </li>
              <li>
                <strong>Square</strong>: No extra animation
              </li>
              <li>
                <strong>Triangle</strong>: No extra animation
              </li>
              <li>
                <strong>Heart</strong>: Bounce up and down
              </li>
              <li>
                <strong>Star</strong>: Pulse effect (scale up/down)
              </li>
            </ul>
          </li>
        </ol>

        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#444",
            borderRadius: "4px",
          }}
        >
          <h4>Technical Details:</h4>
          <p>
            <strong>GSAP Plugin Used:</strong> MorphSVGPlugin
          </p>
          <p>
            <strong>Animation Type:</strong> Timeline with overlapping
            animations
          </p>
          <p>
            <strong>Easing:</strong> back.out(1.7) for bounce effect
          </p>
          <p>
            <strong>Position Parameter:</strong> "-=0.1" for overlap
          </p>
        </div>
      </div>
    </div>
  );
}

export default SVGMorphingAnimation;
