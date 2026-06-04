// backend/utils/cartTransformer.js
function transformCartForFrontend(cart) {
    if (!cart) return { items: [], count: 0, totalAmount: 0 };
    return {
        items: cart.items.map(item => ({
            id: item.swiggyItemId,      // rename field for frontend
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        })),
        count: cart.count,
        totalAmount: cart.totalAmount
    };
}

module.exports = { transformCartForFrontend };