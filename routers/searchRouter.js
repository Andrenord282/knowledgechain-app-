const Router = require('express');
const searchController = require('../controllers/searchController');
const router = new Router();

router.get('/:value', searchController.search);

module.exports = router;
