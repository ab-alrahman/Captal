const express = require("express")
const morgan = require("morgan");
const { notFound ,errorHandler} = require("./middlewares/Error")
const cors = require("cors")
const connectToDb= require("./config/connectToDB")
require("dotenv").config()
connectToDb();


//Init App
const app = express()

//Cors Policy
app.use(cors())

//Apply Middlewares    
app.use(express.json())
app.use(morgan('dev'))

// Routes
app.use("/api/captal/auth",require("./routes/auth"))
app.use("/api/captal/order",require("./routes/order"))
app.use("/api/captal/user",require("./routes/user"))
app.use("/api/captal/matrial",require("./routes/matrials"))


// Error Handler middlewares
app.use(notFound)
app.use(errorHandler)

const PORT=process.env.PORT || 6000
app.listen(PORT,()=>console.log(`server is running in ${process.env.NODE_ENV} on port ${PORT}`))
