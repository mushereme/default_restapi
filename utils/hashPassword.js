const bcrypt = require('bcrypt')

var hashPassword = ( user ) => {
  if(!user.changed('password')) return true
  return new Promise(async (resolve, reject) => {
    var salt = await bcrypt.genSalt(10)
    bcrypt.hash(user.password, salt, (err, hashedPassword) => {
      if(err) reject(err)
      else resolve(hashedPassword)
    })
  }).then((hashedPassword) => {
    user.password = hashedPassword
  })
}

module.exports = hashPassword