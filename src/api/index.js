const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const postTemplateRoutes = require("./routes/postTemplate");
const prospectRoutes = require("./routes/prospect");
const carouselRoutes = require("./routes/carousel");
const teamRoutes = require("./routes/team");
const notificationRoutes = require("./routes/notification");
const rootRoutes = require("./routes/ai");
const contentWritingRoutes = require("./routes/contentWriting");
const linkedinRoutes = require("./routes/linkedin");
const workspaceRoutes = require("./routes/workspace");
const timeSlotInstanceRoutes = require("./routes/timeSlotInstance");
const timeSlotRoutes = require("./routes/timeSlot");
const stripeRoute = require("./routes/stripe");
const invoiceRoute = require("./routes/invoice");
const calendarRoute = require("./routes/calendar");
const webhook = require("./routes/webhook");


module.exports = {
	authRoutes,
	userRoutes,
	postRoutes,
	postTemplateRoutes,
	prospectRoutes,
	carouselRoutes,
	teamRoutes,
	notificationRoutes,
	rootRoutes,
	contentWritingRoutes,
	linkedinRoutes,
	workspaceRoutes,
	webhook,
	stripeRoute,
	invoiceRoute,
	calendarRoute,
	timeSlotRoutes,
	timeSlotInstanceRoutes
}