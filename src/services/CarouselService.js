const bcrypt = require("bcryptjs");
const { generateUniqueId } = require("../helper");
const axios = require("axios");
const Secrets = require("../config");
const userEvents = require("../subscribers/user");
const events = require("../subscribers/events");
const otpGenerator = require("otp-generator");
const LinkedinService = require("./LinkedinService");
const { uuid } = require("uuidv4");



module.exports = class CarouselService {
    constructor(carouselModel){
      this.carouselModel = carouselModel;
    }


    async CreateCarousel(data, workspace) {
        const createCarousel = await this.carouselModel.create({ id: uuid(), workspace_id: workspace, template_id: data.template_id, content: data.content, common_settings: data.common_settings, slides: data.slides });

        if (!createCarousel) {
            let error = new Error("Carousel cannot be created");
            error.statusCode = 400;
            throw error;
        }

        const carousel = createCarousel;
        return carousel;
    }

    async GetCarouselCount(workspace) {
        const count = await this.carouselModel.find({ workspace_id: workspace });
        //console.log(count);
        return count.length;
    }

                                                                                                                                                                                   
    async ListCarousels(workspace, page, per_page) {
        const carousels = await this.carouselModel.aggregate([
            {
                $match: {workspace_id: workspace},
            },
            {
                $facet: {
                    metaData: [
                        {
                            $count: "totalDocument"
                        },
                        {
                            $addFields: {
                                pageNumber: page,
                                totalPages: { $ceil: {$divide: ["$totalDocument", per_page] }}
                            }
                        }
                    ],
                    data: [
                        {
                            $skip: (page - 1) * per_page
                        }, 
                        {
                            $limit: per_page
                        }
                    ]
                }
            }
        ]);
        return carousels[0].data;
    }

    async DeleteCarousel(id) {
        await this.carouselModel.findOneAndRemove({ id });
    }


    async GetCarousel(id) {
        const carousel = await this.carouselModel.findOne({ id });
        return carousel;
    }

    async UpdateCarousel(data, id) {
        const ts = new Date(); // timestamp

        const carousel = await this.carouselModel.findOneAndUpdate({ id }, {
            $set: {
              content: data.content,
              common_settings: data.common_settings,
              slides: data.slides,
              updated_at: ts
            },
            },
            {
            new: true
        });

        return carousel;
    }
}