import { data } from "react-router";
import MenuCard from "./MenuCard";
import { useState } from "react";

export default function MenuList({ menuitems, foodSelected }) {
  const [isOpen, setIsOpen] = useState(true);
  if (!isOpen) {
    return (
      <div className="mt-[26px] mb-4 w-full">
        <div className="flex justify-between">
          <div className="pr-4  mb-6 cursor-pointer text-black text-[18px] font-extrabold">
            {menuitems.title}{` `}({menuitems?.itemCards?.length})
          </div>
          <button className="text-4xl pr-15" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? "⌃" : "⌄"}
          </button>
        </div>
      </div>
    );
  }

  if ("categories" in menuitems) {
    return (
      <div className="w-full">
        <p className="text-2xl font-bold">{menuitems.title}</p>
        <div>
          {menuitems?.categories?.map((items) => (
            <MenuList
              key={items?.title}
              menuitems={items}
              foodSelected={foodSelected}
            ></MenuList>
          ))}
        </div>
      </div>
    );
  }

  if (foodSelected === "veg") {
    return (
      <div className="w-full">
        <div className="flex justify-between w-full">
          <p className="text-3xl font-bold mb-4">{menuitems.title}</p>
          <button
            className="text-5xl font-bold mr-20"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "^" : "˯"}
          </button>
        </div>
        <div>
          {menuitems?.itemCards
            ?.filter((food) => "isVeg" in food?.card?.info)
            .map((items) => (
              <MenuCard
                key={items?.card?.info?.id}
                menuCard={items?.card?.info}
              ></MenuCard>
            ))}
        </div>
        <div className="h-5 bg-gray-200 mt-2 mb-2"></div>
      </div>
    );
  }
  if (foodSelected === "nonveg") {
    return (
      <div className="w-full">
        <div className="flex justify-between w-full">
          <p className="text-3xl font-bold mb-4">{menuitems.title}</p>
          <button
            className="text-5xl font-bold mr-20"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? "^" : "˯"}
          </button>
        </div>
        <div>
          {menuitems?.itemCards
            ?.filter((food) => !("isVeg" in food?.card?.info))
            .map((items) => (
              <MenuCard
                key={items?.card?.info?.id}
                menuCard={items?.card?.info}
              ></MenuCard>
            ))}
        </div>
        <div className="h-5 bg-gray-200 mt-2 mb-2"></div>
      </div>
    );
  }

  console.log()
  return (
    <div className="mt-[26px] mb-4 w-full  ">
      <div className="flex justify-between">
        <div className="pr-4  mb-6 cursor-pointer text-black text-[18px] font-extrabold">{menuitems.title}{` `}({menuitems?.itemCards?.length}) </div>
        <button className="text-4xl pr-15" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "⌃" : "⌄"}
        </button>
      </div>
      {menuitems?.itemCards?.map((items) => (
        <MenuCard
          key={items?.card?.info?.id}
          menuCard={items?.card?.info}
        ></MenuCard>
      ))}
    </div>
  );
}
