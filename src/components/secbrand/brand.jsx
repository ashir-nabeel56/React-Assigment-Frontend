import './brand.css'
import versace from '../../public/Group (1).png'
import zara from '../../public/gucci-logo-1 1.png'
import gucci from '../../public/Group (3).png'
import  prada from '../../public/prada-logo-1 1.png'
import calvin from '../../public/zara-logo-1 1.png'
function Brands() {
  return (
    <section className="brands-section">
      <div className="brand-item">
        <img src={versace} alt="Versace" />
      </div>

      <div className="brand-item">
        <img src={zara} alt="Zara" />
      </div>

      <div className="brand-item">
        <img src={gucci} alt="Gucci" />
      </div>

      <div className="brand-item">
        <img src={prada} alt="Prada" />
      </div>

      <div className="brand-item">
        <img src={calvin} alt="Calvin Klein" />
      </div>
    </section>
  );
}

export default Brands;