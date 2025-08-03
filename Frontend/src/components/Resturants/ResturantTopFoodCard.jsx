import { NavLink, Link } from "react-router";
export default function ResturantTopFoodCard({data}){

    return (
      <Link to={`/city/delhi/${data?.info?.id}`}>  
            <div className="pr-10 [w-273] [h-286.297px]  ">
             <a  href={data?.cta?.link ?? "#" }
             className="cursor-pointer  block transform  hover:scale-95 transition duration-50 ease-in-out w-[273px] 
             " >
              <div className="relative ">
                {/* Image */}
                <img
                  className="min-h-[182px] h-[182px] w-[273px]  min-w-[273px]  rounded-xl object-cover "
                  src={`https://media-assets.swiggy.com/swiggy/image/upload/${data?.info?.cloudinaryImageId}`}
                  alt={data?.info?.name ?? "Food Image"}
                />
                 {/* Gradient + Header/SubHeader */}
                <div className="absolute bottom-0 left-0 w-full  h-[60px] font-extrabold
                bg-gradient-to-t from-black/70 to-transparent rounded-b-xl px-3 flex items-end pb-2 text-white text-[20px]">
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


              <div className="h-[92px] w-[92.297px] ml-3 mt-1 ">
                <div className=" w-[274px] flex ">
                  {data?.info?.name.length > 30
                    ? data.info.name.slice(0, 26) + "…"
                    : data.info.name}
                </div>
                <div className="flex text-[16px] w-[261px]  text-[#02060ceb]">
                  <div className=" flex justify-around items-center">
                    <span>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                        strokeColor="rgba(2, 6, 12, 0.92)"
                        fillColor="rgba(2, 6, 12, 0.92)"
                      >
                        <circle
                          cx="10"
                          cy="10"
                          r="9"
                          fill="url(#StoreRating20_svg__paint0_linear_32982_71567)"
                        ></circle>
                        <path
                          d="M10.0816 12.865C10.0312 12.8353 9.96876 12.8353 9.91839 12.865L7.31647 14.3968C6.93482 14.6214 6.47106 14.2757 6.57745 13.8458L7.27568 11.0245C7.29055 10.9644 7.26965 10.9012 7.22195 10.8618L4.95521 8.99028C4.60833 8.70388 4.78653 8.14085 5.23502 8.10619L8.23448 7.87442C8.29403 7.86982 8.34612 7.83261 8.36979 7.77777L9.54092 5.06385C9.71462 4.66132 10.2854 4.66132 10.4591 5.06385L11.6302 7.77777C11.6539 7.83261 11.706 7.86982 11.7655 7.87442L14.765 8.10619C15.2135 8.14085 15.3917 8.70388 15.0448 8.99028L12.7781 10.8618C12.7303 10.9012 12.7095 10.9644 12.7243 11.0245L13.4225 13.8458C13.5289 14.2757 13.0652 14.6214 12.6835 14.3968L10.0816 12.865Z"
                          fill="white"
                        ></path>
                        <defs>
                          <linearGradient
                            id="StoreRating20_svg__paint0_linear_32982_71567"
                            x1="10"
                            y1="1"
                            x2="10"
                            y2="19"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stop-color="#21973B"></stop>
                            <stop offset="1" stop-color="#128540"></stop>
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                    <div>{data?.info?.avgRating}</div>
                    <span className="text-xl font-bold flex justify-center min-w-[15px]  leading-none">
                      •
                    </span>
                  </div>
                  <div>{data?.info?.sla?.slaString}</div>
                </div>
                <div className="flex w-[274px] text-[16px] text-gray-600 ">
                  {data?.info?.cuisines.join(",")?.length > 30
                    ? data?.info?.cuisines?.join(", ").slice(0, 25) + "..."
                    : data?.info?.cuisines?.join(", ")}
                </div>
                <div className="text-[16px] height-[21px] text-gray-600 flex  w-[274px]">
                  {data?.info?.areaName}
                </div>
              </div>
            </a>
            </div>  
            </Link>      
    );
}