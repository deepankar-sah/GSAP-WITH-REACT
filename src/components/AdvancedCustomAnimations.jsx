import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

// ========== ANIMATION STATE MACHINE ==========
class AnimationStateMachine {
  constructor() {
    this.states = new Map();
    this.currentState = null;
    this.previousState = null;
    this.transitions = new Map();
    this.isTransitioning = false;
  }

  addState(name, { enter, update, exit, data = {} }) {
    this.states.set(name, { enter, update, exit, data });
  }

  addTransition(fromState, toState, { condition, onTransition }) {
    const key = `${fromState}-${toState}`;
    this.transitions.set(key, { condition, onTransition });
  }

  setState(name, force = false) {
    if (this.isTransitioning && !force) return false;

    // Check if transition is allowed
    if (this.currentState) {
      const transitionKey = `${this.currentState}-${name}`;
      const transition = this.transitions.get(transitionKey);

      if (transition && !transition.condition()) {
        console.warn(
          `Transition from ${this.currentState} to ${name} not allowed`
        );
        return false;
      }

      // Call onTransition if exists
      if (transition?.onTransition) {
        transition.onTransition();
      }

      // Exit current state
      const currentStateData = this.states.get(this.currentState);
      if (currentStateData?.exit) {
        currentStateData.exit();
      }
    }

    this.previousState = this.currentState;
    this.currentState = name;
    this.isTransitioning = true;

    // Enter new state
    const newStateData = this.states.get(name);
    if (newStateData?.enter) {
      const promise = newStateData.enter();
      if (promise instanceof Promise) {
        promise.then(() => {
          this.isTransitioning = false;
        });
      } else {
        this.isTransitioning = false;
      }
    } else {
      this.isTransitioning = false;
    }

    return true;
  }

  update() {
    if (this.currentState && !this.isTransitioning) {
      const stateData = this.states.get(this.currentState);
      if (stateData?.update) {
        stateData.update();
      }
    }
  }

  getStateData() {
    return this.states.get(this.currentState)?.data || {};
  }
}

// ========== ANIMATION CONTROLLER ==========
class AnimationController {
  constructor(element) {
    this.element = element;
    this.timelines = new Map();
    this.sequences = new Map();
    this.currentSequence = null;
    this.animationQueue = [];
    this.isPlaying = false;

    // Performance tracking
    this.frameTimes = [];
    this.averageFPS = 60;
  }

  createTimeline(name, config = {}) {
    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power2.out" },
      ...config,
    });

    this.timelines.set(name, tl);
    return tl;
  }

  createSequence(name, steps) {
    this.sequences.set(name, steps);
  }

  playSequence(name, onComplete) {
    if (this.isPlaying) {
      this.animationQueue.push({ name, onComplete });
      return;
    }

    this.isPlaying = true;
    this.currentSequence = name;
    const steps = this.sequences.get(name);

    if (!steps || steps.length === 0) {
      this.isPlaying = false;
      onComplete?.();
      return;
    }

    this._playStep(steps, 0, onComplete);
  }

  _playStep(steps, index, onComplete) {
    if (index >= steps.length) {
      this.isPlaying = false;
      this.currentSequence = null;
      onComplete?.();

      // Play next in queue
      if (this.animationQueue.length > 0) {
        const next = this.animationQueue.shift();
        this.playSequence(next.name, next.onComplete);
      }
      return;
    }

    const step = steps[index];

    if (step.type === "timeline") {
      const tl = this.timelines.get(step.name);
      if (tl) {
        tl.restart();
        tl.eventCallback("onComplete", () => {
          this._playStep(steps, index + 1, onComplete);
        });
      }
    } else if (step.type === "animation") {
      const animation = gsap.to(this.element, {
        ...step.props,
        onComplete: () => {
          this._playStep(steps, index + 1, onComplete);
        },
      });
    } else if (step.type === "delay") {
      gsap.delayedCall(step.duration, () => {
        this._playStep(steps, index + 1, onComplete);
      });
    } else if (step.type === "callback") {
      step.callback();
      this._playStep(steps, index + 1, onComplete);
    }
  }

  // Performance monitoring
  startPerformanceMonitor() {
    let lastTime = performance.now();
    let frameCount = 0;

    const checkPerformance = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - lastTime >= 1000) {
        this.averageFPS = Math.round(
          (frameCount * 1000) / (currentTime - lastTime)
        );
        this.frameTimes.push(this.averageFPS);

        // Keep only last 60 frames
        if (this.frameTimes.length > 60) {
          this.frameTimes.shift();
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(checkPerformance);
    };

    checkPerformance();
  }

  getPerformanceStats() {
    const avg =
      this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length || 60;
    const min = Math.min(...this.frameTimes);
    const max = Math.max(...this.frameTimes);

    return { average: avg, min, max, frames: this.frameTimes.length };
  }
}

