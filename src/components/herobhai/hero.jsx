import './hero.css';
// import heroImage from '../assets/hero.png';

function Hero() {
  return (
    <section className="hero">

      {/* Left Content */}
      <div className="hero-content">

        <h1>
          FIND CLOTHES
          <br />
          THAT MATCHES
          <br />
          YOUR STYLE
        </h1>

        <p>
          Browse through our diverse range of meticulously crafted garments,
          designed to bring out your individuality and cater to your sense of style.
        </p>

        <button className="shop-btn">
          Shop Now
        </button>

        {/* Stats */}
        <div className="hero-stats">

          <div className="stat">
            <h2>200+</h2>
            <p>International Brands</p>
          </div>

          <div className="stat">
            <h2>2,000+</h2>
            <p>High-Quality Products</p>
          </div>

          <div className="stat">
            <h2>30,000+</h2>
            <p>Happy Customers</p>
          </div>

        </div>

      </div>

      {/* Right Image */}
      <div className="hero-image">

        <span className="star star-one">✦</span>

        <img src={"/src/assets/WhatsApp Image 2026-08-14 at 10.15.45 AM.jpeg"} alt="Fashion Models" />

        <span className="star star-two">✦</span>

      </div>

    </section>
  );
}

export default Hero;