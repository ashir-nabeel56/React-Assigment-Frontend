import './brand.css';

import versace from '../../public/Group (2).png';
import zara from '../../public/zara-logo-1 1.png';
import gucci from '../../public/gucci-logo-1 1 (1).png';
import prada from '../../public/prada-logo-1 1.png';
import calvin from '../../public/Group (1).png';

function Brands() {
  const brands = [
    { image: versace, name: 'Versace' },
    { image: zara, name: 'Zara' },
    { image: gucci, name: 'Gucci' },
    { image: prada, name: 'Prada' },
    { image: calvin, name: 'Calvin Klein' },
  ];

  return (
    <section className="brands-section">
      <div className="brands-track">
        {[...brands, ...brands].map((brand, index) => (
          <div className="brand-item" key={index}>
            <img src={brand.image} alt={brand.name} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Brands;