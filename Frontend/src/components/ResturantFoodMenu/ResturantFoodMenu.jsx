import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { useParams } from "react-router";
import MenuCard from "./MenuCard";
import ShimmerMenuPage from "../Shimmer/ShimmerMenuPage";
import { fetchFoodMenu } from "../../Store/FoodMenuSlice";
import { useDispatch, useSelector } from "react-redux";

function ResturantFoodMenu() {
  const { restaurantId } = useParams();

  const dispatch = useDispatch();
  const { cache, loading, error } = useSelector((state) => state.foodMenu)


  useEffect(() => {
    if (!cache[restaurantId]) {
      dispatch(fetchFoodMenu(restaurantId))
    }

  }, [restaurantId])


  const data=cache[restaurantId]
  const cards =
    data?.data?.cards.at(-1)?.groupedCard?.cardGroupMap?.REGULAR?.cards ||[];
    
  const menuData = cards.filter((data) => {
    return data.card?.card?.itemCards || data.card?.card?.categories;
  });
  if (loading || !cache[restaurantId]) return <div><ShimmerMenuPage/></div>
  // if (error) return <p>{error.message}</p>

  return (
    <div className="flex justify-center  mt-[100px]  max-w-[60%] mx-auto container">

      <div>
        {/* Search Menu */}
        <div className="flex flex-col items-center gap-6 py-8 px-4">

          {/* MENU heading with ornaments */}
          <div className="flex items-center gap-3">
            <svg width="38" height="10" viewBox="0 0 38 10" fill="none">
              <path d="M2 5 Q8 1 14 5 Q20 9 26 5" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="28" cy="5" r="2.5" stroke="#9ca3af" strokeWidth="1.2" />
            </svg>
            <span className="text-gray-400 tracking-[0.22em] text-sm">M E N U</span>
            <svg width="38" height="10" viewBox="0 0 38 10" fill="none">
              <circle cx="10" cy="5" r="2.5" stroke="#9ca3af" strokeWidth="1.2" />
              <path d="M12 5 Q18 1 24 5 Q30 9 36 5" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>

          {/* Search bar */}
          <Link to={`/city/delhi/${restaurantId}/search`} className="relative  w-full min-w-[950px] max-w-[950px]  cursor-pointer">
            <div className="flex items-center  h-14 px-6 bg-gray-100 rounded-full">
              <span className="flex-1 text-gray-400 text-base">Search for dishes</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <line x1="16.5" y1="16.5" x2="22" y2="22" />
              </svg>
            </div>
          </Link>

        </div>


        <div>
          {menuData.map(({ card: { card } }, index) => (
            <MenuCard data={card} dropState={true} key={index} />
          ))}
        </div>
      </div>

    </div>
  );
}
export default ResturantFoodMenu;
