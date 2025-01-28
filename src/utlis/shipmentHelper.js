export const validateShipment = (shipment) => {
    const { orderDate, receivedDate, location, supplier, cartons, description } = shipment;
    if (!orderDate || !receivedDate || !location || !supplier || !cartons || !description) {
        return false;
    }
    return true;
}


export const formatShipmentDates = (shipment) => {
    try {
        // convert ISO 8601 standard date from mongo db to yyyy-MM-dd which is the standard date format in HTML
        shipment.orderDate = new Date(shipment.orderDate).toISOString().split('T')[0];
        shipment.receivedDate = new Date(shipment.receivedDate).toISOString().split('T')[0];
        return shipment;
    } catch (error) {
        console.error('Error formatting shipment dates:', error);
        return null;
    }
};

export const formatAllShipmentDates = (shipments) => {
    return shipments.map(formatShipmentDates);
};