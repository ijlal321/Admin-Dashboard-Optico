


export const getLatestOrders = async () => {
    try {
        const response = await fetch('/api/order');
        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: `Failed to fetch orders. Error ${error}` };
    }
}


export const addNewOrder = async (newOrder) => {
    try {
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newOrder),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding order:', error);
        return { success: false, error: `Failed to add order. Error ${error}` };
    }
}

export const updateOrder = async (updatedOrder) => {
    try {
        const response = await fetch('/api/order', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedOrder),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding order:', error);
        return { success: false, error: `Failed to add order. Error ${error}` };
    }
}

export const deleteOrder = async (orderId) => {
    try {
        const response = await fetch('/api/order', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: orderId }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting order:', error);
        return { success: false, error: `Failed to delete order. Error ${error}` };
    }
}

export const getOrderbyId = async (orderId) => {
    try {
        const response = await fetch(`/api/order/${orderId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: `Failed to fetch order. Error ${error}` };
    }
}

export const validateNewOrder = (newOrder) => {
    for (const item of newOrder.items) {
        if (!item.itemId || !item.variantId || !item.inventoryId) {
            item.itemId = '';
            item.variantId = '';
            item.inventoryId = '';
        }


        if (item.itemType === 'Prescription Glasses') {
            if (!prescriptionGlassValidator(item)) {
                return { success: false, error: 'Fill Frame form properly' };
            }
        }
        else if (item.itemType === 'Sunglass') {
            if (!sunglassValidator(item)) {
                return { success: false, error: 'Fill Sunglass form properly' };
            }
        }
        else if (item.itemType === 'Reading Glasses') {
            if (!readingGlassValidator(item)) {
                return { success: false, error: 'Fill Reading Glass form properly' };
            }
        }
        else if (item.itemType === 'Contact Lens') {
            if (!contactLensValidator(item)) {
                return { success: false, error: 'Fill Contact Lens form properly' };
            }
        }
        else if (item.itemType === 'Other') {
            if (!otherValidator(item)) {
                return { success: false, error: 'Fill Other form properly' };
            }
        }
    }
    return { success: true };
}
const prescriptionGlassValidator = (item) => {
    if(item.framePrice <= 0 || item.lensPrice < 0){
        return false;
    }
    return true;
}

const sunglassValidator = (item) => {
    if(item.sunglassPrice <= 0){
        return false;
    }
    return true;
}

const readingGlassValidator = (item) => {
    if(item.price <= 0){
        return false;
    }
    return true;
}

const contactLensValidator = (item) => {
    if(item.price <= 0 || item.quantity <= 0){
        return false;
    }
    return true;
}

const otherValidator = (item) => {
    if(item.price <= 0){
        return false;
    }
    return true;
}

    