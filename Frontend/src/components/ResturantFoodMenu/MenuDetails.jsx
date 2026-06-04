import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, increaseItem, decreaseItem } from "../../slices/CartSlice";
import { SWIGGY_IMAGE_BASE_URL_FOR_MENU } from "../../Utils/Constants";
import { selectItemQuantity } from '../../slices/CartSlice'

function MenuDetails({ Details, restaurantData }) {

  const dispatch = useDispatch();

  const {
    card: {
      info: {
        id,
        name,
        imageId,
        description,
        isBestseller,
        itemAttribute: { vegClassifier },
        ratings,
      },
    },
  } = Details;

  const info=Details?.card?.info;

  const isVeg = vegClassifier === "VEG";
  const finalPrice =Math.floor(
    (info?.finalPrice ||
      info?.price ||
      info?.defaultPrice ||
      0)/100 );

  const isLongDesc = description && description.length > 100;
  const [showMore, setShowMore] = useState(false);

  const quantity = useSelector(state =>
    selectItemQuantity(state, restaurantData.restaurantId || restaurantData.id, id)
  );

  function handleAddItem() {
    dispatch(addItem({
      item: Details.card.info,
      restaurant: restaurantData
    }));
  }


  function handleIncreaseItem() {
    dispatch(increaseItem({
      restaurantId: restaurantData.restaurantId,
      swiggyItemId: id,
    }));
  }

  function handleDecreaseItem() {
    dispatch(decreaseItem({
      restaurantId: restaurantData.restaurantId,
      swiggyItemId: id,
    }));
  }

  return (
    <>
      <div className="flex justify-between items-start py-6 px-2 gap-6">
        {/* Left: Info */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Veg/NonVeg icon + Bestseller */}
          <div className="flex items-center gap-2">
            <div
              className={`w-[18px] h-[18px] border-2 rounded-sm flex items-center justify-center flex-shrink-0 ${isVeg ? "border-green-700" : "border-red-600"
                }`}
            >
              {isVeg ? (
                <div className="w-2 h-2 bg-green-700 rounded-full" />
              ) : (
                <div
                  className="w-0 h-0"
                  style={{
                    borderLeft: "5px solid transparent",
                    borderRight: "5px solid transparent",
                    borderBottom: "8px solid rgb(220,38,38)",
                  }}
                />
              )}
            </div>
            {isBestseller && (
              <span className="text-orange-500 text-xs font-bold flex items-center gap-0.5">
                ★ Bestseller
              </span>
            )}
          </div>

          <h3 className="font-bold text-xl text-gray-900 leading-snug">{name}</h3>
          <p className="font-bold text-xl text-gray-900">₹{finalPrice}</p>

          {ratings?.aggregatedRating?.rating &&
            Number(ratings?.aggregatedRating?.rating) > 0 && (
              <div className="flex items-center gap-1 text-xl font-bold text-green-700">
                ★ {ratings?.aggregatedRating?.rating}
                {ratings?.aggregatedRating?.ratingCountV2 && (
                  <span className="text-gray-400 font-semibold">
                    ({ratings?.aggregatedRating?.ratingCountV2})
                  </span>
                )}
              </div>
            )}

          {description && (
            <p className="text-xl text-gray-500 leading-relaxed">
              {isLongDesc && !showMore
                ? description.slice(0, 100) + "..."
                : description}
              {isLongDesc && (
                <span
                  className="text-gray-800 font-bold cursor-pointer ml-1"
                  onClick={() => setShowMore((p) => !p)}
                >
                  {showMore ? "less" : "more"}
                </span>
              )}
            </p>
          )}
        </div>

        {/* Right: Image + ADD button */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div className="relative">
            {imageId ? (
              <img
                src={`${SWIGGY_IMAGE_BASE_URL_FOR_MENU}${imageId}`}
                alt={name}
                className="w-[156px] h-[144px] object-cover rounded-xl"
              />
            ) : (
              <div className="w-[156px] h-[144px] bg-gray-100 rounded-xl" />
            )}
            <div
              className={`absolute bottom-1 right-1 w-4 h-4 border-2 rounded-sm bg-white flex items-center justify-center ${isVeg ? "border-green-700" : "border-red-600"
                }`}
            >
              {isVeg ? (
                <div className="w-1.5 h-1.5 bg-green-700 rounded-full" />
              ) : (
                <div
                  className="w-0 h-0"
                  style={{
                    borderLeft: "3px solid transparent",
                    borderRight: "3px solid transparent",
                    borderBottom: "5px solid rgb(220,38,38)",
                  }}
                />
              )}
            </div>
          </div>

          {quantity === 0 ? (
            <button
              className="w-[110px] h-[38px] bg-white border-2 border-gray-300 rounded-xl text-green-700 font-bold text-[15px] tracking-widest shadow-sm hover:border-green-700 transition-all duration-150 active:scale-95"
              onClick={handleAddItem}
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center justify-between w-40 px-4 py-2 bg-gray-200 rounded-xl border border-gray-300">
              <button
                className="text-green-600 text-xl font-bold hover:scale-110 transition"
                onClick={handleDecreaseItem}
              >
                −
              </button>
              <span className="text-green-700 text-lg font-semibold">{quantity}</span>
              <button
                className="text-green-600 text-xl font-bold hover:scale-110 transition"
                onClick={handleIncreaseItem}
              >
                +
              </button>
            </div>
          )}

          <span className="text-[11px] text-gray-400 font-medium -mt-1">
            Customisable
          </span>
        </div>
      </div>

      <hr className="border-gray-100 mx-2" />
    </>
  );
}

export default MenuDetails;