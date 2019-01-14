const mapFilter = {
    'like': (query, field, val) => query.find({[field]: { $regex: '.*' + val + '.*' }}),
    'equals': (query, field, val) => query.find({[field]: val }),
    'lt': (query, field, val) => query.find({[field]: { $lt: val }}),
    'lte': (query, field, val) => query.find({[field]: { $lte: val }}),
    'gt': (query, field, val) => query.find({[field]: { $gt: val }}),
    'gte': (query, field, val) => query.find({[field]: { $gte: val }}),
    'in': (query, field, val) => query.find({[field]: { $in: val }}),
};

class Filter {
    constructor(resource) {
        this.resource = resource;
        this.allowedFields = this.resource.getAllowedFilters ? this.resource.getAllowedFilters() : [];
        this.allowedSort = this.resource.getAllowedFilters ? this.resource.getAllowedFilters() : [];
    }

    applyFilters(req, query) {
        if (!req.query.filter) return query;

        Object.keys(req.query.filter)
            .filter((key) => this.allowedFields.find(k => k === key))
            .map((key) => {
                const filter = req.query.filter[key];
                return { key, filter, options: filter.options ? JSON.parse(filter.options) : {} };
            })
            .filter(({ filter, options }) =>  {
                return options && options.allowEmpty ? true : filter.value;
            })
            .forEach(({ key, filter }) => {
                query = mapFilter[filter.op](query, key, filter.value);
            });
        return query;
    }

    applySorting(req, query) {
        if (!req.query.sort || this.allowedSort.indexOf(req.query.sort.field) === -1) return query;
        return query.sort({ [req.query.sort.field]: req.query.sort.order });
    }

    applyPagination(req, query) {
        if (!req.query.pagination) return query;
        const page = +req.query.pagination.page;
        const limit = +req.query.pagination.limit;

        return query.skip(page * limit).limit(limit);
    }
}

module.exports = Filter;
