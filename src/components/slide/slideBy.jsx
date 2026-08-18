import  { useRef } from 'react';
import './slideBy.css';

const testimonialsData = [
  {
    id: 1,
    name: 'Sarah M.',
    stars: 5,
    review:
      "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
  {
    id: 2,
    name: 'Alex K.',
    stars: 5,
    review:
      'Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.',
  },
  {
    id: 3,
    name: 'James L.',
    stars: 5,
    review:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
  },
  {
    id: 4,
    name: 'Mooen P.',
    stars: 5,
    review:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. High quality fabrics and super fast delivery!",
  },
];

const SlideBy = () => {
  const sliderRef = useRef(null);

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 370; 
      sliderRef.current.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="testimonials-wrapper">
      <section className="testimonials-container">
        <div className="testimonials-header">
          <h2 className="section-title">OUR HAPPY CUSTOMERS</h2>
          <div className="slider-arrows">
            <button
              className="arrow-btn"
              onClick={() => handleScroll('prev')}
              aria-label="Previous Testimonial"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="arrow-btn"
              onClick={() => handleScroll('next')}
              aria-label="Next Testimonial"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="slider-track" ref={sliderRef}>
          {testimonialsData.map((item) => (
            <div key={item.id} className="testimonial-card">
              <div className="stars">
                {'★'.repeat(item.stars)}
              </div>
              <div className="user-info">
                <span className="user-name">{item.name}</span>
                <span className="verified-badge">✓</span>
              </div>
              <p className="review-text">"{item.review}"</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SlideBy;