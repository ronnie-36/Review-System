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

export default router;
