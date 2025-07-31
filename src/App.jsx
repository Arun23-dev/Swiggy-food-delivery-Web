import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Resturants from "./pages/Resturants";
import ResturantMenu from "./pages/ResturantMenu";
import Search from "./components/ResturantFoodMenu/Search";
function App() {
  return (
    <>
      <Routes>
        <Route index element={<Home></Home>} />
        <Route path="/resturants" element={<Resturants></Resturants>} />
        <Route path="/city/delhi/:id" element={<ResturantMenu></ResturantMenu>}></Route>
        <Route path="/city/delhi/:id/search" element={<Search></Search>}></Route>
      </Routes>
    </>
  );
}
export default App;
