import { useRef, useState, useEffect } from "react";
import { Link } from "react-router"; // Make sure this is imported

export default function RestuarnatAllFood({ CategoryWise, ResturantAllFood }) {
  return (
    <div className="w-[80%] justify-center mx-auto container">
      <div>
        <h2>Restaurant with online food delivery</h2>
      </div>

      <div>
        <div className="flex justify-start">
          <div>Filter</div>
        </div>
        <div className="flex justify-start">
          <div>Sort By</div>
          <div>down arrow</div>
        </div>

        {CategoryWise?.length > 0 ? (
          CategoryWise.filter(
            (data) => data?.facetInfo?.[0]?.label !== "Afghani"
          ).map((item, index) => (
            <div key={index}>{item?.facetInfo?.[0]?.label}</div>
          ))
        ) : (
          <p className="text-gray-500 p-4">Loading labels...</p>
        )}
      </div>

      <div className="m-0 gap-8 justify-center flex flex-wrap">
        {ResturantAllFood?.length > 0 ? (
          ResturantAllFood.map((data) => (
            <Link
              key={data.info.id}
              to={`/city/delhi/${data?.info?.id}`}
              className="h-[248px] cursor-pointer block transform hover:scale-95 transition duration-50 ease-in-out"
            >
              <div className="relative">
                <img
                  className="h-[190px] min-w-[273px] w-[273px] rounded-xl object-cover"
                  src={`https://media-assets.swiggy.com/swiggy/image/upload/${data?.info?.cloudinaryImageId}`}
                  alt={data?.info?.name ?? "Food Image"}
                />

                <div className="absolute bottom-0 left-0 w-full h-[70px] font-extrabold z-10 bg-gradient-to-t from-black/70 to-transparent rounded-b-xl px-3 flex items-end pb-2 text-white text-[20px]">
                  <span>
                    {[
                      data?.info?.aggregatedDiscountInfoV3?.header,
                      data?.info?.aggregatedDiscountInfoV3?.subHeader,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  </span>
                </div>
              </div>

              <div className="h-[92px] w-[274px] ml-3 mt-1">
                <div className="w-[274px] flex">
                  {data?.info?.name.length > 30
                    ? data.info.name.slice(0, 26) + "…"
                    : data.info.name}
                </div>

                <div className="flex text-[16px] w-[261px] text-[#02060ceb]">
                  <div className="flex justify-around items-center">
                    <span>
                      {/* SVG Star Icon */}
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          cx="10"
                          cy="10"
                          r="9"
                          fill="url(#rating-grad)"
                        />
                        <path
                          d="M10.0816 12.865C10.0312 12.8353 9.96876 12.8353 9.91839 12.865L7.31647 14.3968C6.93482 14.6214 6.47106 14.2757 6.57745 13.8458L7.27568 11.0245C7.29055 10.9644 7.26965 10.9012 7.22195 10.8618L4.95521 8.99028C4.60833 8.70388 4.78653 8.14085 5.23502 8.10619L8.23448 7.87442C8.29403 7.86982 8.34612 7.83261 8.36979 7.77777L9.54092 5.06385C9.71462 4.66132 10.2854 4.66132 10.4591 5.06385L11.6302 7.77777C11.6539 7.83261 11.706 7.86982 11.7655 7.87442L14.765 8.10619C15.2135 8.14085 15.3917 8.70388 15.0448 8.99028L12.7781 10.8618C12.7303 10.9012 12.7095 10.9644 12.7243 11.0245L13.4225 13.8458C13.5289 14.2757 13.0652 14.6214 12.6835 14.3968L10.0816 12.865Z"
                          fill="white"
                        />
                        <defs>
                          <linearGradient
                            id="rating-grad"
                            x1="10"
                            y1="1"
                            x2="10"
                            y2="19"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#21973B" />
                            <stop offset="1" stopColor="#128540" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                    <div>{data?.info?.avgRating}</div>
                    <span className="text-xl font-bold flex justify-center min-w-[15px] leading-none">
                      •
                    </span>
                  </div>
                  <div>{data?.info?.sla?.slaString}</div>
                </div>

                <div className="flex w-[274px] text-[16px] text-gray-600">
                  {data?.info?.cuisines.join(", ").length > 30
                    ? data?.info?.cuisines.join(", ").slice(0, 25) + "..."
                    : data?.info?.cuisines.join(", ")}
                </div>

                <div className="text-[16px] text-gray-600 flex w-[274px]">
                  {data?.info?.areaName}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 p-4">Loading images...</p>
        )}
      </div>
    </div>
  );
}
