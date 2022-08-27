import express from "express";
import { ensureLoggedIn } from "../middleware/auth.js";
import reviewService from "../services/reviewService.js";
let router = express.Router();

// @desc    Get signed URL for Multimedia
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

export default router;
