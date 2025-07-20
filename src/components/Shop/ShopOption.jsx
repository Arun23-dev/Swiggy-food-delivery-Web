import { ShopData } from "../../Utils/ShopData";
import ShopCard from "./ShopCard";
export default function ShopOption(){

    return (
        <>
        <div className="max-w-8/10 container mx-auto flex flex-wrap mt-20 gap-10 justify-center">
                {
                    ShopData.map((data)=><ShopCard key={data.id} shopdata={data} ></ShopCard>)
                }
        </div>
        </>

    )
}