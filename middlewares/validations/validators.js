const { body } = require("express-validator");

// Posting Hotel Validation
exports.hasPinCode=body("address.pincode").isLength({min:6,max:6}).withMessage("PinCode Should be of 6 digits only");

exports.hasCity = body("address.city").exists().withMessage("Address should contain city");

exports.hasState = body("address.state").exists().withMessage("Address should contain State");

exports.hasType = body("type").exists().withMessage("Room Types should be present");

exports.hasName = body("name").exists().withMessage("Name of hotel should be present");

//User Signup Validation
exports.hasUserName = body("name").exists().withMessage("Name of user should be present");

exports.isEmail = body("email").isEmail().withMessage("Email field must contain a correct email");

exports.hasPassword = body("password").exists().withMessage("Password cannot be empty.");

//booking request Validation
exports.hasAfter=body("after").exists().isNumeric().withMessage("after field must be present in numeric type")

exports.hasTill=body("till").exists().isNumeric().withMessage("till field must be present in numeric type")

exports.hasNo=body("number").exists().isNumeric().withMessage("number field must be present in numeric type")
