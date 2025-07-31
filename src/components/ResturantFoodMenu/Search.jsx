import { useState, useEffect } from "react";
import { useParams } from "react-router";

export default function Search() {
  const [food, setFood] = useState("");
  const [restData, setRestData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const proxy = "https://cors-anywhere.herokuapp.com/";
        const swiggyFoodMenuAPI = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=${id}&catalog_qa=undefined&submitAction=ENTER`;

        const response = await fetch(proxy + swiggyFoodMenuAPI);
        const data = await response.json();

        const menuCards =
          data?.data?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards || [];

        const menuItems = menuCards
          .filter((item) => item?.card?.card?.itemCards)
          .flatMap((item) => item.card.card.itemCards)
          .map((item) => item.card.info);

        setRestData(menuItems);
        setFilteredData(menuItems); // initially show all items
      } catch (error) {
        console.error("Error fetching Swiggy data", error);
      }
    }

    fetchData();
  }, [id]);

  useEffect(() => {
    const filtered = restData.filter((item) =>
      item.name.toLowerCase().includes(food.toLowerCase())
    );
    setFilteredData(filtered);
  }, [food, restData]);

  return (
    <div className="w-[80%] mt-10 mx-auto">
      <input
        placeholder="Search for food"
        value={food}
        onChange={(event) => setFood(event.target.value)}
        className="px-4 bg-gray-300 rounded-2xl h-[50px] w-full mb-6"
      />

      {filteredData.length === 0 ? (
        <p className="text-center text-gray-500">No food items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
            >
              <h2 className="font-semibold text-lg">{item.name}</h2>
              {item.price || item.defaultPrice ? (
                <p className="text-sm text-gray-600">
                  ₹{((item.price || item.defaultPrice) / 100).toFixed(2)}
                </p>
              ) : null}
              {item.description && (
                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
              )}
              {item.imageId && (
                <img
                  src={`https://media-assets.swiggy.com/swiggy/image/upload/${item.imageId}`}
                  alt={item.name}
                  className="mt-2 rounded-md w-full h-40 object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
