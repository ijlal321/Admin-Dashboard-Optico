import React, { useEffect } from 'react'
import FieldWithOptionsInput from "./FieldWithOptionsInput";
import { SendToBack } from 'lucide-react';

function BasicAtributesForm({ basicAttributesData, basicAttributes, setBasicAttributes }) {
    useEffect(() => {
        // if it is null, or empty, then set it to default values
        if (!(basicAttributes == null || Object.keys(basicAttributes).length == 0)) {
            return;
        }

        const newAttributes = {};
        Object.entries(basicAttributesData).map(([field, data], index) => {
            if (data.multi){
                newAttributes[field] = [];
            }else{
                newAttributes[field] = "";
            }
        });
        setBasicAttributes(newAttributes);
    }, []);

    const updateField = (field, newValue) => {
        setBasicAttributes((prevState) => ({
            ...prevState,
            [field]: newValue
        }));
    }

    return (
        <div className="row">
            {Object.keys(basicAttributes).length > 0 && Object.entries(basicAttributesData).map(([fieldName, properties], index) => {
                return <FieldWithOptionsInput inputValue={basicAttributes[fieldName]} properties={properties} updateField={(newValue)=>updateField(fieldName, newValue)} key={index} />
            })}
        </div>
    )
}

export default BasicAtributesForm