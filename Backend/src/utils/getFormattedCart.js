const getFormattedCart = (cart) => {
    if (!cart) return null;

    return {
        cartId: cart._id,
        userId: cart.user,
        count: cart.count,
        totalAmount: cart.totalAmount,
        restaurants: cart.restaurants.map((restaurant) => ({
            restaurantId: restaurant.restaurantId,
            restaurantName: restaurant.restaurantName,
            city: restaurant.city || null,
            locality: restaurant.locality || null,
            items: restaurant.items.map((item) => ({
                swiggyItemId: item.swiggyItemId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image || null,
                itemTotal: item.price * item.quantity,  // bonus: per-item total
            })),
        })),
        updatedAt: cart.updatedAt,
    };
};
module.exports=getFormattedCart;