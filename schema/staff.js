var mongoose = require('./db.js'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10,
    Schema = mongoose.Schema;

var StaffSchema = new Schema({
    "name": { type: String },
    "mobile": { type: Number },
    "number": { type: Number },
    "uid": { type: String },
    "position": { type: String },
    "mail": { type: String },
    "website": { type: String },
    "password": { type: String, required: true },
});

StaffSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

StaffSchema.methods.comparePassword = function(candidatePassword, cb) {	
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null,isMatch);
    });
};

module.exports = mongoose.model('staff', StaffSchema, 'staff');