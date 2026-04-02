import { useState } from "react";

import { FoodOnlineAddress } from "../../Utils/FoodOnlineAddress";
export default function FoodDelivery() {
  const [dataShow, setDataShow] = useState(11);
  return (
    <div className="flex justify-center max-w-[70%] mx-auto container mt-20 ">
      <div>
        <div>  <h2 className="text-[#02060ceb] text-[24px] font-semibold pb-2">Cities with Food delivery</h2></div>
        <div className="flex justify-between flex-wrap gap-4 ">
          {FoodOnlineAddress.slice(0, dataShow).map((data) => (
            <a href={data.link} key={data.link}>
              <div
                
                className="h-[71px] min-w-[231px] border-solid border-[1.5px] border-[#02060c26]  rounded-xl p-4
                 items-center  justify-center flex text-center"
              >
                <div className="min-h-[36px] max-w-[194px] text-[14px] flex items-center">
                  {data.text}
                </div>
              </div>
            </a>
          ))}
          {dataShow < FoodOnlineAddress.length && (
  <button
    onClick={() => setDataShow(FoodOnlineAddress.length)}
    className="max-h-[71px]  min-w-[231px] border-[1.5px] border-[#02060c26] rounded-xl p-4
               flex items-center justify-center gap-2 text-[#FF5200] font-semibold 
               hover:bg-[#fff2ee] transition-all duration-200"
  >
    <span>Show more</span>
    <svg
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1.352 5.292a1 1 0 0 0-.106 1.41l5.261 6.12.029.033c.15.175.324.377.495.527.204.179.533.402.993.402s.789-.223.992-.402a5.4 5.4 0 0 0 .495-.527l.03-.034 5.213-6.064a1 1 0 1 0-1.517-1.303l-5.213 6.064-5.262-6.12a1 1 0 0 0-1.41-.106"
        fill="#FF5200"
        fillOpacity="0.92"
      ></path>
    </svg>
  </button>
)}

        </div>
      </div>
    </div>
  );
}
