/**
 * Converts a flat list of categories into a hierarchical tree structure.
 * @param {Array} categories - Array of category objects with id and parent_id.
 * @returns {Array} - Array of root category objects with children array.
 */
export const buildCategoryTree = (categories) => {
    const map = {};
    const tree = [];

    // First pass: Create a map of all categories
    categories.forEach(cat => {
        map[cat.id] = { ...cat, children: [] };
    });

    // Second pass: Populate children arrays and root level
    categories.forEach(cat => {
        if (cat.parent_id) {
            if (map[cat.parent_id]) {
                map[cat.parent_id].children.push(map[cat.id]);
            }
        } else {
            tree.push(map[cat.id]);
        }
    });

    return tree;
};
