const express = require("express")
const cors = require("cors")
const app = express()

app.use(cors())

// panggil router member
const member = require("./routers/member")

app.use("/member", member)

// panggi router paket
const paket = require("./routers/paket")

app.use("/paket", paket)

// panggil router users
const users = require("./routers/users")

app.use("/users", users)

//panggil router outlet
const outlet = require("./routers/outlet")

app.use("/outlet", outlet)

//pangil router transaksi
const transaksi = require("./routers/transaksi")

app.use("/transaksi", transaksi)

//pangil router login
const {login} = require("./routers/login")

app.use("/login", login)

// endpoint
app.listen(8000,() => {
    console.log(`Server run on port 8000`);
})