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
	XION_RPC_URL: process.env.XION_RPC_URL || "https://rpc.xion-testnet-2.burnt.com",
  	CHAIN_ID: process.env.XION_CHAIN_ID || "xion-testnet-2",
  	MNEMONIC: process.env.XION_MNEMONIC,
	LIVE_BASE_URL: process.env.LIVE_BASE_URL,
	STAGING_BASE_URL: process.env.STAGING_BASE_URL,
	WEB_STAGING_URL: process.env.WEB_STAGING_URL,
	WEB_PRODUCTION_URL: process.env.WEB_PRODUCTION_URL,
	EMAIL_USERNAME: process.env.EMAIL_USERNAME,
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
	CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

	// Make sure we have required values
	validateConfig: function() {
		if (!this.MNEMONIC) {
		  throw new Error("XION_MNEMONIC is required in .env file");
		}
		if (!this.XION_RPC_URL) {
		  throw new Error("XION_RPC_URL is required in .env file");
		}
		return true;
	}

}

module.exports = Secrets;