const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const moment = require("moment")
const hashPassword = require("../utils/hashPassword")
'use strict';

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '9',
      validate: {
        isIn: {
          args: [["0", "1", "9"]],
          msg: "Define user status"
        }
      }
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    action: DataTypes.STRING,
    ip: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpire: DataTypes.DATE,
    about: { 
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.username} - ${this.email}`
      }
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci', 
    sequelize,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ],
    defaultScope: {
      attributes: { exclude: ['password'] }
    },
    scopes: {
      withPassword: {
        attributes: {
          include: ['password']
        }
      }
    }
  });

  //  ######  ####### ####### ####### ######  ####### 
  //  #     # #       #       #     # #     # #       
  //  #     # #       #       #     # #     # #       
  //  ######  #####   #####   #     # ######  #####   
  //  #     # #       #       #     # #   #   #       
  //  #     # #       #       #     # #    #  #       
  //  ######  ####### #       ####### #     # ####### 
  
  user.beforeCreate(hashPassword)
  user.beforeUpdate(hashPassword)


  //   #####  ####### ####### ####### ####### #    # ####### #     # 
  //  #     # #          #       #    #     # #   #  #       ##    # 
  //  #       #          #       #    #     # #  #   #       # #   # 
  //  #  #### #####      #       #    #     # ###    #####   #  #  # 
  //  #     # #          #       #    #     # #  #   #       #   # # 
  //  #     # #          #       #    #     # #   #  #       #    ## 
  //   #####  #######    #       #    ####### #    # ####### #     # 
  
  user.prototype.getJsonWebToken = function () {
    const token = jwt.sign({ id: this.id, status: this.status }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN})
    // console.log('I AM GENERATED TOKEN: ', token)
    // console.log("WITH: ", this.id)
    // console.log("WITH: ", this.status)
    return token
  }

  //   #####  #     # #######  #####  #    # ######     #     #####   #####  #     # ####### ######  ######  
  //  #     # #     # #       #     # #   #  #     #   # #   #     # #     # #  #  # #     # #     # #     # 
  //  #       #     # #       #       #  #   #     #  #   #  #       #       #  #  # #     # #     # #     # 
  //  #       ####### #####   #       ###    ######  #     #  #####   #####  #  #  # #     # ######  #     # 
  //  #       #     # #       #       #  #   #       #######       #       # #  #  # #     # #   #   #     # 
  //  #     # #     # #       #     # #   #  #       #     # #     # #     # #  #  # #     # #    #  #     # 
  //   #####  #     # #######  #####  #    # #       #     #  #####   #####   ## ##  ####### #     # ######  
  
  user.prototype.checkPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
  }
  
  //   #####  ####### #     #  #####  #     #    #    #     #  #####  ####### ####### ####### #    # ####### #     # 
  //  #     # #       ##    # #     # #     #   # #   ##    # #     # #          #    #     # #   #  #       ##    # 
  //  #       #       # #   # #       #     #  #   #  # #   # #       #          #    #     # #  #   #       # #   # 
  //  #  #### #####   #  #  # #       ####### #     # #  #  # #  #### #####      #    #     # ###    #####   #  #  # 
  //  #     # #       #   # # #       #     # ####### #   # # #     # #          #    #     # #  #   #       #   # # 
  //  #     # #       #    ## #     # #     # #     # #    ## #     # #          #    #     # #   #  #       #    ## 
  //   #####  ####### #     #  #####  #     # #     # #     #  #####  #######    #    ####### #    # ####### #     # 
  
  user.prototype.generatePasswordChangeToken = function () {
    const resetToken = crypto.randomBytes(30).toString("hex")

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.resetPasswordExpire = moment().add(2, 'h').utc(8).format()

    return resetToken
  }

  //  ######  #######  #####  ####### ####### ######     #     #####   #####  #     # ####### ######  ######  
  //  #     # #       #     # #          #    #     #   # #   #     # #     # #  #  # #     # #     # #     # 
  //  #     # #       #       #          #    #     #  #   #  #       #       #  #  # #     # #     # #     # 
  //  ######  #####    #####  #####      #    ######  #     #  #####   #####  #  #  # #     # ######  #     # 
  //  #   #   #             # #          #    #       #######       #       # #  #  # #     # #   #   #     # 
  //  #    #  #       #     # #          #    #       #     # #     # #     # #  #  # #     # #    #  #     # 
  //  #     # #######  #####  #######    #    #       #     #  #####   #####   ## ##  ####### #     # ######  
  
  user.prototype.resetPassword = async function (password) {
    
  }

  user.associate = function(models) {
    // user.hasMany(models.shareholder, {
    //   onDelete: 'NO ACTION',
    //   onUpdate: 'CASCADE'
    // })
    // user.hasMany(models.discussion_vote, {
    //   onDelete: 'NO ACTION',
    //   onUpdate: 'CASCADE'
    // })
    // user.hasMany(models.bod_vote, {
    //   onDelete: 'NO ACTION',
    //   onUpdate: 'CASCADE'
    // })
    // user.hasMany(models.company, {
    //   onDelete: 'NO ACTION',
    //   onUpdate: 'CASCADE'
    // })
  }
  
  return user
}