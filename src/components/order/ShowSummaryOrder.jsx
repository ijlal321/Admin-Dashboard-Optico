import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Card, CardGroup } from 'react-bootstrap';

function ShowSummaryOrder({ order: originalOrder, status, setStatus }) {
    const [orderSummary, setOrderSummary] = useState(null);
    const [order, setOrder] = useState(originalOrder);


    useEffect(() => {
        const prepareSummary = async () => {
            const summary = {};
            summary['orderNumber'] = order.orderNumber;
            summary['orderDate'] = order.orderDate;
            summary['deliveryDate'] = order.deliveryDate;
            summary['status'] = order.status;
            const sunglassesInfo = { totalPrice: 0, quantity: 0 };
            const prescriptionGlassesInfo = { totalPrice: 0, quantity: 0 };
            const contactLensesInfo = { totalPrice: 0, quantity: 0 };
            const readingGlassesInfo = { totalPrice: 0, quantity: 0 };
            const othersInfo = { totalPrice: 0, quantity: 0 };
            order.items.forEach(item => {
                if (item.itemType == "Sunglass") {
                    sunglassesInfo.totalPrice += item.sunglassPrice + (item.customLens ? item.lensPrice : 0);
                    sunglassesInfo.quantity += 1;
                } else if (item.itemType == "Prescription Glasses") {
                    prescriptionGlassesInfo.totalPrice += item.framePrice + item.lensPrice;
                    prescriptionGlassesInfo.quantity += 1;
                } else if (item.itemType == "Contact Lens") {
                    contactLensesInfo.totalPrice += item.price;
                    contactLensesInfo.quantity += item.quantity;
                } else if (item.itemType == "Reading Glasses") {
                    readingGlassesInfo.totalPrice += item.price;
                    readingGlassesInfo.quantity += 1;
                } else if (item.itemType == "Other") {
                    othersInfo.totalPrice += item.price;
                    othersInfo.quantity += 1;
                }
                else {
                    console.log("Invalid item type");
                    alert("Invalid item types found, ignoring them for now, contact devs for more info");
                }
            });
            summary['sunglasses'] = sunglassesInfo;
            summary['prescriptionGlasses'] = prescriptionGlassesInfo;
            summary['contactLenses'] = contactLensesInfo;
            summary['readingGlasses'] = readingGlassesInfo;
            summary['others'] = othersInfo;
            summary['totalPrice'] = sunglassesInfo.totalPrice + prescriptionGlassesInfo.totalPrice + contactLensesInfo.totalPrice + readingGlassesInfo.totalPrice + othersInfo.totalPrice;
            setOrderSummary(summary);
        }
        prepareSummary();
    }, [order]);

    const gotoOrderDetail = () => {
        window.location.href = `/manage-orders/${order.id}`;
    }

    const handleOrderStatusUpdate = async() => {
        try {
            setStatus({ status: 'loading', description: 'Updating order status' });
            const updatedOrder = { ...order, status: 'Delivered', deliveryDate: new Date() };    
            const response = await fetch(`/api/order`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedOrder)
            });
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.error);
            }
            setOrder(updatedOrder);
            setStatus({ status: 'successful', description: 'Order status updated successfully' });
        } catch (error) {
            console.log(error);
            setStatus({ status: 'error', description: error });
        }

    }

    if (!orderSummary) {
        return <div>Loading...</div>
    }

    return (
        <Card>
            <Card.Header className='d-flex  gap-2 align-items-center'>
                <div className='d-flex gap-3 align-items-center'>
                    <ShoppingCart /> Date: {new Date(orderSummary.orderDate).toDateString()}
                </div>
                <button className='btn btn-primary' onClick={gotoOrderDetail}>View Details</button>
                {order.status.toLowerCase() != 'delivered' && 
                <button className='btn btn-success' onClick={handleOrderStatusUpdate}>Mark Delivered</button>
                 }
            </Card.Header>
            <Card.Body>
                <Card.Title>Order Number: {order.orderNumber || "N/A"}</Card.Title>
                <Card.Text>
                    <strong>Order Date:</strong> {new Date(orderSummary.orderDate).toDateString()}<br />
                    {order.status.toLowerCase() === 'delivered' && (
                        <>
                            <strong>Delivery Date:</strong> {new Date(orderSummary.deliveryDate).toDateString()}<br />
                        </>
                    )}
                    <strong>Status:</strong> {order.status}
                </Card.Text>

                <hr />

                {orderSummary.sunglasses.quantity > 0 &&
                    <div className='d-flex gap-3 align-items-center m-1'>
                        <h1 style={{ fontSize: "1.2rem" }}>Sunglass</h1>
                        <p>x {orderSummary.sunglasses.quantity}</p>
                        <p>Total Price: {orderSummary.sunglasses.totalPrice}</p>
                    </div>
                }
                {orderSummary.prescriptionGlasses.quantity > 0 &&
                    <div className='d-flex gap-3 align-items-center m-1'>
                        <h1 style={{ fontSize: "1.2rem" }}>Prescription Glasses</h1>
                        <p>x {orderSummary.prescriptionGlasses.quantity}</p>
                        <p>Total Price: {orderSummary.prescriptionGlasses.totalPrice}</p>
                    </div>
                }
                {orderSummary.contactLenses.quantity > 0 &&
                    <div className='d-flex gap-3 align-items-center m-1'>
                        <h1 style={{ fontSize: "1.2rem" }}>Contact Lenses</h1>
                        <p>x {orderSummary.contactLenses.quantity}</p>
                        <p>Total Price: {orderSummary.contactLenses.totalPrice}</p>
                    </div>
                }
                {orderSummary.readingGlasses.quantity > 0 &&
                    <div className='d-flex gap-3 align-items-center m-1'>
                        <h1 style={{ fontSize: "1.2rem" }}>Reading Glasses</h1>
                        <p>x {orderSummary.readingGlasses.quantity}</p>
                        <p>Total Price: {orderSummary.readingGlasses.totalPrice}</p>
                    </div>
                }
                {orderSummary.others.quantity > 0 &&
                    <div className='d-flex gap-3 align-items-center m-1'>
                        <h1 style={{ fontSize: "1.2rem" }}>Others</h1>
                        <p>x {orderSummary.others.quantity}</p>
                        <p>Total Price: {orderSummary.others.totalPrice}</p>
                    </div>
                }

                <hr />

                <h1 className='mx-3 mt-2' style={{ fontSize: "1.2rem" }}>Total Price: Rs.{orderSummary.totalPrice}</h1>
            </Card.Body>
        </Card>
    );
}

export default ShowSummaryOrder;