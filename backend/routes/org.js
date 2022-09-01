import express from "express";
import { optionalJwtAuth } from "../middleware/auth.js";
import orgService from "../services/orgService.js";
let router = express.Router();

// @desc    Searching org
// @route   POST /org/search
router.post('/search', optionalJwtAuth, async function (req, res, next) {
    try {
        const { place_id } = req.body;
        let existingOrg = await orgService.checkExistOrg(place_id);
        if (existingOrg) {
            res.status(200);
            res.json(existingOrg);
            return res.end();
        }
        else {
            if (req.user) {
                await orgService.addOrg(place_id).then((newOrg) => {
                    if (!newOrg) {
                        res.status(500);
                        return res.end();
                    }
                    else {
                        res.status(200);
                        res.json(newOrg);
                        return res.end();
                    }
                })
                    .catch(err => {
                        throw (err);
                    });
            }
            else {
                res.status(404);
                res.json("Org Not Found");
                return res.end();
            }
        }
    }
    catch (e) {
        next(e);
    }
});

export default router;
