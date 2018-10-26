const constants = require('./constants');
const Filter = require('./filters.controller');

function exists (res, item) {
    if (!item) {
        res.status(constants.HTTP_CODES.NOT_FOUND).send();
        return false;
    }
    return true;
}

function initCallbacks () {
    return Object.assign({}, ...Object.keys(constants.HTTP_TIMED_EVENTS).map((key) => {
        return { [key]: [] };
    }));
}

class BaseController {
    constructor (Resource, findByCb) {
        this.Resource = Resource;
        this.filter = new Filter(this.Resource);
        this.findByCb = findByCb;
        this.callbacks = initCallbacks();
    }

    get () {
        return (req, res) => {
            let query = this.Resource.find({});
            this.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET].forEach(cb => cb(query));
            query = this.filter.applyFilters(req, query);
            query = this.filter.applySorting(req, query);
            query = this.filter.applyPagination(req, query);
            query.exec().then((items) => {
                this.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_GET].forEach(cb => cb(res, items));
                res.json(items);
            }).catch((err) => {
                res.status(constants.HTTP_CODES.INTERNAL_SERVER_ERROR).json(err);
            });
        }
    }

    getOne () {
        return (req, res) => {
            let query = this.Resource.findOne(this.findByCb(req));
            this.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET_ONE].forEach(cb => cb(query));
            query.exec().then((item) => {
                if (!exists(res, item)) return;
                this.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_GET_ONE].forEach(cb => cb(res, item));
                res.json(item);
            }).catch((err) => {
                res.status(constants.HTTP_CODES.INTERNAL_SERVER_ERROR).json(err);
            });
        }
    }

    create () {
        return (req, res) => {
            let item = this.Resource(req.body);
            this.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_CREATE].forEach(cb => cb(req, item));
            item.save().then((item) => {
                this.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_CREATE].forEach(cb => cb(res, item));
                res.json(item);
            }).catch((err) => {
                res.status(constants.HTTP_CODES.BAD_REQUEST).json(err);
            });
        }
    }

    update (userOptions) {
        let options = userOptions || { new: true, runValidators: true };

        return (req, res) => {
            let updateFields = this.Resource.updateFields ? this.Resource.updateFields(req.body) : req.body;
            let query = this.Resource.findOneAndUpdate(this.findByCb(req), { $set: updateFields }, options);

            this.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_UPDATE].forEach(cb => cb(query));
            query.exec().then((item) => {
                    this.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_UPDATE].forEach(cb => cb(res, item));
                    res.status(constants.HTTP_CODES.OK).json(item);
            }).catch((err) => {
                res.status(constants.HTTP_CODES.INTERNAL_SERVER_ERROR).json(err);
            });
        }
    }

    remove (userOptions) {
        let options = userOptions || {};

        return (req, res) => {
            let query = this.Resource.findOneAndRemove(this.findByCb(req), options);
            this.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_REMOVE].forEach(cb => cb(query));
            query.exec().then((item) => {
                this.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_REMOVE].forEach(cb => cb(res, item));
                res.status(constants.HTTP_CODES.OK).json(item);
            }).catch((err) => {
                res.status(constants.HTTP_CODES.INTERNAL_SERVER_ERROR).json(err);
            });
        }
    }
}

module.exports = BaseController;