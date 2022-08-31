import express from "express";
import { ensureLoggedIn } from "../middleware/auth.js";
import reviewService from "../services/reviewService.js";
let router = express.Router();

// @desc    Returns signed URL for Multimedia and filename
// @route   POST /review/multimedia
router.post('/multimedia', ensureLoggedIn(), async function (req, res, next) {
    const { filetype } = req.body;
    let output = await reviewService.getSignedURL(filetype);
    res.json(output);
});

// @desc    Add Review
// @route   POST /review/add
router.post('/add', ensureLoggedIn(), async function (req, res, next) {
    const review = req.body;
    await reviewService.addReview(review, req.user.id);
    res.json("added");
});

// @desc    Get reviews by user
// @route   GET /review/byuser/:id
router.get('/byuser/:id', ensureLoggedIn(), async function (req, res, next) {
    const userID = req.params.id;
    let reviews = await reviewService.getReviews(userID, "user");
    res.json(reviews);
});

// @desc    Get reviews by org
// @route   GET /review/byorg/:id
router.get('/byorg/:id', ensureLoggedIn(), async function (req, res, next) {
    const orgID = req.params.id;
    let reviews = await reviewService.getReviews(orgID, "org");
    res.json(reviews);
});

export default router;
