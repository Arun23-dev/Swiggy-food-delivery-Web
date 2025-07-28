export default function MenuCard({ menuCard }) {
  return (
    <div className="h-[174px]  w-full mb-10 pb-10 justify-center ">

        <div className="flex  justify-between pb-10 ">
      <div className="w-7/10">
        <div className="text-[18px] font-semibold text-[#02060ceb]">{menuCard?.name}</div>
        <div className="text-[16px] font-normal text-[#02060ceb]"><span>&#8377;</span>{Math.floor(menuCard?.price / 100)}</div>
        
        {menuCard?.ratings?.aggregatedRating?.rating && (
        <div>
            <span>{menuCard.ratings.aggregatedRating.rating}</span>
            <span>{`(${menuCard.ratings.aggregatedRating.ratingCountV2})`}</span>
        </div>
        )}

        <div>{menuCard?.description}</div>
      </div>

      
      <div className="relative  w-[20%] ">
        <div>
          <img
            src={`https://media-assets.swiggy.com/swiggy/image/upload/${menuCard?.imageId}`}
            alt=""
            className="object-cover h-[144px] max-w-[156px] w-[156px]"
          />
        </div>
        <button
          className="w-[120px] h-[38px] text-center
            border-gray-400  border-2 rounded-xl cursor-pointer  bg-white px-4 py-2
            shadow-lg 
             text-[#1BA672] font-semibold text-[18px] absolute bottom-0 z-20 right-15"
        >
          ADD
        </button>
       
      
       </div>
    </div>

    
   </div>

  );
}
