const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require ('jsonwebtoken');
const User = require('../models/User');
const Inquiry = require('../models/Inquiry')

// userID is primary key
const signToken = userID => {
// will return actual JWT token
// we can send any data inside payload but not info like credict cards
    return JWT.sign({
// who issue this JWT token
        iss: "tastyTreatsApp",
// who is this token for
        sub: userID
// this risk manager must be same as secretOrKey
    }, "tastyTreats", {expiresIn: "5hr"});
}

userRouter.post('/register', (req, res) => {
    const { username, password, role} = req.body;
    User.findOne({username}, (err, user) =>{
        if(err)
            res.status(500).json({message: {msgBody : 'Error has occured', msgErr: true}})
            if(user)
            res.status(400).json({message: {msgBody : 'Username is already taken', msgErr: true}})
        else{
            const newUser = new User({username, password, role});
            newUser.save(err => {
                if(err)
                res.status(500).json({message: {msgBody : 'Error has occured', msgErr: true}});
                else{
                    res.status(201).json({message: {msgBody : 'Account successfully created', msgErr: false}})
                }
            })
        }
    })
});

// use passport local middleware
userRouter.post('/login', passport.authenticate('local', {session: false}), (req, res) => {
// if authenticated
    if(req.isAuthenticated()){
// get the user info from user object
    const {_id, username, role} = req.user;
    // create a JWT token using "_id"
    const token = signToken(_id);
// setting cookie,
// httpOnly mean you cannot touct this cookie using JavaScript(it will prevent cross-site scripting attacks)
// sameSite property for against cross-site request forgery attacks
    res.cookie('access_token', token, {httpOnly: true, sameSite: true});
    res.status(200).json({isAuthenticated:true, user:{username, role}})
}

});
// creating inquiries route
userRouter.post('/inquiries', (req, res) =>{
const newInquiry = new Inquiry(req.body);
newInquiry.save(err => {
    // If there is an error saving inquiry, return 500 'Internal Server Error' code
    if (err) {
      res
        .status(500)
        .json({
          message: {
            msgBody: "An error occured while saving your inquiry",
            msgErr: true
          },
        });
    }
    // If no error occurred, new inquiry was created so return 201 'Created' code
    else {
      res      
        .status(201)
        .json({
          message: {
            msgBody: "Inquiry successfully submitted",
            msgErr: false,
          },
        });
    }
  });
})
// gett all inquiries
userRouter.get('/inquiryInfo', (req, res) =>{
    Inquiry.find({})
      .sort({ date: -1 })
      .then(Inquiries =>
        // If project data was returned from the DB, return a 200 'OK' code
        res
          .status(200)
          .json({
            message: {
              msgBody: "All customer Inquiries ordered by date",
              msgErr: false,
            },
            data: { Inquiries },
          })
      )
      // If an error was caught, return a 422 'Unprocessable Entity' code
      .catch(err =>
        res
          .status(422)
          .json({
            message: {
              msgBody: "Error has occured",
              msgErr: true
            }
          })
      );
  },
)
//Creating the logout route
userRouter.get('/logout', passport.authenticate('jwt', {session : false}), (req, res) =>{
    res.clearCookie('access_token');
    res.json({user : {username: ""}, success: true});
});

userRouter.get('/admin', passport.authenticate('jwt', {session: false}), (req, res) => {
    if(req.user.role ==='admin')
        res.status(200).json({message: {msgBody : 'You are an admin', msgErr: false}});
        else{
            res.status(403).json({message : {msgBody: "You are not an admin, can't access", msgErr: false}})
        }
    
});

userRouter.get('/authenticated', passport.authenticate('jwt', {session : false}), (req, res) =>{
    const {username, role} = req.user;
    res.status(200).json({isAuthenticated : true, user: {username, role}});
});

module.exports = userRouter;