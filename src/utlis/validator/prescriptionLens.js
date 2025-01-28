export const validateInvntory = (inventory) => {
    // given inventory is a list of items like this
    // [
    //     { sph: '', cyl: '', quantity: '0' },
    //     { sph: '', cyl: '', quantity: '0' }
    // ]
    // make sure no duplicates (sph + cyl) are present
    const uniqueCheck = new Set();
    for (const item of inventory) {
        // check nothin is ''
        if (item.sph === '' || item.cyl === '' || parseInt(item.quantity, 10) == 0) {
            return { success: false, error: 'All fields are required' };
        }
        const key = item.sph + item.cyl;
        if (uniqueCheck.has(key)) {
            return { success: false, error: 'Duplicate inventory found' };
        }
        uniqueCheck.add(key);
    }
    return { success: true};
}