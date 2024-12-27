const { Router  } = require("express");
const { celebrate, Joi } = require("celebrate");
const csv = require("csvtojson");
const ProspectService = require("../../services/ProspectService");
const ScrapeDataService = require("../../services/ScrapeDataService");
const { sendResponse } = require("../../helper/ResponseHelper");
const { authentication, authorization } = require("../middleware");
const Secrets = require("../../config");
const { default: axios } = require("axios");
const upload = require("../../helper/upload");
const router = Router();
const authRouter = Router();


// authRouter.get("/:handle",
//   async (req, res, next) => {
//     const { handle } = req.params;
//     try {
//       const prospectServiceInstance = new ProspectService(ProspectModel);
//       const prospectDetails = await prospectServiceInstance.FetchProspect(handle);
//       return sendResponse(req, res, 200, false, prospectDetails, "Prospect fetched!");
//     } catch (error) {
//       return next(error)
//     }
// }); 


// // authRouter.get("/",
// //   async (req, res, next) => {
// //     const { user } = req.session;
// //     try {
// //       const prospectServiceInstance = new ProspectService(ProspectModel);
// //       const prospects = await prospectServiceInstance.ListProspects(user.id);
// //       return sendResponse(req, res, 200, false, prospects, "Prospects fetched!");
// //     } catch (error) {
// //       return next(error)
// //     }
// // });



// // router.post("/",
// //   // celebrate({
// //   //   body: Joi.object({
// //   //     data: Joi.array().required()
// //   //   }),
// //   // }),
// //   async (req, res, next) => {
// //     const { user } = req.session;
// //     try {
// //       const prospectServiceInstance = new ProspectService(ProspectModel);
// //       const lead = await prospectServiceInstance.CreateProspect();
// //       return sendResponse(req, res, 201, false, lead, "Lead created successfully!");
// //     } catch (error) {
// //         return next(error);
// //     }
// // });



// router.post("/list",
//   celebrate({
//     body: Joi.object({
//       name: Joi.string().required()
//     }),
//   }),
//   async (req, res, next) => {
//     const { user } = req.session;
//     try {
//       const prospectServiceInstance = new ProspectService(ProspectModel, ProspectListModel);
//       const lead = await prospectServiceInstance.CreateProspectList({name: req.body.name, id: "RCP3W2UR6Z24" });
//       return sendResponse(req, res, 201, false, lead, "Prospect List created successfully!");
//     } catch (error) {
//       return next(error);
//     }
// });


// router.put("/",
//   celebrate({
//     body: Joi.object({
//       id: Joi.string().required(),
//       name: Joi.string().required(),
//       page: Joi.number().required(),
//       first_name: Joi.string().required(),
//       last_name: Joi.string().required(),
//       url: Joi.string().required(),
//       email: Joi.string().email().optional(),
//       phone: Joi.array().optional(),
//       region: Joi.string().optional(),
//       job_title: Joi.string().optional(),
//       photo: Joi.string().optional(),
//       handle: Joi.string().required(),
//       headline: Joi.string().required(),
//       company: Joi.string().optional(),
//       connection: Joi.string().optional(),
//       website: Joi.array().optional()
//     }),
//   }),
//   async (req, res, next) => {
//     const { user } = req.session;
//     const data = {
//       id: req.body.id,
//       first_name: req.body.first_name,
//       last_name: req.body.last_name,
//       company: req.body.company,
//       email: req.body.email,
//       phone: req.body.phone,
//       handle: req.body.handle,
//       headline: req.body.headline,
//       connection: req.body.connection,
//       region: req.body.region,
//       job_title: req.body.job_title,
//       photo: req.body.photo,
//       website: req.body.website,
//       url: req.body.url
//     }
//     try {
//       const prospectServiceInstance = new ProspectService(ProspectModel, ProspectListModel);
//       const lead = await prospectServiceInstance.AddProspects(data, req.body.name, req.body.page, "RCP3W2UR6Z24");
//       return sendResponse(req, res, 201, false, lead, "Prospect added successfully!");
//     } catch (error) {
//       return next(error);
//     }
// });


// router.get("/:name",
//   async (req, res, next) => {
//     const { user } = req.session;
//     const { name } = req.params;
//     try {
//       const prospectServiceInstance = new ProspectService(ProspectModel, ProspectListModel);
//       const prospects = await prospectServiceInstance.FetchSingleProspect("RCP3W2UR6Z24", name);
//       return sendResponse(req, res, 200, false, prospects, "List fetched!");
//     } catch (error) {
//       return next(error);
//     }
// });


// router.get("/",
//   async (req, res, next) => {
//     const { user } = req.session;
//     try {
//       const prospectServiceInstance = new ProspectService(ProspectModel, ProspectListModel);
//       const prospects = await prospectServiceInstance.FetchProspectList("RCP3W2UR6Z24");
//       return sendResponse(req, res, 200, false, prospects, "List fetched!");
//     } catch (error) {
//       return next(error);
//     }
// });



// authRouter.post("/scrape/linkedin",
//   celebrate({
//     body: Joi.object({
//       text: Joi.string().required(),
//       page: Joi.number().required(),
//     }),
//   }),
//   async (req, res, next) => {
//     try {
//       const scrape = await ScrapeDataService(req.body.text, req.body.page);
//       return sendResponse(req, res, 200, false, scrape, "Fetch successfully!");
//     } catch (error) {
//       return next(error);
//     }
// });


// authRouter.post("/upload", upload.single("csv"),
//   async (req, res, next) => {
//     try {
//       const jsonArray = await csv().fromFile(req.file.path);
//       //const scrape = await ScrapeDataService(req.body.text, req.body.page);
//       return sendResponse(req, res, 200, false, jsonArray, "Upload successfully!");
//     } catch (error) {
//       return next(error);
//     }
// });


// authRouter.post("/linkedin/message",
//   celebrate({
//     body: Joi.object({
//       recipients: Joi.array().required(),
//       subject: Joi.string().required(),
//       body: Joi.string().required(),
//       attachments: Joi.array().optional(),
//     }),
//   }),
//   async (req, res, next) => {
//     try {
//       const response = await axios.post("https://api.linkedin.com/v2/messages",
//       {
        
//         "recipients": req.body.recipients,
//         "subject": req.body.subject,
//         "body": req.body.body,
//         "messageType": "MEMBER_TO_MEMBER",
//         "attachments": req.body.attachments
//       },
//       {
//         "headers": {
//           'Content-Type': 'application/json',
//           "Authorization": "Bearer AQVRvgvHHVFcsG9QyxJq4ySo5sfwMiChE7ILk_pMuty9tTmawyY6OLktL2-zE0L9edH8w3lgaQLlI9smZKT4hyNraiXcA_IacviFNijR287iU-tYZHAAUA7KThnMNWbyazKdp_9qFCNpSH9PKP8EWUg8XkxdelWixkhHY8toiNQneuMV837gkXOiyeFfHU0M1zCPRJ5OgBZpZggSVicdgJj8Gy3DRL9StlNmT7WHIfrEoavNi57DTrwPDgooeWt6ocdG8fyrjygGeT-PcwulML1NYsm_pJwTKLjYJ3XYCSsa2it-V4CwjV7wmduhpmtf6LWQq6M5JIeAE6pCKGArC3DxLjqDqg"
//         }
//       })
//       console.log(response);
//       //const scrape = await ScrapeDataService(req.body.text, req.body.page);
//       return sendResponse(req, res, 200, false, response, "Fetch successfully!");
//     } catch (error) {
//       return next(error);
//     }
// });


router.use("/", authentication, authorization, authRouter);

module.exports = router;
