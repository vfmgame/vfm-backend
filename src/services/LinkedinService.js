const Secrets = require("../config");
const axios = require("axios").default;
const linkedinEvents = require("../subscribers/linkedin");
const events = require("../subscribers/events");


module.exports = class LinkedinService { 
  constructor(linkedinModel, accountModel) {
    this.linkedinModel = linkedinModel;
    this.accountModel = accountModel;
  }


  

  async GetLinkedinProfile(accessToken) {
    /**
     * @TODO Call Mailchimp/Sendgrid or whatever
    */
   
    try {
      
        //const response = await axios.get(`https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))&oauth2_access_token=${accessToken}`,
        const response = await axios.get("https://api.linkedin.com/v2/userinfo",
        {
          "headers": {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
          }
        });
        // id: response.data.id,
        // image: response.data.profilePicture["displayImage~"].elements[3].identifiers[0].identifier,
        // firstName: response.data.firstName.localized.en_US,
        // lastName: response.data.lastName.localized.en_US
      return {
        id: response.data.sub,
        image: response.data.picture,
        firstName: response.data.given_name,
        lastName: response.data.family_name,
        email: response.data.email
      }
    } catch(e) {
      console.log(e);
      return  { error: e };
    }
  }


  async ListLinkedinAccounts(id, main_id) {
    const account = await this.accountModel.findOne({ creator_id: main_id });
    if(account.account_status === "expired" && account.number_of_days_left_in_trial < 0 && account.can_use_ai === false) {
      let error = new Error("Trial period has expired!");
      error.statusCode = 402;
      throw error;
    }
    const linkedinAccounts = await this.linkedinModel.find({ creator_id: main_id });
    const filteredAccounts = linkedinAccounts.filter(account => delete account._doc.access_token)
    .filter(account => delete account._doc.scope)
    .filter(account => delete delete account._doc.expires_in)
    .filter(account => delete delete account._doc.refresh_token)
    return filteredAccounts;
  }

  async DeleteLinkedinAccount(account, id) {
    const linkedinAccount = await this.linkedinModel.findOneAndDelete({ user_id: account }); 
    if (!linkedinAccount) {
      let error = new Error("Cannot perform task, try again!");
      error.statusCode = 400;
      throw error;
    }
    linkedinEvents.dispatch(events.linkedin.removeAccount, { creator_id: id, account });
    return linkedinAccount;
  }


  async ConnectLinkedin() {
    const response = await axios({
      method: "GET",
      url: `${Secrets.LINKEDIN_AUTH_URL}?response_type=code&client_id=${Secrets.LINKEDIN_CLIENT_ID}&redirect_uri=${Secrets.LINKEDIN_REDIRECT_LIVE_URL}&scope=openid%20profile%20email%20r_liteprofile%20r_emailaddress%20w_member_social`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
    })
    console.log(Secrets.LINKEDIN_REDIRECT_LIVE_URL);
    console.log(response);
    console.log(response.request.path);
    return response.request.path;
  }
  

  async GetLinkedinAuthToken(code, redirect_uri, id, workspace, main_id) {

    //console.log(redirect_uri);

    // const response = await axios.post(Secrets.LINKEDIN_ACCESS_TOKEN_URL,
    //   {
    //     grant_type: "authorization_code",
    //     code,
    //     client_id: Secrets.LINKEDIN_CLIENT_ID,
    //     client_secret: Secrets.LINKEDIN_CLIENT_SECRET,
    //     redirect_uri
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded"
    //     },
    //   }
    // )
    // .then((res) => {
    //   console.log(res);
    // }).catch((err) => {
    //   console.log(err);
    // })

    try {
      const response = await axios.post(Secrets.LINKEDIN_ACCESS_TOKEN_URL,
        {
          grant_type: "authorization_code",
          code,
          client_id: Secrets.LINKEDIN_CLIENT_ID,
          client_secret: Secrets.LINKEDIN_CLIENT_SECRET,
          redirect_uri
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
        }
      )
      const linkedinProfile = await this.GetLinkedinProfile(response.data.access_token);
      linkedinEvents.dispatch(events.linkedin.addAccount, { id, main_id, workspace, linkedinProfile, account: response.data });

      return response.data
      

    } catch (error) {
      return { error };
    }

    // if(!response) {
    //   let error = new Error("Could not connect Linkedin");
    //   error.statusCode = 422;
    //   throw error;
    // }

    
    //console.log(response.data);
    //AQQsif0bdHMfmnQQQLe7Jj4bn_Hrp2TSLBDoFTvKJFdcgjHX7uYdhWrroDCYn8sd2ycUVdaZa8RwbUc_K7uQh5tlw7X8Ppi5nhdmI93C50UHdZS_JIZYOxqOv38FvGmfrW_Hu4wr5iNr8qNtDKhSJvXFXkItV9vxfI3853efXDZNH

    // const linkedinProfile = await this.GetLinkedinProfile(response.data.access_token);

    //linkedinEvents.dispatch(events.linkedin.getProfile, { id, main_id, workspace, token, account: response.data });
    
    //linkedinEvents.dispatch(events.linkedin.addAccount, { id, main_id, workspace, account: response.data });

    // return linkedinProfile;
  }
}