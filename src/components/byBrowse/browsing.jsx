import "./browsing.css";
import { useNavigate } from "react-router-dom";

function Browsing() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName}`);
  };

  return (
    <div className="all">
      <section className="dress-style-container">
        <h2 className="section-title">BROWSE BY DRESS STYLE</h2>

        <div className="style-grid">
          {/* Casual */}
          <div
            className="style-card card-small"
            onClick={() => handleCategoryClick("casual")}
            style={{ cursor: "pointer" }}
          >
            <span className="card-title"></span>
            <img src="/src/assets/Frame 61.png" alt="Casual Style" />
          </div>

          {/* Formal */}
          <div
            className="style-card card-large"
            onClick={() => handleCategoryClick("formal")}
            style={{ cursor: "pointer" }}
          >
            <span className="card-title"></span>
            <img src="/src/assets/Frame 62.png" alt="Formal Style" />
          </div>

          {/* Party */}
          <div
            className="style-card card-large"
            onClick={() => handleCategoryClick("party")}
            style={{ cursor: "pointer" }}
          >
            <span className="card-title"></span>
            <img src="/src/assets/Frame 64.png" alt="Party Style" />
          </div>

          {/* Gym */}
          <div
            className="style-card card-small"
            onClick={() => handleCategoryClick("gym")}
            style={{ cursor: "pointer" }}
          >
            <span className="card-title"></span>
            <img src="/src/assets/Frame 63.png" alt="Gym Style" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Browsing;