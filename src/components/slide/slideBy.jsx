import { useEffect, useRef } from "react";
import "./slideBy.css";

const testimonialsData = [
  {
    id: 1,
    name: "Sarah M.",
    stars: 5,
    review:
      "I'm blown away by the quality and style of the clothes. Everything feels premium and comfortable.",
  },
  {
    id: 2,
    name: "Alex K.",
    stars: 5,
    review:
      "Finding clothes that match my personal style used to be difficult, but this store made it so easy.",
  },
  {
    id: 3,
    name: "James L.",
    stars: 5,
    review:
      "As someone who is always looking for unique fashion, I'm thrilled with the selection here.",
  },
  {
    id: 4,
    name: "Mooen P.",
    stars: 5,
    review:
      "The quality is excellent and the delivery was fast. I'll definitely be shopping here again.",
  },
  {
    id: 5,
    name: "Emily R.",
    stars: 5,
    review:
      "Amazing experience from start to finish. The products look exactly like the pictures.",
  },
  {
    id: 6,
    name: "Daniel W.",
    stars: 5,
    review:
      "Great designs, great quality and excellent customer service. Highly recommended!",
  },
];

const SlideBy = () => {
  const sliderRef = useRef(null);

  // =========================
  // AUTO SLIDE
  // =========================
  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    const autoSlide = setInterval(() => {
      const card = slider.querySelector(".testimonial-card");

      if (!card) return;

      const cardWidth = card.offsetWidth;
      const gap = 24;

      // If reached the end, go back to beginning
      if (
        slider.scrollLeft + slider.clientWidth >=
        slider.scrollWidth - 10
      ) {
        slider.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        slider.scrollBy({
          left: cardWidth + gap,
          behavior: "smooth",
        });
      }
    }, 4000);

    return () => clearInterval(autoSlide);
  }, []);

  // =========================
  // MANUAL SLIDE
  // =========================
  const handleScroll = (direction) => {
    if (!sliderRef.current) return;

    const slider = sliderRef.current;
    const card = slider.querySelector(".testimonial-card");

    if (!card) return;

    const cardWidth = card.offsetWidth;
    const gap = 24;

    slider.scrollBy({
      left:
        direction === "next"
          ? cardWidth + gap
          : -(cardWidth + gap),
      behavior: "smooth",
    });
  };

  return (
    <section className="testimonials-wrapper">
      <div className="testimonials-container">

        {/* HEADER */}
        <div className="testimonials-header">
          <h2 className="section-title">
            OUR HAPPY CUSTOMERS
          </h2>

          <div className="slider-arrows">
            <button
              className="arrow-btn"
              onClick={() => handleScroll("prev")}
              aria-label="Previous testimonial"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M19 12H5M12 19L5 12L12 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              className="arrow-btn"
              onClick={() => handleScroll("next")}
              aria-label="Next testimonial"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M5 12H19M12 5L19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* SLIDER */}
        <div
          className="slider-track"
          ref={sliderRef}
        >
          {testimonialsData.map((item) => (
            <article
              key={item.id}
              className="testimonial-card"
            >
              {/* STARS */}
              <div className="stars">
                {Array.from(
                  { length: item.stars },
                  (_, index) => (
                    <span key={index}>★</span>
                  )
                )}
              </div>

              {/* USER */}
              <div className="user-info">
                <span className="user-name">
                  {item.name}
                </span>

                <span className="verified-badge">
                  ✓
                </span>

                <span className="verified-text">
                  Verified Customer
                </span>
              </div>

              {/* REVIEW */}
              <p className="review-text">
                "{item.review}"
              </p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SlideBy;