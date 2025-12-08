import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(Draggable, Flip, ScrollTrigger);

function InteractiveDashboard() {
  // State for dashboard
  const [theme, setTheme] = useState("light");
  const [layout, setLayout] = useState("grid");
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState(3);
  const [data, setData] = useState({
    sales: 12540,
    users: 8421,
    revenue: 89250,
    growth: 24.5,
    activeUsers: 3245,
    bounceRate: 32.1,
    conversion: 4.2,
    sessions: 12890,
  });

  // Refs for animations
  const dashboardRef = useRef(null);
  const widgetsRef = useRef([]);
  const sidebarRef = useRef(null);
  const headerRef = useRef(null);
  const chartRef = useRef(null);
  const notificationBellRef = useRef(null);

  // Mock real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        sales: prev.sales + Math.floor(Math.random() * 100),
        users: prev.users + Math.floor(Math.random() * 50),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10,
        sessions: prev.sessions + Math.floor(Math.random() * 200),
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // ========== 1. DASHBOARD ENTRANCE ANIMATION ==========
    const dashboardEntrance = gsap.timeline();

    dashboardEntrance
      .from(".dashboard-header", {
        y: -100,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      })
      .from(
        ".sidebar",
        {
          x: -100,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4"
      )
      .from(
        ".metric-card",
        {
          scale: 0,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "back.out(1.7)",
        },
        "-=0.2"
      )
      .from(
        ".chart-container",
        {
          y: 50,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.3"
      );

    // ========== 2. WIDGET DRAGGABLE & RESIZABLE ==========
    const widgets = document.querySelectorAll(".draggable-widget");

    widgets.forEach((widget) => {
      // Draggable
      Draggable.create(widget, {
        type: "x,y",
        bounds: ".dashboard-content",
        edgeResistance: 0.65,
        inertia: true,
        onPress: function () {
          gsap.to(this.target, {
            scale: 1.02,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            duration: 0.2,
            zIndex: 100,
          });
        },
        onRelease: function () {
          gsap.to(this.target, {
            scale: 1,
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            duration: 0.3,
            zIndex: 1,
          });
        },
      });

      // Resizable (simulated with click)
      const resizeHandle = widget.querySelector(".resize-handle");
      if (resizeHandle) {
        resizeHandle.addEventListener("click", function (e) {
          e.stopPropagation();

          const currentWidth = widget.offsetWidth;
          const currentHeight = widget.offsetHeight;

          const newWidth = currentWidth === 300 ? 600 : 300;
          const newHeight = currentHeight === 200 ? 400 : 200;

          // FLIP animation for resize
          const state = Flip.getState(widget);

          gsap.set(widget, {
            width: newWidth,
            height: newHeight,
          });

          Flip.from(state, {
            duration: 0.5,
            scale: true,
            ease: "power2.inOut",
            onComplete: () => {
              // Re-initialize charts or content if needed
              if (widget.classList.contains("chart-widget")) {
                animateChart();
              }
            },
          });
        });
      }
    });

    // ========== 3. METRIC CARDS REAL-TIME UPDATES ==========
    const metricCards = document.querySelectorAll(".metric-card");

    metricCards.forEach((card) => {
      const valueElement = card.querySelector(".metric-value");
      const metricType = card.dataset.metric;

      // Pulse animation on data update
      const observer = new MutationObserver(() => {
        gsap.fromTo(
          valueElement,
          { scale: 1.2, color: "#2ecc71" },
          { scale: 1, color: "inherit", duration: 0.5 }
        );
      });

      observer.observe(valueElement, { childList: true, characterData: true });
    });

    // ========== 4. CHART ANIMATIONS ==========
    const animateChart = () => {
      const chartBars = document.querySelectorAll(".chart-bar");
      const chartLines = document.querySelectorAll(".chart-line-point");

      // Animate bars
      gsap.fromTo(
        chartBars,
        { scaleY: 0, transformOrigin: "bottom" },
        {
          scaleY: 1,
          duration: 1,
          stagger: 0.1,
          ease: "back.out(1.7)",
          delay: 0.5,
        }
      );

      // Animate line points
      gsap.fromTo(
        chartLines,
        { scale: 0 },
        {
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "elastic.out(1, 0.5)",
          delay: 1,
        }
      );

      // Continuous line drawing animation
      const linePath = document.querySelector(".chart-line-path");
      if (linePath) {
        const length = linePath.getTotalLength();

        gsap.set(linePath, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(linePath, {
          strokeDashoffset: 0,
          duration: 2,
          ease: "power2.inOut",
          delay: 0.5,
        });
      }
    };

    // Initialize chart
    animateChart();

    // ========== 5. NOTIFICATION SYSTEM ==========
    const notificationBell = notificationBellRef.current;

    if (notificationBell) {
      // Bell shake animation when new notifications
      const shakeBell = () => {
        gsap.to(notificationBell, {
          rotation: 15,
          duration: 0.1,
          yoyo: true,
          repeat: 5,
          ease: "power1.inOut",
        });
      };

      // Mock new notifications every 30 seconds
      const notificationInterval = setInterval(() => {
        if (Math.random() > 0.5) {
          setNotifications((prev) => prev + 1);
          shakeBell();
          showNotification();
        }
      }, 30000);

      // Bell hover animation
      notificationBell.addEventListener("mouseenter", () => {
        gsap.to(notificationBell, {
          scale: 1.2,
          duration: 0.3,
          ease: "elastic.out(1, 0.5)",
        });
      });

      notificationBell.addEventListener("mouseleave", () => {
        gsap.to(notificationBell, {
          scale: 1,
          duration: 0.3,
        });
      });

      // Click to view notifications
      notificationBell.addEventListener("click", () => {
        const notificationPanel = document.querySelector(".notification-panel");

        if (notificationPanel.style.display === "block") {
          gsap.to(notificationPanel, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            onComplete: () => {
              notificationPanel.style.display = "none";
            },
          });
        } else {
          notificationPanel.style.display = "block";
          gsap.fromTo(
            notificationPanel,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.3 }
          );

          // Mark as read animation
          setNotifications(0);

          const notificationItems =
            document.querySelectorAll(".notification-item");
          notificationItems.forEach((item) => {
            gsap.to(item, {
              backgroundColor: "#f8f9fa",
              duration: 0.5,
            });
          });
        }
      });

      return () => clearInterval(notificationInterval);
    }

    // ========== 6. THEME SWITCHER ANIMATION ==========
    const themeSwitcher = document.querySelector(".theme-switcher");

    if (themeSwitcher) {
      themeSwitcher.addEventListener("click", () => {
        const isDark = theme === "dark";
        const newTheme = isDark ? "light" : "dark";

        // Animate switcher
        gsap.to(themeSwitcher.querySelector(".switch-handle"), {
          x: isDark ? 0 : 24,
          duration: 0.3,
          ease: "power2.out",
        });

        // Theme transition animation
        gsap.to("body", {
          backgroundColor: isDark ? "#ffffff" : "#1a1a2e",
          color: isDark ? "#333" : "#fff",
          duration: 0.5,
          onComplete: () => setTheme(newTheme),
        });

        // Animate all cards
        gsap.to(".metric-card, .chart-container, .widget", {
          backgroundColor: isDark ? "#fff" : "#2d2d44",
          color: isDark ? "#333" : "#fff",
          duration: 0.5,
        });
      });
    }

    // ========== 7. LAYOUT SWITCHER (GRID/LIST) ==========
    const layoutSwitcher = document.querySelector(".layout-switcher");

    if (layoutSwitcher) {
      layoutSwitcher.addEventListener("click", () => {
        const newLayout = layout === "grid" ? "list" : "grid";

        // Get current state for FLIP animation
        const widgetsContainer = document.querySelector(".widgets-grid");
        const state = Flip.getState(".draggable-widget");

        // Change layout class
        widgetsContainer.className =
          newLayout === "grid" ? "widgets-grid" : "widgets-list";

        // FLIP animation
        Flip.from(state, {
          duration: 0.7,
          scale: true,
          ease: "power2.inOut",
          onComplete: () => setLayout(newLayout),
        });
      });
    }

    // ========== 8. TAB SWITCHING ANIMATIONS ==========
    const tabButtons = document.querySelectorAll(".tab-button");

    tabButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const tabId = this.dataset.tab;

        // Animate active tab
        gsap.to(".tab-button.active", {
          scale: 1,
          backgroundColor: "transparent",
          color: theme === "light" ? "#666" : "#aaa",
          duration: 0.3,
        });

        gsap.to(this, {
          scale: 1.05,
          backgroundColor: theme === "light" ? "#3498db" : "#2980b9",
          color: "white",
          duration: 0.3,
          ease: "back.out(1.7)",
        });

        // Animate tab content
        const currentContent = document.querySelector(".tab-content.active");
        const newContent = document.querySelector(`#${tabId}-tab`);

        if (currentContent && newContent) {
          const tl = gsap.timeline();

          tl.to(currentContent, {
            opacity: 0,
            y: 20,
            duration: 0.3,
            onComplete: () => {
              currentContent.classList.remove("active");
              newContent.classList.add("active");
            },
          }).fromTo(
            newContent,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.3 },
            "-=0.2"
          );
        }

        setActiveTab(tabId);
      });
    });

    // ========== 9. DATA FILTER ANIMATIONS ==========
    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const filter = this.dataset.filter;

        // Button animation
        gsap.to(filterButtons, {
          scale: 1,
          backgroundColor: "transparent",
          color: theme === "light" ? "#666" : "#aaa",
          duration: 0.3,
        });

        gsap.to(this, {
          scale: 1.1,
          backgroundColor: theme === "light" ? "#2ecc71" : "#27ae60",
          color: "white",
          duration: 0.3,
        });

        // Filter data animation
        const filteredData = document.querySelectorAll("[data-category]");

        filteredData.forEach((item) => {
          if (filter === "all" || item.dataset.category === filter) {
            gsap.to(item, {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: "power2.out",
            });
          } else {
            gsap.to(item, {
              opacity: 0.3,
              scale: 0.9,
              duration: 0.5,
              ease: "power2.in",
            });
          }
        });
      });
    });

    // ========== 10. SIDEBAR COLLAPSE ANIMATION ==========
    const sidebarToggle = document.querySelector(".sidebar-toggle");

    if (sidebarToggle) {
      sidebarToggle.addEventListener("click", () => {
        const sidebar = sidebarRef.current;
        const isCollapsed = sidebar.classList.contains("collapsed");

        if (isCollapsed) {
          // Expand
          gsap.to(sidebar, {
            width: 250,
            duration: 0.4,
            ease: "power2.out",
          });

          gsap.to(".sidebar-item span", {
            opacity: 1,
            x: 0,
            duration: 0.3,
            stagger: 0.05,
            delay: 0.2,
          });
        } else {
          // Collapse
          gsap.to(".sidebar-item span", {
            opacity: 0,
            x: -20,
            duration: 0.2,
            stagger: 0.05,
          });

          gsap.to(sidebar, {
            width: 80,
            duration: 0.4,
            ease: "power2.inOut",
            delay: 0.1,
          });
        }

        sidebar.classList.toggle("collapsed");
      });
    }

    // ========== 11. PROGRESS BARS ANIMATION ==========
    const progressBars = document.querySelectorAll(".progress-bar-fill");

    progressBars.forEach((bar) => {
      const percentage = bar.dataset.percentage;

      ScrollTrigger.create({
        trigger: bar,
        start: "top 80%",
        onEnter: () => {
          gsap.to(bar, {
            width: `${percentage}%`,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: function () {
              const currentPercent = Math.round(this.progress() * percentage);
              bar.parentElement.querySelector(
                ".progress-percentage"
              ).textContent = `${currentPercent}%`;
            },
          });
        },
      });
    });

    // ========== 12. LIVE DATA STREAM SIMULATION ==========
    const liveDataStream = () => {
      const dataPoints = document.querySelectorAll(".live-data-point");

      dataPoints.forEach((point) => {
        // Random pulse animation
        setInterval(() => {
          gsap.to(point, {
            scale: 1.2,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
          });
        }, Math.random() * 3000 + 2000);
      });
    };

    liveDataStream();

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      Draggable.get(".draggable-widget")?.forEach((d) => d.kill());
    };
  }, [theme, layout]);

  // Show notification function
  const showNotification = () => {
    const notification = document.createElement("div");
    notification.className = "toast-notification";
    notification.innerHTML = `
      <div class="toast-icon">🔔</div>
      <div class="toast-content">
        <div class="toast-title">New Update</div>
        <div class="toast-message">Data has been updated</div>
      </div>
    `;

    document.body.appendChild(notification);

    // Toast animation
    gsap.fromTo(
      notification,
      { x: 300, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
        onComplete: () => {
          setTimeout(() => {
            gsap.to(notification, {
              x: 300,
              opacity: 0,
              duration: 0.5,
              onComplete: () => notification.remove(),
            });
          }, 3000);
        },
      }
    );
  };

  // Add widget function
  const addWidget = () => {
    const widgetId = Date.now();
    const newWidget = {
      id: widgetId,
      type: "chart",
      title: "New Widget",
      data: [25, 50, 75, 100, 75, 50, 25],
    };

    // FLIP animation for adding widget
    const container = document.querySelector(".widgets-grid");
    const state = Flip.getState(".draggable-widget");

    // Add widget to DOM (in real app, this would be state update)
    const widgetElement = document.createElement("div");
    widgetElement.className = "draggable-widget widget chart-widget";
    widgetElement.innerHTML = `
      <div class="widget-header">
        <h4>${newWidget.title}</h4>
        <div class="widget-controls">
          <button class="resize-handle">↔</button>
          <button class="close-widget">×</button>
        </div>
      </div>
      <div class="widget-content">
        <div class="chart-bars">
          ${newWidget.data
            .map(
              (value, i) => `
            <div class="chart-bar" style="height: ${value}%"></div>
          `
            )
            .join("")}
        </div>
      </div>
    `;

    container.appendChild(widgetElement);

    Flip.from(state, {
      duration: 0.5,
      scale: true,
      ease: "back.out(1.7)",
      onComplete: () => {
        // Reinitialize draggable for new widget
        Draggable.create(widgetElement, {
          type: "x,y",
          bounds: ".dashboard-content",
        });

        // Add close functionality
        widgetElement
          .querySelector(".close-widget")
          .addEventListener("click", () => {
            const state = Flip.getState(".draggable-widget");
            widgetElement.remove();
            Flip.from(state, {
              duration: 0.3,
              scale: true,
            });
          });
      },
    });
  };

  return (
    <div ref={dashboardRef} className={`dashboard ${theme}`}>
      {/* Header */}
      <header ref={headerRef} className="dashboard-header">
        <div className="header-left">
          <h1>Analytics Dashboard</h1>
          <div className="breadcrumbs">
            <span>Home</span>
            <span>•</span>
            <span className="active">Dashboard</span>
          </div>
        </div>

        <div className="header-right">
          <div className="header-controls">
            <button className="theme-switcher">
              <div className="switch-track">
                <div className="switch-handle"></div>
              </div>
              <span>{theme === "light" ? "🌙" : "☀️"}</span>
            </button>

            <button className="layout-switcher">
              {layout === "grid" ? "≡" : "☷"}
            </button>

            <div className="notification-container">
              <div ref={notificationBellRef} className="notification-bell">
                🔔
                {notifications > 0 && (
                  <span className="notification-count">{notifications}</span>
                )}
              </div>

              <div className="notification-panel">
                <div className="notification-header">
                  <h4>Notifications</h4>
                  <button className="mark-all-read">Mark all as read</button>
                </div>
                <div className="notification-list">
                  <div className="notification-item">
                    <div className="notification-icon">📈</div>
                    <div className="notification-content">
                      <p>Sales increased by 15%</p>
                      <span>2 minutes ago</span>
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-icon">👥</div>
                    <div className="notification-content">
                      <p>100 new users registered</p>
                      <span>1 hour ago</span>
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-icon">⚠️</div>
                    <div className="notification-content">
                      <p>Server load at 85%</p>
                      <span>3 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="user-profile">
              <div className="avatar">JD</div>
              <div className="user-info">
                <span className="user-name">John Doe</span>
                <span className="user-role">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-main">
        {/* Sidebar */}
        <aside ref={sidebarRef} className="sidebar">
          <button className="sidebar-toggle">☰</button>

          <nav className="sidebar-nav">
            {[
              { icon: "📊", label: "Overview", active: true },
              { icon: "📈", label: "Analytics" },
              { icon: "👥", label: "Users" },
              { icon: "💰", label: "Revenue" },
              { icon: "🛒", label: "Products" },
              { icon: "⚙️", label: "Settings" },
            ].map((item, index) => (
              <div
                key={index}
                className={`sidebar-item ${item.active ? "active" : ""}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </div>
            ))}
          </nav>

          <div className="sidebar-footer">
            <button className="add-widget-btn" onClick={addWidget}>
              + Add Widget
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-content">
          {/* Tabs */}
          <div className="dashboard-tabs">
            {["overview", "analytics", "reports", "export"].map((tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? "active" : ""}`}
                data-tab={tab}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Metrics Cards */}
          <div className="metrics-grid">
            {[
              {
                title: "Total Sales",
                value: `$${data.sales.toLocaleString()}`,
                change: "+12%",
                icon: "💰",
              },
              {
                title: "Active Users",
                value: data.users.toLocaleString(),
                change: "+5%",
                icon: "👥",
              },
              {
                title: "Revenue",
                value: `$${data.revenue.toLocaleString()}`,
                change: "+24%",
                icon: "📈",
              },
              {
                title: "Growth",
                value: `${data.growth}%`,
                change: "+3.2%",
                icon: "📊",
              },
            ].map((metric, index) => (
              <div
                key={index}
                className="metric-card"
                data-metric={metric.title.toLowerCase()}
              >
                <div className="metric-icon">{metric.icon}</div>
                <div className="metric-info">
                  <h4>{metric.title}</h4>
                  <div className="metric-value">{metric.value}</div>
                  <div className="metric-change">
                    <span
                      className={`change-${
                        metric.change.includes("+") ? "positive" : "negative"
                      }`}
                    >
                      {metric.change}
                    </span>
                    <span> from last month</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="filters-section">
            <div className="filter-buttons">
              {["all", "today", "week", "month", "year"].map((filter) => (
                <button
                  key={filter}
                  className="filter-btn"
                  data-filter={filter}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>

            <div className="date-range">
              <input type="date" />
              <span>to</span>
              <input type="date" />
            </div>
          </div>

          {/* Charts */}
          <div ref={chartRef} className="chart-container">
            <div className="chart-header">
              <h3>Revenue Overview</h3>
              <div className="chart-legend">
                <span className="legend-item">
                  <div className="legend-color sales"></div>
                  Sales
                </span>
                <span className="legend-item">
                  <div className="legend-color revenue"></div>
                  Revenue
                </span>
              </div>
            </div>

            <div className="chart-wrapper">
              <div className="chart-bars">
                {[65, 85, 75, 90, 65, 85, 70].map((height, i) => (
                  <div
                    key={i}
                    className="chart-bar"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>

              <svg className="chart-line" width="100%" height="100%">
                <path
                  className="chart-line-path"
                  d="M0,50 L100,30 L200,70 L300,40 L400,80 L500,30 L600,60"
                  fill="none"
                  stroke="#3498db"
                  strokeWidth="3"
                />
                {[0, 100, 200, 300, 400, 500, 600].map((x, i) => (
                  <circle
                    key={i}
                    className="chart-line-point"
                    cx={x}
                    cy={[50, 30, 70, 40, 80, 30, 60][i]}
                    r="5"
                    fill="#3498db"
                  />
                ))}
              </svg>
            </div>

            <div className="chart-labels">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </div>

          {/* Widgets Grid */}
          <div className={`widgets-${layout}`}>
            {/* Active Users Widget */}
            <div className="draggable-widget widget">
              <div className="widget-header">
                <h4>Active Users</h4>
                <div className="widget-controls">
                  <button className="resize-handle">↔</button>
                  <button className="close-widget">×</button>
                </div>
              </div>
              <div className="widget-content">
                <div className="live-data">
                  <div className="live-data-point">📱</div>
                  <div className="live-data-value">
                    {data.activeUsers.toLocaleString()}
                  </div>
                  <div className="live-data-label">Currently Active</div>
                </div>
                <div className="progress-bars">
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      data-percentage="75"
                    ></div>
                    <span className="progress-label">Mobile</span>
                    <span className="progress-percentage">0%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      data-percentage="25"
                    ></div>
                    <span className="progress-label">Desktop</span>
                    <span className="progress-percentage">0%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sessions Widget */}
            <div className="draggable-widget widget">
              <div className="widget-header">
                <h4>Sessions</h4>
              </div>
              <div className="widget-content">
                <div className="session-metrics">
                  <div className="session-metric">
                    <div className="metric-value">
                      {data.sessions.toLocaleString()}
                    </div>
                    <div className="metric-label">Total Sessions</div>
                  </div>
                  <div className="session-metric">
                    <div className="metric-value">{data.bounceRate}%</div>
                    <div className="metric-label">Bounce Rate</div>
                  </div>
                  <div className="session-metric">
                    <div className="metric-value">{data.conversion}%</div>
                    <div className="metric-label">Conversion</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-time Data Stream */}
            <div className="draggable-widget widget">
              <div className="widget-header">
                <h4>Real-time Data</h4>
              </div>
              <div className="widget-content">
                <div className="data-stream">
                  {[
                    { label: "API Requests", value: "1.2k/sec", trend: "up" },
                    {
                      label: "Database Queries",
                      value: "850/sec",
                      trend: "stable",
                    },
                    { label: "Cache Hits", value: "95%", trend: "up" },
                    { label: "Error Rate", value: "0.2%", trend: "down" },
                  ].map((item, i) => (
                    <div key={i} className="stream-item">
                      <span className="stream-label">{item.label}</span>
                      <span className="stream-value">{item.value}</span>
                      <span className={`stream-trend trend-${item.trend}`}>
                        {item.trend === "up"
                          ? "↑"
                          : item.trend === "down"
                          ? "↓"
                          : "→"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: "Inter", sans-serif;
          transition: background-color 0.5s, color 0.5s;
        }

        .dashboard {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .dashboard.light {
          background: #f8f9fa;
          color: #333;
        }

        .dashboard.dark {
          background: #1a1a2e;
          color: #fff;
        }

        /* Header */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 40px;
          background: inherit;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
          z-index: 100;
        }

        .header-left h1 {
          font-size: 1.8rem;
          margin-bottom: 5px;
        }

        .breadcrumbs {
          display: flex;
          gap: 10px;
          color: #666;
          font-size: 0.9rem;
        }

        .breadcrumbs .active {
          color: #3498db;
          font-weight: 600;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 30px;
        }

        .header-controls {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .theme-switcher,
        .layout-switcher {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .theme-switcher:hover,
        .layout-switcher:hover {
          background: rgba(52, 152, 219, 0.1);
        }

        .theme-switcher {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .switch-track {
          width: 50px;
          height: 24px;
          background: #ddd;
          border-radius: 12px;
          position: relative;
          transition: background-color 0.3s;
        }

        .dark .switch-track {
          background: #444;
        }

        .switch-handle {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 50%;
          transition: transform 0.3s;
        }

        .notification-container {
          position: relative;
        }

        .notification-bell {
          position: relative;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .notification-bell:hover {
          background: rgba(52, 152, 219, 0.1);
        }

        .notification-count {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #e74c3c;
          color: white;
          font-size: 0.7rem;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-panel {
          position: absolute;
          top: 100%;
          right: 0;
          width: 350px;
          background: inherit;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          border-radius: 10px;
          padding: 20px;
          display: none;
          z-index: 1000;
          border: 1px solid #eee;
        }

        .dark .notification-panel {
          border-color: #444;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .notification-header h4 {
          font-size: 1.1rem;
        }

        .mark-all-read {
          background: none;
          border: none;
          color: #3498db;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .notification-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .notification-item {
          display: flex;
          gap: 15px;
          padding: 10px;
          border-radius: 8px;
          transition: background-color 0.3s;
        }

        .notification-item:hover {
          background: rgba(52, 152, 219, 0.1);
        }

        .notification-icon {
          font-size: 1.2rem;
        }

        .notification-content p {
          margin-bottom: 5px;
          font-weight: 500;
        }

        .notification-content span {
          font-size: 0.8rem;
          color: #666;
        }

        .dark .notification-content span {
          color: #aaa;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .avatar {
          width: 40px;
          height: 40px;
          background: #3498db;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .user-info {
          display: flex;
          flex-direction: column;
        }

        .user-name {
          font-weight: 600;
        }

        .user-role {
          font-size: 0.8rem;
          color: #666;
        }

        .dark .user-role {
          color: #aaa;
        }

        /* Main Layout */
        .dashboard-main {
          display: flex;
          flex: 1;
        }

        /* Sidebar */
        .sidebar {
          width: 250px;
          background: inherit;
          border-right: 1px solid #eee;
          padding: 20px;
          display: flex;
          flex-direction: column;
          transition: width 0.4s;
        }

        .dark .sidebar {
          border-right-color: #444;
        }

        .sidebar.collapsed {
          width: 80px;
        }

        .sidebar-toggle {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 10px;
          margin-bottom: 30px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .sidebar-toggle:hover {
          background: rgba(52, 152, 219, 0.1);
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px 15px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .sidebar-item:hover {
          background: rgba(52, 152, 219, 0.1);
        }

        .sidebar-item.active {
          background: #3498db;
          color: white;
        }

        .sidebar-icon {
          font-size: 1.2rem;
        }

        .sidebar-label {
          transition: opacity 0.3s, transform 0.3s;
        }

        .sidebar.collapsed .sidebar-label {
          opacity: 0;
          transform: translateX(-20px);
          width: 0;
        }

        .sidebar-footer {
          padding-top: 20px;
          border-top: 1px solid #eee;
        }

        .dark .sidebar-footer {
          border-top-color: #444;
        }

        .add-widget-btn {
          width: 100%;
          padding: 12px;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .add-widget-btn:hover {
          background: #2980b9;
          transform: translateY(-2px);
        }

        /* Main Content */
        .dashboard-content {
          flex: 1;
          padding: 30px;
          overflow-y: auto;
        }

        .dashboard-tabs {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }

        .dark .dashboard-tabs {
          border-bottom-color: #444;
        }

        .tab-button {
          padding: 10px 20px;
          background: none;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .tab-button.active {
          background: #3498db;
          color: white;
        }

        /* Metrics Grid */
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .metric-card {
          background: inherit;
          border: 1px solid #eee;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          gap: 20px;
          align-items: center;
          transition: all 0.3s ease;
        }

        .dark .metric-card {
          border-color: #444;
        }

        .metric-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .metric-icon {
          font-size: 2rem;
        }

        .metric-info h4 {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 5px;
        }

        .dark .metric-info h4 {
          color: #aaa;
        }

        .metric-value {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .metric-change {
          font-size: 0.9rem;
        }

        .change-positive {
          color: #2ecc71;
          font-weight: 600;
        }

        .change-negative {
          color: #e74c3c;
          font-weight: 600;
        }

        /* Filters */
        .filters-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding: 20px;
          background: inherit;
          border: 1px solid #eee;
          border-radius: 12px;
        }

        .dark .filters-section {
          border-color: #444;
        }

        .filter-buttons {
          display: flex;
          gap: 10px;
        }

        .filter-btn {
          padding: 8px 16px;
          background: none;
          border: 1px solid #ddd;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .dark .filter-btn {
          border-color: #444;
        }

        .date-range {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .date-range input {
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: inherit;
          color: inherit;
        }

        .dark .date-range input {
          border-color: #444;
        }

        /* Chart Container */
        .chart-container {
          background: inherit;
          border: 1px solid #eee;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 30px;
        }

        .dark .chart-container {
          border-color: #444;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .chart-legend {
          display: flex;
          gap: 20px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
        }

        .legend-color.sales {
          background: #3498db;
        }

        .legend-color.revenue {
          background: #2ecc71;
        }

        .chart-wrapper {
          height: 300px;
          position: relative;
          margin-bottom: 20px;
        }

        .chart-bars {
          display: flex;
          align-items: flex-end;
          justify-content: space-around;
          height: 100%;
          position: relative;
          z-index: 1;
        }

        .chart-bar {
          width: 40px;
          background: #3498db;
          border-radius: 4px 4px 0 0;
          transition: height 0.5s ease;
        }

        .chart-line {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
        }

        .chart-labels {
          display: flex;
          justify-content: space-around;
          padding-top: 10px;
          border-top: 1px solid #eee;
          font-size: 0.9rem;
          color: #666;
        }

        .dark .chart-labels {
          border-top-color: #444;
          color: #aaa;
        }

        /* Widgets */
        .widgets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .widgets-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .widget {
          background: inherit;
          border: 1px solid #eee;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .dark .widget {
          border-color: #444;
        }

        .draggable-widget {
          cursor: move;
        }

        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid #eee;
          background: inherit;
        }

        .dark .widget-header {
          border-bottom-color: #444;
        }

        .widget-header h4 {
          font-size: 1rem;
        }

        .widget-controls {
          display: flex;
          gap: 10px;
        }

        .widget-controls button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
          border-radius: 4px;
          transition: background-color 0.3s;
        }

        .widget-controls button:hover {
          background: rgba(52, 152, 219, 0.1);
        }

        .widget-content {
          padding: 20px;
        }

        /* Live Data */
        .live-data {
          text-align: center;
          margin-bottom: 20px;
        }

        .live-data-point {
          font-size: 3rem;
          margin-bottom: 10px;
        }

        .live-data-value {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .live-data-label {
          color: #666;
          font-size: 0.9rem;
        }

        .dark .live-data-label {
          color: #aaa;
        }

        /* Progress Bars */
        .progress-bars {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .progress-bar {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .progress-bar-fill {
          flex: 1;
          height: 8px;
          background: #3498db;
          border-radius: 4px;
          width: 0%;
        }

        .progress-label {
          width: 60px;
          font-size: 0.9rem;
        }

        .progress-percentage {
          width: 40px;
          text-align: right;
          font-weight: 600;
        }

        /* Session Metrics */
        .session-metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          text-align: center;
        }

        .session-metric .metric-value {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .session-metric .metric-label {
          font-size: 0.9rem;
          color: #666;
        }

        .dark .session-metric .metric-label {
          color: #aaa;
        }

        /* Data Stream */
        .data-stream {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .stream-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border-radius: 8px;
          transition: background-color 0.3s;
        }

        .stream-item:hover {
          background: rgba(52, 152, 219, 0.1);
        }

        .stream-label {
          font-size: 0.9rem;
        }

        .stream-value {
          font-weight: 600;
        }

        .stream-trend {
          font-size: 1.2rem;
        }

        .trend-up {
          color: #2ecc71;
        }

        .trend-down {
          color: #e74c3c;
        }

        .trend-stable {
          color: #f39c12;
        }

        /* Toast Notifications */
        .toast-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          background: inherit;
          border: 1px solid #eee;
          border-radius: 10px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          z-index: 10000;
          width: 300px;
        }

        .dark .toast-notification {
          border-color: #444;
        }

        .toast-icon {
          font-size: 1.5rem;
        }

        .toast-content {
          flex: 1;
        }

        .toast-title {
          font-weight: 600;
          margin-bottom: 5px;
        }

        .toast-message {
          font-size: 0.9rem;
          color: #666;
        }

        .dark .toast-message {
          color: #aaa;
        }
      `}</style>
    </div>
  );
}

export default InteractiveDashboard;
