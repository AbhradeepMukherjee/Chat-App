const express = require("express");

const {protect} = require('../middlewares/authMiddlewares.js');
const { accessChats, fetchChats, createGroupChats, renameGroupChats, removeFromGroup, addToGroup } = require("../controllers/chatControllers.js");
const router = express.Router();

router.route("/").post(protect, accessChats);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChats);
router.route("/rename").put(protect, renameGroupChats);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").post(protect, addToGroup);

module.exports = router;

