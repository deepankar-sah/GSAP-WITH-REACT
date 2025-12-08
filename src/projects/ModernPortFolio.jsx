import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable);

function ModernPortfolio() {
  const heroRef = useRef(null);
  const navRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const skillsRef = useRef(null);
  const contactRef = useRef(null);

  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    // ========== 1. NAVIGATION ANIMATIONS ==========
    const navItems = navRef.current?.querySelectorAll(".nav-item");

    // Nav items hover effects
    navItems?.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        gsap.to(item, {
          scale: 1.1,
          color: "#3498db",
          duration: 0.3,
          ease: "power2.out",
        });
      });

      item.addEventListener("mouseleave", () => {
        gsap.to(item, {
          scale: 1,
          color: activeSection === item.dataset.section ? "#3498db" : "#2c3e50",
          duration: 0.3,
        });
      });
    });

    // ========== 2. HERO SECTION ANIMATIONS ==========
    if (heroRef.current) {
      // Hero text split animation
      const heroText = heroRef.current.querySelector(".hero-text");
      const splitText = new SplitText(heroText, { type: "chars" });

      gsap.from(splitText.chars, {
        duration: 1,
        y: 100,
        rotation: -10,
        opacity: 0,
        stagger: 0.03,
        ease: "back.out(1.7)",
        delay: 0.5,
      });

      // Hero image floating animation
      const heroImage = heroRef.current.querySelector(".hero-image");
      gsap.to(heroImage, {
        y: 30,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Scroll down indicator
      const scrollIndicator =
        heroRef.current.querySelector(".scroll-indicator");
      gsap.to(scrollIndicator, {
        y: 10,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }

    // ========== 3. ABOUT SECTION ANIMATIONS ==========
    if (aboutRef.current) {
      const aboutCards = aboutRef.current.querySelectorAll(".about-card");

      aboutCards.forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
          x: index % 2 === 0 ? -100 : 100,
          opacity: 0,
          duration: 1,
          delay: index * 0.2,
          ease: "power2.out",
        });

        // Card hover effect
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -10,
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            duration: 0.3,
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            duration: 0.3,
          });
        });
      });
    }

    // ========== 4. PROJECTS SECTION - INTERACTIVE ==========
    if (projectsRef.current) {
      const projectCards =
        projectsRef.current.querySelectorAll(".project-card");

      projectCards.forEach((card, index) => {
        // Initial animation
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
          scale: 0.8,
          opacity: 0,
          rotationY: 30,
          duration: 1,
          delay: index * 0.1,
          ease: "back.out(1.7)",
        });

        // 3D tilt effect on hover
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateY = ((x - centerX) / centerX) * 10;
          const rotateX = ((centerY - y) / centerY) * 10;

          gsap.to(card, {
            rotationY: rotateY,
            rotationX: rotateX,
            transformPerspective: 1000,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            rotationY: 0,
            rotationX: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)",
          });
        });
      });

      // Project filter animation
      const filterButtons = projectsRef.current.querySelectorAll(".filter-btn");
      filterButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
          // Active state animation
          gsap.to(filterButtons, {
            scale: 1,
            backgroundColor: "#f8f9fa",
            color: "#333",
            duration: 0.3,
          });

          gsap.to(this, {
            scale: 1.1,
            backgroundColor: "#3498db",
            color: "white",
            duration: 0.3,
          });

          // Filter animation
          const selectedCategory = this.dataset.filter;
          projectCards.forEach((card) => {
            if (
              selectedCategory === "all" ||
              card.dataset.category === selectedCategory
            ) {
              gsap.to(card, {
                scale: 1,
                opacity: 1,
                display: "block",
                duration: 0.5,
                ease: "power2.out",
              });
            } else {
              gsap.to(card, {
                scale: 0.8,
                opacity: 0,
                display: "none",
                duration: 0.5,
                ease: "power2.in",
              });
            }
          });
        });
      });
    }

    // ========== 5. SKILLS SECTION - ANIMATED PROGRESS BARS ==========
    if (skillsRef.current) {
      const skillBars = skillsRef.current.querySelectorAll(".skill-progress");

      skillBars.forEach((bar) => {
        const progress = bar.dataset.progress;
        const fill = bar.querySelector(".skill-fill");

        ScrollTrigger.create({
          trigger: bar,
          start: "top 90%",
          onEnter: () => {
            gsap.to(fill, {
              width: `${progress}%`,
              duration: 1.5,
              ease: "power2.out",
              onUpdate: function () {
                const percentage = Math.round(this.progress() * progress);
                bar.querySelector(
                  ".skill-percentage"
                ).textContent = `${percentage}%`;
              },
            });
          },
        });
      });

      // Skills drag to reorder
      const skillItems = skillsRef.current.querySelectorAll(".skill-item");

      skillItems.forEach((item) => {
        Draggable.create(item, {
          type: "y",
          bounds: ".skills-grid",
          inertia: true,
          onDragStart: function () {
            gsap.to(this.target, {
              scale: 1.05,
              boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
              duration: 0.2,
            });
          },
          onDragEnd: function () {
            gsap.to(this.target, {
              scale: 1,
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              duration: 0.3,
            });
          },
        });
      });
    }

    // ========== 6. CONTACT FORM ANIMATIONS ==========
    if (contactRef.current) {
      const formInputs = contactRef.current.querySelectorAll(".form-input");

      formInputs.forEach((input) => {
        // Focus animation
        input.addEventListener("focus", () => {
          gsap.to(input, {
            scale: 1.02,
            borderColor: "#3498db",
            duration: 0.3,
            ease: "power2.out",
          });

          gsap.to(input.parentElement.querySelector(".input-label"), {
            y: -25,
            color: "#3498db",
            fontSize: "14px",
            duration: 0.3,
          });
        });

        // Blur animation
        input.addEventListener("blur", () => {
          if (!input.value) {
            gsap.to(input, {
              scale: 1,
              borderColor: "#ddd",
              duration: 0.3,
            });

            gsap.to(input.parentElement.querySelector(".input-label"), {
              y: 0,
              color: "#666",
              fontSize: "16px",
              duration: 0.3,
            });
          }
        });
      });

      // Submit button animation
      const submitBtn = contactRef.current.querySelector(".submit-btn");
      submitBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const tl = gsap.timeline();

        tl.to(submitBtn, {
          scale: 0.95,
          duration: 0.1,
        })
          .to(submitBtn, {
            scale: 1,
            duration: 0.2,
            ease: "elastic.out(1, 0.5)",
          })
          .to(submitBtn, {
            backgroundColor: "#2ecc71",
            duration: 0.3,
          })
          .to(".success-message", {
            opacity: 1,
            y: 0,
            duration: 0.5,
          });
      });
    }

    // ========== 7. SECTION TRACKING FOR NAV ==========
    const sections = [
      { id: "home", ref: heroRef },
      { id: "about", ref: aboutRef },
      { id: "projects", ref: projectsRef },
      { id: "skills", ref: skillsRef },
      { id: "contact", ref: contactRef },
    ];

    sections.forEach((section) => {
      if (section.ref.current) {
        ScrollTrigger.create({
          trigger: section.ref.current,
          start: "top 50%",
          end: "bottom 50%",
          onEnter: () => setActiveSection(section.id),
          onEnterBack: () => setActiveSection(section.id),
        });
      }
    });

    // ========== 8. PAGE LOAD ANIMATION ==========
    const pageLoadTL = gsap.timeline();

    pageLoadTL
      .from(".loading-screen", {
        opacity: 1,
        duration: 0.5,
        delay: 1,
      })
      .from(
        ".logo",
        {
          y: -50,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        "-=0.3"
      )
      .from(
        ".nav-item",
        {
          y: -30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5,
        },
        "-=0.5"
      );

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      //   SplitText.getAll().forEach((split) => split.revert());
      Draggable.get(".skill-item")?.forEach((d) => d.kill());
    };
  }, [activeSection]);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      gsap.to(window, {
        duration: 1,
        scrollTo: {
          y: section,
          offsetY: 80,
        },
        ease: "power2.inOut",
      });
    }
  };

  return (
    <div className="portfolio-container">
      {/* Loading Screen */}
      <div className="loading-screen">
        <div className="loader"></div>
      </div>

      {/* Navigation */}
      <nav ref={navRef} className="portfolio-nav">
        <div className="logo">Portfolio</div>
        <div className="nav-items">
          {["home", "about", "projects", "skills", "contact"].map((section) => (
            <div
              key={section}
              className={`nav-item ${
                activeSection === section ? "active" : ""
              }`}
              data-section={section}
              onClick={() => scrollToSection(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </div>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} id="home" className="hero-section">
        <div className="hero-content">
          <h1 className="hero-text">Hello, I'm a Full Stack Developer</h1>
          <p className="hero-subtitle">Creating amazing digital experiences</p>
          <button
            className="hero-cta"
            onClick={() => scrollToSection("projects")}
          >
            View My Work
          </button>
        </div>
        <div className="hero-image">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Scroll</span>
          <div className="arrow"></div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} id="about" className="about-section">
        <h2 className="section-title">About Me</h2>
        <div className="about-cards">
          <div className="about-card">
            <h3>Experience</h3>
            <p>5+ years building web applications</p>
          </div>
          <div className="about-card">
            <h3>Skills</h3>
            <p>React, Node.js, GSAP, Three.js</p>
          </div>
          <div className="about-card">
            <h3>Projects</h3>
            <p>50+ successful projects</p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section ref={projectsRef} id="projects" className="projects-section">
        <h2 className="section-title">My Projects</h2>

        <div className="project-filters">
          {["all", "web", "mobile", "design"].map((filter) => (
            <button key={filter} className="filter-btn" data-filter={filter}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {[
            { id: 1, title: "E-commerce Platform", category: "web" },
            { id: 2, title: "Fitness App", category: "mobile" },
            { id: 3, title: "Portfolio Website", category: "design" },
            { id: 4, title: "Dashboard UI", category: "web" },
            { id: 5, title: "Travel App", category: "mobile" },
            { id: 6, title: "Brand Identity", category: "design" },
          ].map((project) => (
            <div
              key={project.id}
              className="project-card"
              data-category={project.category}
            >
              <div className="project-image"></div>
              <h3>{project.title}</h3>
              <p>{project.category.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section ref={skillsRef} id="skills" className="skills-section">
        <h2 className="section-title">My Skills</h2>

        <div className="skills-container">
          <div className="skills-grid">
            {[
              { name: "React", level: 95 },
              { name: "GSAP", level: 90 },
              { name: "Node.js", level: 85 },
              { name: "UI/UX Design", level: 80 },
              { name: "Three.js", level: 75 },
              { name: "MongoDB", level: 85 },
            ].map((skill, index) => (
              <div key={index} className="skill-item">
                <div className="skill-info">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-percentage">0%</span>
                </div>
                <div className="skill-progress" data-progress={skill.level}>
                  <div className="skill-fill"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} id="contact" className="contact-section">
        <h2 className="section-title">Get In Touch</h2>

        <form className="contact-form">
          <div className="form-group">
            <label className="input-label">Name</label>
            <input type="text" className="form-input" />
          </div>

          <div className="form-group">
            <label className="input-label">Email</label>
            <input type="email" className="form-input" />
          </div>

          <div className="form-group">
            <label className="input-label">Message</label>
            <textarea className="form-input textarea" rows="5"></textarea>
          </div>

          <button type="submit" className="submit-btn">
            Send Message
          </button>

          <div className="success-message">Message sent successfully! 🎉</div>
        </form>
      </section>

      {/* Footer */}
      <footer className="portfolio-footer">
        <p>© 2024 Portfolio. All rights reserved.</p>
      </footer>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .portfolio-container {
          font-family: "Inter", sans-serif;
          overflow-x: hidden;
        }

        /* Loading Screen */
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .loader {
          width: 50px;
          height: 50px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Navigation */
        .portfolio-nav {
          position: fixed;
          top: 0;
          width: 100%;
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          z-index: 100;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }

        .logo {
          font-size: 24px;
          font-weight: 700;
          color: #3498db;
        }

        .nav-items {
          display: flex;
          gap: 30px;
        }

        .nav-item {
          padding: 8px 16px;
          cursor: pointer;
          font-weight: 500;
          color: #2c3e50;
          border-radius: 20px;
          transition: all 0.3s ease;
        }

        .nav-item.active {
          background: #3498db;
          color: white;
        }

        /* Hero Section */
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 100px 40px 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          position: relative;
        }

        .hero-content {
          max-width: 600px;
        }

        .hero-text {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          margin-bottom: 30px;
          opacity: 0.9;
        }

        .hero-cta {
          padding: 15px 30px;
          background: white;
          color: #3498db;
          border: none;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .hero-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .hero-image {
          position: relative;
          width: 400px;
          height: 400px;
        }

        .floating-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .shape {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }

        .shape-1 {
          width: 100px;
          height: 100px;
          top: 50px;
          left: 50px;
        }

        .shape-2 {
          width: 150px;
          height: 150px;
          bottom: 50px;
          right: 50px;
        }

        .shape-3 {
          width: 80px;
          height: 80px;
          top: 150px;
          right: 100px;
        }

        .scroll-indicator {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          color: white;
        }

        .arrow {
          width: 20px;
          height: 20px;
          border-right: 2px solid white;
          border-bottom: 2px solid white;
          transform: rotate(45deg);
        }

        /* About Section */
        .about-section {
          padding: 100px 40px;
          background: #f8f9fa;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 60px;
          color: #2c3e50;
        }

        .about-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .about-card {
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          text-align: center;
          transition: all 0.3s ease;
        }

        .about-card h3 {
          font-size: 1.5rem;
          margin-bottom: 15px;
          color: #3498db;
        }

        /* Projects Section */
        .projects-section {
          padding: 100px 40px;
          background: white;
        }

        .project-filters {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 40px;
        }

        .filter-btn {
          padding: 10px 20px;
          background: #f8f9fa;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .project-card {
          background: #f8f9fa;
          border-radius: 20px;
          padding: 30px;
          transform-style: preserve-3d;
          transition: all 0.3s ease;
        }

        .project-image {
          width: 100%;
          height: 200px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 10px;
          margin-bottom: 20px;
        }

        .project-card h3 {
          font-size: 1.2rem;
          margin-bottom: 10px;
          color: #2c3e50;
        }

        /* Skills Section */
        .skills-section {
          padding: 100px 40px;
          background: #2c3e50;
          color: white;
        }

        .skills-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .skills-grid {
          display: grid;
          gap: 30px;
        }

        .skill-item {
          background: rgba(255, 255, 255, 0.1);
          padding: 20px;
          border-radius: 10px;
          cursor: move;
        }

        .skill-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .skill-progress {
          height: 10px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 5px;
          overflow: hidden;
        }

        .skill-fill {
          height: 100%;
          background: #3498db;
          width: 0%;
          border-radius: 5px;
        }

        /* Contact Section */
        .contact-section {
          padding: 100px 40px;
          background: #f8f9fa;
        }

        .contact-form {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .form-group {
          margin-bottom: 30px;
          position: relative;
        }

        .input-label {
          position: absolute;
          left: 10px;
          top: 12px;
          color: #666;
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .form-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
          background: transparent;
        }

        .textarea {
          resize: vertical;
        }

        .submit-btn {
          width: 100%;
          padding: 15px;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          background: #2980b9;
        }

        .success-message {
          margin-top: 20px;
          text-align: center;
          color: #2ecc71;
          opacity: 0;
          transform: translateY(10px);
        }

        /* Footer */
        .portfolio-footer {
          padding: 30px;
          text-align: center;
          background: #2c3e50;
          color: white;
        }
      `}</style>
    </div>
  );
}

export default ModernPortfolio;
