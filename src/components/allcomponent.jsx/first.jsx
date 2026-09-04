import Browsing from "../byBrowse/browsing"
import Hero from "../herobhai/hero"
import ProductList from "../pro/productsList"
import Brands from "../secbrand/brand"
import Topselling from "../tselling/topselling"
import SlideBy from "../slide/slideBy"
function first() {
  return (
    <div>
      <Hero/>
      <Brands/>
      <ProductList/>
      <Topselling/>
      <Browsing/>
      <SlideBy/>
    </div>
  )
}

export default first

