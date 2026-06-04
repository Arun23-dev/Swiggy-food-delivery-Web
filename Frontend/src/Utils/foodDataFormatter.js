export default function foodDataFormatter(restaruantData) {
    // Get 
    const data = restaruantData;
    // console.log(data);
    const cards =
        data?.data?.cards.at(-1)?.groupedCard?.cardGroupMap?.REGULAR?.cards ||
        [];
    const filteredData = cards.filter((data) => {
        return data.card?.card?.itemCards || data.card?.card?.categories;
    });


    const filteredArrayData = filteredData.flatMap((item) => {

        const inner = item.card.card;

        if (inner.itemCards) {
            return inner.itemCards;
        }

        if (inner.categories) {
            return inner.categories.flatMap((item) => {
                return item.itemCards;
            })
        }
    })
    return filteredArrayData;


}


