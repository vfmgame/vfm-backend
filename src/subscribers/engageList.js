const { engage } = require("./events");
const ContactModel = require("../models/Contact");
const EngageListModel = require("../models/EngageList");
const EventEmitter = require("events");
const { v4: uuidv4 } = require('uuid');



class EngageEvents extends EventEmitter {
    dispatch(eventName, message) {
      this.emit(eventName, message);
    }
}

const engageEvents = new EngageEvents();


engageEvents.on(engage.createContact, async({ list_id }) => {
    const ts = new Date();
    const contacts = await ContactModel.find({ list_id });
    await EngageListModel.findOneAndUpdate({ id: list_id }, {
        $set: {
            contacts_count: contacts.length,
            updated_at: ts
        },
        },
        {
            new: true
    });
})


engageEvents.on(engage.deleteContact, async({ list_id }) => {
    const ts = new Date();
    const contacts = await ContactModel.find({ list_id });
    await EngageListModel.findOneAndUpdate({ id: list_id }, {
        $set: {
            contacts_count: contacts.length,
            updated_at: ts
        },
        },
        {
            new: true
    });
})


module.exports = engageEvents;
