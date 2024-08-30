const express = require('express')
const methodOverride = require('method-override')
const flash = require('express-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const routeAdmin = require('./routes/admin/index.route')
const route = require('./routes/client/index.route')
const bodyParser = require('body-parser')
const systemConfig = require('./config/system')

require('dotenv').config()

//METHOD OVERRIDE
const app = express()
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({ extended: false }))

// FLASH
app.use(cookieParser('asdasdasdas'))
app.use(session({ cookie: { maxAge: 60000 } }))
app.use(flash())
// END FLASH

const database = require('./config/database')

database.connect()

const port = process.env.PORT

app.set('views', `${__dirname}\\views`)
app.set('view engine', 'pug')

app.locals.prefixAdmin = systemConfig.prefixAdmin

app.use(express.static(`${__dirname}\\public`))

console.log('dirName : ', __dirname + '\\public')

routeAdmin(app)
route(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
