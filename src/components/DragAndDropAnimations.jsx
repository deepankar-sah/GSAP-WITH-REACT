import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

// Draggable plugin register karo
gsap.registerPlugin(Draggable);

function DragAndDropPhysics() {
  const dragBoxRef = useRef(null);
  const dropZoneRef = useRef(null);
  const [isInZone, setIsInZone] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!dragBoxRef.current || !dropZoneRef.current) return;

    // Draggable instance create karo
    const draggable = Draggable.create(dragBoxRef.current, {
      type: "x,y", // X and Y directions mein drag allow karo
      bounds: ".container", // Container ke andar hi drag kar sakte hain
      inertia: true, // Physics effect - drag karne ke baad thoda slide karega
      resistance: 0.5, // Drag resistance
      onDragStart: function () {
        // Drag start pe animation
        gsap.to(this.target, {
          scale: 1.1,
          duration: 0.2,
        });
      },
      onDrag: function () {
        // Check if box drop zone mein hai
        const boxRect = this.target.getBoundingClientRect();
        const zoneRect = dropZoneRef.current.getBoundingClientRect();

        const isOverlapping =
          boxRect.left < zoneRect.right &&
          boxRect.right > zoneRect.left &&
          boxRect.top < zoneRect.bottom &&
          boxRect.bottom > zoneRect.top;

        if (isOverlapping && !isInZone) {
          setIsInZone(true);
          gsap.to(this.target, {
            backgroundColor: "#4CAF50",
            duration: 0.3,
          });
          gsap.to(dropZoneRef.current, {
            scale: 1.1,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
          });
        } else if (!isOverlapping && isInZone) {
          setIsInZone(false);
          gsap.to(this.target, {
            backgroundColor: "#2196F3",
            duration: 0.3,
          });
        }
      },
      onDragEnd: function () {
        // Drag end pe animation
        gsap.to(this.target, {
          scale: 1,
          duration: 0.2,
        });

        // Check if successfully dropped in zone
        const boxRect = this.target.getBoundingClientRect();
        const zoneRect = dropZoneRef.current.getBoundingClientRect();

        const isDroppedInZone =
          boxRect.left < zoneRect.right &&
          boxRect.right > zoneRect.left &&
          boxRect.top < zoneRect.bottom &&
          boxRect.bottom > zoneRect.top;

        if (isDroppedInZone) {
          // Success animation
          setScore((prev) => prev + 1);

          const tl = gsap.timeline();
          tl.to(this.target, {
            scale: 1.5,
            rotation: 360,
            duration: 0.5,
            ease: "back.out(1.7)",
          }).to(this.target, {
            scale: 1,
            duration: 0.3,
          });

          // Reset position after 1 second
          setTimeout(() => {
            gsap.to(this.target, {
              x: 0,
              y: 0,
              duration: 0.5,
              ease: "power2.out",
            });
          }, 1000);
        }
      },
    });

    // Cleanup
    return () => {
      if (draggable[0]) {
        draggable[0].kill();
      }
    };
  }, [isInZone]);

  return (
    <div
      className="container"
      style={{
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        position: "relative",
        height: "600px",
        border: "2px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <h1>Drag & Drop Physics Demo</h1>

      {/* Score Display */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#333",
          color: "white",
          borderRadius: "4px",
        }}
      >
        Score:{" "}
        <span style={{ fontSize: "24px", fontWeight: "bold" }}>{score}</span>
      </div>

      {/* Instructions */}
      <div style={{ marginBottom: "30px" }}>
        <p>Drag the blue box into the green drop zone!</p>
        <p>Status: {isInZone ? "✅ In Drop Zone!" : "❌ Not in Zone"}</p>
      </div>

      {/* Draggable Box */}
      <div
        ref={dragBoxRef}
        style={{
          width: "100px",
          height: "100px",
          backgroundColor: "#2196F3",
          borderRadius: "8px",
          cursor: "grab",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          userSelect: "none",
          position: "absolute",
          top: "150px",
          left: "50px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
      >
        Drag Me!
      </div>

      {/* Drop Zone */}
      <div
        ref={dropZoneRef}
        style={{
          width: "200px",
          height: "200px",
          backgroundColor: "rgba(76, 175, 80, 0.2)",
          border: "3px dashed #4CAF50",
          borderRadius: "8px",
          position: "absolute",
          bottom: "50px",
          right: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          fontWeight: "bold",
          color: "#2E7D32",
        }}
      >
        🎯 Drop Zone
      </div>

      {/* Physics Controls */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "20px",
          backgroundColor: "#f5f5f5",
          padding: "15px",
          borderRadius: "8px",
          width: "300px",
        }}
      >
        <h3>Physics Settings:</h3>
        <div style={{ marginBottom: "10px" }}>
          <label>Inertia: </label>
          <span style={{ fontWeight: "bold" }}>Enabled</span>
          <div style={{ fontSize: "14px", color: "#666" }}>
            Box will slide after release
          </div>
        </div>
        <div>
          <label>Resistance: </label>
          <span style={{ fontWeight: "bold" }}>0.5</span>
          <div style={{ fontSize: "14px", color: "#666" }}>
            How hard it is to drag
          </div>
        </div>
      </div>

      {/* Animation Log */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "300px",
          backgroundColor: "#333",
          color: "white",
          padding: "15px",
          borderRadius: "8px",
          width: "250px",
          fontSize: "14px",
        }}
      >
        <h4 style={{ marginTop: 0 }}>Animation Events:</h4>
        <ul style={{ paddingLeft: "20px", margin: 0 }}>
          <li>Drag Start → Scale up</li>
          <li>Enter Zone → Color change</li>
          <li>Drop in Zone → Score +1</li>
          <li>Success → Spin & Scale</li>
          <li>Release → Return to start</li>
        </ul>
      </div>
    </div>
  );
}

export default DragAndDropPhysics;
