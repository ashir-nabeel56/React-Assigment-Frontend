import { Route, Routes } from "react-router-dom";
import First from "../components/allcomponent.jsx/first";
import ProductList from "../components/pro/productsList.jsx";
import ProductDetail from "../components/detail/ProductDetail.jsx";
import YouMight from "../components/you/youMight.jsx";
import Cart from "../components/cart/Cart.jsx"; 
import CategoryPage from "../components/cate/categoryPage.jsx";
import Sec1 from "../components/21/sec1.jsx";
import TopSelling from "../components/tselling/topselling.jsx";
// import Login from "../components/auth2/login.jsx";
// import Signup from "../components/auth/signup.jsx";

function Routing() {
  return (
    <div>
      <Routes>
        <Route path="/"  element={<Sec1/>}/>
        <Route path="/first" element={<First />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/signup" element={<Signup />} /> */}
      
        <Route path="/youMight" element={<YouMight />} />
        <Route path="/topSelling" element={<TopSelling />} />
        
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