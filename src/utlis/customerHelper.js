

export const searchCustomer = async(name, phone) =>{
    try {
        const response = await fetch(`/api/customer/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, phone }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return {success: false, error: error};
    }
}

export const searchCustomerById = async(customerId) =>{
    try {
        const response = await fetch(`/api/customer/${customerId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        return {success: false, error: `Failed to search customer. Error ${error}`};
    }
}

export const addNewCustomer = async (newCustomer) => {
    try {
        const response = await fetch('/api/customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCustomer),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return {success: false, error: `Failed to add customer. Error ${error}`};
    }
}


export const updateCustomer = async (updatedCustomer) => {
    try {
        const response = await fetch('/api/customer', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCustomer),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return {success: false, error: `Failed to update customer. Error ${error}`};
    }
}


export const deleteCustomer = async (customerId) => {
    try {
        const response = await fetch('/api/customer', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: customerId }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return {success: false, error: `Failed to delete customer. Error ${error}`};
    }
}

// const [currentPrescription, setCurrentPrescription] = useState({
//     date: '',
//     doctor: '',
//     left_sph: '',
//     left_cyl: '',
//     left_axis: '',
//     left_vision: '',
//     right_sph: '',
//     right_cyl: '',
//     right_axis: '',
//     right_vision: '',
//     addition: '',
//     ipd: ''
// });

import doctors from "@/data/doctors.json";

export const prescriptionValidator = (prescription) => {
    const requiredFields = ['date', 'doctor', 'left_sph', 'left_cyl', 'left_axis', 'left_vision', 'right_sph', 'right_cyl', 'right_axis', 'right_vision', 'addition', 'ipd'];
    for (const field of requiredFields) {
        if (!prescription[field]) {
            return { success: false, message: `Please enter ${field.replace('_', ' ')}` };
        }
    }

    // check doctor
    if (!doctors.includes(prescription.doctor)) {
        return { success: false, message: 'Please select a valid doctor' };
    }

    return { success: true };
}
