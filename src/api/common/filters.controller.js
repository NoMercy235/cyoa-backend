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
        this.defaultFilter = this.resource.getDefaultFilter ? this.resource.getDefaultFilter() : {};
        this.defaultSort = this.resource.getDefaultSort ? this.resource.getDefaultSort() : {};
        this.allowedFields = this.resource.getAllowedFilters ? this.resource.getAllowedFilters() : [];
        this.allowedSort = this.resource.getAllowedSort ? this.resource.getAllowedSort() : [];
    }

    applyFilters(req, query) {
        const filter = req.query.filter || this.defaultFilter;
        if (!filter || Object.keys(filter).length === 0) return query;

        Object.keys(filter)
            .filter((key) => this.allowedFields.find(k => k === key))
            .map((key) => {
                const f = filter[key];
                return { key, f, options: f.options ? JSON.parse(f.options) : {} };
            })
            .filter(({ f, options }) =>  {
                return options && options.allowEmpty ? true : f.value;
            })
            .forEach(({ key, f }) => {
                query = mapFilter[f.op](query, key, f.value);
            });
        return query;
    }

    applySorting(req, query) {
        const sort = req.query.sort || this.defaultSort;
        if (!sort || this.allowedSort.indexOf(sort.field) === -1) return query;
        return query.sort({ [sort.field]: sort.order });
    }

    applyPagination(req, query) {
        if (!req.query.pagination) return query;
        const page = +req.query.pagination.page;
        const limit = +req.query.pagination.limit;

        return query.skip(page * limit).limit(limit);
    }
}

module.exports = Filter;
