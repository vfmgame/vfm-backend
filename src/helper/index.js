const crypto = require("crypto");
const moment = require("moment");
const { generateUniqueId, generateOrderId, generateReference } = require("./generateIdHelper");
const { sendResponse } = require("./ResponseHelper");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./userHelper");
const generateRandomNDigits = require("./tokenGenerator");
const { encrypt, decrypt } = require("./encryption");
const prepStream = require("./eventStream")


// const EXTEND_PERIOD = (
// 	amount,
// 	interval,
// 	CURRENT_PERIOD = new Date()
// ) => moment(CURRENT_PERIOD)
// 	.add(Number(amount), interval)
// 	.toDate();

	/**
 * Generate a random crypto token.
 * @param length
 * @returns {string}
 */
const cryptoTokenBuffer = (length = 56) => crypto.randomBytes(length)
.toString('hex');

module.exports = {
	sendResponse,
    generateUniqueId,
	generateReference,
	generateOrderId,
    cryptoTokenBuffer,
	addUser,
	removeUser,
	getUser,
	getUsersInRoom,
	encrypt,
	decrypt,
	prepStream,
	generateRandomNDigits
}