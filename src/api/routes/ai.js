const { Router  } = require("express");
// import middlewares from '../middlewares';
const fetch = require("node-fetch-commonjs");
const Secrets = require("../../config");
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: Secrets.OPENAI_KEY, // This is the default and can be omitted
});
const { pipeline } = require("node:stream/promises");
const { prepStream } = require("../../helper");
const { celebrate, Joi } = require("celebrate");
const CarouselModel = require("../../models/Carousel");
const EngageModel = require("../../models/EngageList");
const AccountModel = require("../../models/Account");
const EngagePostModel = require("../../models/EngageListPost");
const ContactModel = require("../../models/Contact");
const PostTemplatesModel = require("../../models/PostTemplate");
const BrandkitModel = require("../../models/Brandkit");
const UserService = require("../../services/UserService");
const CarouselService = require("../../services/CarouselService");
const PostTemplateService = require("../../services/PostTemplateService");
const AIService = require("../../services/AIService");
const OpenAIService = require("../../services/OpenAIService");
const BrandkitService = require("../../services/BrandkitService");
const EngageService = require("../../services/EngageService");
const WorkspaceService = require("../../services/WorkspaceService");
const CronJobService = require("../../services/CronJobService");
const PaymentService = require("../../services/PaymentService");
const { authentication, authorization } = require("../middleware")
const { sendResponse } = require("../../helper");
const router = Router();
const authRouter = Router();
const { 
  validate,
  create_carousel,
  update_carousel,
  update_brandkit,
  create_brandkit,
  create_contact,
  create_engage_list

} = require("../middleware/validator");
const userEvents = require("../../subscribers/user");
const events = require("../../subscribers/events");




