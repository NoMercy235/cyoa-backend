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
        return async (req, res) => {
            let query = this.Resource.find({});
            query = this.filter.applyFilters(req, query);
            query = this.filter.applySorting(req, query);
            query = this.filter.applyPagination(req, query);
            try {
                await Promise.all(this.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET].map(cb => cb(query)));
                const items = await query.exec();
                await Promise.all(this.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_GET].map(cb => cb(res, items)));
                res.json(items);
            } catch (err) {
                res.status(constants.HTTP_CODES.INTERNAL_SERVER_ERROR).json(err);
            }
        }
    }

    getOne () {
        return async (req, res) => {
            let query = this.Resource.findOne(this.findByCb(req));
            try {
                await Promise.all(this.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET_ONE].map(cb => cb(query)));
                const item = await query.exec();
                if (!exists(res, item)) return;
                await Promise.all(this.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_GET_ONE].map(cb => cb(res, item)));
                res.json(item);
            } catch (err) {
                res.status(constants.HTTP_CODES.INTERNAL_SERVER_ERROR).json(err);
            }
        }
    }

    create () {
        return async (req, res) => {
            let item = this.Resource(req.body);
            try {
                await Promise.all(this.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_CREATE].map(cb => cb(req, item)));
                const dbItem = await item.save();
                await Promise.all(this.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_CREATE].map(cb => cb(res, dbItem)));
                res.json(dbItem);
            } catch (err) {
                res.status(constants.HTTP_CODES.BAD_REQUEST).json(err);
            }
        }
    }

    update (userOptions) {
        const options = userOptions || { new: true, runValidators: true };

        return async (req, res) => {
            const updateFields = this.Resource.updateFields ? this.Resource.updateFields(req.body) : req.body;
            let query = this.Resource.findOneAndUpdate(this.findByCb(req), { $set: updateFields }, options);
            try {
                await Promise.all(this.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_UPDATE].map(cb => cb(query)));
                const item = await query.exec();
                if (!exists(res, item)) return;
                await Promise.all(this.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_UPDATE].map(cb => cb(res, item)));
                res.status(constants.HTTP_CODES.OK).json(item);
            } catch (err) {
                res.status(constants.HTTP_CODES.INTERNAL_SERVER_ERROR).json(err);
            }
        }
    }

    remove (userOptions) {
        const options = userOptions || {};

        return async (req, res) => {
            let query = this.Resource.findOneAndRemove(this.findByCb(req), options);
            try {
                await Promise.all(this.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_REMOVE].map(cb => cb(query)));
                const item = await query.exec();
                await Promise.all(this.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_REMOVE].map(cb => cb(res, item)));
                res.status(constants.HTTP_CODES.OK).json(item);
            } catch (err) {
                res.status(constants.HTTP_CODES.INTERNAL_SERVER_ERROR).json(err);
            }
        }
    }

    createCustomHandler (cb) {
        return async (req, res) => {
            try {
                const result = await cb(req, res);
                res.status(constants.HTTP_CODES.OK).json(result);
            } catch (err) {
                res.status(constants.HTTP_CODES.INTERNAL_SERVER_ERROR).json(err);
            }
        }
    }
}

module.exports = BaseController;