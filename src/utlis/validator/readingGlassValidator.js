import { validateBasicAttributes, validateImages } from "./validatorHelper";

const validateReadingGlassVariants = (variants) => {
    if (!variants || variants.length === 0) {
        return {isValid: false, message: `Please add at least one variant.`};
    }

    for (const variant of variants) {
        if (!variant.color || variant.color.length == 0  || !variant.inventory || variant.inventory.length === 0) {
            return{isValid: false, message: `Please fill in all variant fields.`};
        }

        // Optionally, you can also check if the inventory objects have valid properties
        for (const inventoryItem of variant.inventory) {
            if (!inventoryItem.stock || !inventoryItem.location || !inventoryItem.power) {
                return {isValid: false, message: `Please fill in all inventory fields.`};
            }
        }
    }
    return {isValid: true};
}





export const ValidateAllReadingGlassData = (basicAttributes, variants, images) => {
    const basicAttributesValidation = validateBasicAttributes(basicAttributes);
    if (!basicAttributesValidation.isValid) return basicAttributesValidation;

    const frameVariantsValidation = validateReadingGlassVariants(variants);
    if (!frameVariantsValidation.isValid) return frameVariantsValidation;

    const imagesValidation = validateImages(images);
    if (!imagesValidation.isValid) return imagesValidation;

    if (variants.length !== images.length) {
        return { isValid: false, message: 'The number of variants and images do not match. Contact Devs' };
    }

    return { isValid: true };
}