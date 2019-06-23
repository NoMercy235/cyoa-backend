const constants = require('./constants');
const Filter = require('./filters.controller');

function exists (res, item) {
    if (!item) {
        res.sendStatus(constants.HTTP_CODES.NOT_FOUND);
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
            const ignoreFields = BaseController.getIgnoreFields(this.Resource.ignoreFieldsInList, req.query.ignoreFields);
            let query = this.Resource.find({}, ignoreFields);
            query = this.filter.applyFilters(req, query);
            query = this.filter.applySorting(req, query);
            try {
                await Promise.all(this.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET].map(cb => cb(req, query)));
                const items = req.query.pagination
                    ? await this.filter.applyPagination(req.query.pagination, query)
                    : await query.exec();
                await Promise.all(this.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_GET].map(cb => cb(req, items)));
                res.json(items);
            } catch (err) {
                BaseController.onError(err, res);
            }
        }
    }

    getOne () {
        return async (req, res) => {
            const ignoreFields = BaseController.getIgnoreFields(req.query.ignoreFields);
            let query = this.Resource.findOne(this.findByCb(req), ignoreFields);
            try {
                await Promise.all(this.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_GET_ONE].map(cb => cb(req, query)));
                const item = await query.exec();
                if (!exists(res, item)) return;
                await Promise.all(this.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_GET_ONE].map(cb => cb(req, item)));
                res.json(item);
            } catch (err) {
                BaseController.onError(err, res);
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
                BaseController.onError(err, res);
            }
        }
    }

    createMany () {
        return async (req, res) => {
            let items = req.body;
            try {
                await Promise.all(this.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_CREATE_MANY].map(cb => cb(req, items)));
                const dbItems = await Promise.all(items.map(async item => {
                    const resourceItem = this.Resource(item);
                    return await resourceItem.save();
                }));
                await Promise.all(this.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_CREATE_MANY].map(cb => cb(res, dbItems)));
                res.json(dbItems);
            } catch (err) {
                BaseController.onError(err, res);
            }
        }
    }

    update (userOptions) {
        const options = userOptions || { new: true, runValidators: true };

        return async (req, res) => {
            const updateFields = this.Resource.updateFields ? this.Resource.updateFields(req.body) : req.body;
            let query = this.Resource.findOneAndUpdate(this.findByCb(req), { $set: updateFields }, options);
            try {
                await Promise.all(this.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_UPDATE].map(cb => cb(req, req.body, query)));
                const item = await query.exec();
                if (!exists(res, item)) return;
                await Promise.all(this.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_UPDATE].map(cb => cb(req, item)));
                res.status(constants.HTTP_CODES.OK).json(item);
            } catch (err) {
                BaseController.onError(err, res);
            }
        }
    }

    remove (userOptions) {
        const options = userOptions || {};

        return async (req, res) => {
            let query = this.Resource.findOneAndRemove(this.findByCb(req), options);
            try {
                await Promise.all(this.callbacks[constants.HTTP_TIMED_EVENTS.BEFORE_REMOVE].map(cb => cb(req, query)));
                const item = await query.exec();
                if (!exists(res, item)) return;
                await Promise.all(this.callbacks[constants.HTTP_TIMED_EVENTS.AFTER_REMOVE].map(cb => cb(req, item)));
                res.status(constants.HTTP_CODES.OK).json(item);
            } catch (err) {
                BaseController.onError(err, res);
            }
        }
    }

    createCustomHandler (cb) {
        return async (req, res) => {
            try {
                const result = await cb(req, res);
                res.status(constants.HTTP_CODES.OK).json(result);
            } catch (err) {
                BaseController.onError(err, res);
            }
        }
    }

    static getIgnoreFields (...arr) {
        return arr
            .map(a => {
                if (typeof a === 'string') a = a.split(',');
                return (a || []).map(f => '-' + f).join(' ')
            })
            .filter(val => val);
    }

    static onError (err, res) {
        console.error(err);
        const {
            status = constants.HTTP_CODES.INTERNAL_SERVER_ERROR,
            message,
        } = err;
        res.status(status).json(message || err);
    }
}

module.exports = BaseController;
