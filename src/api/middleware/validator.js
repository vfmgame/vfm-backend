const { body, query, validationResult } = require("express-validator");
const { sendResponse } = require("../../helper");


module.exports = {
    validate(values = []) {
        return async (req, res, next) => {
            await Promise.all(values.map((value) => value.run(req)));

            const errors = validationResult(req);
            if(errors.isEmpty()) {
                return next();
            }

            let _errors = errors.array();
            let message = "Invalid parameters:";

            _errors.forEach((v) => {
                message +=  ` ${v.param}`;
                console.log(message);
            });


            // if (_errors.length > 0) {
            //     let error = new Error(message);
            //     error.statusCode = 400;
            //     throw error;
            // }


            sendResponse(req, res, 400, errors.array(), false, message);
        };
    },


    send_team_invitation: [
        body("name").isString().withMessage("Name cannot be empty"),
        body("email").isString().withMessage("Email cannot be empty"),
        body("role_id").isString().withMessage("Role ID cannot be empty"),
        body("redirect_to").isString().withMessage("Redirect to cannot be empty")
    ],

    accept_invitation: [
        body("id").isString().withMessage("Id cannot be empty"),
        body("token").isString().withMessage("Token cannot be empty"),
        body("password").isLength(6).withMessage("Password cannot be empty"),
        body("avatar").isString().trim()
    ],

    create_campaign: [
        body("title").isString().isLength(3).withMessage("Title cannot be empty"),
        body("icon").isString().withMessage("Icon cannot be empty"),
        body("prospect_list_id").isString().withMessage("Prospect List id cannot be empty"),
        body("workflow").isString().withMessage("Workflow ID cannot be empty"),
    ],

    create_workspace: [
        body("name").isString().optional(),
        body("timezone").isString().optional(),
        body("language").isString().optional()
    ],

    update_workspace: [
        body("name").isString()
    ],

    create_user_info: [
        body("onboarding_completed").isBoolean(),
        body("problems_to_solve").isArray(),
        body("source_of_discovery").isString()
    ],

    update_user_info: [
        body("id").isString(),
        body("onboarding_completed").isBoolean(),
        body("problems_to_solve").isArray(),
        body("source_of_discovery").isString()
    ],

    create_content_writing: [
        body("name").isString(),
        body("posts").isArray().isLength(10)
    ],

    create_prospect_list: [
        body("name").isString().isLength(3).withMessage("List name cannot be empty")
    ],

    create_rewrite_template: [
        body("post_rewrite_templates").isArray().withMessage("Rewrite cannot be empty")
    ],

    create_post: [
        body("rich_text").isObject().withMessage("External Id cannot be empty"),
        body("text").isString()
    ],

    publish_post: [
        body("id").isString().withMessage("Post Id cannot be empty")
    ],

    create_post_template: [
        body("external_id").isString().withMessage("External Id cannot be empty"),
        body("title").isString().isLength(3).withMessage("Title cannot be empty"),
        body("description").isString().isLength(3).withMessage("Description cannot be empty"),
        body("image_url").isString().isLength(3).withMessage("Image Url cannot be empty"),
        body("post_formats").isObject().withMessage("Post Formats cannot be empty"),
        body("sort_order").isNumeric().isLength(3).withMessage("Sort order cannot be empty"),
        body("user_input_fields").isArray().withMessage("User input fields cannot be empty"),
    ],

    create_prospect: [
        body("prospect_list_id").isString().isLength(3).withMessage("List id cannot be empty"),
        body("prospect_list_name").isString().isLength(3).withMessage("List name cannot be empty"),
        body("first_name").isString().isLength(3).withMessage("first name cannot be empty"),
        body("last_name").isString().isLength(3).withMessage("last name cannot be empty"),
        body("url").isString().isLength(3).withMessage("url cannot be empty"),
        body("email").isString(),
        body("phone").isArray(),
        body("region").isString(),
        body("job_title").isString(),
        body("photo").isString(),
        body("handle").isString().isLength(3).withMessage("handle  cannot be empty"),
        body("headline").isString(),
        body("company").isString(),
        body("website").isArray(),
    ],

    validate_linkedin: [
        body("code").isString().isLength(3).withMessage("Code cannot be empty")
    ],


    create_workflow: [
        body("name").isString().isLength(3).withMessage("Name cannot be empty"),
        body("description").isString().isLength(3).withMessage("Description cannot be empty"),
        body("complexity").isNumeric().withMessage("Complexity cannot be empty"),
        body("image").isString().isLength(3).withMessage("Image cannot be empty"),
        body("starting_point").isObject().withMessage("Starting point cannot be empty"),
        body("waypoints").isArray().withMessage("Waypoints cannot be empty"),
        body("tags").isArray().withMessage("Tags cannot be empty")
    ],

    checkout_stripe: [
        body("price").isString().isLength(3).withMessage("Price cannot be empty"),
        body("quantity").isNumeric().withMessage("Quantity cannot be empty"),
        body("success_url").isString().withMessage("Success url cannot be empty"),
        body("cancel_url").isString().withMessage("Cancel url cannot be empty")
    ],


    rewrite: [
        body("template_id").isString(),
        body("text").isString()
    ],

    create_contact: [
        body("profile_urls").isArray()
    ],

    create_carousel: [
        body("template_id").isString(),
        body("content").isString().optional(),
        body("common_settings").isObject(),
        body("slides").isArray()
    ],

    update_carousel: [
        body("content").isString().optional(),
        body("common_settings").isObject(),
        body("slides").isArray()
    ],

    create_engage_list: [
        body("icon").isString().withMessage("Icon cannot be empty"),
        body("title").isString().isLength(3).withMessage("Title cannot be empty or less than 3 characters"),
    ],


    create_brandkit: [
        body("name").isString(),
        body("handle").isString(),
        body("logo").isString(),
        body("font").isString(),
        body("primary_color").isString(),
        body("secondary_color").isString().optional(),
        body("tertiary_color").isString().optional(),
        body("secondary_font").isString().optional(),
    ],

    update_brandkit: [
        body("name").isString(),
        body("handle").isString(),
        body("logo").isString(),
        body("font").isString(),
        body("primary_color").isString(),
        body("secondary_color").isString().optional(),
        body("tertiary_color").isString().optional(),
        body("secondary_font").isString().optional(),
    ],


    // "website": [{
    //     "label": null,
    //     "category": "PORTFOLIO",
    //     "$recipeTypes": ["com.linkedin.91dbb8279e0615e79143ad1ed02013fa"],
    //     "url": "ememesidem.ccom",
    //     "$type": "com.linkedin.voyager.dash.identity.profile.Website"
    // }]


    update_post: [
        body("carousel_title").isString(),
        body("text").isString(),
        body("rich_text").isObject(),
        body("image_url").isString(),
        body("mentions").isArray(),
        body("file_url").isString(),
        body("linked_in_account_id").isString(),
        body("linked_in_account").isObject(),
        body("video_url").isString(),
        body("video_title").isString(),
    ],

    create_time_slot_instance: [
        body("post_id").isString().withMessage("Post Id cannot be empty"),
        body("time_slot_id").isString().optional(),
        body("day_of_the_month").isInt().withMessage("Day of the month cannot be empty"),
        body("month").isInt().withMessage("Month cannot be empty"),
        body("year").isInt().withMessage("Year cannot be empty"),
        body("day_of_week").isInt().withMessage("Day of week cannot be empty"),
        body("hour").isInt().optional(),
        body("minute").isInt().optional()
    ],

    create_business: [
        body("name").isString().withMessage("Name cannot be empty").trim(),
        body("businessType").isString().withMessage("businessType cannot be empty").trim(),
        body("useCase").isString().withMessage("useCase cannot be empty").trim(),
        body("role").isString().withMessage("Role cannot be empty").trim()
    ],

    update_business: [
        body("name").isString().withMessage("Name cannot be empty").trim(),
        body("businessType").isString().withMessage("businessType cannot be empty").trim(),
        body("useCase").isString().withMessage("useCase cannot be empty").trim(),
        body("role").isString().withMessage("Role cannot be empty").trim()
    ],

    important_update_business: [
        body("businessType").isString().withMessage("businessType cannot be empty").trim(),
        body("useCase").isString().withMessage("useCase cannot be empty").trim(),
        body("role").isString().withMessage("Role cannot be empty").trim()
    ],

    toggle_widget: [
        body("id").isString().withMessage("ID is require").trim()
    ],

    update_widget: [
        body("title").isString().withMessage("Title cannot be empty").trim(),
        body("id").isString().withMessage("Id cannot be empty").trim(),
        body("website").isString().withMessage("Website cannot be empty").trim(),
    ],


    create_widget: [
        body("title").isString().withMessage("Title cannot be empty").trim(),
        body("feedblocks").isArray().withMessage("Feedblocks cannot be empty"),
        body("channel").isString().withMessage("Channel cannot be empty").trim()
    ],

    

    send_feedback: [
        body("widgetId").isString().withMessage("widgetId cannot be empty").trim(),
        body("businessId").isString().withMessage("businessId cannot be empty").trim(),
        body("feedBlockId").isString().withMessage("feedBlockId cannot be empty").trim(),
        body("customerEmail").isEmail().withMessage("Customer Email cannot be empty").trim(),
        body("feedbackType").isString().withMessage("feedbackType cannot be empty").trim(),
        body("channel").isString().withMessage("channel cannot be empty").trim(),
        body("rating").isInt().withMessage("Rating cannot be empty")
    ],

    send_feedback_reply: [
        body("widgetId").isString().withMessage("widgetId cannot be empty").trim(),
        body("businessId").isString().withMessage("businessId cannot be empty").trim(),
        body("feedBlockId").isString().withMessage("feedBlockId cannot be empty").trim(),
        body("customerEmail").isEmail().withMessage("Customer Email cannot be empty").trim(),
        body("channel").isString().withMessage("channel cannot be empty").trim(),
        body("comment").isString().withMessage("Comment cannot be empty").trim()
    ],

    

    login: [
        body("email").isEmail().trim().withMessage("Email address cannot be empty"),,
        body("password").isString().isLength(6).withMessage("Password cannot be empty")
    ],

    wait_list: [
        body("name").isString().trim(),
        body("email").isEmail().normalizeEmail().trim()
    ],

    resend_verification_email: [
        body("email").isEmail().trim().withMessage("Email address cannot be empty"),
    ],

    create_account: [
        body("name").isString().isLength(3).trim().withMessage("Full Name cannot be empty"),
        body("email").isEmail().trim().withMessage("Email address cannot be empty"),
        body("password").isLength(6).withMessage("Password cannot be empty"),
        body("avatar").isString().trim()
    ],

    forgot_password: [
        body("email").isEmail().trim().withMessage("Email address cannot be empty"),
    ],

    reset_password: [
        body("password").isString().isLength(6).trim().withMessage("Password cannot be empty"),
        body("token").isString().isLength(6).trim().withMessage("Token cannot be empty")
    ],

    update_password: [
        body("old_password").isString().trim(),
        body("confirm_password").isString().trim(),
        body("password").isString().trim(),
    ],

    update_profile: [
        body("first_name").isString().trim(),
        body("last_name").isString().trim(),
        body("user_name").isString().trim(),
        body("photo").isString().trim(),
    ],

    cancel_event: [
        body("event").isString(),
        body("offer").isString(),
        body("paddy_id").isString(),
    ],

    create_category: [
        body("name").isString(),
    ],

    create_sub_category: [
        body("name").isString(),
        body("category").isString(),
    ],

    verify_bvn: [
        body("bvn").isString().trim(),
    ],

    verify_account: [
        body("account_number").isString().trim(),
        body("account_bank").isString().trim(),
    ],

    create_virtual_account: [
        body("bvn").isString().trim(),
    ]

}