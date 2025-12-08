import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(ScrollTrigger, Draggable);

function ECommerceProductPage() {
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  const productRef = useRef(null);
  const galleryRef = useRef(null);
  const cartRef = useRef(null);
  const cartNotificationRef = useRef(null);

  const product = {
    name: "Premium Running Shoes",
    price: 129.99,
    colors: ["black", "blue", "red", "white"],
    sizes: ["S", "M", "L", "XL"],
    images: {
      black: ["black1", "black2", "black3"],
      blue: ["blue1", "blue2", "blue3"],
      red: ["red1", "red2", "red3"],
      white: ["white1", "white2", "white3"],
    },
  };

  useEffect(() => {
    // ========== 1. PRODUCT IMAGE GALLERY ANIMATIONS ==========
    const mainImage = productRef.current?.querySelector(".main-product-image");
    const thumbnails = productRef.current?.querySelectorAll(".thumbnail");

    // Main image hover effect
    mainImage?.addEventListener("mouseenter", () => {
      gsap.to(mainImage, {
        scale: 1.05,
        duration: 0.5,
        ease: "power2.out",
      });
    });

    mainImage?.addEventListener("mouseleave", () => {
      gsap.to(mainImage, {
        scale: 1,
        duration: 0.5,
        ease: "power2.inOut",
      });
    });

    // Thumbnail interactions
    thumbnails?.forEach((thumb, index) => {
      // Click animation
      thumb.addEventListener("click", () => {
        // Scale down all thumbnails
        gsap.to(thumbnails, {
          scale: 1,
          borderColor: "#ddd",
          duration: 0.3,
        });

        // Scale up selected thumbnail
        gsap.to(thumb, {
          scale: 1.1,
          borderColor: "#3498db",
          duration: 0.3,
        });

        // Main image change animation
        gsap.to(mainImage, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            // Change image source here
            gsap.to(mainImage, {
              opacity: 1,
              duration: 0.3,
            });
          },
        });
      });

      // Hover effect
      thumb.addEventListener("mouseenter", () => {
        gsap.to(thumb, {
          y: -5,
          duration: 0.3,
        });
      });

      thumb.addEventListener("mouseleave", () => {
        gsap.to(thumb, {
          y: 0,
          duration: 0.3,
        });
      });
    });

    // ========== 2. COLOR SELECTOR ANIMATIONS ==========
    const colorOptions = productRef.current?.querySelectorAll(".color-option");

    colorOptions?.forEach((option) => {
      option.addEventListener("click", function () {
        const color = this.dataset.color;
        setSelectedColor(color);

        // Animate selection
        gsap.to(colorOptions, {
          scale: 1,
          borderWidth: "1px",
          duration: 0.3,
        });

        gsap.to(this, {
          scale: 1.2,
          borderWidth: "3px",
          duration: 0.3,
          ease: "back.out(1.7)",
        });

        // Image gallery update animation
        updateGallery(color);
      });
    });

    // ========== 3. SIZE SELECTOR ANIMATIONS ==========
    const sizeOptions = productRef.current?.querySelectorAll(".size-option");

    sizeOptions?.forEach((option) => {
      option.addEventListener("click", function () {
        const size = this.dataset.size;
        setSelectedSize(size);

        // Animate selection
        gsap.to(sizeOptions, {
          backgroundColor: "white",
          color: "#333",
          duration: 0.3,
        });

        gsap.to(this, {
          backgroundColor: "#3498db",
          color: "white",
          scale: 1.1,
          duration: 0.3,
          ease: "back.out(1.7)",
        });
      });
    });

    // ========== 4. QUANTITY SELECTOR ANIMATIONS ==========
    const quantityMinus = productRef.current?.querySelector(".quantity-minus");
    const quantityPlus = productRef.current?.querySelector(".quantity-plus");
    const quantityDisplay =
      productRef.current?.querySelector(".quantity-display");

    quantityMinus?.addEventListener("click", () => {
      if (quantity > 1) {
        gsap.to(quantityMinus, {
          scale: 0.9,
          duration: 0.1,
          onComplete: () => {
            gsap.to(quantityMinus, {
              scale: 1,
              duration: 0.2,
            });
          },
        });

        setQuantity((q) => q - 1);

        // Animate quantity display
        gsap.fromTo(
          quantityDisplay,
          { scale: 1.2, color: "#e74c3c" },
          { scale: 1, color: "#333", duration: 0.3 }
        );
      }
    });

    quantityPlus?.addEventListener("click", () => {
      gsap.to(quantityPlus, {
        scale: 0.9,
        duration: 0.1,
        onComplete: () => {
          gsap.to(quantityPlus, {
            scale: 1,
            duration: 0.2,
          });
        },
      });

      setQuantity((q) => q + 1);

      // Animate quantity display
      gsap.fromTo(
        quantityDisplay,
        { scale: 1.2, color: "#2ecc71" },
        { scale: 1, color: "#333", duration: 0.3 }
      );
    });

    // ========== 5. ADD TO CART ANIMATION ==========
    const addToCartBtn = productRef.current?.querySelector(".add-to-cart");

    addToCartBtn?.addEventListener("click", () => {
      // Button press animation
      const tl = gsap.timeline();

      tl.to(addToCartBtn, {
        scale: 0.95,
        duration: 0.1,
      })
        .to(addToCartBtn, {
          scale: 1,
          duration: 0.2,
          ease: "elastic.out(1, 0.5)",
        })
        .to(addToCartBtn, {
          backgroundColor: "#2ecc71",
          duration: 0.3,
        });

      // Cart icon animation
      const cartIcon = cartRef.current?.querySelector(".cart-icon");
      if (cartIcon) {
        gsap.to(cartIcon, {
          scale: 1.3,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut",
        });
      }

      // Cart count animation
      setCartItems((prev) => {
        const newCount = prev + quantity;

        // Animate cart notification
        if (cartNotificationRef.current) {
          gsap.fromTo(
            cartNotificationRef.current,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: "back.out(1.7)",
              onComplete: () => {
                gsap.to(cartNotificationRef.current, {
                  scale: 0,
                  opacity: 0,
                  duration: 0.5,
                  delay: 2,
                });
              },
            }
          );
        }

        return newCount;
      });

      // Product fly to cart animation
      const productClone = mainImage?.cloneNode(true);
      if (productClone && cartRef.current) {
        productClone.style.position = "fixed";
        productClone.style.zIndex = "1000";
        productClone.style.width = "100px";
        productClone.style.height = "100px";
        productClone.style.borderRadius = "50%";
        productClone.style.overflow = "hidden";

        const mainRect = mainImage.getBoundingClientRect();
        const cartRect = cartRef.current.getBoundingClientRect();

        productClone.style.left = `${mainRect.left}px`;
        productClone.style.top = `${mainRect.top}px`;

        document.body.appendChild(productClone);

        gsap.to(productClone, {
          x: cartRect.left - mainRect.left,
          y: cartRect.top - mainRect.top,
          scale: 0.3,
          duration: 1,
          ease: "power2.inOut",
          onComplete: () => {
            document.body.removeChild(productClone);
          },
        });
      }

      // Reset button after 1 second
      setTimeout(() => {
        gsap.to(addToCartBtn, {
          backgroundColor: "#3498db",
          duration: 0.3,
        });
      }, 1000);
    });

    // ========== 6. PRODUCT DETAILS TABS ==========
    const tabButtons = productRef.current?.querySelectorAll(".tab-btn");
    const tabContents = productRef.current?.querySelectorAll(".tab-content");

    tabButtons?.forEach((button) => {
      button.addEventListener("click", function () {
        const tabId = this.dataset.tab;
        setActiveTab(tabId);

        // Animate tab buttons
        gsap.to(tabButtons, {
          color: "#666",
          borderBottomColor: "transparent",
          duration: 0.3,
        });

        gsap.to(this, {
          color: "#3498db",
          borderBottomColor: "#3498db",
          duration: 0.3,
        });

        // Animate tab contents
        tabContents?.forEach((content) => {
          if (content.id === `${tabId}-tab`) {
            gsap.fromTo(
              content,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.5 }
            );
          } else {
            gsap.to(content, {
              opacity: 0,
              y: -20,
              duration: 0.3,
            });
          }
        });
      });
    });

    // ========== 7. PRODUCT GALLERY DRAGGABLE ==========
    if (galleryRef.current) {
      const gallery = galleryRef.current.querySelector(".gallery-track");
      const galleryItems = galleryRef.current.querySelectorAll(".gallery-item");

      // Calculate gallery width
      const itemWidth = galleryItems[0]?.offsetWidth || 300;
      const totalWidth = itemWidth * galleryItems.length;
      gallery.style.width = `${totalWidth}px`;

      Draggable.create(gallery, {
        type: "x",
        bounds: {
          minX: -(totalWidth - galleryRef.current.offsetWidth),
          maxX: 0,
        },
        inertia: true,
        edgeResistance: 0.8,
        onDrag: function () {
          // Parallax effect for items
          galleryItems.forEach((item, index) => {
            const x = this.x;
            const depth = (index + 1) * 0.1;
            gsap.to(item, {
              x: x * depth,
              duration: 0.1,
            });
          });
        },
      });

      // Auto-scroll gallery
      let autoScroll = gsap.to(gallery, {
        x: -(totalWidth - galleryRef.current.offsetWidth),
        duration: 30,
        ease: "none",
        paused: true,
        repeat: -1,
        yoyo: true,
      });

      // Pause on hover
      galleryRef.current.addEventListener("mouseenter", () =>
        autoScroll.pause()
      );
      galleryRef.current.addEventListener("mouseleave", () =>
        autoScroll.play()
      );
    }

    // ========== 8. REVIEWS SECTION ANIMATIONS ==========
    const reviewCards = productRef.current?.querySelectorAll(".review-card");

    reviewCards?.forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
        x: index % 2 === 0 ? -50 : 50,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.2,
        ease: "power2.out",
      });

      // Star rating animation
      const stars = card.querySelectorAll(".star");
      const rating = parseInt(card.dataset.rating);

      stars.forEach((star, starIndex) => {
        if (starIndex < rating) {
          gsap.from(star, {
            scale: 0,
            rotation: 180,
            duration: 0.5,
            delay: 0.5 + starIndex * 0.1,
            ease: "back.out(1.7)",
          });
        }
      });
    });

    // ========== 9. SCROLL ANIMATIONS ==========
    // Price sticky animation
    const priceElement = productRef.current?.querySelector(".product-price");

    ScrollTrigger.create({
      trigger: productRef.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (priceElement) {
          const progress = self.progress;
          gsap.to(priceElement, {
            scale: 1 + progress * 0.1,
            opacity: 1 - progress * 0.3,
            duration: 0.1,
          });
        }
      },
    });

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      Draggable.get(".gallery-track")?.kill();
    };
  }, [selectedColor]);

  const updateGallery = (color) => {
    // This would update the gallery images based on selected color
    console.log(`Updating gallery for ${color} color`);
  };

  const calculateTotal = () => {
    return (product.price * quantity).toFixed(2);
  };

  return (
    <div className="ecommerce-container">
      {/* Header with Cart */}
      <header className="ecommerce-header">
        <div className="logo">SHOPPING</div>

        <div ref={cartRef} className="cart-section">
          <div className="cart-icon">🛒</div>
          <div className="cart-count">{cartItems}</div>
          <div ref={cartNotificationRef} className="cart-notification">
            Added to cart! ✅
          </div>
        </div>
      </header>

      {/* Main Product Section */}
      <main ref={productRef} className="product-container">
        <div className="product-gallery">
          <div className="main-image-container">
            <div className="main-product-image"></div>
            <div className="product-badge">New Arrival</div>
          </div>

          <div className="thumbnail-container">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="thumbnail"></div>
            ))}
          </div>
        </div>

        <div className="product-details">
          <h1 className="product-title">{product.name}</h1>

          <div className="product-price-section">
            <span className="product-price">${product.price}</span>
            <span className="product-old-price">$149.99</span>
            <span className="product-discount">Save 13%</span>
          </div>

          <div className="product-colors">
            <h3>Color: {selectedColor}</h3>
            <div className="color-options">
              {product.colors.map((color) => (
                <div
                  key={color}
                  className={`color-option ${
                    selectedColor === color ? "selected" : ""
                  }`}
                  data-color={color}
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
          </div>

          <div className="product-sizes">
            <h3>Size: {selectedSize}</h3>
            <div className="size-options">
              {product.sizes.map((size) => (
                <div
                  key={size}
                  className={`size-option ${
                    selectedSize === size ? "selected" : ""
                  }`}
                  data-size={size}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>

          <div className="product-quantity">
            <h3>Quantity</h3>
            <div className="quantity-selector">
              <button className="quantity-minus">-</button>
              <span className="quantity-display">{quantity}</span>
              <button className="quantity-plus">+</button>
            </div>
          </div>

          <div className="product-total">
            <span>Total:</span>
            <span className="total-price">${calculateTotal()}</span>
          </div>

          <button className="add-to-cart">
            Add to Cart • ${calculateTotal()}
          </button>

          <button className="buy-now">Buy Now</button>
        </div>
      </main>

      {/* Product Gallery Section */}
      <section ref={galleryRef} className="gallery-section">
        <h2>More Images</h2>
        <div className="gallery-container">
          <div className="gallery-track">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <div key={num} className="gallery-item">
                Image {num}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Info Tabs */}
      <section className="product-info-section">
        <div className="product-tabs">
          {["description", "specifications", "reviews", "shipping"].map(
            (tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                data-tab={tab}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )
          )}
        </div>

        <div className="tab-contents">
          <div id="description-tab" className="tab-content">
            <h3>Product Description</h3>
            <p>Premium running shoes with advanced cushioning technology.</p>
          </div>

          <div id="specifications-tab" className="tab-content">
            <h3>Specifications</h3>
            <ul>
              <li>Material: Breathable Mesh</li>
              <li>Weight: 280g</li>
              <li>Color Options: 4</li>
            </ul>
          </div>

          <div id="reviews-tab" className="tab-content">
            <h3>Customer Reviews</h3>
            <div className="reviews-container">
              {[
                { name: "John D.", rating: 5, comment: "Best shoes ever!" },
                { name: "Sarah M.", rating: 4, comment: "Very comfortable" },
                { name: "Mike T.", rating: 5, comment: "Great for running" },
              ].map((review, index) => (
                <div
                  key={index}
                  className="review-card"
                  data-rating={review.rating}
                >
                  <h4>{review.name}</h4>
                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="star">
                        {star <= review.rating ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="related-products">
        <h2>You Might Also Like</h2>
        <div className="related-items">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="related-item">
              <div className="related-image"></div>
              <h4>Related Product {item}</h4>
              <p>$99.99</p>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .ecommerce-container {
          font-family: "Inter", sans-serif;
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        /* Header */
        .ecommerce-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          margin-bottom: 40px;
          border-bottom: 1px solid #eee;
        }

        .logo {
          font-size: 28px;
          font-weight: 700;
          color: #3498db;
        }

        .cart-section {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cart-icon {
          font-size: 24px;
          cursor: pointer;
        }

        .cart-count {
          background: #e74c3c;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
        }

        .cart-notification {
          position: absolute;
          top: 100%;
          right: 0;
          background: #2ecc71;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          white-space: nowrap;
          opacity: 0;
          transform: scale(0);
        }

        /* Main Product Section */
        .product-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          margin-bottom: 80px;
        }

        .product-gallery {
          position: sticky;
          top: 20px;
          align-self: start;
        }

        .main-image-container {
          position: relative;
          width: 100%;
          height: 500px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 20px;
        }

        .main-product-image {
          width: 100%;
          height: 100%;
          background: #f8f9fa;
        }

        .product-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          background: #e74c3c;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
        }

        .thumbnail-container {
          display: flex;
          gap: 15px;
        }

        .thumbnail {
          width: 100px;
          height: 100px;
          background: #ddd;
          border-radius: 10px;
          cursor: pointer;
          border: 1px solid #ddd;
          transition: all 0.3s ease;
        }

        .thumbnail:hover {
          border-color: #3498db;
        }

        /* Product Details */
        .product-details {
          padding: 20px;
        }

        .product-title {
          font-size: 2.5rem;
          margin-bottom: 20px;
          color: #2c3e50;
        }

        .product-price-section {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 30px;
        }

        .product-price {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .product-old-price {
          font-size: 1.2rem;
          color: #95a5a6;
          text-decoration: line-through;
        }

        .product-discount {
          background: #2ecc71;
          color: white;
          padding: 5px 10px;
          border-radius: 5px;
          font-weight: 600;
        }

        .product-colors,
        .product-sizes,
        .product-quantity {
          margin-bottom: 30px;
        }

        .product-colors h3,
        .product-sizes h3,
        .product-quantity h3 {
          margin-bottom: 15px;
          color: #2c3e50;
        }

        .color-options {
          display: flex;
          gap: 15px;
        }

        .color-option {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          border: 1px solid #ddd;
          transition: all 0.3s ease;
        }

        .color-option.selected {
          border-width: 3px;
          border-color: #3498db;
        }

        .size-options {
          display: flex;
          gap: 10px;
        }

        .size-option {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ddd;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .size-option.selected {
          background: #3498db;
          color: white;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 20px;
          width: fit-content;
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 10px;
        }

        .quantity-minus,
        .quantity-plus {
          width: 40px;
          height: 40px;
          border: none;
          background: #f8f9fa;
          border-radius: 8px;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .quantity-minus:hover,
        .quantity-plus:hover {
          background: #3498db;
          color: white;
        }

        .quantity-display {
          font-size: 1.5rem;
          font-weight: 600;
          min-width: 50px;
          text-align: center;
        }

        .product-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
          margin-bottom: 30px;
          font-size: 1.2rem;
        }

        .total-price {
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .add-to-cart,
        .buy-now {
          width: 100%;
          padding: 20px;
          border: none;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 15px;
        }

        .add-to-cart {
          background: #3498db;
          color: white;
        }

        .buy-now {
          background: #2c3e50;
          color: white;
        }

        .add-to-cart:hover,
        .buy-now:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        /* Gallery Section */
        .gallery-section {
          margin-bottom: 80px;
        }

        .gallery-section h2 {
          margin-bottom: 30px;
          color: #2c3e50;
        }

        .gallery-container {
          overflow: hidden;
          border-radius: 20px;
          background: #f8f9fa;
          padding: 20px;
        }

        .gallery-track {
          display: flex;
          gap: 20px;
          cursor: grab;
        }

        .gallery-item {
          flex: 0 0 300px;
          height: 200px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
        }

        /* Product Info Tabs */
        .product-info-section {
          margin-bottom: 80px;
        }

        .product-tabs {
          display: flex;
          gap: 30px;
          margin-bottom: 30px;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }

        .tab-btn {
          padding: 10px 0;
          background: none;
          border: none;
          font-size: 1.1rem;
          color: #666;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
        }

        .tab-btn.active {
          color: #3498db;
          border-bottom-color: #3498db;
        }

        .tab-content {
          padding: 30px 0;
        }

        .tab-content h3 {
          margin-bottom: 20px;
          color: #2c3e50;
        }

        /* Reviews */
        .reviews-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-top: 30px;
        }

        .review-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 15px;
        }

        .review-card h4 {
          margin-bottom: 10px;
          color: #2c3e50;
        }

        .stars {
          margin-bottom: 15px;
          color: #f39c12;
        }

        /* Related Products */
        .related-products h2 {
          margin-bottom: 30px;
          color: #2c3e50;
        }

        .related-items {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
        }

        .related-item {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 15px;
          text-align: center;
        }

        .related-image {
          width: 100%;
          height: 200px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 10px;
          margin-bottom: 15px;
        }

        .related-item h4 {
          margin-bottom: 10px;
          color: #2c3e50;
        }
      `}</style>
    </div>
  );
}

export default ECommerceProductPage;
