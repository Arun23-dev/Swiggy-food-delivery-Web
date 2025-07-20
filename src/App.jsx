import Header from "./components/Header";
import FoodOption from "./components/Food/FoodOption";
import ShopOption from "./components/Shop/ShopOption";
import DineOption from "./components/Dineout/DineOption";
import Footer from "./components/Footer";
import Scanner from "./components/Scanner";
import CityDelivery from "./components/City/CityDelivery";




function App(){
  return (
    <>
     <Header></Header>
    <FoodOption></FoodOption>
    <ShopOption></ShopOption>
    <DineOption></DineOption>
    <Scanner></Scanner>
    <CityDelivery></CityDelivery>
    <Footer></Footer>
    </>
 
  )
}
export default App;