// const { monotonicFactory } = require("ulid");
// const ulid = monotonicFactory();
const { customAlphabet } = require("nanoid/async");
/**
 * This generates an alphanumeric ID,
 * based on the number of characters provided.
 * @param {Number} length
 * @returns String
 */

// const generateUniqueId = () => {
// 	return String(ulid()).toLowerCase();
// }


const generateUniqueId = () => {
	const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 12);
	return nanoid();
}

const generateReference = () => {
	const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 12);
	return nanoid();
}

const generateOrderId = () => {
	const nanoid = customAlphabet("0123456789", 7);
	return nanoid();
}


module.exports = {
	generateUniqueId,
	generateReference,
	generateOrderId
}