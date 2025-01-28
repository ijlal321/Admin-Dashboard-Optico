import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { PencilSquare, CheckCircle, XCircle } from 'react-bootstrap-icons';

const EditableCard = ({ data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...data });

  // Handle changes to the fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle saving changes
  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically call a function to save the changes to the server or parent component
    console.log('Saved data:', editData);
  };

  // Handle canceling changes
  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...data }); // Revert to the original data
  };

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5>Editable Card</h5>
          </div>
          <div>
            {!isEditing ? (
              <PencilSquare size={20} onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }} />
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
            {Object.keys(editData).map((key) => (
              <Form.Group key={key} className="mb-3">
                <Form.Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Form.Label>
                <Form.Control
                  type="text"
                  name={key}
                  value={editData[key]}
                  onChange={handleChange}
                />
              </Form.Group>
            ))}
          </Form>
        ) : (
          <div>
            {Object.keys(data).map((key) => (
              <div key={key}>
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {data[key]}
              </div>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default EditableCard;
