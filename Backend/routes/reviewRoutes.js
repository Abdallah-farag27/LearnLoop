const reviewController = require("../controller/ReviewsController");
const Auth = require("../middleware/auth");
const router = require("express").Router({ mergeParams: true });

router.use(Auth.auth);

router.route('/')
.get(reviewController.getAllReviews)
.post(reviewController.createReview)


router.route('/:reviewId')
.get(reviewController.getReviewbyId)
.patch(reviewController.updateReview)
.delete(reviewController.deleteReview)

module.exports = router;
