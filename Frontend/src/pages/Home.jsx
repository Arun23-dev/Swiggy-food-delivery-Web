import Header from "../components/Header/Header";
import FoodOption from "../components/Food/FoodOption";
import ShopOption from "../components/ShopItems/ShopOption";
import DineOption from "../components/Dineout/DineOption";
import Scanner from "../components/Footer/Scanner";
import CityDelivery from "../components/City/CityDelivery";
import Footer from "../components/Footer/Footer";

function Home() {
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
  );
}
export default Home;
