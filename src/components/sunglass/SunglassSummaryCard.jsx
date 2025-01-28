"use client";

import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Edit2, Trash2 } from 'lucide-react';
import { deleteVariantsImages } from '@/utlis/uploadImages';



function SunglassSummaryCard({ sunglass, setStatus }) {
  const [isDeleted, setIsDeleted] = useState(false); // used to hide from UI
  //  when deleted, only that is its purpose

  const {
    id = 'N/A',
    images = [[]],
    brand = 'Unknown',
    shape = [],
    material = [],
    sex = [],
    tags = [],
    price = 'N/A',
    discount = 0,
    lens_type = [],
    lens_material = 'N/A',
    prescription_possible = 'N/A',
    copy_type = 'N/A',
    variants = []
  } = sunglass;


  const gotoSunglassEditPage = () => {
    // redirect to frame edit page
    window.location.href = `/manage-sunglass/edit/${id}`;
  };

  const deleteSunglass = async () => {
    if (!window.confirm('Are you sure you want to delete this Sunglass?')) {
      setStatus({ status: 'error', description: 'Sunglass not deleted' });
      return;
    }
    try {

      setStatus({ status: 'loading', description: 'Deleting Sunglass Data...' });

      // delete images from cloudinary
      const { total, unSuccessful } = await deleteVariantsImages(variants);
      if (unSuccessful > 0) {
        setStatus({ status: 'error', description: `Failed to delete ${unSuccessful} images out of ${total} images` });
        return;
      }



      // delete sunglass data
      const response = await fetch('/api/sunglass', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });

      const data = await response.json();
      if (data.success) {

        setStatus({ status: 'successful', description: 'Sunglass deleted successfully' });
        // window.location.reload();
        setIsDeleted(true); //to not show the deleted Sunglass
      } else {
        setStatus({ status: 'error', description: data.error });
      }
    } catch (error) {
      console.error('Error deleting Sunglass:', error);
      setStatus({ status: 'error', description: error });
    }
  };

  if (isDeleted) return null; // donot render if deleted


  return (
    <div className="sunglass-summary-card">
      <Card style={{ width: 'auto', margin: '1rem', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <Card.Img
          variant="top"
          src={variants.length > 0 ? variants[0].images[0] : 'placeholder-image-url'}
          alt="Frame Image"
          className='thumbnailImg'
        />
        <Card.Body>
          <Card.Title>Price: Rs.{price}</Card.Title>
          <Card.Text>Brand: {brand}</Card.Text>
          <Card.Text>Shape: {shape.join(', ') || 'N/A'}</Card.Text>
          <Card.Text>Material: {material.join(', ') || 'N/A'}</Card.Text>
          <Card.Text>Gender: {sex.join(', ') || 'N/A'}</Card.Text>
          <Card.Text>Tags: {tags.join(', ') || 'N/A'}</Card.Text>
          <Card.Text>Discount: {discount}%</Card.Text>
          <Card.Text>Lens Type: {lens_type.join(', ') || 'N/A'}</Card.Text>
          <Card.Text>Lens Material: {lens_material}</Card.Text>
          <Card.Text>Prescription Possible: {prescription_possible}</Card.Text>
          <Card.Text>Copy Type: {copy_type}</Card.Text>
          <Card.Text>
            Color: {variants.map(variant => {
              const totalStock = variant.inventory.reduce((acc, curr) => acc + curr.stock, 0);
              return `${variant.color} (Stock: ${totalStock})`;
            }).join(', ') || 'N/A'}
          </Card.Text>
          <div className="d-flex justify-content-between mt-3 gap-3">
            <Button variant="primary d-flex gap-2" onClick={gotoSunglassEditPage}>
              <Edit2 /> Manage
            </Button>
            <Button variant="danger d-flex gap-2" onClick={deleteSunglass}>
              <Trash2 /> Delete
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default SunglassSummaryCard;