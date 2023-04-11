
// Import login model
User = require('../userModel');
// Initialise bcrypt
let bcrypt = require('bcrypt');
const e = require('express');



async function authUser(req, res, next) {
    if (req.body.username == null) {
      res.status(401)
      return res.send('You need to sign in')
    }
  
    const query = {username: req.body.username};
    try {
        const user = await User.findOne(query);
        if (user == null){
            res.status(400).send('Invalid user') 
        }
        if (await bcrypt.compare(req.body.password, user.password)){
          res.status(200)  
          next()
        } else {
            res.status(401).send('Wrong password')
        }
    } catch {
        res.status(500).send()
    }

  }
  
  function authRole(role) {
    return (req, res, next) => {
      if (req.body.role !== role) {
        res.status(401)
        return res.send('Not allowed')
      }
  
      next()
    }
  }
  
  module.exports = {
    authUser,
    authRole
  }