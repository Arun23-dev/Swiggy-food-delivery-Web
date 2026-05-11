import { ShopData } from "../../Utils/ShopData"
import {SWIGGY_IMAGE_BASE_URL_FOR_DINE} from "../../Utils/Constants"

export default function ShopCard({shopdata}) {
  
    return (
      <div className=""> 
          <a href={shopdata?.action?.link ?? "#"}>
            <img
              className="min-h-[11.25rem] min-w-[9rem]"
              src={`${SWIGGY_IMAGE_BASE_URL_FOR_DINE}${shopdata?.imageId}`}
              alt={shopdata?.name ?? "Shop Image"}
            />
          </a>
        <h2 className="text-center font-semibold text-[20px] text-[#02060cbf]
        leading-[24px] tracking-[-0.5px]">{shopdata?.description}</h2>
        </div>
     
    );
  
}
