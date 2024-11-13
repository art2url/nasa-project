const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0; // mongo returns all documents of the collection if set 0

function getPagination(query) {
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT; // returns absolute value of the number (only positive) also converts to number
    const skip = (page - 1) * limit;

    return {
        skip,
        limit,
    };
}

module.exports = {
    getPagination,
};
