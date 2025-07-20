import { DineData } from "../../Utils/DineData";
export default function DineCard({resturantdata})
{
    return (
        
        <div className="h-[23.625rem w-[20.375rem] ">
            <div>
                <a href="#"> 
                    <img src={`https://media-assets.swiggy.com/swiggy/image/upload/${resturantdata?.info?.mediaFiles[0]?.url}`}
                     alt={resturantdata?.info?.name ?? "Restaurant Image"}
                     className="min-h-[11.8rem] h-[11.8rem] min-w-[20.375rem]"/>
                   
                </a>
                <h2> {resturantdata?.info?.name} </h2>
                <p>{resturantdata?.info?.rating?.value ?? "No Rating"}</p>
            </div>
        </div>

       
    );
}