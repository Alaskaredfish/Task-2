// contactController.js
const { viewContact, canEditContact, canDeleteContact } = require ('./authenticate_authorise/permission')
// Import contact model
Contact = require('./contactModel');
// Handle index actions
exports.index = async function (req, res) {
    if (viewContact(req.body.role)) {
        Contact.get(function (err, contacts) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            res.json({
                status: "success",
                message: "Contacts retrieved successfully",
                data: contacts
            });
        });
    } else {
        const query = {creatorID: req.body.username};
        try {
            const contacts = await Contact.find(query);
              res.json({
                status: "success",
                mesaage: "Contacts retrieved successfully",
                data: contacts
              });
        } catch {
            res.status(500).send()
        }
    }
};
// Handle create contact actions
exports.new = function (req, res) {
    var contact = new Contact();
    contact.name = req.body.name ? req.body.name : contact.name;
    contact.gender = req.body.gender;
    contact.email = req.body.email;
    contact.phone = req.body.phone;
    contact.creatorID = req.body.username;
// save the contact and check for errors
    contact.save(function (err) {
        if (err){
            res.status(400).send(err);
        }
        else {
            res.json({
                message: 'New contact created!',
                data: contact
            });
        }
    });
};
// Handle view contact info
exports.view = function (req, res) {
    Contact.findById(req.params.contact_id, function (err, contact) {
        if (err)
            res.status(400).send(err);
        else {
            res.json({
            message: 'Contact details loading..',
            data: contact
            });
        }
    });
};
// Handle update contact info
exports.update = function (req, res) {
    Contact.findById(req.params.contact_id, function (err, contact) {
        if (err)
            res.send(err);
        contact.name = req.body.name ? req.body.name : contact.name;
        contact.gender = req.body.gender ? req.body.gender : contact.gender;
        contact.email = req.body.email ? req.body.email : contact.email;
        contact.phone = req.body.phone ? req.body.phone : contact.phone;
        // save the contact and check for errors
        contact.save(function (err) {
            if (err)
                res.json(err);
            else {
                res.json({
                message: 'Contact Info updated',
                data: contact
                });
            }
        });
    });
};
// Handle delete contact
exports.delete = function (req, res) {
    Contact.deleteMany({
        _id: req.params.contact_id
    }, function (err, contact) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'Contact deleted'
        });
    });
};