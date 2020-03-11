const router = require('express').Router();
const controller = require('./user.public.controller');

router.get('/overview/:id', controller.getUserOverview);
router.get('/profilePicture/:id', controller.getProfilePicture);

module.exports = router;
