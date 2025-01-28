

export function prepareNewFrameData(basicAttributes, variants, images) {

    const newVariants = [...variants];

    variants.forEach((variant, index) => {
        newVariants[index].images = images[index];
    });

    const newFrame = {
        ...basicAttributes,
        variants: variants,
    };
    return newFrame;

}