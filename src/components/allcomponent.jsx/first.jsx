import Browsing from "../byBrowse/browsing"
import Hero from "../herobhai/hero"
import ProductList from "../pro/productsList"
import Brands from "../secbrand/brand"
import Topselling from "../tselling/topselling"
import SlideBy from "../slide/slideBy"
import Navbar from "../navbar/navbar"
import TopBar from "../top/topbar"
function first() {
  return (
    <div>
      <TopBar/>
      <Navbar/>
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

