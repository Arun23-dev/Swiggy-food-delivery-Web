export default function MenuCard({ menuCard }) {
  return (
    <div className="h-[174px]   ">

        <div className="flex  justify-between pb-5 ">
       <div className="w-7/10">
        <div className="text-[18px] font-semibold text-[#02060ceb]">{menuCard?.name}</div>
        <div className="text-[16px] font-normal text-[#02060ceb]"><span>&#8377;</span>{Math.floor(menuCard?.price / 100)}</div>
        
        {menuCard?.ratings?.aggregatedRating?.rating && (
        <div className="flex  items-center gap-0.5">
            <span className="flex align-middle "> <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" fillColor="#116649"><rect width="14" height="14" fill="white"></rect><path d="M5.67163 3.99166C6.22068 2.34179 6.49521 1.51686 7 1.51686C7.50479 1.51686 7.77932 2.34179 8.32837 3.99166L8.65248 4.96556H9.60668C11.4122 4.96556 12.315 4.96556 12.4703 5.45302C12.6256 5.94049 11.8893 6.4628 10.4167 7.50744L9.67376 8.03444L9.97544 8.94095C10.5325 10.615 10.8111 11.452 10.4033 11.754C9.99553 12.056 9.27604 11.5457 7.83705 10.5249L7 9.93112L6.16295 10.5249C4.72396 11.5457 4.00447 12.056 3.5967 11.754C3.18893 11.452 3.46747 10.615 4.02456 8.94095L4.04557 8.87783C4.18081 8.47145 4.24843 8.26825 4.18684 8.08006C4.12525 7.89187 3.94958 7.76725 3.59824 7.51802C2.11566 6.46633 1.37437 5.94049 1.52971 5.45302C1.68504 4.96556 2.5878 4.96556 4.39332 4.96556H5.34752L5.67163 3.99166Z" fill="#116649"></path></svg>
            </span>

            <span>{menuCard.ratings.aggregatedRating.rating}</span>
            <span>{`(${menuCard.ratings.aggregatedRating.ratingCountV2})`}</span>
        </div>
        )}

        <div className="w-[515px] h-[42px] ">{menuCard?.description.slice()}</div>
      </div>

      
      <div className="relative  w-[20%] h-[154px]">
        
          <img
            src={`https://media-assets.swiggy.com/swiggy/image/upload/${menuCard?.imageId}`}
            alt=""
            className="object-cover h-[144px] max-w-[156px] w-[156px] rounded-xl"
          />
      
        <button
          className="w-[120px] h-[38px] text-center
            border-gray-400  border-2 rounded-xl cursor-pointer  bg-white px-4 py-2
            shadow-lg 
             text-[#1BA672] font-semibold text-[18px] absolute  z-20 left-5 bottom-0"
        >
          ADD
        </button>
       
      
       </div>
    </div>

    
   </div>

  );
}
