import {FoodData} from "../../Utils/FoodData"
import FoodCard from "./FoodCard"
export default  function FoodOption(){
    return (
       
        <div className="relative h-[26rem] overflow-y-auto mt-20" >
       
       <div className="mb-8 h-[1.625rem]">
         <div className="absolute top-0 right-0 flex ">
            <button class="w-12 h-12 rounded-full bg-gray-300 text-gray-900 text-lg font-medium flex items-center justify-center hover:bg-gray-400 transition"> &larr;</button>
             <button class="w-12 h-12 rounded-full bg-gray-100 text-gray-500 text-lg font-medium flex items-center justify-center hover:bg-gray-200 transition">&rarr;</button>
        </div>
       </div>
         
        <div className="max-w-[80%] container mx-auto flex  justify-center flex-wrap gap-10">
        {

            FoodData.map((data)=><FoodCard key={data.id} fooddata={data} ></FoodCard>)
        }
        </div>
        </div>
        
    )
}