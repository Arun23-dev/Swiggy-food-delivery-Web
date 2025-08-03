
export default function FoodCard({ fooddata }) {
  return (
    <a href={fooddata?.action?.link ?? "#"}>
      <img
        className="h-[11.25rem] w-[9rem] min-h-[11.25rem] min-w-[9rem] object-cover rounded-xl"
        src={`https://media-assets.swiggy.com/swiggy/image/upload/${fooddata?.imageId}`}
        alt={fooddata?.name ?? "Food Image"}
      />
    </a>
  );
}
