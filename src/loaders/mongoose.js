const mongoose = require("mongoose");
const Secrets = require("../config");
const CurrencyModel = require("../models/Currency");
const AdminModel = require("../models/Admin");
const AdminTaskModel = require("../models/AdminTask");
const { v4: uuidv4 } = require("uuid");


module.exports = async () => {
  //mongoose.set('strictQuery', true);
  await mongoose.connect(Secrets.DATABASE_LOCAL_URL)
  .then(
    async () => {
      console.log("Connect Successful");
      const admin = await AdminModel.find();
      const currency = await CurrencyModel.find();
      if(admin.length && currency.length) return;
      const newAdmin = AdminModel.create({});
      Promise.all([
        CurrencyModel.create({
          id: await uuidv4(),
          name: "Virtual Football Manager",
          symbol: "VFM",
          imageUrl: "https://res.cloudinary.com/dzlx5cw7g/image/upload/v1744885674/vfm-token_rovbpn.svg",
        }),
        CurrencyModel.create({
          id: await uuidv4(),
          name: "XION",
          symbol: "UXION",
          imageUrl: "https://res.cloudinary.com/dzlx5cw7g/image/upload/v1744806004/XION-Blaze-Logo-White-On-Black-Circle_cej3qt.png",
        }),
        CurrencyModel.create({
          id: await uuidv4(),
          name: "Play Pass",
          symbol: "PP",
          imageUrl: "https://res.cloudinary.com/dzlx5cw7g/image/upload/v1744886473/play-passes_aluldx.svg",
        }),
        AdminTaskModel.create({
          sectionType: "REGULAR",
          creatorId: newAdmin._id,
          subSections: [
            {
              "title": "New",
              "tasks": [
                {
                  "id": "061614df-ff00-42b8-a0ee-40934d3ee3b8",
                  "sectionType": "REGULAR",
                  "subSectionTitle": "New",
                  "type": "SOCIAL_SUBSCRIPTION",
                  "title": "Blum Content Strategy",
                  "icon": "https://cdn.blum.codes/d72d558b-ce90-4e80-8dd8-109a134fe36a/c11fe842-e014-4ae2-94d7-f93e2cfd3ed5",
                  "validationType": "KEYWORD",
                  "answer": "answer",
                  "subType": "YOUTUBE",
                  "reward": {
                    "currencyId": "59bee2e3-a682-4ec5-93df-a3bb294f7bed",
                    "name": "VFM Points",
                    "symbol": "VFM",
                    "value": 250
                  },
                  "socialSubscription": {
                    "openInTelegram": false,
                    "url": "https://www.youtube.com/watch?v=9al3YgsWyp4"
                  },
                  "status": "NOT_STARTED"
                }
              ]
            },
            {
              "title": "Socials",
              "tasks": [
                {
                  "type": "SOCIAL_SUBSCRIPTION",
                  "title": "Join our TG-Community",
                  "icon": "https://cdn.blum.codes/10645bfc-3c45-4b86-be2b-53ffe59fbf0f/cc5ccd00-b1ac-498c-85bd-c9d59cb6916a",
                  "validationType": "DEFAULT",
                  "subType": "TELEGRAM",
                  "reward": {
                    "currencyId": "59bee2e3-a682-4ec5-93df-a3bb294f7bed",
                    "name": "VFM Points",
                    "symbol": "VFM",
                    "value": 90
                  },
                  "socialSubscription": {
                    "openInTelegram": false,
                    "url": "https://t.me/blumcrypto/820"
                  },
                  "status": "NOT_STARTED"
                },
                {
                  "type": "SOCIAL_SUBSCRIPTION",
                  "title": "Follow Blum CEO on IG",
                  "icon": "https://cdn.blum.codes/c2427646-76db-4a98-bb94-773f4634a35b/3741c507-f7b9-468e-9941-dc487c45114a",
                  "validationType": "DEFAULT",
                  "subType": "INSTAGRAM",
                  "reward": {
                    "currencyId": "59bee2e3-a682-4ec5-93df-a3bb294f7bed",
                    "name": "VFM Points",
                    "symbol": "VFM",
                    "value": 20
                  },
                  "socialSubscription": {
                    "openInTelegram": false,
                    "url": "https://instagram.com/facebook"
                  },
                  "status": "NOT_STARTED"
                },
                {
                  "type": "SOCIAL_SUBSCRIPTION",
                  "title": "Follow Blum on X",
                  "icon": "https://cdn.blum.codes/b4bbdaaa-184e-4334-907a-b5b656fa2866/636cf638-5e1e-44b3-be7a-58bb09f33c5c",
                  "validationType": "DEFAULT",
                  "subType": "TWITTER",
                  "reward": {
                    "currencyId": "59bee2e3-a682-4ec5-93df-a3bb294f7bed",
                    "name": "VFM Points",
                    "symbol": "VFM",
                    "value": 50
                  },
                  "socialSubscription": {
                    "openInTelegram": false,
                    "url": "https://x.com/facebook"
                  },
                  "status": "NOT_STARTED"
                },
                {
                  "type": "SOCIAL_SUBSCRIPTION",
                  "title": "Follow Blum on YouTube",
                  "icon": "https://cdn.blum.codes/d72d558b-ce90-4e80-8dd8-109a134fe36a/c11fe842-e014-4ae2-94d7-f93e2cfd3ed5",
                  "validationType": "DEFAULT",
                  "subType": "YOUTUBE",
                  "reward": {
                    "currencyId": "59bee2e3-a682-4ec5-93df-a3bb294f7bed",
                    "name": "VFM Points",
                    "symbol": "VFM",
                    "value": 90
                  },
                  "socialSubscription": {
                    "openInTelegram": false,
                    "url": "https://youtube.com/facebook"
                  },
                  "status": "NOT_STARTED"
                },
                {
                  "type": "SOCIAL_SUBSCRIPTION",
                  "title": "Join Blum Facebook",
                  "icon": "https://cdn.blum.codes/b1336c17-8b26-49dc-9d07-0e1d9eaee9ae/c892ae72-f8c0-4270-8abc-0e5630c3b078",
                  "validationType": "DEFAULT",
                  "subType": "FACEBOOK",
                  "reward": {
                    "currencyId": "59bee2e3-a682-4ec5-93df-a3bb294f7bed",
                    "name": "VFM Points",
                    "symbol": "VFM",
                    "value": 80
                  },
                  "socialSubscription": {
                    "openInTelegram": false,
                    "url": "https://web.facebook.com/vfm.lk"
                  },
                  "status": "NOT_STARTED"
                },
                {
                  "type": "SOCIAL_SUBSCRIPTION",
                  "title": "Crypto Slang. Part 5",
                  "icon": "https://cdn.blum.codes/d72d558b-ce90-4e80-8dd8-109a134fe36a/c11fe842-e014-4ae2-94d7-f93e2cfd3ed5",
                  "validationType": "KEYWORD",
                  "subType": "YOUTUBE",
                  "reward": {
                    "currencyId": "59bee2e3-a682-4ec5-93df-a3bb294f7bed",
                    "name": "VFM Points",
                    "symbol": "VFM",
                    "value": 250
                  },
                  "socialSubscription": {
                    "openInTelegram": false,
                    "url": "https://youtube.com/crypto"
                  },
                  "status": "NOT_STARTED"
                }
              ]
            },
            {
              title: "Onchain",
              tasks: []
            },
            {
              title: "Academy",
              tasks: []
            },
            {
              title: "Frens",
              tasks: []
            },
            {
              title: "Farming",
              tasks: []
            }
          ],
        })
      ]).then(async () =>
        console.log("Currencies Added"), 
      )
    }
  )
  .catch((err) => console.error("Could not connect" + err));
}