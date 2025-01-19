require('dotenv')
	.config();


const Secrets = {
	PORT: process.env.PORT || 4000,
	HOST: process.env.HOST || "localhost",
	ENVIRONMENT: process.env.NODE_ENV || "local",
	DATABASE_LOCAL_URL: process.env.DATABASE_LOCAL_URL,
	DATABASE_LIVE_URL: process.env.DATABASE_LIVE_URL,
	DATABASE_NAME: process.env.DATABASE_NAME,
	JWT_TOKEN: process.env.JWT_TOKEN,
	LOCAL_BASE_URL: process.env.LOCAL_BASE_URL,
	LIVE_BASE_URL: process.env.LIVE_BASE_URL,
	STAGING_BASE_URL: process.env.STAGING_BASE_URL,
	WEB_STAGING_URL: process.env.WEB_STAGING_URL,
	WEB_PRODUCTION_URL: process.env.WEB_PRODUCTION_URL,
	EMAIL_USERNAME: process.env.EMAIL_USERNAME,
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
	CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

}

module.exports = Secrets;