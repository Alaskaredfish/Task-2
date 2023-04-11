const { ROLE } = require('../data')
// Import contact model
Contact = require('../contactModel');
const e = require('express');

function viewContact(role) {
  if (role == ROLE.ADMIN) {
    return true;
  }

 return false;
}

async function canEditContact(req, res, next) {
  const query = {_id: req.params.contact_id};
  try {
      const contacts = await Contact.findOne(query);
      if (req.body.role == ROLE.ADMIN || contacts.creatorID == req.body.username) {
        next();
      }
      else {
        res.status(403).send('No permission, plesae contact system admin');    
      }
  } catch {
      res.status(500).send();
  }
}

async function canDeleteContact(contact_id, username, role) {
  const query = {_id: contact_id};
  try {
      const contacts = await Contact.findOne(query);
      return (role == ROLE.ADMIN || contacts.creatorID == username);
  } catch {
      res.status(500).send();
  }
}

module.exports = {
  viewContact,
  canEditContact,
  canDeleteContact,
}