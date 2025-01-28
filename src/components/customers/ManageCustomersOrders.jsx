'use client';

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ShowSummaryOrder from '../order/ShowSummaryOrder';
import CurrentStatusComponent from '../helpers/CurrentStatusComponent';

const dummyOrders = [
  {
    id: 1,
    orderNumber: "11", // from physical store
    customerId: "cust001",
    prescriptionId: "presc001",
    orderDate: new Date(),
    deliveryDate: new Date(),
    status: "Pending",
    items: [
      {
        id: "item001",
        itemType: "Sunglass",
        itemId: "1",
        variantId: "1",
        inventoryId: "1",
        customLens: true,
        sunglassPrice: 100,
        lensPrice: 50,
        lensType: "Polarized",
        description: "Polarized Sunglasses"
      },
      {
        id: "item002",
        itemType: "Prescription Glasses",
        itemId: "prescGlasses001",
        variantId: "var002",
        inventoryId: "1",
        lensType: "Single Vision",
        framePrice: 150,
        lensPrice: 75,
        description: "Blue light blocking glasses"
      },
      {
        id: "item003",
        itemType: "Contact Lens",
        brandId: "1",
        colorId: "1",
        batchId: "1",
        inventoryId: "1",
        kit: "Monthly",
        price: 60,
        quantity: 2,
        description: "Monthly disposable contact lenses"
      },
      {
        id: "1",
        itemType: "Reading Glasses",
        itemId: "1",
        variantId: "1",
        inventoryId: "1",
        price: 50,
        description: "Reading glasses blue"
      },
      {
        id: "item005",
        itemType: "Other",
        description: "Cleaning Kit",
        price: 20
      }
    ]
  },
  {
    id: 2,
    orderNumber: "22", // from physical store
    customerId: "cust001",
    prescriptionId: "presc002",
    orderDate: new Date(),
    deliveryDate: new Date(),
    status: "Pending",
    items: [
      {
        id: "item001",
        itemType: "Sunglass",
        itemId: "1",
        variantId: "1",
        inventoryId: "1",
        customLens: true,
        sunglassPrice: 100,
        lensPrice: 50,
        lensType: "Polarized",
        description: "Polarized Sunglasses"
      },
      {
        id: "item002",
        itemType: "Prescription Glasses",
        itemId: "prescGlasses001",
        variantId: "var002",
        inventoryId: "1",
        lensType: "Single Vision",
        framePrice: 150,
        lensPrice: 75,
        description: "Blue light blocking glasses"
      },
      {
        id: "item003",
        itemType: "Contact Lens",
        brandId: "1",
        colorId: "1",
        batchId: "1",
        inventoryId: "1",
        kit: "Monthly",
        price: 60,
        quantity: 2,
        description: "Monthly disposable contact lenses"
      },
      {
        id: "1",
        itemType: "Reading Glasses",
        itemId: "1",
        variantId: "1",
        inventoryId: "1",
        price: 50,
        description: "Reading glasses blue"
      },
      {
        id: "item005",
        itemType: "Other",
        description: "Cleaning Kit",
        price: 20
      }
    ]
  }
]


function ManageCustomersOrders() {
  const [status, setStatus] = useState({ status: "hide", description: "" });
  const [orders, setOrders] = useState([]);
  const params = useParams();
  const { customerId } = params;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/order/customer/${customerId}`);
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.message);
        }
        setOrders(data.data);
        setStatus({ status: "successful", description: "Orders fetched successfully" });
      } catch (error) {
        console.error(error);
        setStatus({ status: "error", description: "Failed to fetch orders" });
      }
    }
    fetchOrders();
  }, [customerId])

  return (
    <div className='container'>
      <h1 className='my-3' style={{ textAlign: 'center', fontSize: "4rem" }}>Orders</h1>
      <div className='d-flex flex-wrap gap-3'>
        {orders.map((order, index) =>
          <div key={index} className='col-4'>
            <ShowSummaryOrder order={order} />
          </div>
        )}
      </div>
      <CurrentStatusComponent status={status} setStatus={setStatus} />
    </div>
  )
}
export default ManageCustomersOrders