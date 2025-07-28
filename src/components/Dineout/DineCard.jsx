export default function DineCard({ resturantdata }) {
  

  return (
    <div className=" min-w-[326px] min-h-[378px] rounded-2xl border-[#e3dada] border-[0.5px]">
        <div className="relative">
          <a href="#">
            <img
              src={`https://media-assets.swiggy.com/swiggy/image/upload/${resturantdata?.info?.mediaFiles[0]?.url}`}
              alt={resturantdata?.info?.name ?? "Restaurant Image"}
              className="min-h-[11.8rem] h-[11.8rem] min-w-[20.375rem] rounded-t-xl object-cover "
            />
          </a>
          <h2 className="absolute text-white text-[20px] bottom-3 z-10 font-extrabold left-3 cov ">
            {resturantdata?.info?.name}
          </h2>
          <div className="absolute z-10 bottom-3 flex right-3 items-center gap-1 align-middle">
            <span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="8.00005"
                  cy="7.99999"
                  r="7.2"
                  fill="url(#StoreRating16_svg__paint0_linear_32982_71565)"
                ></circle>
                <path
                  d="M8.06524 10.292C8.02495 10.2683 7.97496 10.2683 7.93466 10.292L5.85313 11.5174C5.54781 11.6972 5.1768 11.4206 5.26191 11.0766L5.8205 8.81958C5.83239 8.77154 5.81567 8.72094 5.77751 8.68943L3.96412 7.19223C3.68661 6.96312 3.82918 6.51269 4.18797 6.48497L6.58754 6.29955C6.63517 6.29587 6.67685 6.2661 6.69578 6.22223L7.63269 4.05109C7.77165 3.72907 8.22825 3.72907 8.36722 4.05109L9.30412 6.22223C9.32305 6.2661 9.36473 6.29587 9.41237 6.29955L11.8119 6.48497C12.1707 6.51269 12.3133 6.96312 12.0358 7.19223L10.2224 8.68943C10.1842 8.72094 10.1675 8.77154 10.1794 8.81958L10.738 11.0766C10.8231 11.4205 10.4521 11.6972 10.1468 11.5174L8.06524 10.292Z"
                  fill="white"
                ></path>
                <defs>
                  <linearGradient
                    id="StoreRating16_svg__paint0_linear_32982_71565"
                    x1="8.00005"
                    y1="0.799988"
                    x2="8.00005"
                    y2="15.2"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#21973B"></stop>
                    <stop offset="1" stop-color="#128540"></stop>
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <p className=" text-white text-[16px]  font-extrabold ">
              {resturantdata?.info?.rating?.value ?? "No Rating"}
            </p>
          </div>
          <div className="absolute bottom-0 h-14 w-full bg-gradient-to-t from-black to-transparent"></div>
        </div>

        <div className="min-w-[302px] min-h-[169px]  px-3 pt-2 pb-3  text-[14px]  text-[02060c99 ] z-10">
          <div className="flex justify-between  text-[13px]  mt-1 ">
            <div className="flex flex-wrap items-center text-sm text-gray-800">
              {resturantdata?.info?.cuisines.map((cuisine, index) => (
                <span key={index} className="inline-flex items-center">
                  {cuisine}
                  {index !== resturantdata.info.cuisines.length - 1 && (
                    <span className="mx-1">•</span>
                  )}
                </span>
              ))}
            </div>

            <div>{resturantdata?.info?.costForTwo}</div>
          </div>

          <div className="flex justify-between text-[13px]  mt-1 min-h-[17px] z-10">
            <div>
              {[
                resturantdata?.info?.locationInfo?.landmarkName,
                resturantdata?.info?.locality,
                resturantdata?.info?.locationInfo?.city?.name,
              ]
                .filter(Boolean)
                .join(",")}
            </div>
            <div>{resturantdata?.info?.locationInfo?.distanceString}</div>
          </div>

          <div className="flex gap-4 bg-[f0f0f5] mt-[10px] min-h-[21px] ">
            <div className="flex items-center py-0.5 px-2 bg-[#f0f0f5]  border-solid rounded-xl">
              <img
                src={`https://media-assets.swiggy.com/swiggy/image/upload/${resturantdata?.info?.vendorOffer?.offerHighlights[0]?.logoCtx?.logo}`}
                alt="booklogo"
                className="h-[12px] w-[12px]"
              />
              <div>
                {
                  resturantdata?.info?.vendorOffer?.offerHighlights[0]?.logoCtx
                    ?.text
                }
              </div>
            </div>

         {resturantdata?.info?.vendorOffer?.offerHighlights?.[1]&&(  <div className="flex items-center py-0.5 px-2 bg-[#f0f0f5]  border-solid rounded-xl">
              
               
                  <img
                    src={`https://media-assets.swiggy.com/swiggy/image/upload/${resturantdata.info.vendorOffer.offerHighlights[1].logoCtx.logo}`}
                    className="h-[12px] w-[12px] object-contain"
                  />
                  <div>
                    {
                      resturantdata.info.vendorOffer.offerHighlights[1].logoCtx
                        .text
                    }
                  </div>
               
              
            </div>)}
          </div>



            <div className="flex justify-between mt-3  min-h-[36px] min-w-[302px] bg-[#1ba672] items-center
                    border-solid rounded-lg px-2">
              <div className="flex gap-2 justify-center items-center">
                <img src={`https://media-assets.swiggy.com/swiggy/image/upload/${resturantdata?.info?.vendorOffer?.info?.offersLogoV2[0]?.logo}`}
                alt="logo" className="h-[26px] w-[26px]"></img>
                <div >{[resturantdata?.info?.offerInfoV3?.vendorOffer?.title,resturantdata?.info?.offerInfoV3?.vendorOffer?.subtitle].join("")}</div>
              </div>



              <div>{resturantdata?.info?.offerInfoV3?.vendorOffer?.subtext}</div>
              </div>

            <div className="mt-3 pl-2  flex text-[14px] items-center bg-[#c8f9e5] rounded-[8px] min-h-[36px]">
              <div>{resturantdata?.info?.customerOffer?.infos[0]?.description}</div>
            </div>

            {resturantdata?.info?.vendorOffer?.infos[0]?.header&& (<div className="pt-3 text-[#0000EE]">
              <div>{resturantdata?.info?.vendorOffer?.infos[0]?.header}</div>
            </div>)}
        </div>
    </div>
  );
}
