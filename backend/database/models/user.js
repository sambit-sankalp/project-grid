const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
mongoose.promise = Promise;

const userSchema = new Schema({
    name: { type: String, unique: false, required: false },
    userType: {type: String},
    email: { type: String, unique: false, required: false },
    walletAddress: {type: String, unique: false, required: true}
})

// userSchema.methods = {
//     checkPassword: function (inputPassword) {
//       return bcrypt.compareSync(inputPassword, this.password);
//     },
//     hashPassword: (plainTextPassword) => {
//       return bcrypt.hashSync(plainTextPassword, 10);
//     },
//   };
  

  // userSchema.pre("save", function (next) {
  //   if (!this.password) {
  //     console.log("models/user.js =======NO PASSWORD PROVIDED=======");
  //     next();
  //   } else {
  //     console.log("models/user.js hashPassword in pre save");
  
  //     this.password = this.hashPassword(this.password);
  //     next();
  //   }
  // });
  
  const User = new mongoose.model("User", userSchema);
  
  module.exports = { User };