// ========== MAIN COMPONENT ==========
function AdvancedAnimationSystem() {
  const containerRef = useRef(null);
  const characterRef = useRef(null);
  const [stateMachine, setStateMachine] = useState(null);
  const [animationController, setAnimationController] = useState(null);
  const [currentState, setCurrentState] = useState("idle");
  const [performanceStats, setPerformanceStats] = useState({
    average: 60,
    min: 60,
    max: 60,
  });

  useEffect(() => {
    // Initialize State Machine
    const sm = new AnimationStateMachine();
    const ac = new AnimationController(characterRef.current);

    // ========== DEFINE ANIMATION STATES ==========

    // IDLE STATE
    sm.addState("idle", {
      enter: () => {
        console.log("Entering IDLE state");
        return ac.playSequence("idleSequence");
      },
      update: () => {
        // Idle breathing animation
        gsap.to(characterRef.current, {
          y: "+=2",
          duration: 2,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      },
      exit: () => {
        gsap.killTweensOf(characterRef.current);
      },
      data: { speed: 0, canJump: true },
    });

    // WALK STATE
    sm.addState("walk", {
      enter: () => {
        console.log("Entering WALK state");
        return ac.playSequence("walkSequence");
      },
      update: () => {
        // Walking animation
        gsap.to(characterRef.current, {
          x: "+=100",
          duration: 2,
          ease: "none",
          modifiers: {
            x: gsap.utils.unitize((x) => parseFloat(x) % 800),
          },
        });

        // Arm swing
        gsap.to(".arm", {
          rotation: 30,
          duration: 0.5,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          stagger: 0.25,
        });
      },
      exit: () => {
        gsap.killTweensOf(characterRef.current);
        gsap.killTweensOf(".arm");
      },
      data: { speed: 5, canJump: true },
    });

    // RUN STATE
    sm.addState("run", {
      enter: () => {
        console.log("Entering RUN state");
        return ac.playSequence("runSequence");
      },
      update: () => {
        // Running animation (faster)
        gsap.to(characterRef.current, {
          x: "+=200",
          duration: 2,
          ease: "none",
          modifiers: {
            x: gsap.utils.unitize((x) => parseFloat(x) % 800),
          },
        });

        // Faster arm swing
        gsap.to(".arm", {
          rotation: 45,
          duration: 0.3,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          stagger: 0.15,
        });
      },
      exit: () => {
        gsap.killTweensOf(characterRef.current);
        gsap.killTweensOf(".arm");
      },
      data: { speed: 10, canJump: true },
    });

    // JUMP STATE
    sm.addState("jump", {
      enter: () => {
        console.log("Entering JUMP state");

        const tl = gsap.timeline();

        tl.to(characterRef.current, {
          y: -100,
          duration: 0.5,
          ease: "power2.out",
        }).to(characterRef.current, {
          y: 0,
          duration: 0.5,
          ease: "power2.in",
          onComplete: () => {
            // Return to previous state after jump
            sm.setState(sm.previousState || "idle");
          },
        });

        return tl;
      },
      data: { speed: 0, canJump: false },
    });

    // ATTACK STATE
    sm.addState("attack", {
      enter: () => {
        console.log("Entering ATTACK state");

        const tl = gsap.timeline();

        tl.to(".weapon", {
          rotation: -90,
          duration: 0.1,
          ease: "power2.out",
        }).to(".weapon", {
          rotation: 0,
          duration: 0.3,
          ease: "back.out(1.7)",
          onComplete: () => {
            // Return to previous state after attack
            sm.setState(sm.previousState || "idle");
          },
        });

        return tl;
      },
      data: { speed: 0, canJump: false },
    });

    // ========== DEFINE STATE TRANSITIONS ==========

    sm.addTransition("idle", "walk", {
      condition: () => true, // Always allowed
      onTransition: () => console.log("Transition: idle -> walk"),
    });

    sm.addTransition("walk", "run", {
      condition: () => true,
      onTransition: () => console.log("Transition: walk -> run"),
    });

    sm.addTransition("run", "walk", {
      condition: () => true,
      onTransition: () => console.log("Transition: run -> walk"),
    });

    sm.addTransition("idle", "jump", {
      condition: () => sm.getStateData().canJump,
      onTransition: () => console.log("Transition: idle -> jump"),
    });

    sm.addTransition("walk", "jump", {
      condition: () => sm.getStateData().canJump,
      onTransition: () => console.log("Transition: walk -> jump"),
    });

    sm.addTransition("run", "jump", {
      condition: () => sm.getStateData().canJump,
      onTransition: () => console.log("Transition: run -> jump"),
    });

    sm.addTransition("idle", "attack", {
      condition: () => true,
      onTransition: () => console.log("Transition: idle -> attack"),
    });

    // ========== CREATE ANIMATION SEQUENCES ==========

    // Idle sequence
    ac.createSequence("idleSequence", [
      { type: "animation", props: { scale: 1.05, duration: 0.5 } },
      { type: "animation", props: { scale: 1, duration: 0.5 } },
      { type: "delay", duration: 1 },
      {
        type: "callback",
        callback: () => console.log("Idle animation complete"),
      },
    ]);

    // Walk sequence
    ac.createSequence("walkSequence", [
      { type: "animation", props: { x: 100, duration: 1 } },
      { type: "animation", props: { x: 200, duration: 1 } },
    ]);

    // Run sequence
    ac.createSequence("runSequence", [
      { type: "animation", props: { x: 200, duration: 0.8 } },
      { type: "animation", props: { x: 400, duration: 0.8 } },
    ]);

    // Start in idle state
    sm.setState("idle");

    // Update current state for UI
    const updateState = () => {
      setCurrentState(sm.currentState);
      sm.update();
    };

    // State update loop
    const stateUpdateInterval = setInterval(updateState, 100);

    // Performance monitoring
    ac.startPerformanceMonitor();
    const performanceInterval = setInterval(() => {
      setPerformanceStats(ac.getPerformanceStats());
    }, 1000);

    setStateMachine(sm);
    setAnimationController(ac);

    // Cleanup
    return () => {
      clearInterval(stateUpdateInterval);
      clearInterval(performanceInterval);
      gsap.killTweensOf(characterRef.current);
      gsap.killTweensOf(".arm");
      gsap.killTweensOf(".weapon");
    };
  }, []);

  // State change handlers
  const changeState = (state) => {
    if (stateMachine) {
      const success = stateMachine.setState(state);
      if (success) {
        setCurrentState(state);
      }
    }
  };

  // Add to animation queue
  const queueAnimation = (sequence) => {
    if (animationController) {
      animationController.playSequence(sequence, () => {
        console.log(`${sequence} sequence complete`);
      });
    }
  };

  return (
    <div ref={containerRef} className="animation-system-container">
      <h1>Advanced Animation System with State Machine</h1>

      <div className="system-overview">
        <div className="control-panel">
          <h2>Animation States</h2>
          <div className="state-buttons">
            {["idle", "walk", "run", "jump", "attack"].map((state) => (
              <button
                key={state}
                className={`state-btn ${
                  currentState === state ? "active" : ""
                }`}
                onClick={() => changeState(state)}
              >
                {state.toUpperCase()}
              </button>
            ))}
          </div>

          <h2>Animation Queue</h2>
          <div className="queue-buttons">
            <button onClick={() => queueAnimation("idleSequence")}>
              Queue Idle
            </button>
            <button onClick={() => queueAnimation("walkSequence")}>
              Queue Walk
            </button>
            <button onClick={() => queueAnimation("runSequence")}>
              Queue Run
            </button>
          </div>

          <h2>Performance Stats</h2>
          <div className="performance-stats">
            <div className="stat">
              <span>FPS:</span>
              <span className="stat-value">
                {performanceStats.average.toFixed(1)}
              </span>
            </div>
            <div className="stat">
              <span>Min:</span>
              <span className="stat-value">{performanceStats.min}</span>
            </div>
            <div className="stat">
              <span>Max:</span>
              <span className="stat-value">{performanceStats.max}</span>
            </div>
            <div className="stat">
              <span>Frames:</span>
              <span className="stat-value">{performanceStats.frames}</span>
            </div>
          </div>

          <div className="state-info">
            <h3>
              Current State: <span className="state-name">{currentState}</span>
            </h3>
            <p>
              Use buttons to change animation states. States have transitions
              and conditions.
            </p>
          </div>
        </div>

        <div className="animation-stage">
          <div className="stage-boundary">
            <div ref={characterRef} className="character">
              <div className="character-head"></div>
              <div className="character-body"></div>
              <div className="arm left-arm"></div>
              <div className="arm right-arm"></div>
              <div className="leg left-leg"></div>
              <div className="leg right-leg"></div>
              <div className="weapon"></div>
            </div>
          </div>

          <div className="ground"></div>
        </div>
      </div>

      <div className="system-architecture">
        <h2>System Architecture</h2>
        <div className="architecture-diagram">
          <div className="arch-component">
            <h3>State Machine</h3>
            <ul>
              <li>Manages animation states</li>
              <li>Handles state transitions</li>
              <li>Enforces transition conditions</li>
              <li>Manages state data</li>
            </ul>
          </div>

          <div className="arch-component">
            <h3>Animation Controller</h3>
            <ul>
              <li>Manages timelines</li>
              <li>Handles animation sequences</li>
              <li>Queue system for animations</li>
              <li>Performance monitoring</li>
            </ul>
          </div>

          <div className="arch-component">
            <h3>GSAP Integration</h3>
            <ul>
              <li>Physics-based animations</li>
              <li>GPU-accelerated transforms</li>
              <li>Timeline management</li>
              <li>Easing functions</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="code-examples">
        <h2>State Machine Implementation</h2>
        <pre>{`
// State Machine Class
class AnimationStateMachine {
  constructor() {
    this.states = new Map();
    this.transitions = new Map();
    this.currentState = null;
  }
  
  addState(name, { enter, update, exit, data }) {
    this.states.set(name, { enter, update, exit, data });
  }
  
  addTransition(from, to, { condition, onTransition }) {
    this.transitions.set(\`\${from}-\${to}\`, { condition, onTransition });
  }
  
  setState(name) {
    // Check transition conditions
    const transitionKey = \`\${this.currentState}-\${name}\`;
    const transition = this.transitions.get(transitionKey);
    
    if (transition && !transition.condition()) {
      return false; // Transition not allowed
    }
    
    // Execute transition
    transition?.onTransition?.();
    
    // Exit current state
    this.states.get(this.currentState)?.exit?.();
    
    // Enter new state
    this.currentState = name;
    this.states.get(name)?.enter?.();
    
    return true;
  }
}
        `}</pre>
      </div>

      <style jsx>{`
        .animation-system-container {
          padding: 40px;
          font-family: "Inter", sans-serif;
          background: #1a1a2e;
          color: white;
          min-height: 100vh;
        }

        h1 {
          text-align: center;
          color: #3498db;
          margin-bottom: 40px;
          font-size: 2.5rem;
        }

        .system-overview {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        .control-panel {
          background: #2c3e50;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .control-panel h2 {
          color: #3498db;
          margin-top: 25px;
          margin-bottom: 15px;
          font-size: 1.2rem;
          border-bottom: 1px solid #34495e;
          padding-bottom: 8px;
        }

        .control-panel h2:first-child {
          margin-top: 0;
        }

        .state-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .state-btn {
          padding: 12px;
          background: #34495e;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
        }

        .state-btn:hover {
          background: #3498db;
          transform: translateX(5px);
        }

        .state-btn.active {
          background: #2ecc71;
          transform: translateX(10px);
          box-shadow: 0 5px 15px rgba(46, 204, 113, 0.4);
        }

        .queue-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .queue-buttons button {
          padding: 10px;
          background: #9b59b6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .queue-buttons button:hover {
          background: #8e44ad;
          transform: scale(1.05);
        }

        .performance-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          background: #34495e;
          padding: 15px;
          border-radius: 8px;
        }

        .stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-value {
          font-weight: 600;
          color: #2ecc71;
          font-size: 1.1rem;
        }

        .state-info {
          margin-top: 25px;
          padding: 15px;
          background: #34495e;
          border-radius: 8px;
          border-left: 4px solid #3498db;
        }

        .state-name {
          color: #2ecc71;
          font-weight: 600;
        }

        .animation-stage {
          position: relative;
          background: #2c3e50;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .stage-boundary {
          width: 100%;
          height: 400px;
          position: relative;
          overflow: hidden;
        }

        .character {
          position: absolute;
          left: 100px;
          bottom: 100px;
          transform-origin: bottom center;
        }

        .character-head {
          width: 40px;
          height: 40px;
          background: #e74c3c;
          border-radius: 50%;
          margin: 0 auto 10px;
        }

        .character-body {
          width: 60px;
          height: 80px;
          background: #3498db;
          border-radius: 20px;
          position: relative;
        }

        .arm {
          width: 50px;
          height: 15px;
          background: #3498db;
          position: absolute;
          top: 20px;
          border-radius: 7px;
          transform-origin: 10px center;
        }

        .left-arm {
          left: -45px;
        }

        .right-arm {
          right: -45px;
        }

        .leg {
          width: 20px;
          height: 60px;
          background: #2c3e50;
          position: absolute;
          bottom: -60px;
          border-radius: 10px;
        }

        .left-leg {
          left: 10px;
        }

        .right-leg {
          right: 10px;
        }

        .weapon {
          width: 60px;
          height: 10px;
          background: #f39c12;
          position: absolute;
          right: -60px;
          top: 20px;
          border-radius: 5px;
          transform-origin: left center;
        }

        .ground {
          width: 100%;
          height: 100px;
          background: linear-gradient(to top, #27ae60, #2ecc71);
          position: absolute;
          bottom: 0;
        }

        .system-architecture {
          background: #2c3e50;
          padding: 30px;
          border-radius: 15px;
          margin-bottom: 40px;
        }

        .system-architecture h2 {
          color: #3498db;
          margin-bottom: 25px;
          text-align: center;
        }

        .architecture-diagram {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 25px;
        }

        .arch-component {
          background: #34495e;
          padding: 20px;
          border-radius: 10px;
          border-top: 4px solid #9b59b6;
        }

        .arch-component h3 {
          color: #9b59b6;
          margin-bottom: 15px;
        }

        .arch-component ul {
          list-style: none;
          padding: 0;
        }

        .arch-component li {
          padding: 8px 0;
          color: #ecf0f1;
          border-bottom: 1px solid #2c3e50;
        }

        .arch-component li:last-child {
          border-bottom: none;
        }

        .code-examples {
          background: #2c3e50;
          padding: 30px;
          border-radius: 15px;
        }

        .code-examples h2 {
          color: #3498db;
          margin-bottom: 20px;
        }

        pre {
          background: #1a1a2e;
          padding: 20px;
          border-radius: 8px;
          overflow-x: auto;
          font-family: "JetBrains Mono", monospace;
          font-size: 14px;
          line-height: 1.5;
          color: #ecf0f1;
          border-left: 4px solid #2ecc71;
        }

        @media (max-width: 1024px) {
          .system-overview {
            grid-template-columns: 1fr;
          }

          .architecture-diagram {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default AdvancedAnimationSystem;
