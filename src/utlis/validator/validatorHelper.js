
// Check if any basic attribute is empty
export const validateBasicAttributes = (basicAttributes) => {
    for (const key in basicAttributes) {
        if (key === 'tags') continue;
        if (!basicAttributes[key] || (Array.isArray(basicAttributes[key]) && basicAttributes[key].length === 0)) {
            return { isValid: false, message: `Please fill in the ${key} field.` };
        }
    }
    return { isValid: true };
};

// Check if there are at least 2 images in each variant
export const validateImages = (images) => {
    for (const variantImages of images) {
        if (variantImages.length < 2) {
            return { isValid: false, message: 'Please upload at least 2 images for each variant.' };
        }
    }
    return { isValid: true };
}