const mapFilter = {
    'like': (field, val) => { return {[field]: { $regex: '.*' + val + '.*' }} },
    'ilike': (field, val) => { return { [field]: { $regex: new RegExp('.*' + val + '.*', "i") } } },
    'equals': (field, val) => { return { [field]: val }; },
    'lt': (field, val) => { return { [field]: { $lt: val } }; },
    'lte': (field, val) => { return { [field]: { $lte: val } }; },
    'gt': (field, val) => { return { [field]: { $gt: val } }; },
    'gte': (field, val) => { return { [field]: { $gte: val } }; },
    'in': (field, val, options = {}) => { return { [field]: { $in: val.split(options.splitter || ',') } }; },
};

const isOrFilter = filter => !!filter.$or;

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

        const parsedFilters = Object.keys(filter)
            .filter((key) => this.allowedFields.find(k => k === key))
            .map((key) => {
                const f = filter[key];
                return { key, f, options: f.options ? JSON.parse(f.options) : {} };
            })
            .filter(({ f, options }) =>  {
                return options
                    ? (options.allowEmpty ? true : f.value)
                    : true;
            });

        if (!parsedFilters.length) return query;

        if (isOrFilter(filter)) {
            query = query.find({
                $or: parsedFilters.map(({ key, f }) => {
                    return mapFilter[f.op](key, f.value, f.options);
                }),
            });
        } else {
            parsedFilters.forEach(({ key, f }) => {
                query = query.find(mapFilter[f.op](key, f.value, f.options));
            });
        }
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
