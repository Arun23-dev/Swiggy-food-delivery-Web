import { SWIGGY_IMAGE_BASE_URL_FOR_DINE } from "../../Utils/Constants";
export default function FoodCard({ fooddata }) {
  return (
    <a href={fooddata?.action?.link ?? "#"}>
      <img
        className="h-[11.25rem] w-[9rem] min-h-[11.25rem] min-w-[9rem] object-cover rounded-xl"
        src={`${SWIGGY_IMAGE_BASE_URL_FOR_DINE}${fooddata?.imageId}`}
        alt={fooddata?.name ?? "Food Image"}
      />
    </a>
  );
}
