import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { Link } from "react-router";
import MenuList from "./MenuList";

export default function ResturantFoodMenu() {
  let { id } = useParams();

  const [RestData, setRestData] = useState(null);
  const [selected, SetSelected] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const proxy = "https://cors-anywhere.herokuapp.com/";
      const swiggyFoodMenuAPI = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=${id}&catalog_qa=undefined&submitAction=ENTER`;
      const response = await fetch(proxy + swiggyFoodMenuAPI);
      const data = await response.json();
      const temp = data?.data?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards;
      const filteredData = temp?.filter(
        (items) => "title" in items?.card?.card
      );
      setRestData(filteredData);
    }
    fetchData();
  }, []);
 
  return (
    <div>
      <Link  to={`/city/delhi/${id}/search`}>
      <div className="w-6/10 text-center mt-10 bg-gray-300 h-[50px] justify-center rounded-2xl py-2 align-middle font-bold text-2xl mx-auto container">
        Search for Resturants 
      </div>
      </Link>
      <div className=" flex gap-20 ">
        <button
          className={`border-4 w-[50px] rounded-xl ${
            selected === "veg" ? "bg-green-400" : "bg-white"
          }`}
          onClick={() => {
            selected === "veg" ? SetSelected(null) : SetSelected("veg");
          }}
        >
          Veg
        </button>
        <button
          className={`border-4 w-[80px] rounded-xl ${
            selected === "nonveg" ? "bg-red-500" : "bg-white"
          }`}
          onClick={() => {
            selected === "nonveg" ? SetSelected(null) : SetSelected("nonveg");
          }}
        >
          Non-Veg
        </button>
      </div>
      <div className="w-[70%] mx-auto container">
        {RestData?.map((menuitems) => (
          <MenuList
            key={menuitems?.card?.card?.title}
            menuitems={menuitems?.card?.card}
            foodSelected={selected}
          ></MenuList>
        ))}
      </div>
    </div>
  );
}
