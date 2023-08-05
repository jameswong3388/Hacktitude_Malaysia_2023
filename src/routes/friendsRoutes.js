import express from "express";
import friendsService from "../services/friendsService.js";
import HttpStatus from "../enums/httpStatus.js";
const router = express.Router();

router.get("/:id/suggestions", async (req, res) => {
    const id = req.params.id;
    const response = await friendsService.getSuggestedFriends(id);
    if (response.status == HttpStatus.NOT_FOUND) {
        res.status(response.status).json({ message: "User Not Found" });
    } else {
        res.status(response.status).json(response);
    }
});

router.post("/request", async (req, res) => {
    const data = req.body;
    const response = await friendsService.sendReq(data);
    if (response.error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: response.error.message,
        });
    }
    if (response == HttpStatus.BAD_REQUEST) {
        res.status(HttpStatus.BAD_REQUEST).json({
            message: "Request already received!",
        });
    } else if (response == HttpStatus.FORBIDDEN) {
        res.status(HttpStatus.FORBIDDEN).json({
            message: "Request already sent!",
        });
    } else {
        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            response: response,
        });
    }
});

router.get("/:id/sent-requests", async (req, res) => {
    const id = req.params.id;
    const response = await friendsService.viewSentReqs(id);
    res.status(response.status).json(response);
});

router.get("/:id/received-requests", async (req, res) => {
    const id = req.params.id;
    const response = await friendsService.viewPendingReqs(id);
    res.status(response.status).json(response);
});

router.put("/:id/accept-request", async (req, res) => {
    const id = req.params.id;
    const response = await friendsService.acceptReq(id);
    res.status(response.status).json(response);
});

router.delete("/:id/reject-request", async (req, res) => {
    const id = req.params.id;
    const response = await friendsService.rejectReq(id);
    res.status(response.status).json(response);
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const response = await friendsService.viewFriends(id);
    res.status(response.status).json(response);
});

export default router;
