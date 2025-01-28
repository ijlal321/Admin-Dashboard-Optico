

export function prepareNewSunglassData(basicAttributes, variants, images) {
    try {
        const newVariants = [...variants];

        variants.forEach((variant, index) => {
            newVariants[index].images = images[index];
        });

        const newSunglass = {
            ...basicAttributes,
            variants: variants,
        };
        return newSunglass;
    }
    catch (error) {
        console.error('Error preparing new sunglass data', error);
        return null
    }
}