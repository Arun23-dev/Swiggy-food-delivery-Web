import { useState, useEffect } from "react";
import { useParams } from "react-router";
import MenuDetails from "../components/ResturantFoodMenu/MenuDetails";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [menuData, setMenuData] = useState([]);
  const [showData, setShowData] = useState([]);

  const { restaurantId } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
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


        const filteredArrayData = filteredData.flatMap((item) => {

          const inner = item.card.card;

          if (inner.itemCards) {
            return inner.itemCards;
          }

          if (inner.categories) {
            return inner.categories.flatMap((item) => {
              return item.itemCards;
            })
         }
        })

        setMenuData(filteredArrayData);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [restaurantId]);

  useEffect(() => {
    if (!query || query.length < 2) {
      setShowData([])
      return;
    }
    const filtered = menuData.filter((item) => {

      const name = item?.card?.info?.name ?? "";
      const queried = query.toLowerCase();
      const words = name.toLowerCase().split(" ");

      return words.some((word) => {

        if (queried.length >= 2 && word.length >= 2) {
          return word.startsWith(queried.slice(0, 2));  // first 2 must match
        }

      })
    });
    setShowData(filtered);
  }, [query, menuData]);

  return (
    <div className="flex justify-center  mt-[150px]  max-w-[60%] mx-auto container">

      <div className="relative w-full min-w-[950px] max-w-[950px] cursor-pointer">
        <input
          type="text"
          placeholder="Search for dishes"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full h-14 px-6 rounded-full bg-gray-100 text-gray-700 placeholder-gray-400 focus:outline-none"
        />
        <svg
          className="absolute right-6 top-1/2 -translate-y-1/2"
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

        {showData.length === 0 ? (
          <p className="text-center text-gray-500">No food items found.</p>
        ) : <div>
          {showData?.map((item) => (
            <MenuDetails Details={item} key={item?.card?.info?.id} />
          ))}
        </div>
        }
      </div>
    </div >
  );
}


