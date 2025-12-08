import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

function ScrollSplitText() {
  const heroRef = useRef(null);
  const revealRef = useRef(null);
  const pinTextRef = useRef(null);
  const staggeredRef = useRef(null);

  useEffect(() => {
    // Cleanup
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    // const splits = SplitText.getAll();
    // splits.forEach((split) => split.revert());

    // ========== 1. HERO TEXT ON SCROLL ==========
    if (heroRef.current) {
      const splitHero = new SplitText(heroRef.current, {
        type: "chars",
        charsClass: "hero-char",
      });

      // Initial hide
      gsap.set(splitHero.chars, { y: 100, opacity: 0 });

      // Scroll animation
      gsap.to(splitHero.chars, {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
          markers: true,
        },
        y: 0,
        opacity: 1,
        stagger: 0.05,
        ease: "power2.out",
      });
    }

    // ========== 2. TEXT REVEAL ON SCROLL ==========
    if (revealRef.current) {
      const splitReveal = new SplitText(revealRef.current, {
        type: "words",
        wordsClass: "reveal-word",
      });

      gsap.from(splitReveal.words, {
        scrollTrigger: {
          trigger: revealRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
        duration: 1,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: "back.out(1.7)",
      });
    }

    // ========== 3. PINNED TEXT ANIMATION ==========
    if (pinTextRef.current) {
      const splitPin = new SplitText(pinTextRef.current, {
        type: "chars",
        charsClass: "pin-char",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".pin-section",
          start: "top top",
          end: "+=1000",
          scrub: 1,
          pin: true,
          markers: true,
        },
      });

      // Sequence of animations while pinned
      tl.from(splitPin.chars, {
        y: 100,
        rotation: 30,
        opacity: 0,
        stagger: 0.02,
        duration: 2,
      })
        .to(splitPin.chars, {
          color: "#FF6B6B",
          scale: 1.2,
          stagger: 0.01,
          duration: 1,
        })
        .to(splitPin.chars, {
          color: "#4ECDC4",
          scale: 1,
          stagger: 0.01,
          duration: 1,
        });
    }

    // ========== 4. STAGGERED LINE REVEAL ==========
    if (staggeredRef.current) {
      const splitStaggered = new SplitText(staggeredRef.current, {
        type: "lines",
        linesClass: "staggered-line",
      });

      gsap.from(splitStaggered.lines, {
        scrollTrigger: {
          trigger: staggeredRef.current,
          start: "top 85%",
          end: "bottom 60%",
          scrub: 2,
        },
        y: 100,
        opacity: 0,
        skewY: 10,
        stagger: 0.3,
        ease: "power3.out",
      });
    }

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      const splits = SplitText.getAll();
      splits.forEach((split) => split.revert());
    };
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Hero Section */}
      <section
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1
            ref={heroRef}
            style={{
              fontSize: "5rem",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            SCROLL DOWN
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#666" }}>
            Watch the text animate as you scroll
          </p>
        </div>
      </section>

      {/* Reveal Section */}
      <section style={{ padding: "100px 40px", backgroundColor: "#f8f9fa" }}>
        <div
          ref={revealRef}
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            lineHeight: "1.3",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          This text reveals word by word as you scroll into this section
        </div>
      </section>

      {/* Pinned Section */}
      <section
        className="pin-section"
        style={{ height: "300vh", position: "relative" }}
      >
        <div
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h2
            ref={pinTextRef}
            style={{
              fontSize: "4rem",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            PINNED ANIMATION
          </h2>
        </div>
      </section>

      {/* Staggered Lines Section */}
      <section style={{ padding: "100px 40px", backgroundColor: "#f0f8ff" }}>
        <div
          ref={staggeredRef}
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            lineHeight: "1.5",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <p>This is the first line that will animate.</p>
          <p>The second line follows with a slight delay.</p>
          <p>Third line comes in with its own timing.</p>
          <p>And the fourth line completes the sequence.</p>
          <p>Each line appears as you scroll further down.</p>
        </div>
      </section>

      {/* Final Spacer */}
      <section style={{ height: "100vh" }} />
    </div>
  );
}

export default ScrollSplitText;
