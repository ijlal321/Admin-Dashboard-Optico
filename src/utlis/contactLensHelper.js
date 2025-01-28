

export const searchBrandByName = async(brandInput) =>{
    try {
        const response = await fetch(`/api/contactLens/search?search=${brandInput}`);
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
        const response = await fetch(`/api/contactLens/${brandId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        return {success: false, error: `Failed to search brand. Error ${error}`};
    }
}

export const addNewBrand = async (newBrand) => {
    try {
        const response = await fetch('/api/contactLens', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newBrand),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding contact lens:', error);
        return {success: false, error: `Failed to add brand. Error ${error}`};
    }
}


export const updateBrand = async (updatedBrand) => {
    try {
        const response = await fetch('/api/contactLens', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedBrand),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding contact lens:', error);
        return {success: false, error: `Failed to add brand. Error ${error}`};
    }
}


export const deleteBrand = async (brandId) => {
    try {
        const response = await fetch('/api/contactLens', {
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

export const getAllBrands = async () => {
    try {
        const response = await fetch('/api/contactLens');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return {success: false, error: `Failed to fetch brands. Error ${error}`};
    }
}
