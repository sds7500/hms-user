/*This model is responsible for storing User related information and methods which includes 
    1-Details of the user ( Name, Email and Password )
    2-encryptPassword Method ( to secure user password by encrypting using bcrypt )
    3-validatePassword Method ( to match the user entered password with encrypted password )
*/
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const Schema=mongoose.Schema;

const UserSchema=new Schema({
    name: {type:String, required:true},
    email: {type:String, required:true},
    password:{type:String, required:true}
})

UserSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(5);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};
  
UserSchema.methods.validPassword = async function(candidatePassword) {
  const result = await bcrypt.compare(candidatePassword, this.password);
  return result;
};

module.exports=mongoose.model('user',UserSchema);