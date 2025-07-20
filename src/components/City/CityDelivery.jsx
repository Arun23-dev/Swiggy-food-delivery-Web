import {FoodOnlineAddress} from "../../Utils/FoodOnlineAddress"
 export default function CityDelivery(){
    return (
        <div className="flex   justify-center max-w-[80%] mx-auto container">
            {/* city for food delivery */}
             <div >
                <h2 className="text-[#02060ceb]">Cities with grocery delivery</h2>
                <div className="flex justify-center flex-wrap gap-10 " >
                   

                    {
            FoodOnlineAddress.map((data) => (
                <div 
                key={data.link}
                className="border-[#02060C1A] rounded-2xl border-[1.5px] 
                            flex justify-center flex-wrap text-center items-center  
                            p-4 w-[185px] h-[71px] border-solid text-[14px]"
                >
                <a href={data.link}>
                    {data.text}
                </a>
                </div>
            ))
            }

                    {/* <div>Content2</div>

                    <div>Content2</div>
                    <div>Content2</div>

                    <div>Content2</div>
                    <div>Content2</div>

                    <div>Content2</div>
                    <div>Content2</div>
                    <div>Content2</div>
                    <div>Content2</div> */}
                </div>
               

            </div>



            {/* city for grocery delivery
            <div className="mx-auto container">
                <h2>Cities with grocery delivery</h2>
                <div>Content21</div>
            </div> */}
        </div>
    )
}