export const calculatePrices = (itemsPrice) => {
    const taxPrice = Number((itemsPrice * 0.18).toFixed(2));
    const shippingPrice = 0; // Free shipping for now, as per backend
    const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));

    return {
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    };
};
