

export const searchBrandByName = async(brandInput) =>{
    try {
        const response = await fetch(`/api/prescriptionLens/search?search=${brandInput}`);
        const data = await response.json();

        if (data.success) {
            return data.data;
        } else {
            // throw error
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

export const searchBrandById = async(brandId) =>{
    try {
        const response = await fetch(`/api/prescriptionLens/${brandId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        return {success: false, error: `Failed to search brand. Error ${error}`};
    }
}

export const addNewBrand = async (newBrand) => {
    try {
        const response = await fetch('/api/prescriptionLens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBrand),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding prescription lens:', error);
        return {success: false, error: `Failed to add brand. Error ${error}`};
    }
}


export const updateBrand = async (updatedBrand) => {
    try {
        const response = await fetch('/api/prescriptionLens', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedBrand),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding prescription lens:', error);
        return {success: false, error: `Failed to add brand. Error ${error}`};
    }
}


export const deleteBrand = async (brandId) => {
    try {
        const response = await fetch('/api/prescriptionLens', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: brandId }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting brand:', error);
        return {success: false, error: `Failed to delete brand. Error ${error}`};
    }
}
