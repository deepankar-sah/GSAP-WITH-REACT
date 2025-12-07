import { useRef, useState, useEffect } from "react";
import gsap from "gsap";

function AdvancedTimeline() {
  const circleRef = useRef(null);
  const squareRef = useRef(null);
  const triangleRef = useRef(null);

  // Timeline instance store karo state mein
  const [tl, setTl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Complex timeline create karo
    const masterTimeline = gsap.timeline({
      paused: true, // Start mein paused rahega
      onComplete: () => setIsPlaying(false),
      onReverseComplete: () => setIsPlaying(false),
    });

    // Add labels for navigation
    masterTimeline.addLabel("start");

    // Circle animation sequence
    masterTimeline
      .to(
        circleRef.current,
        {
          x: 200,
          duration: 1,
          ease: "power2.out",
        },
        "start"
      )
      .to(
        circleRef.current,
        {
          y: 100,
          duration: 0.5,
        },
        "+=0.5"
      ) // 0.5 seconds delay after previous animation
      .to(circleRef.current, {
        rotation: 360,
        duration: 1,
      })
      .addLabel("circleComplete");

    // Square animation (parallel with circle's last animation)
    masterTimeline.to(
      squareRef.current,
      {
        x: 200,
        y: 100,
        duration: 1.5,
        ease: "elastic.out(1, 0.3)",
      },
      "circleComplete-=0.5"
    ); // Circle complete hone se 0.5s pehle start

    // Triangle animation (different timeline)
    const triangleTimeline = gsap.timeline();
    triangleTimeline
      .to(triangleRef.current, { x: -100, duration: 1 })
      .to(triangleRef.current, { y: 100, duration: 1 })
      .to(triangleRef.current, { rotation: 180, duration: 1 });

    // Nested timeline add karo
    masterTimeline.add(triangleTimeline, "circleComplete+=0.5");

    // Final animations
    masterTimeline
      .to([circleRef.current, squareRef.current, triangleRef.current], {
        scale: 1.5,
        duration: 1,
        stagger: 0.2,
      })
      .addLabel("allBig")
      .to([circleRef.current, squareRef.current, triangleRef.current], {
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
      });

    // Timeline ko state mein save karo
    setTl(masterTimeline);

    // Cleanup
    return () => {
      if (masterTimeline) masterTimeline.kill();
    };
  }, []);

  // Control functions
  const playAnimation = () => {
    if (tl) {
      tl.play();
      setIsPlaying(true);
    }
  };

  const pauseAnimation = () => {
    if (tl) {
      tl.pause();
      setIsPlaying(false);
    }
  };

  const restartAnimation = () => {
    if (tl) {
      tl.restart();
      setIsPlaying(true);
    }
  };

  const goToLabel = (label) => {
    if (tl) {
      tl.play(label);
      setIsPlaying(true);
    }
  };

  const reverseAnimation = () => {
    if (tl) {
      tl.reverse();
      setIsPlaying(true);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>Advanced Timeline Controls</h1>

      {/* Control Buttons */}
      <div
        style={{
          marginBottom: "30px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={playAnimation}
          disabled={isPlaying}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Play
        </button>

        <button
          onClick={pauseAnimation}
          disabled={!isPlaying}
          style={{
            padding: "10px 20px",
            backgroundColor: "#FF9800",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Pause
        </button>

        <button
          onClick={restartAnimation}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2196F3",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Restart
        </button>

        <button
          onClick={reverseAnimation}
          style={{
            padding: "10px 20px",
            backgroundColor: "#9C27B0",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Reverse
        </button>

        <button
          onClick={() => goToLabel("circleComplete")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#00BCD4",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Go to Circle Complete
        </button>

        <button
          onClick={() => goToLabel("allBig")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#FF5722",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Go to All Big
        </button>
      </div>

      {/* Status Display */}
      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
        }}
      >
        <strong>Status:</strong> {isPlaying ? "Playing" : "Paused"}
      </div>

      {/* Animation Area */}
      <div
        style={{
          height: "500px",
          border: "2px dashed #ccc",
          position: "relative",
          marginBottom: "30px",
          backgroundColor: "#fafafa",
        }}
      >
        {/* Circle */}
        <div
          ref={circleRef}
          style={{
            width: "80px",
            height: "80px",
            backgroundColor: "#FF6B6B",
            borderRadius: "50%",
            position: "absolute",
            top: "50px",
            left: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Circle
        </div>

        {/* Square */}
        <div
          ref={squareRef}
          style={{
            width: "80px",
            height: "80px",
            backgroundColor: "#4ECDC4",
            position: "absolute",
            top: "200px",
            left: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Square
        </div>

        {/* Triangle */}
        <div
          ref={triangleRef}
          style={{
            width: "0",
            height: "0",
            borderLeft: "40px solid transparent",
            borderRight: "40px solid transparent",
            borderBottom: "80px solid #FFD166",
            position: "absolute",
            top: "350px",
            left: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#333",
            fontWeight: "bold",
          }}
        >
          <div style={{ marginTop: "30px" }}>Triangle</div>
        </div>
      </div>

      {/* Timeline Visualization */}
      <div
        style={{
          backgroundColor: "#333",
          color: "white",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h3>Timeline Structure:</h3>
        <div style={{ display: "flex", overflowX: "auto", padding: "10px 0" }}>
          <div
            style={{
              minWidth: "100px",
              padding: "10px",
              backgroundColor: "#FF6B6B",
              marginRight: "5px",
              textAlign: "center",
            }}
          >
            Start
            <br />
            (0s)
          </div>
          <div
            style={{
              minWidth: "100px",
              padding: "10px",
              backgroundColor: "#4ECDC4",
              marginRight: "5px",
              textAlign: "center",
            }}
          >
            Circle Right
            <br />
            (1s)
          </div>
          <div
            style={{
              minWidth: "100px",
              padding: "10px",
              backgroundColor: "#4ECDC4",
              marginRight: "5px",
              textAlign: "center",
            }}
          >
            Circle Down
            <br />
            (1.5s)
          </div>
          <div
            style={{
              minWidth: "100px",
              padding: "10px",
              backgroundColor: "#4ECDC4",
              marginRight: "5px",
              textAlign: "center",
            }}
          >
            Circle Rotate
            <br />
            (2.5s)
          </div>
          <div
            style={{
              minWidth: "100px",
              padding: "10px",
              backgroundColor: "#FFD166",
              marginRight: "5px",
              textAlign: "center",
            }}
          >
            Square Move
            <br />
            (2s - 3.5s)
          </div>
          <div
            style={{
              minWidth: "100px",
              padding: "10px",
              backgroundColor: "#06D6A0",
              marginRight: "5px",
              textAlign: "center",
            }}
          >
            Triangle Timeline
            <br />
            (3s - 6s)
          </div>
          <div
            style={{
              minWidth: "100px",
              padding: "10px",
              backgroundColor: "#9C27B0",
              marginRight: "5px",
              textAlign: "center",
            }}
          >
            All Scale Up
            <br />
            (6s - 7s)
          </div>
          <div
            style={{
              minWidth: "100px",
              padding: "10px",
              backgroundColor: "#9C27B0",
              marginRight: "5px",
              textAlign: "center",
            }}
          >
            All Scale Down
            <br />
            (7s - 7.5s)
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h4>Key Concepts Used:</h4>
          <ul>
            <li>
              <strong>Position Parameters:</strong> "+=0.5",
              "circleComplete-=0.5"
            </li>
            <li>
              <strong>Labels:</strong> Markers for navigation
            </li>
            <li>
              <strong>Nested Timelines:</strong> Timeline inside timeline
            </li>
            <li>
              <strong>Callbacks:</strong> onComplete, onReverseComplete
            </li>
            <li>
              <strong>Stagger:</strong> Multiple elements with delay
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdvancedTimeline;
