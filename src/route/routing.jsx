import { Route, Routes } from "react-router-dom";
import First from "../components/allcomponent.jsx/first";
import ProductList from "../components/pro/productsList";
import ProductDetail from "../components/detail/ProductDetail";
import YouMight from "../components/you/youMight";
import Cart from "../components/cart/Cart"; 
import CategoryPage from "../components/cate/categoryPage";

function Routing() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<First />} />
        <Route path="/youMight" element={<YouMight />} />
        
        <Route path="/productlist" element={<ProductList />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        
        <Route path="/category/:categoryName" element={<CategoryPage />} />
<Route path="/category" element={<CategoryPage />} />
        
        
      </Routes>
    </div>
  );
}

export default Routing;