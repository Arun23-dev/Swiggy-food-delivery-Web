import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import MenuCard from "./MenuCard";
function ResturantFoodMenu() {
  const { restaurantId } = useParams();

  const [menuData, setMenuData] = useState([]);
  const [currIndex, setCurrIndex] = useState(null);
  useEffect(() => {
    async function fetchData() {
      const proxyServer = "https://cors-anywhere.herokuapp.com/";
      const swiggyAPI = `https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=${restaurantId}&catalog_qa=undefined&submitAction=ENTER`;

      const response = await fetch(proxyServer + swiggyAPI);
      const data = await response.json();

      const cards =
        data?.data?.cards.at(-1)?.groupedCard?.cardGroupMap?.REGULAR?.cards ||
        [];
      const filteredData = cards.filter((data) => {
        return data.card?.card?.itemCards || data.card?.card?.categories;
      });
      setMenuData(filteredData);
    }
    fetchData();
  }, [restaurantId]);

  return (
    <div className=" mt-[100px] flex justify-center max-w-[60%] mx-auto container">
      <div>
        {menuData.map(({ card: { card } }, index) => (
          <MenuCard data={card} dropState={true}  key={index}/>
        ))}
      </div>
    </div>
  );
}
export default ResturantFoodMenu;
