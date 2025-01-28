import { validateBasicAttributes, validateImages } from "./validatorHelper";

const validateSunglassVariants = (variants) => {
    try {
        if (!variants || variants.length === 0) {
            return { isValid: false, message: 'Please add at least one variant.' };
        }
        for (const variant of variants) {
            if (!variant.color || !variant.lensColor || !variant.inventory || variant.inventory.length === 0) {
                return { isValid: false, message: 'Please fill in all variant fields.' };
            }
            // Optionally, you can also check if the inventory objects have valid properties
            for (const inventoryItem of variant.inventory) {
                if (!inventoryItem.stock || inventoryItem.stock == 0 || !inventoryItem.location) {
                    return { isValid: false, message: 'Please fill in all inventory fields.' };
                }
            }
        }
        return { isValid: true };
    }
    catch (error) {
        console.error('Error validating sunglass variants:', error);
        return { isValid: false, message: error.message };
    }
}

export const ValidateAllSunglassData = (basicAttributes, variants, images) => {
    try {
        const basicAttributesValidation = validateBasicAttributes(basicAttributes);
        if (!basicAttributesValidation.isValid) return basicAttributesValidation;

        const sunglassVariantsValidation = validateSunglassVariants(variants);
        if (!sunglassVariantsValidation.isValid) return sunglassVariantsValidation;

        const imagesValidation = validateImages(images);
        if (!imagesValidation.isValid) return imagesValidation;

        if (variants.length !== images.length) {
            return { isValid: false, message: 'The number of variants and images do not match. Contact Devs' };
        }

        return { isValid: true };
    } catch (error) {
        console.error('Error validating sunglass data:', error);
        return { isValid: false, message: error };
    }
}
