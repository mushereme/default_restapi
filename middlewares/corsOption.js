/**
 * 
 * Зөвхөн зөвшөөрөгдсөн хаягаас холбогдох эрхтэй
 * 
 * @param {http} req 
 * @param {*} callback 
 */

module.exports = corsOptionsDelegate = (req, callback) => {
    var corsOptions;
    const whitelist = process.env.WHITE_LIST
    // console.log("============", req.header('Origin'))

    // console.log(req)
    if(whitelist.indexOf(req.header('Origin')) !== -1) {
        console.log('LISTED')
        corsOptions = { 
            origin: true, 
            allowHeaders: "Authorization, Set-Cookie, Content-Type",
            methods: 'GET, POST, PUT, DELETE', 
            credentials: true,
        }
    } else {
        console.log('NOT LISTED')
        corsOptions = { origin: false }
    }
    callback(null, corsOptions)
}