const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        min: 6,
        max: 15        
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        require: true
    },
    
});

// use this function to hash the password before saving to database
// this is mongoose midleware, once saved it will go to next
// use old function wants to access to "this"
UserSchema.pre('save',function(next){
    // if password already modified
    if(!this.isModified('password'))
    return next();
    bcrypt.hash(this.password, 10, (err, passwordHash) => {
        if(err)
        return next(err);
        this.password = passwordHash;
        next();
    });
});

//creating a comparePassword method as parameters password which is we are getting from the user and (cb as done) 
UserSchema.methods.comparePassword = function(password, cb){
//  compare password, we getting from user and the one saved in database
    bcrypt.compare(password, this.password, (err, isMatch) => {
       // if we got any error with comparing
        if(err)
        //call cb with error
        return cb(err);
        // if there are no errors with compareing
        else{
            // if passwords match?
            if(!isMatch)
            // is not match call done function isMatch will be false
            return cb(null, isMatch);
            // if there is a match call done and return user object
            // "this" mean user 
            return cb(null, this);
        }
    });
}


module.exports = mongoose.model('User', UserSchema);