import casual from '../../public/Frame 61 (1).png'
import formal from '../../public/Frame 62.png'
import party from '../../public/Frame 63.png'
import gym from '../../public/Frame 64.png'
import { useNavigate } from 'react-router-dom';
import "./browsing.css";
function Browsing() {
  const navigate = useNavigate();

  // Category page par redirect karne ke liye handler
  const handleCategoryClick = (category) => {
    navigate(`/category/${category.toLowerCase()}`);
  };

  return (
    <div className="all">
      <section className="dress-style-container">
        <h2 className="section-title">BROWSE BY DRESS STYLE</h2>
        
        <div className="style-grid">
          {/* Casual */}
          <div 
            className="style-card card-small" 
            onClick={() => handleCategoryClick('casual')}
            style={{ cursor: 'pointer' }}
          >
            <span className="card-title"></span>
            <img src={casual} alt="Casual Style" />
          </div>

          {/* Formal */}
          <div 
            className="style-card card-large" 
            onClick={() => handleCategoryClick('formal')}
            style={{ cursor: 'pointer' }}
          >
            <span className="card-title"></span>
            <img src={formal} alt="Formal Style" />
          </div>

          {/* Party */}
          <div 
            className="style-card card-large" 
            onClick={() => handleCategoryClick('party')}
            style={{ cursor: 'pointer' }}
          >
            <span className="card-title"></span>
            <img src={gym} alt="Party Style" />
          </div>

          {/* Gym */}
          <div 
            className="style-card card-small" 
            onClick={() => handleCategoryClick('gym')}
            style={{ cursor: 'pointer' }}
          >
            <span className="card-title"></span>
            <img src={party} alt="Gym Style" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Browsing;