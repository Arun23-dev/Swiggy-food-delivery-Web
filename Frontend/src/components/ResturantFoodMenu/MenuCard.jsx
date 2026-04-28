import { useState } from "react";
import MenuDetails from "./MenuDetails";
export default function MenuCard({ data, dropState, selected, bestSeller }) {

  const [dropDown, setDropdown] = useState(dropState ?? true);

  function toggle() {
    setDropdown((prev) => !prev);
  }

  function filterItem(item) {
    const classifier = item?.card?.info?.itemAttribute?.vegClassifier;
    const vegMatch = selected === "veg" ? classifier === "VEG" : true;
    const nonvegMatch = selected === "nonveg" ? classifier === "NONVEG" : true;
    const bestsellerMatch = bestSeller ? item?.card?.info?.isBestseller === true : true;
    return vegMatch && nonvegMatch && bestsellerMatch;
  }

  if (data?.itemCards) {
    const { title, itemCards } = data;
    const filteredItems = itemCards.filter(filterItem);

    if (filteredItems.length === 0) return null;

    return (
      <>
        <div>
          <div className="flex justify-between my-3 mx-5">
            <h1 className={`font-bold ${dropState ? "text-xl" : "text-base"}`}>
              {title}({filteredItems.length})
            </h1>
            <i
              className={`text-3xl text-black fi fi-rr-angle-small-${dropDown ? "up" : "down"}`}
              onClick={() => setDropdown((prev) => !prev)}
            />
          </div>
          {dropDown &&
            filteredItems.map((item) => (
              <MenuDetails Details={item} key={item.card.info.name} />
            ))}
        </div>
        <div
          style={{ height: dropState ? "16px" : "4px" }}
          className="my-1.5 bg-[rgb(245,245,246)]"
        />
      </>
    );
  }

  if (data?.categories) {
    return (
      <div>
        <h1 className="font-bold text-xl">{data.title}</h1>
        {data.categories.map((category) => (
          <MenuCard
            data={category}
            dropState={false}
            key={category.title}
            selected={selected}       
            bestSeller={bestSeller}    
          />
        ))}
      </div>
    );
  }

  return null;
}