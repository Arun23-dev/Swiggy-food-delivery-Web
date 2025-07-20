import { ShopData } from "../../Utils/ShopData"

export default function ShopCard({shopdata}) {
  
    return (
      <div> 
          <a href={shopdata?.action?.link ?? "#"}>
            <img
              className="h-[11.25rem] w-[9rem]"
              src={`https://media-assets.swiggy.com/swiggy/image/upload/${shopdata?.imageId}`}
              alt={shopdata?.name ?? "Shop Image"}
            />
          </a>
        <h2>{shopdata?.description}</h2>
        </div>
     
    );
  
}
