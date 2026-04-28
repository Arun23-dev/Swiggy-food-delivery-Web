import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { useParams } from "react-router";
import MenuCard from "./MenuCard";
import ShimmerMenuPage from "../Shimmer/ShimmerMenuPage";
import { fetchFoodMenu } from "../../features/FoodMenuSlice";
import { useDispatch, useSelector } from "react-redux";

function ResturantFoodMenu() {
  const [bestSeller, setBestSeller] = useState(false);

  const [selected, setSelected] = useState(null); // null | 'veg' | 'nonveg'

  const { restaurantId } = useParams();

  const dispatch = useDispatch();
  const { cache, loading, error } = useSelector((state) => state.foodMenu);

  useEffect(() => {
    if (!cache[restaurantId]) {
      dispatch(fetchFoodMenu(restaurantId));
    }
  }, [restaurantId]);

  const data = cache[restaurantId];
  const cards =
    data?.data?.cards.at(-1)?.groupedCard?.cardGroupMap?.REGULAR?.cards || [];

  const menuData = cards.filter((data) => {
    return (
      (data.card?.card?.itemCards || data.card?.card?.categories) &&
      data.card?.card?.categoryId !== "123456"
    );
  });


  if (loading || !cache[restaurantId])
    return (
      <div>
        <ShimmerMenuPage />
      </div>
    );

  return (
    <div className="flex flex-col mt-[100px] max-w-[70%] container mx-auto  px-4">

      {/* Search Menu */}
      <div className="flex flex-col items-center gap-6 py-8 px-4">
        {/* MENU heading with ornaments */}
        <div className="flex items-center gap-3">
          <svg width="38" height="10" viewBox="0 0 38 10" fill="none">
            <path
              d="M2 5 Q8 1 14 5 Q20 9 26 5"
              stroke="#9ca3af"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <circle
              cx="28"
              cy="5"
              r="2.5"
              stroke="#9ca3af"
              strokeWidth="1.2"
            />
          </svg>
          <span className="text-gray-400 tracking-[0.22em] text-sm">
            M E N U
          </span>
          <svg width="38" height="10" viewBox="0 0 38 10" fill="none">
            <circle
              cx="10"
              cy="5"
              r="2.5"
              stroke="#9ca3af"
              strokeWidth="1.2"
            />
            <path
              d="M12 5 Q18 1 24 5 Q30 9 36 5"
              stroke="#9ca3af"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Search bar */}
        <Link
          to={`/city/delhi/${restaurantId}/search`}
          className="relative w-full cursor-pointer"
        >
          <div className="flex items-center  h-14 px-6 bg-gray-100 rounded-full">
            <span className="flex-1 text-gray-400 text-base">
              Search for dishes
            </span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
          </div>
        </Link>

        {/* Filter bar */}

        <div className="flex gap-2.5 px-5 py-3 w-full">
          {/* — Green (Veg) toggle — */}

          <div
            onClick={() => setSelected(selected === "veg" ? null : "veg")}
            className="flex items-center gap-2 bg-gray-100 border border-gray-200

rounded-full px-3 py-1.5 cursor-pointer select-none

hover:border-gray-300 transition-colors"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center

bg-green-50 border border-green-200"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect
                  x="1"
                  y="1"
                  width="12"
                  height="12"
                  rx="3"
                  stroke="#16a34a"
                  strokeWidth="1.8"
                />

                <circle cx="7" cy="7" r="3" fill="#16a34a" />
              </svg>
            </div>

            <div
              className={`relative w-8 h-[18px] rounded-full transition-colors

${selected === "veg" ? "bg-green-600" : "bg-gray-300"}`}
            >
              <div
                className={`absolute top-[2px] left-[2px] w-[14px] h-[14px]

bg-white rounded-full shadow-sm transition-transform

${selected === "veg" ? "translate-x-[14px]" : "translate-x-0"}`}
              />
            </div>
          </div>

          {/* — Red (Non-Veg) toggle — */}

          <div
            onClick={() =>
              setSelected(selected === "nonveg" ? null : "nonveg")
            }
            className="flex items-center gap-2 bg-gray-100 border border-gray-200

rounded-full px-3 py-1.5 cursor-pointer select-none

hover:border-gray-300 transition-colors"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center

bg-red-50 border border-red-200"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect
                  x="1"
                  y="1"
                  width="12"
                  height="12"
                  rx="3"
                  stroke="#dc2626"
                  strokeWidth="1.8"
                />

                <path d="M7 3.5L11.5 10.5H2.5L7 3.5Z" fill="#dc2626" />
              </svg>
            </div>

            <div
              className={`relative w-8 h-[18px] rounded-full transition-colors

${selected === "nonveg" ? "bg-red-600" : "bg-gray-300"}`}
            >
              <div
                className={`absolute top-[2px] left-[2px] w-[14px] h-[14px]

bg-white rounded-full shadow-sm transition-transform

${selected === "nonveg" ? "translate-x-[14px]" : "translate-x-0"}`}
              />
            </div>
          </div>

          {/* — Divider — */}

          <div className="w-px h-7 bg-gray-200 self-center" />

          {/* — Bestseller chip — */}

          <div
            onClick={() => setBestSeller(!bestSeller)}
            className={`flex items-center gap-2 border rounded-full pl-3.5 pr-2.5

py-1.5 text-sm font-medium cursor-pointer select-none transition-colors

${bestSeller
                ? "border-orange-400 bg-orange-50 text-orange-700"
                : "border-gray-300 text-gray-800 hover:border-gray-400 hover:bg-gray-50"
              }`}
          >
            <span>Bestseller</span>

            {bestSeller && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setBestSeller(false);
                }}
                className="w-4 h-4 rounded-full flex items-center justify-center

hover:bg-orange-200 transition-colors"
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path
                    d="M1 1l6 6M7 1L1 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>


      <div>
        {menuData.map(({ card: { card } }, index) => (
          <MenuCard data={card} dropState={true} selected={selected} bestSeller={bestSeller} key={index} />
        ))}
      </div>
    </div>
  );
}
export default ResturantFoodMenu;
