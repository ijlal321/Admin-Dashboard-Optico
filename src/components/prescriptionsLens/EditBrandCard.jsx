import React, { useEffect, useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { PencilSquare, CheckCircle, XCircle, Trash } from 'react-bootstrap-icons';
import { deleteImagesArray } from '@/utlis/uploadImages';
import { updateBrand, searchBrandByName, deleteBrand } from '@/utlis/prescriptionLensHelper';

const EditBrandCard = ({ selectedBrand, setSelectedBrand, setStatus }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(selectedBrand.name);

  // Handle saving changes
  const handleSave = async () => {

    try {
      setStatus({ status: 'saving', description: 'Updating...' });

      // validate new Name
      if (editName.trim() === '') {
        setStatus({ status: 'error', description: 'Name cannot be empty' });
        return;
      }

      // checking if brand name already exists
      const searchResult = await searchBrandByName(editName);
      if (searchResult.some(brand => brand.name.toLowerCase() == editName.toLowerCase())) {
        setStatus({ status: 'error', description: 'Item with this Brand name already exists' });
        return;
      }

      const updatedBrand = { ...selectedBrand, name: editName };

      // update brand
      const data = await updateBrand(updatedBrand);
      if (data.success) {
        setSelectedBrand(data.data);
        setStatus({ status: 'successful', description: 'New product saved successfully' });
        setIsEditing(false);
      } else {
        setStatus({ status: 'error', description: data.error });
      }
      
    } catch (error) {
      setStatus({ status: 'error', description: 'Failed to save new product' });
    }
  };

  // Handle canceling changes
  const handleCancel = () => {
    setIsEditing(false);
    setEditName(selectedBrand.name); // Revert to the original data
  };

  const handleDeleteBrand = async () => {
    // ask window if want to delete this brand
    if (window.confirm('Are you sure you want to delete this brand?')) {
      
      setStatus({ status: 'loading', description: 'Deleting images...' });

      const allImages = selectedBrand.products.reduce((acc, product) => {
        product.images.forEach(image => acc.push(image));
        return acc;
      }, []);

      // delete all images
      const { unSuccessful } = await deleteImagesArray(allImages);
      if (unSuccessful > 0) {
        setStatus({ status: 'finished', description: 'Failed to delete images. Try again' });
        return;
      }

      setStatus({ status: 'saving', description: 'Deleting brand...' });
      
      const data = await deleteBrand(selectedBrand.id);
      if (data.success) {
        setStatus({ status: 'successful', description: 'Brand deleted successfully' });
        setSelectedBrand(null);
      }
      else {
        setStatus({ status: 'error', description: data.error });
      }
    }
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5>Edit Brand Information</h5>
          </div>
          <div>
            {!isEditing ? (
              <>
                <PencilSquare size={20} onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }} />
                <Trash size={20} onClick={handleDeleteBrand} style={{ cursor: 'pointer', marginTop: "10px" }} />
              </>
            ) : (
              <>
                <CheckCircle size={20} onClick={handleSave} style={{ cursor: 'pointer', marginRight: '10px' }} />
                <XCircle size={20} onClick={handleCancel} style={{ cursor: 'pointer' }} />
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Form.Group>
          </Form>
        ) : (
          <div>
            <div>
              <strong>Name</strong> {editName}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default EditBrandCard;
