import React from 'react'

function ShipmentCard({shipment, setShipment, readOnly}) {
  return (
    <div className='card'>
      <h5 className='card-header'>Shipment Details</h5>
      <div className='card-body'>
        <div className='row'>
          <div className='col'>
            <label>Order Date</label>
            <input type='date' className='form-control' value={shipment.orderDate} readOnly={readOnly} onChange={(e) => setShipment({...shipment, orderDate: e.target.value})} />
          </div>
          <div className='col'>
            <label>Received Date</label>
            <input type='date' className='form-control' value={shipment.receivedDate} readOnly={readOnly} onChange={(e) => setShipment({...shipment, receivedDate: e.target.value})} />
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <label>Location</label>
            <input type='text' className='form-control' value={shipment.location} readOnly={readOnly} onChange={(e) => setShipment({...shipment, location: e.target.value})} />
          </div>
          <div className='col'>
            <label>Supplier</label>
            <input type='text' className='form-control' value={shipment.supplier} readOnly={readOnly} onChange={(e) => setShipment({...shipment, supplier: e.target.value})} />
          </div>
        </div>
        <div className='row'>
          <div className='col'>
            <label>Cartons</label>
            <input type='number' className='form-control' value={shipment.cartons} readOnly={readOnly} onChange={(e) => setShipment({...shipment, cartons: e.target.value})} />
          </div>
          <div className='col'>
            <label>Description</label>
            <input type='text' className='form-control' value={shipment.description} readOnly={readOnly} onChange={(e) => setShipment({...shipment, description: e.target.value})} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShipmentCard