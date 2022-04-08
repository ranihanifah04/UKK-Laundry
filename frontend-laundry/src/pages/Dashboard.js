import React, { useReducer } from "react";
import axios from "axios";
import { authorization, formatNumber } from "../config";
import "../index.css"

export default class Dashboard extends React.Component{
    constructor(){
        super()

        this.state = {
            jumlahMember: 0,
            jumlahPaket: 0,
            jumlahTransaksi: 0,
            income: 0
        }
        if(!localStorage.getItem("token")){
            window.location.href = "/login"
        }
    }

    getSummary(){
        let endpoint = `http://localhost:8000/member`
        axios.get(endpoint, authorization)
        .then(response => {
            this.setState({jumlahMember: response.data.length})
        })
        .catch(error => console.log(error))

        //paket
        endpoint = `http://localhost:8000/paket`
        axios.get(endpoint, authorization)
        .then(response => {
            this.setState({jumlahPaket: response.data.length})
        })
        .catch(error => console.log(error))

        //transaksi
        endpoint = `http://localhost:8000/transaksi`
        axios.get(endpoint, authorization)
        .then(response => {
            let dataTransaksi = response.data
            let income = 0
            for (let i = 0; i < dataTransaksi.length; i++) {
                let total  = 0;
                for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
                    let harga = dataTransaksi[i].detail_transaksi[j].paket.harga
                    let qty = dataTransaksi[i].detail_transaksi[j].qty
                    
                    total += (harga * qty)
                }

                income += total
            }
            this.setState({
                jumlahTransaksi: response.data.length,
                income: income
            })
        })
        .catch(error => console.log(error))
    }

    componentDidMount(){
        this.getSummary()
    }
    render(){
        let greeting = JSON.parse(localStorage.getItem(`user`))
        return(
            <div className="container">
                <div className="row">
                    <div>
                        <h1>Hi, Welcome {greeting.role} {greeting.nama}!</h1>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div id="card1" className="card text-center m-1">
                            <div className="card-body">
                                <h4 className="card-title"><i class="fa-solid fa-user"></i> Jumlah Member</h4>
                                <h2 id="cardState">{this.state.jumlahMember}</h2>
                                <h6 id="cardDesk">Member yang tergabung dalam laundry</h6>
                                <hr></hr>
                                <a id="link" href="/member">See more detail <i class="fa-solid fa-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div id="card2" className="card text-center m-1">
                            <div className="card-body">
                                <h4 className="card-title"><i class="fa-solid fa-box"></i> Jumlah Paket</h4>
                                <h2 id="cardState">{this.state.jumlahPaket}</h2>
                                <h6 id="cardDesk">Jenis yang tersedia</h6>
                                <hr></hr>
                                <a id="link" href="/paket">See more detail <i class="fa-solid fa-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <div id="card3" className="card text-center m-1">
                            <div className="card-body">
                                <h4 className="card-title"> <i class="fa-solid fa-tags"></i> Jumlah Transaksi</h4>
                                <h2 id="cardState">{this.state.jumlahTransaksi}</h2>
                                <h6 id="cardDesk">Jumlah pencapaian transaksi</h6>
                                <hr></hr>
                                <a id="link" href="/transaksi">See more detail <i class="fa-solid fa-arrow-right"></i> </a>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-12">
                        <div id="card4" className="card text-center m-1">
                            <div className="card-body">
                                <h4 className="card-title text-white text-center"> 
                                <i class="fa-solid fa-money-bill-transfer"></i> Income
                                </h4>
                                <h2 id="cardState" className="text-white text-center">Rp {formatNumber(this.state.income)}</h2>
                                <h6 id="cardDesk" className="text-white text-center">Jumlah pemasukan</h6>
                                <hr></hr>
                                <a id="link" href="/form-transaksi">Tambah transaksi baru <i class="fa-solid fa-plus"></i> </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}