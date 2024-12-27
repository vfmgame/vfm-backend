const axios = require("axios").default;
const AccountModel = require("../../models/Account");


const checkTrialPeriod = (pulse) => {
    pulse.define(`check_user_trial`, async (job, done) => {
        try {
            const ts = new Date();
            const { userID } = job.attrs.data;
            console.log(`Checking for User ${userID} Trial period`);
            const fetchUser = await AccountModel.findOne({ creator_id: userID });
    
            if(fetchUser.account_status === "trial" && fetchUser.number_of_days_left_in_trial >= 0) {
                await AccountModel.findOneAndUpdate({ creator_id: userID }, {
                    $set: {
                        number_of_days_left_in_trial: fetchUser.number_of_days_left_in_trial - 1,
                        can_use_ai: false,
                        updated_at: ts
                    },
                    },
                    {
                    new: true
                });
            }

            if(fetchUser.account_status === "trial" && fetchUser.number_of_days_left_in_trial == -1) {
                await AccountModel.findOneAndUpdate({ creator_id: userID }, {
                    $set: {
                        number_of_days_left_in_trial: fetchUser.number_of_days_left_in_trial - 1,
                        can_use_ai: false,
                        account_status: "expired",
                        updated_at: ts
                    },
                    },
                    {
                    new: true
                });
            }

            if(fetchUser.account_status === "expired" && fetchUser.number_of_days_left_in_trial <= 0) {
                await AccountModel.findOneAndUpdate({ creator_id: userID }, {
                    $set: {
                        number_of_days_left_in_trial: fetchUser.number_of_days_left_in_trial - 1,
                        can_use_ai: false,
                        account_status: "expired",
                        updated_at: ts
                    },
                    },
                    {
                    new: true
                });
            }

            if(fetchUser.plan_name !== "trial") {
               await pulse.cancel({ "data.userID": userID });
               await AccountModel.findOneAndUpdate({ creator_id: userID }, {
                $set: {
                    number_of_days_left_in_trial: 0,
                    updated_at: ts
                },
                },
                {
                    new: true
                });
            }

            done(undefined, "Success");
            
        } catch (error) {
            console.error("Failed to update trial period:", error);
            done(error);
        }
        
    },{
        concurrency: 20,
        lockLimit: 20,
        priority: "high",
        lockLifetime: 300000, // 5 minutes
        shouldSaveResult: true,
        attempts: 3, // Retry up to 3 times
        backoff: {
            type: "exponential",
            delay: 3000, // Start with a 2-second delay between retries
        },
    });
}



module.exports = checkTrialPeriod;

