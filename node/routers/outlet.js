const { response, request } = require("express")
const express = require("express")
const app = express()

// membaca request dari body dengan tipe json
app.use(express.json())

// panggil models
const models = require("../models/index")

//panggil model "outlet"
const outlet = models.outlet

// panggil fungsi auth -> validasi token
const {auth} = require("./login")

// fungsi auth dijadikan middleware
app.use(auth)

//endpoint for get all outlet
app.get("/", async (request, response) => {
    let dataOutlet = await outlet.findAll()

    return response.json(dataOutlet)
})

// endpoint add new outlet
app.post("/", (request, response) => {
    let newOutlet = { //menampung data
        nama: request.body.nama, 
        alamat: request.body.alamat,
    }

    outlet.create(newOutlet)
    .then(result => {
        response.json({
            message: `Data berhasil ditambahkan`,
            data: result
        })
    })
    .catch(error => {
        response.json({
            message: error.message
        })
    })
})

//endpoint update data outlet
app.put("/:id", (request, response) => {
    // tampung data yg akan diubah
    let data = {
        nama: request.body.nama,
        alamat: request.body.alamat,
    }

    let parameter = {
        id: request.params.id
    }

    // proses update 
    outlet.update(data, {where: parameter})
    .then(result => {
        return response.json({
            message: `Data berhasil diubah`,
            data: result
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

//endpoint hapus data outlet
app.delete("/:id", (request, response) => {
    // tampung data yang akan dihapus
    let parameter = {
        id: request.params.id
    }

    // proses hapus
    outlet.destroy({ where: parameter})
    .then(result => {
        return response.json({
            message: `Data berhasil dihapus`
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
})

module.exports = app