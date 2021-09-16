//  #     #    #    ### #     # 
//  ##   ##   # #    #  ##    # 
//  # # # #  #   #   #  # #   # 
//  #  #  # #     #  #  #  #  # 
//  #     # #######  #  #   # # 
//  #     # #     #  #  #    ## 
//  #     # #     # ### #     # 

const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const fileupload = require("express-fileupload")
const path = require("path")
const http = require('http')
const { socketio } = require('./utils/socketio')

//  ######  ####### #     # ####### #######  #####  
//  #     # #     # #     #    #    #       #     # 
//  #     # #     # #     #    #    #       #       
//  ######  #     # #     #    #    #####    #####  
//  #   #   #     # #     #    #    #             # 
//  #    #  #     # #     #    #    #       #     # 
//  #     # #######  #####     #    #######  #####  

const userRoutes = require("./routes/users")
const uploadRoutes = require("./routes/upload")
const emailRoutes = require("./routes/email")

//  ######  #######  #####  #     # ### ######  ####### 
//  #     # #       #     # #     #  #  #     # #       
//  #     # #       #     # #     #  #  #     # #       
//  ######  #####   #     # #     #  #  ######  #####   
//  #   #   #       #   # # #     #  #  #   #   #       
//  #    #  #       #    #  #     #  #  #    #  #       
//  #     # #######  #### #  #####  ### #     # ####### 

require("dotenv").config()
require("colors")

//  #     # ### ######  ######  #       ####### ### #     # ######  ####### ######  #######  #####  
//  ##   ##  #  #     # #     # #       #        #  ##   ## #     # #     # #     #    #    #     # 
//  # # # #  #  #     # #     # #       #        #  # # # # #     # #     # #     #    #    #       
//  #  #  #  #  #     # #     # #       #####    #  #  #  # ######  #     # ######     #     #####  
//  #     #  #  #     # #     # #       #        #  #     # #       #     # #   #      #          # 
//  #     #  #  #     # #     # #       #        #  #     # #       #     # #    #     #    #     # 
//  #     # ### ######  ######  ####### ####### ### #     # #       ####### #     #    #     #####  

const morgan = require("morgan")
const { logger, accessLogStream } = require("./middlewares/logger")
const errorHandler = require("./middlewares/error")
const injectDb = require("./middlewares/injectDb")
const corsOptionsDelegate = require('./middlewares/corsOption')

//   #####  ####### #     #  #####  ####### 
//  #     # #     # ##    # #     #    #    
//  #       #     # # #   # #          #    
//  #       #     # #  #  #  #####     #    
//  #       #     # #   # #       #    #    
//  #     # #     # #    ## #     #    #    
//   #####  ####### #     #  #####     #     

const db = require('./models/index.js')
const { protect, authorize } = require("./middlewares/protect")
const app = express()

//  #     # ### ######  ######  #       ####### #     #    #    ######  ####### 
//  ##   ##  #  #     # #     # #       #       #  #  #   # #   #     # #       
//  # # # #  #  #     # #     # #       #       #  #  #  #   #  #     # #       
//  #  #  #  #  #     # #     # #       #####   #  #  # #     # ######  #####   
//  #     #  #  #     # #     # #       #       #  #  # ####### #   #   #       
//  #     #  #  #     # #     # #       #       #  #  # #     # #    #  #       
//  #     # ### ######  ######  ####### #######  ## ##  #     # #     # ####### 

app.use(express.json())
app.use(fileupload())
app.use(morgan('combined', {stream: accessLogStream}))
app.use(logger)
app.use(injectDb(db))
app.use(cors(corsOptionsDelegate))
app.use(cookieParser())
app.set('views', path.join(__dirname, './views'))
app.set('view engine', 'pug')

//  ######  ####### #     # ####### #######  #####  
//  #     # #     # #     #    #    #       #     # 
//  #     # #     # #     #    #    #       #       
//  ######  #     # #     #    #    #####    #####  
//  #   #   #     # #     #    #    #             # 
//  #    #  #     # #     #    #    #       #     # 
//  #     # #######  #####     #    #######  #####  

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/email', emailRoutes)
app.use('/upload', uploadRoutes)

// app.use('/pdf', protect, authorize("0", "1"), express.static(path.join(__dirname, './pdf')))
app.use(express.static(path.join(__dirname, './public')))

//  ####### ######  ######  ####### ######  #     #    #    #     # ######  #       ####### ######  
//  #       #     # #     # #     # #     # #     #   # #   ##    # #     # #       #       #     # 
//  #       #     # #     # #     # #     # #     #  #   #  # #   # #     # #       #       #     # 
//  #####   ######  ######  #     # ######  ####### #     # #  #  # #     # #       #####   ######  
//  #       #   #   #   #   #     # #   #   #     # ####### #   # # #     # #       #       #   #   
//  #       #    #  #    #  #     # #    #  #     # #     # #    ## #     # #       #       #    #  
//  ####### #     # #     # ####### #     # #     # #     # #     # ######  ####### ####### #     # 

app.use(errorHandler)


//   #####  #     # #     #  #####  
//  #     #  #   #  ##    # #     # 
//  #         # #   # #   # #       
//   #####     #    #  #  # #       
//        #    #    #   # # #       
//  #     #    #    #    ## #     # 
//   #####     #    #     #  #####  

db.sequelize
    .sync({
        // force: true
    })
    .then(() => {
        console.log('Sequelize sync...'.cyan)
    })
    .catch(err => {
        console.log(err)
    })

//   #####  ####### ####### #     # ######  
//  #     # #          #    #     # #     # 
//  #       #          #    #     # #     # 
//   #####  #####      #    #     # ######  
//        # #          #    #     # #       
//  #     # #          #    #     # #       
//   #####  #######    #     #####  #       

const server = http.createServer(app)

socketio(server)

server.listen(process.env.PORT, () => {
    console.log('Server is running on: ' + process.env.PORT.cyan + ' with ' + process.env.NODE_ENV)
})

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error:  ${err.message}`.underline.red.bold)
    server.close(() => {
        process.exit(1)
    })
})