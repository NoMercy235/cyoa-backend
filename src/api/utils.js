function searchById (id) {
    if (id.indexOf('-') > -1) {
        return { id };
    }
    return { _id: id };
}

function findByCb (req) {
    return searchById(req.params.id);
}

module.exports = {
    searchById,
    findByCb,
};
