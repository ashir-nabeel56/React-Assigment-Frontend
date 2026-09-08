import Browsing from "../byBrowse/browsing"
import Hero from "../herobhai/hero"
import ProductList from "../pro/productsList"
import Brands from "../secbrand/brand"
import SlideBy from "../slide/slideBy"
import TopSelling from "../tselling/topselling"

function sec1() {
  return (
    <div>
      
      <Hero/>
      <Brands/>
      <ProductList/>
      <TopSelling/>
      <Browsing/>
      <SlideBy/>
    </div>
  )
}

export default sec1
