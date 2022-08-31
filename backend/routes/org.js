import express from "express";
import { ensureLoggedIn } from "../middleware/auth.js";
import orgService from "../services/orgService.js";
let router = express.Router();

// @desc    Searching org
// @route   POST /org/search
router.post('/search', ensureLoggedIn(), async function (req, res, next) {
    const { place_id } = req.body;
    let output = await orgService.getOrg(place_id);
    res.json(output);
});

export default router;
