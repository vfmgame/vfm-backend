const cron = require('node-cron');


module.exports = class CronJob {
    constructor(userModel, subcriptionModel, leadModel) {
        this.userModel = userModel;
        this.subcriptionModel = subcriptionModel;
        this.leadModel = leadModel;
    } 

    checkSubscriptionTask(data) {
        console.log(data);
        return cron.schedule("* * * * * *", async () => {
            const fetchSubscription = await this.subcriptionModel.findOne({ customer_id: data.customer_id })
            const durationInSeconds = fetchSubscription.end_date - fetchSubscription.start_date;
            const durationInDays = moment.duration(durationInSeconds, 'seconds').asDays();
            console.log(durationInDays);
            //             await SubscriptionModel.findOneAndUpdate({ customer_id: data.object.customer }, {
            //                 $set: {
            //                     customer_id: data.object.customer,
            //                     start_date: moment.unix(data.object.current_period_start).format('YYYY-MM-DD'),
            //                     end_date: moment.unix(data.object.current_period_end).format('YYYY-MM-DD'),
            //                     count_down: durationInDays,
            //                     plan: data.object.plan.id,
            //                     product: data.object.plan.product,
            //                     updated_at: ts
            //                 },
            //                 },
            //             {
            //                 new: true
            //             });
            console.log('running every minute 1, 2, 4 and 5');
        });
    }
}
