const express = require("express");
const router = express.Router();
const makeUploader = require("../middlewares/cloudUpload");
const hotelController = require("../controllers/hotelController");
const { auth ,isAdmin} = require("../middlewares/auth");
// Specific uploader for hotels
const hotelUpload = makeUploader("hoteluploads");

router.post("/",auth,isAdmin, hotelUpload.array("images", 10), hotelController.createHotel);
router.post("/list",hotelController.getAllHotels);
router.get("/:id",auth, hotelController.getHotelById);
router.put("/:id",auth,isAdmin, hotelUpload.array("images", 10), hotelController.updateHotel);
router.delete("/:id",auth,isAdmin, hotelController.deleteHotel);

module.exports = router;

