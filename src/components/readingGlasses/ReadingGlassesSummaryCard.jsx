"use client";

import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Edit2, Trash2 } from 'lucide-react';
import { deleteVariantsImages } from '@/utlis/uploadImages';

function ReadingGlassesSummmaryCard({ readingGlass, setStatus }) {
  const [powerSummary, setPowerSummary] = useState(null);
  const {
    _id = "N/A",
    id = 'N/A',
    images = [[]],
    brand = 'Unknown',
    shape = [],
    material = [],
    sex = [],
    tags = [],
    price = 'N/A',
    discount = 0,
    variants = []
  } = readingGlass;

  useEffect(() => {
    // for a given reading glass, it would get totalStock correscponding to each power
    const powerSummary = {};
    variants.forEach(variant => {
      variant.inventory.forEach(inventory => {
        const { power, stock } = inventory;
        if (stock == 0) return;
        if (powerSummary[power]) {
          powerSummary[power] += stock;
        } else {
          powerSummary[power] = stock;
        }
      });
    });
    setPowerSummary(powerSummary);
  }, [variants]);


  const gotoReadingGlassEditPage = () => {
    // redirect to frame edit page
    window.location.href = `/manage-reading-glass/edit/${id}`;
  };

  const deleteReadingGlass = async () => {
    if (!window.confirm('Are you sure you want to delete this Reading Glass?')) {
      setStatus({ status: 'error', description: 'Reading Glass not deleted' });
      return;
    }
    // delete reading glass
    try {
      setStatus({ status: 'loading', description: 'Deleting Reading Glass...' });

      // delete images from cloudinary
      const { total, unSuccessful } = await deleteVariantsImages(variants);
      if (unSuccessful > 0) {
        setStatus({ status: 'error', description: `Failed to delete ${unSuccessful} images out of ${total} images` });
        return;
      }

      // delete data from database
      const res = await fetch('/api/readingGlass', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ _id })
      });
      const data = await res.json();
      if (data.success) {

        setStatus({ status: 'successful', description: 'Reading Glass deleted successfully' });
        // window.location.reload();
        setPowerSummary(null); //to not show the deleted reading glass
      } else {
        setStatus({ status: 'error', description: data.error });
      }
    } catch (error) {
      console.error('Error deleting Reading Glass:', error);
      setStatus({ status: 'error', description: error });
    }
  };

  if (!powerSummary) return null;

  return (
    <div className="frame-summary-card">
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

          <Card.Text>
            Color: {variants.map(variant => {
              const totalStock = variant.inventory.reduce((acc, curr) => acc + curr.stock, 0);
              return `${variant.color} (Stock: ${totalStock})`;
            }).join(', ') || 'N/A'}
          </Card.Text>

          <Card.Title>
            Combined Power Summary:
          </Card.Title>
          <table className="table table-bordered mt-2">
            <thead>
              <tr>
                <th>Power</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {powerSummary ? Object.keys(powerSummary).map(power => (
                <tr key={power}>
                  <td>{power}</td>
                  <td>{powerSummary[power]}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="2">N/A</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="d-flex justify-content-between mt-3 gap-3">
            <Button variant="primary d-flex gap-2" onClick={gotoReadingGlassEditPage}>
              <Edit2 /> Manage
            </Button>
            <Button variant="danger d-flex gap-2" onClick={deleteReadingGlass}>
              <Trash2 /> Delete
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ReadingGlassesSummmaryCard;