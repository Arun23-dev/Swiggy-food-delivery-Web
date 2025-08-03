import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { Link } from "react-router";
import MenuList from "./MenuList";

export default function ResturantFoodMenu() {
  let { id } = useParams();
    const [RestData, setRestData] = useState(null);
    const [selected, SetSelected] = useState(null);

    const temp =RestData?.data?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards;
    
    const FilteredData = temp?.filter(
        (items) => "title" in items?.card?.card
      );

      const  orderOnline=RestData?.data?.cards[2]?.card?.card?.info;
      console.log(orderOnline);



  useEffect(() => {
    async function fetchData() {
      const proxy = "https://cors-anywhere.herokuapp.com/";
      const swiggyFoodMenuAPI = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=${id}&catalog_qa=undefined&submitAction=ENTER`;
      const response = await fetch(proxy + swiggyFoodMenuAPI);
      const data = await response.json();
      setRestData(data);
    }
    fetchData();
  }, []);

 

  return (
    <div className="w-full ">
      <Link to={`/city/delhi/${id}/search`}>
        <div className="w-6/10 text-center mt-10 bg-gray-300 h-[50px] justify-center rounded-2xl py-2 align-middle font-bold text-2xl mx-auto container">
          Search for Resturants
        </div>
      </Link>

      {     /* order online and dine out div */}
    
        <div className="h-[146px]  border rounded-xl solid w-[600px] justify-center">
          <div></div>
          <div className="flex  gap-1">

            <span><svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" strokeColor="rgba(2, 6, 12, 0.92)" fillColor="rgba(2, 6, 12, 0.92)"><circle cx="10" cy="10" r="9" fill="url(#StoreRating20_svg__paint0_linear_32982_71567)"></circle><path d="M10.0816 12.865C10.0312 12.8353 9.96876 12.8353 9.91839 12.865L7.31647 14.3968C6.93482 14.6214 6.47106 14.2757 6.57745 13.8458L7.27568 11.0245C7.29055 10.9644 7.26965 10.9012 7.22195 10.8618L4.95521 8.99028C4.60833 8.70388 4.78653 8.14085 5.23502 8.10619L8.23448 7.87442C8.29403 7.86982 8.34612 7.83261 8.36979 7.77777L9.54092 5.06385C9.71462 4.66132 10.2854 4.66132 10.4591 5.06385L11.6302 7.77777C11.6539 7.83261 11.706 7.86982 11.7655 7.87442L14.765 8.10619C15.2135 8.14085 15.3917 8.70388 15.0448 8.99028L12.7781 10.8618C12.7303 10.9012 12.7095 10.9644 12.7243 11.0245L13.4225 13.8458C13.5289 14.2757 13.0652 14.6214 12.6835 14.3968L10.0816 12.865Z" fill="white"></path><defs><linearGradient id="StoreRating20_svg__paint0_linear_32982_71567" x1="10" y1="1" x2="10" y2="19" gradientUnits="userSpaceOnUse"><stop stop-color="#21973B"></stop><stop offset="1" stop-color="#128540"></stop></linearGradient></defs></svg></span>
            <span>{orderOnline?.avgRating}</span>
            <span> ({orderOnline?.totalRatingsString})</span>
            <span className="items-center align-middle">.</span>
            <span>{orderOnline?.costForTwoMessage}</span>

          </div>
          <div>{orderOnline?.cuisines.join(", ")}</div>
          <div></div>
        </div>
      
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
        {FilteredData?.map((menuitems) => (
          <MenuList key={menuitems?.card?.card?.title} menuitems={menuitems?.card?.card}  foodSelected={selected} ></MenuList>
        ))}
      </div>
    </div>
  );
}
