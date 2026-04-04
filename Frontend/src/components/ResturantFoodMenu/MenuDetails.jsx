import React, { useState } from "react";

function MenuDetails({ Details }) {
  const [showMore, setShowMore] = useState(false);

  const {
    card: {
      info: {
        name,
        defaultPrice,
        price,
        imageId,
        description,
        isBestseller,
        itemAttribute: { vegClassifier },
        ratings: {
          aggregatedRating: { rating, ratingCountV2 },
        },
      },
    },
  } = Details;

  const isVeg = vegClassifier === "VEG";
  const finalPrice = (defaultPrice || price) / 100;
  const isLongDesc = description && description.length > 100;

  return (
    <>
      <div className="flex justify-between items-start py-6 px-2 gap-6">
        {/* Left: Info */}
        <div className="flex-1 flex flex-col gap-2 ">
          {/* Veg/NonVeg icon + Bestseller */}
          <div className="flex items-center gap-2">
            {/* Veg/NonVeg square badge */}
            <div
              className={`w-[18px] h-[18px] border-2 rounded-sm flex items-center justify-center flex-shrink-0 ${
                isVeg ? "border-green-700" : "border-red-600"
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

            {/* Bestseller */}
            {isBestseller && (
              <span className="text-orange-500 text-xs font-bold flex items-center gap-0.5">
                ★ Bestseller
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className="font-bold text-xl text-gray-900 leading-snug">
            {name}
          </h3>

          {/* Price */}
          <p className="font-bold text-xl text-gray-900">₹{finalPrice}</p>

          {/* Rating */}
          {rating && Number(rating) > 0 && (
            <div className="flex items-center gap-1 text-xl font-bold text-green-700">
              ★ {rating}
              {ratingCountV2 && (
                <span className="text-gray-400 font-semibold">
                  ({ratingCountV2})
                </span>
              )}
            </div>
          )}

          {/* Description */}
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
                src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_300,c_fit/${imageId}`}
                alt={name}
                className="w-[156px] h-[144px] object-cover rounded-xl"
              />
            ) : (
              <div className="w-[156px] h-[144px] bg-gray-100 rounded-xl" />
            )}

            {/* Veg/NonVeg corner icon on image */}
            <div
              className={`absolute bottom-1 right-1 w-4 h-4 border-2 rounded-sm bg-white flex items-center justify-center ${
                isVeg ? "border-green-700" : "border-red-600"
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

          {/* ADD Button */}
          <button
            className="w-[110px] h-[38px] bg-white border-2 border-gray-300
              rounded-xl text-green-700 font-bold text-[15px]
              tracking-widest shadow-sm hover:border-green-700
              transition-all duration-150 active:scale-95"
          >
            ADD
          </button>

          {/* Customisable */}
          <span className="text-[11px] text-gray-400 font-medium -mt-1">
            Customisable
          </span>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-100 mx-2" />
    </>
  );
}

export default MenuDetails;