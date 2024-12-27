const { array } = require("joi");
const { generateUniqueId } = require("../helper");
const getLinkedinPage = require("../services/LinkedinPeopleSearch");
const searchPeople = require("../services/ScrapeDataService");

module.exports = class ProspectService {
  constructor(prospectModel, prospectListModel) {
    this.prospectModel = prospectModel;
    this.prospectListModel = prospectListModel;
  }

  async FetchProspect(handle) {
    const fetchProspect = await this.prospectModel.findOne({ handle });
    if (!fetchProspect) {
      let error = new Error("Lead doesn't exists.");
      error.statusCode = 404;
      throw error;
    }
   
    return fetchProspect;
  }

  async ListProspects(user) {
    const listProspects = await this.prospectModel.find({ user_id: user });
    if (!listProspects) {
      let error = new Error("You have no leads!");
      error.statusCode = 400;
      throw error;
    }
    
    return listProspects;
  }


  async FetchProspectList(user) {
    const fetchProspectList = await this.prospectModel.find({ user_id: user }).sort({ _id: -1 });
    if (!fetchProspectList) {
      let error = new Error("You have no lists!");
      error.statusCode = 400;
      throw error;
    }
    return fetchProspectList;
  }


  async FetchSingleProspect(user, name) {
    const fetchProspect = await this.prospectModel.findOne({ user_id: user, name });
    if (!fetchProspect) {
      let error = new Error("Prospect does not exists!");
      error.statusCode = 400;
      throw error;
    }
    return fetchProspect;
  }


  async CreateProspectList(data) {
    const checkExistingProspect = await this.prospectModel.findOne({ user_id: data.id, name: data.name });

    if (checkExistingProspect) {
      let error = new Error("List already exists.");
      error.statusCode = 400;
      throw error;
    }

    const list = await this.prospectModel.create({
      user_id: data.id,
      name: data.name
    });

    if (!list) {
      let error = new Error("Cannot perform task, try again!");
      error.statusCode = 500;
      throw error;
    }

    const fetchProspectList = await this.prospectModel.find({ user_id: data.id }).sort({ _id: -1 });
    console.log(fetchProspectList);
    return fetchProspectList;
  }


  async AddProspects(data, name, page, user) {
    const ts = new Date(); // timestamp
    const item = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      phone: data.phone,
      region: data.region,
      photo: data.photo,
      handle: data.handle,
      headline: data.headline,
      company: data.company,
      created_at: ts,
      updated_at: ts
    }
    const prospect = await this.prospectModel.findOneAndUpdate({ user_id: user, name }, { $set: { page, updated_at: ts } }, { $push: { prospects: item }}, {upsert: true});

    if (!prospect) {
      let error = new Error("Cannot perform task, try again!");
      error.statusCode = 500;
      throw error;
    }
    return prospect;
  }


    
  async CreateProspect(data, user) {
    // const options = { ordered: true };
    // const leads = data.map(p => ({ ...p, user_id: user, source: "linkedin", job_title: p.jobTitle.split(" ")[0] + " " + p.jobTitle.split(" ")[1] }));
    // const prospects = await this.prospectModel.insertMany(leads, options);

    // if (!prospects) {
    //   let error = new Error("Cannot perform task, try again!");
    //   error.statusCode = 500;
    //   throw error;
    // }
    //return prospects;
  //   const checkName = await this.prospectModel.findOne({ name: data.name });

  //   if(checkName) {

  //   }


  // async function updateList() {

  //   const update = await this.prospectModel.update(leads, options);
  // } 
  
  const prospects = [
    {
      url: 'https://www.linkedin.com/in/daniel-chukwurah'
    },
    {
      url: 'https://www.linkedin.com/in/abdulazeez-adeyiga'
    },
    {
      url: 'https://www.linkedin.com/in/metibemu-oluwatobi-abishai'
    },
    {
      url: 'https://www.linkedin.com/in/imkida'
    },
    {
      url: 'https://www.linkedin.com/in/alandouglasdan'
    },
    {
      url: 'https://www.linkedin.com/in/adedayo-jiboye-661632146'
    },
    {
      url: 'https://www.linkedin.com/in/onyenuwe-japheth-14a711150'
    },
    {
      url: 'https://www.linkedin.com/in/peter-odekwo'
    },
    {
      url: 'https://www.linkedin.com/in/timileyin-babalola-283b4b149'
    },
    {
      url: 'https://www.linkedin.com/in/andymobile'
    }
  ]


  const lists = [
    {
      url: 'https://www.linkedin.com/in/alandouglasdan'
    },
    {
      url: 'https://www.linkedin.com/in/adedayo-jiboye-661632146'
    },
    {
      url: 'https://www.linkedin.com/in/onyenuwe-japheth-14a711150'
    },
    {
      url: 'https://www.linkedin.com/in/peter-odekwo'
    },
    {
      url: 'https://www.linkedin.com/in/timileyin-babalola-283b4b149'
    },
    {
      url: 'https://www.linkedin.com/in/andymobile'
    }
  ]
  
  
  async function createList(arr) {
    let scanned = 0;
    let success = 0;
    let duplicates = false;
    const newLists = [];


    // check for duplicates

    // for (let index = 0; index < list.length; index++) {
    //   //console.log(array[index].url);
    //   scanned += 1;
    //   if(prospects.includes(list[index].url)) {
    //     console.log(list[index].url);
    //     console.log("hello");
    //     duplicates = true;
    //   } else {
    //     success += 1;
    //     newLists.push(list[index].url)
    //   }
    //   console.log(duplicates);
    //   // console.log(scanned);
    //   // console.log(success);
      
    // }

    // console.log(newLists);

    // let unique1 = prospects.filter((o) => lists.indexOf(o) === -1);
    // //let unique2 = lists.filter((o) => prospects.indexOf(o) === -1);

    // const unique = unique1;

    // console.log(unique);

    let res = arr.filter(e => arr.indexOf(e.url) == arr.lastIndexOf(e.url));

    console.log(res);


    // Save the geniuen ones


    // Send update responses



    //const create = await this.prospectModel.insertMany(list, options);
  }  


    // const { data: html } = await axios.get("https://www.linkedin.com/in/omodauda");
    // console.log(html);

    // const browser = await puppeteer.launch({ headless: true});
    // const page = await browser.newPage();

    // await page.goto("https://www.linkedin.com/in/kemekenneth/");

    // await page.waitForNavigation({ waitUntil: "networkidle0"})

    // const title = await page.evaluate(() => document.title);

    // const hey = await page.evaluate(() => document.querySelector("div.inline-show-more-text"))

    // console.log(title);

    // await browser.close() 

    // const { data: html } = await axios.get("https://example.com/");
    // const $ = cheerio.load(html);
    // const title = $('title').text();
    // console.log(title);

    //const res = await getLinkedinPage("https://www.linkedin.com/in/teneeto/");
    //const res = await searchPeople("react native", 1)
    const hello = prospects.concat(lists);
    createList(hello);

    //console.log(res);

    

   


  }
}
