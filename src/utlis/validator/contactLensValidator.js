export const ContantLensValidation = (lens) => {
    if (lens.colors.length < 1) {
        alert('Please add at least one color');
        return false;
    }
    return true;
}

export const validateInvntory = (inventory) => {
    // given inventory is a list of items like this
    // [
    //     { power:'', quantity: '0' },
    //     { power:'', quantity: '0' }
    // ]
    // make sure no duplicates (power) are present
    const uniqueCheck = new Set();
    for (const item of inventory) {
        // check nothin is ''
        if (item.power === '' || parseInt(item.quantity, 10) == 0) {
            return { success: false, error: 'All fields are required' };
        }
        const key = item.power;
        if (uniqueCheck.has(key)) {
            return { success: false, error: 'Duplicate inventory found' };
        }
        uniqueCheck.add(key);
    }
    return { success: true};
}