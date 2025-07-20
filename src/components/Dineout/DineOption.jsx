import { DineData } from "../../Utils/DineData"
import DineCard from "./DineCard"
export default function DineOption(){
return (
    <div className="flex flex-wrap max-w-8/10 justify-center container mx-auto gap-10 mt-4">
        {
            DineData.map((data)=><DineCard key={data.id} resturantdata={data}></DineCard>)
        }
    </div>
)
}