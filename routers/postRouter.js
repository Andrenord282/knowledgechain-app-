const multer = require('multer');
const Router = require('express');
const postController = require('../controllers/postController');
const router = new Router();

const storage = multer.memoryStorage();

const upload = multer({
	dest: 'uploads/',
	limits: {
		files: 10,
	},
	storage: storage,
});

router.post('/', upload.any(), postController.createPost);
router.get('/', postController.getPosts);
// router.get('/:id');

module.exports = router;
