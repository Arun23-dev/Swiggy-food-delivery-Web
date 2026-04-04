import React, { useState } from "react";
import MenuDetails from "./MenuDetails";

function MenuCard({ data, dropState }) {
  const [dropDown, setDropdown] = useState(dropState ?? true);

  function toggle() {
    setDropdown((prev) => !prev);
  }

  if (data?.itemCards) {
    const { title, itemCards } = data;
    return (
      <>
        <div key={title} >
          <div className="flex justify-between my-3 mx-5 ">
            <h1 className={`font-bold ${dropState ? "text-xl" : "text-base"}`}>
              {title}({itemCards.length})
            </h1>
            <i
              className={` text-3xl text-black fi fi-rr-angle-small-${dropDown ? "up" : "down"} `}
              onClick={toggle}></i>
          </div>
          {dropDown && itemCards.map((data) => <MenuDetails Details={data} />)}
      
        </div>
            <div
            style={{ height: dropState ? "16px" : "4px" }}
            className="my-1.5 bg-[rgb(245,245,246)]"
          />
      </>
    );
  }
  if (data.categories) {
    return (
      <div>
        <h1 className="font-bold text-xl">
          {data.title}({data.categories.length})
        </h1>

        {data.categories.map((category) => (
          <div>
            <h1>{/* {category.title}({category.itemCards.length}) */}</h1>

            <MenuCard data={category} dropState={false} />
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default MenuCard;
