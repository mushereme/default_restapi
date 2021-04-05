const moment = require('moment')

exports.isBefore = (date1, date2) => {

    return moment(date1).isBefore(date2)
}


exports.isAfter = (date1, date2) => {

    return moment(date1).isAfter(date2)
}

exports.now = () => {

    return moment().toDate()
}

exports.nowFormat = () => {
    return moment().format()
}