authRouter.post("/carousels",
  validate(create_carousel),
  async (req, res, next) => {
    const { user } = req.body
    try {
      const carouselServiceInstance = new CarouselService(CarouselModel);
      const carousel = await carouselServiceInstance.CreateCarousel(req.body, user.workspace);

      return sendResponse(req, res, 201, false, carousel, "Carousel created successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.put("/carousels/:id",
  validate(update_carousel),
  async (req, res, next) => {
    const id = req.params.id;
    try {
      const carouselServiceInstance = new CarouselService(CarouselModel);
      const carousel = await carouselServiceInstance.UpdateCarousel(req.body, id);
      return sendResponse(req, res, 200, false, carousel, "Carousel updated successfully");
    } catch (error) {
    return next(error);
  }
});


authRouter.get("/carousels",
  async (req, res, next) => {
    try {
      const carouselServiceInstance = new CarouselService(CarouselModel);
      const carousels = await carouselServiceInstance.ListCarousels();
      return sendResponse(req, res, 200, false, carousels, "Carousels fetched successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.get("/carousels/:id",
  async (req, res, next) => {
    const id = req.params.id;
    try {
      const carouselServiceInstance = new CarouselService(CarouselModel);
      const carousels = await carouselServiceInstance.GetCarousel(id);
      return sendResponse(req, res, 200, false, carousels, "Carousel fetched successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.get("/carousels/count",
  async (req, res, next) => {
    try {
      const carouselServiceInstance = new CarouselService(CarouselModel);
      const count = await carouselServiceInstance.GetCarouselCount();
      return sendResponse(req, res, 200, false, count, `This ${count} carousels`);
    } catch (error) {
      return next(error);
    }
});


authRouter.get("/post_generation_templates",
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const postTemplateServiceInstance = new PostTemplateService(PostTemplatesModel, AccountModel);
      const postTemplates = await postTemplateServiceInstance.ListPostTemplates(user.main_id);
      return sendResponse(req, res, 200, false, postTemplates, "Post templates fetched successfully");
    } catch (error) {
      return next(error);
    }
});

authRouter.get("/post_generation_templates/:id",
  async (req, res, next) => {
    const id = req.params.id;
    try {
      const postTemplateServiceInstance = new PostTemplateService(PostTemplatesModel, AccountModel);
      const postTemplate = await postTemplateServiceInstance.GetPostTemplateByID(id);
      return sendResponse(req, res, 200, false, postTemplate, "Template fetched successfully");
    } catch (error) {
      return next(error);
    }
});



// Engage List Routes




authRouter.post("/lists",
  validate(create_engage_list),
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const engageServiceInstance = new EngageService(EngageModel);
      const list = await engageServiceInstance.CreateEngageList(req.body, user.workspace);
      return sendResponse(req, res, 201, false, list, "Engage List created successfully");
    } catch (error) {
      return next(error);
    }
});

authRouter.get("/lists",
  async (req, res, next) => {
    const { user } = req.body
    try {
      const engageServiceInstance = new EngageService(EngageModel);
      const lists = await engageServiceInstance.ListEngageList(user.workspace);
      return sendResponse(req, res, 200, false, lists, "Lists fetched successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.post("/lists/:id/contacts/v2",
  validate(create_contact),
  async (req, res, next) => {
    const id = req.params.id;
    try {
      const engageServiceInstance = new EngageService(EngageModel, ContactModel);
      const list = await engageServiceInstance.CreateEngageContact(id, req.body.profile_urls);
      return sendResponse(req, res, 201, false, list, "Contact created successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.get("/lists/:id/contacts",
  async (req, res, next) => {
    const id = req.params.id;
    try {
      const engageServiceInstance = new EngageService(EngageModel, ContactModel);
      const contacts = await engageServiceInstance.ListEngageContacts(id);
      return sendResponse(req, res, 200, false, contacts, "Lists contacts fetched successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.delete("/lists/:listId/contacts/:contactId",
  async (req, res, next) => {
    const { listId, contactId } = req.params;
    try {
      const engageServiceInstance = new EngageService(EngageModel, ContactModel);
      const contacts = await engageServiceInstance.DeleteEngageContact(listId, contactId);
      return sendResponse(req, res, 200, false, contacts, "Contact deleted successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.put("/lists/:id",
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const engageServiceInstance = new EngageService(EngageModel, ContactModel);
      const contacts = await engageServiceInstance.UpdateEngageList(req.body, id);
      return sendResponse(req, res, 200, false, contacts, "Contact updated successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.post("/lists/:listId/archive",
  async (req, res, next) => {
    const { listId } = req.params;
    try {
      const engageServiceInstance = new EngageService(EngageModel, ContactModel);
      const contacts = await engageServiceInstance.ArchiveEngageList(listId);
      return sendResponse(req, res, 200, false, contacts, "Contact archived successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.get("/lists/:id",
  async (req, res, next) => {
    const id = req.params.id;
    try {
      const engageServiceInstance = new EngageService(EngageModel);
      const list = await engageServiceInstance.GetEngageList(id);
      return sendResponse(req, res, 200, false, list, "List fetched successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.get("/lists/:id/posts",
  async (req, res, next) => {
    const id = req.params.id;
    const { status, page, per_page } = req.query;
    try {
      const engageServiceInstance = new EngageService(EngageModel, ContactModel, EngagePostModel);
      const list = await engageServiceInstance.ListEngageListPosts(id, status, page, per_page);
      return sendResponse(req, res, 200, false, list, "List Posts fetched successfully");
    } catch (error) {
      return next(error);
    }
});






// Workspaces routes

// authRouter.get("/workspaces",
//   async (req, res, next) => {
//     try {
//       const workspaceServiceInstance = new WorkspaceService(Workspaces, UserWorkspaces);
//       const workspace = await workspaceServiceInstance.ListWorkspaces();
//       return sendResponse(req, res, 200, false, workspace, "Workspace fetched successfully");
//     } catch (error) {
//       return next(error);
//     }
// });



// BrandkitService Routes

authRouter.post("/brand_kits",
  validate(create_brandkit),
  async (req, res, next) => {
    const { user } = req.body;
    try {
      const brandkitServiceInstance = new BrandkitService(BrandkitModel);
      const brandkit = await brandkitServiceInstance.CreateBrandkit(req.body, user.workspace);
      return sendResponse(req, res, 201, false, brandkit, "Brandkit created successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.get("/brand_kits",
  async (req, res, next) => {
    try {
      const brandkitServiceInstance = new BrandkitService(BrandkitModel);
      const brandkits = await brandkitServiceInstance.ListBrandkits();
      return sendResponse(req, res, 200, false, brandkits, "Brandkits fetched successfully");
    } catch (error) {
      return next(error);
    }
});


authRouter.delete("/brand_kits/:id",
  async (req, res, next) => {
    const id = req.params.id;
    try {
      const brandkitServiceInstance = new BrandkitService(BrandkitModel);
      const brandkit = await brandkitServiceInstance.DeleteBrandkit(id);
      return sendResponse(req, res, 200, false, brandkit, "Deleted Successful");
    } catch (error) {
      console.log(error);
      return next(error);
    }
});

authRouter.put("/brand_kits/:id",
  validate(update_brandkit),
  async (req, res, next) => {
    const id = req.params.id;
    try {
      const brandkitServiceInstance = new BrandkitService(BrandkitModel);
      const brandkit = await brandkitServiceInstance.UpdateBrandkit(req.body, id);
      return sendResponse(req, res, 200, false, brandkit, "Brandkit updated successfully");
    } catch (error) {
    return next(error);
  }
});




// authRouter.post("/accept_all_invitations",
//   celebrate({
//     body: Joi.object({
//       code: Joi.string().required()
//     }),
//   }),
//   async (req, res, next) => {
//     try {
//       const authServiceInstance = new AuthService(UserModel);
//       const { user } = await authServiceInstance.GetLinkedinAuthToken(req.body.code, req.session.user.email);
//       return sendResponse(req, res, 200, false, user, "Successful");
//     } catch (error) {
//       console.log(error);
//       return next(error);
//     }
// });


const emitSSE = (res, data, event, id, retry) => {
  res.write("data:" + `{"text":${JSON.stringify(data)}}` + '\n');
  res.write("event: " + event + '\n');
  res.write("id: " + id + '\n\n');
  //res.write("retry: " + retry + '\n\n');
  res.flushHeaders();
}

authRouter.post("/ai/generate_posts_streaming",
  async (req, res, next) => {
    const { user } = req.body;
    const getWords = await AccountModel.findOne({ creator_id: user.main_id });
    if(getWords.words_generated >= getWords.words_allowed_in_billing_cycle) {
      return sendResponse(req, res, 400, true, {}, "You have exceeded your words!");
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {"role": "system", "content": `write a post about user topic "${req.body.instructions.user_input[0]}" in a ${req.body.instructions.user_input[1]} tone using this following exact (${req.body.instructions.user_input[2]}) format. Make sure to write a call to action whenever it is mentioned but (never mention "call to action" explicitly to the user). Use at least 3 related hashtag related to the user topic.`},
        {"role": "user", "content": `${req.body.instructions.user_input[0]}`}
      ],
      temperature: 0,
      max_tokens: 20,
      n: 1,
      stream: true,
    });

    let words = "";

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
  
    for await (const chunk of completion) {
      words += chunk.choices[0].delta.content;
      const total = words.length + getWords.words_generated;
      console.log(words.length);
      console.log(total);
      if(total >= getWords.words_allowed_in_billing_cycle) {
        userEvents.dispatch(events.user.postGeneration, { creator_id: user.main_id, words });
        res.end();
        break;
      }
      emitSSE(res, chunk?.choices[0]?.delta?.content, chunk.object, chunk.id.split("-")[1], chunk?.choices[0]?.finish_reason);
      if(chunk?.choices[0]?.delta?.content === "undefined" || chunk.choices[0].finish_reason === "length"  ) {
        userEvents.dispatch(events.user.postGeneration, { creator_id: user.main_id, words });
        res.end();
        break;
      } 
    }

  //   try {
  //     const response = await fetch(
  //       "https://api.openai.com/v1/chat/completions",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${Secrets.OPENAI_KEY}`,
  //         },
  //         body: JSON.stringify({
  //           model: "gpt-3.5-turbo",
  //           messages: [
  //             {
  //               role: "user",
  //               // The message will be 'Say hello.' unless you provide a message in the request body.
  //               content: `${req.body.instructions.user_input[0]}`,
  //             },
  //             {
  //               role: "system",
  //               content: `write a post about user topic "${req.body.instructions.user_input[0]}" in a ${req.body.instructions.user_input[1]} tone using this following exact (${req.body.instructions.user_input[2]}) format. Make sure to write a call to action whenever it is mentioned but (never mention "call to action" explicitly to the user). Use at least 3 related hashtag related to the user topic.`
  //             }
  //           ],
  //           temperature: 0,
  //           max_tokens: 40,
  //           n: 1,
  //           stop: ["\n\n"],
  //           //stream: true,
  //         }),
  //       }
  //     );
  //     const completion = await response.json();
  //     //await pipeline(response.body, res);
  //     console.log(completion.choices[0].message.content);
  //     let words = "";
  
  //     // for await (const chunk of completion) {
  //     //   console.log(chunk);
  //     //   words += chunk.choices[0].delta.content;
  //     //   console.log(words);
  //     //   console.log(words.length);
  //     //   console.log(chunk.choices[0].finish_reason);

  //     if(completion.choices[0].message.content) {
  //       userEvents.dispatch(events.user.postGeneration, { creator_id: user.main_id, words: completion.choices[0].message.content });
  //     }
  //     // }
  //     // if(!response.body || response.status === 429 || response.status === 401 || response.status >= 500) {
  //     //   res.end();
  //     // }
  //     return sendResponse(req, res, 200, false, completion.choices[0].message.content, "Chat successful");
  //   } catch (error) {
  //     console.log(error);
  //     return next(error);
  // }
});


authRouter.post("/ai/rewrite/v2",
  async (req, res, next) => {
    const { user } = req.body;
    const getWords = await AccountModel.findOne({ creator_id: user.main_id });
    if(getWords.words_generated >= getWords.words_allowed_in_billing_cycle) {
      return sendResponse(req, res, 400, true, {}, "You have exceeded your words!");
    }
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {"role": "system", "content": `${req.body.name} the given sentence given by the user`},
        {"role": "user", "content": `${req.body.text}`}
      ],
      temperature: 0,
      max_tokens: 20,
      n: 1,
      stream: true,
    });

    let words = "";

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });
  
    for await (const chunk of completion) {
      words += chunk.choices[0].delta.content;
      const total = words.length + getWords.words_generated;
      console.log(words.length);
      console.log(total);
      if(total >= getWords.words_allowed_in_billing_cycle) {
        userEvents.dispatch(events.user.postGeneration, { creator_id: user.main_id, words });
        res.end();
        break;
      }
      emitSSE(res, chunk?.choices[0]?.delta?.content, chunk.object, chunk.id.split("-")[1], chunk?.choices[0]?.finish_reason);
      if(chunk?.choices[0]?.delta?.content === "undefined" || chunk.choices[0].finish_reason === "length"  ) {
        userEvents.dispatch(events.user.postGeneration, { creator_id: user.main_id, words });
        res.end();
        break;
      } 
  }
});



authRouter.post("/ai/chat",
  async (req, res, next) => {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Secrets.OPENAI_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "user",
                // The message will be 'Say hello.' unless you provide a message in the request body.
                content: `${req.body.user_input[0]}`,
              },
              {
                role: "system",
                content: `rewrite this user post using this following exact (${req.body.user_input[2]}) format. Make sure to write a call to action whenever it is mentioned but (never mention "call to action" explicitly to the user). Use at least 3 related hashtag related to the user topic.`
              }
            ],
            temperature: 0,
            max_tokens: 50,
            n: 1,
            stream: true,
          }),
        }
      );
      await pipeline(response.body, res);
      if(!response.body || response.status === 429 || response.status === 401 || response.status >= 500) {
        res.end();
      }
    } catch (error) {
      console.log(error);
      return next(error);
  }
});


router.use("/", authentication, authorization, authRouter);

module.exports = router;