import React from "react";
import axios from "axios";
import { baseUrl, authorization, formatNumber } from "../config";
import domToPdf from "dom-to-pdf"
import "../index"

export default class Transaksi extends React.Component {
    constructor() {
        super()
        this.state = {
            transaksi: [],
            visible: "",
            user: "",
            id: "",
            outlets: []
        }
        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    getData() {
        let endpoint = "http://localhost:8000/transaksi"
        axios.get(endpoint, authorization)
            .then(response => {
                let dataTransaksi = response.data
                for (let i = 0; i < dataTransaksi.length; i++) {
                    let total = 0;
                    for (let j = 0; j < dataTransaksi[i].detail_transaksi.length; j++) {
                        let harga = dataTransaksi[i].detail_transaksi[j].paket.harga
                        let qty = dataTransaksi[i].detail_transaksi[j].qty

                        total += (harga * qty)
                    }

                    //tambahkan key total
                    dataTransaksi[i].total = total
                }
                this.setState({ transaksi: dataTransaksi })
            })
            .catch(error => console.log(error));
    }

    getOutlet() {
        let endpoint = `${baseUrl}/outlet`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ outlets: response.data })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getData()
        let user = JSON.parse(localStorage.getItem("user"))
        this.getOutlet()

        // cara kedua
        if (user.role === 'Admin' || user.role === 'Kasir') {
            this.setState({
                visible: true
            })
        } else {
            this.setState({
                visible: false
            })
        }
    }

    convertStatus(id_transaksi, status) {
        if (status === 1) {
            return (
                <div id="action2" className="badge text-white">
                    Transaksi Baru
                    <br></br>
                    <a onClick={() => this.changeStatus(id_transaksi, 2)} className="text-white">
                        klik untuk ganti
                    </a>
                </div>
            )
        } else if (status === 2) {
            return (
                <div id="action3" className="badge text-white">
                    Sedang diproses

                    <br></br>
                    <a onClick={() => this.changeStatus(id_transaksi, 3)} className="text-white">
                        klik untuk ganti
                    </a>
                </div>
            )
        } else if (status === 3) {
            return (
                <div id="action4" className="badge text-white">
                    Siap diambil
                    <br></br>
                    <a onClick={() => this.changeStatus(id_transaksi, 4)} className="text-white">
                        klik untuk ganti
                    </a>
                </div>
            )
        } else if (status === 4) {
            return (
                <div className="badge bg-success text-white">
                    Telah Diambil
                </div>
            )
        }
    }

    changeStatus(id, status) {
        if (window.confirm(`Apakah anda yakin ingin mengganti statusnya?`)) {
            let endpoint = `http://localhost:8000/transaksi/status/${id}`
            let data = {
                status: status
            }

            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(`Status telah diubah!`)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }

    convertStatusBayar(id_transaksi, dibayar) {
        if (dibayar == 0) {
            return (
                <div id="status2" className="badge text-white">
                    Belum dibayar
                    <br></br>

                    <a onClick={() => this.changeStatusBayar(id_transaksi, 1)} className="text-white">
                        klik untuk ganti
                    </a>
                </div>
            )
        } else if (dibayar == 1) {
            return (
                <div id="status1" className="badge text-white">
                    Sudah dibayar
                </div>
            )
        }
    }

    changeStatusBayar(id, status) {
        if (window.confirm(`Apakah anda yakin?`)) {
            let endpoint = `http://localhost:8000/transaksi/bayar/${id}`

            axios.get(endpoint, authorization)
                .then(response => {
                    window.alert(`Status bayar berhasil diubah!`)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }
    deleteTransaksi(id) {
        if (window.confirm(`Apakah anda yakin menghapus data tersebut?`)) {
            let endpoint = `http://localhost:8000/transaksi/${id}`
            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }

    convertPdf() {
        //ambil element yang akan didownload ke pdf
        let element = document.getElementById(`target`)
        let options = {
            filename: "Laporan.pdf"
        }
        domToPdf(element, options, () => {
            window.alert("Laporan akan dicetak!")
        })
    }

    printStruk(id) {
        var element = document.getElementById(`struk${id}`);
        var options = {
            filename: `struk-${id}.pdf`
        };
        domToPdf(element, options, function (pdf) {
            window.alert(`Struk akan dicetak!`)
        });
    }

    render() {
        const target = React.createRef()
        const optionPDF = {
            orientation: `landscape`,
            unit: `cm`,
            format: [21, 29.7]
        }
        return (
            <div className="container">
                <div ref={target} id="target" className="card">
                    <div className="card-header">
                        <div id="card5" className="card-header">
                            <h4 className="text-white text-center">Data Transaksi</h4>
                        </div>
                    </div>

                    <div className="card-body">
                        <button id="card6" className="btn btn-sm mb-3" onClick={() => this.convertPdf()}>
                            <i class="fa-solid fa-file-arrow-down"> </i>
                        </button>
                        <ul className="list-group">
                            {this.state.transaksi.map(trans => (
                                <li className="list-group-item">
                                    <div className="row">
                                        {/* this is member area */}
                                        <div className="col-lg-3">
                                            <small className="text-info">
                                                Member
                                            </small><br />
                                            {trans.member.nama}
                                        </div>

                                        {/* this is outlet area */}
                                        <div className="col-lg-3">
                                            <small className="text-info">
                                                Outlet
                                            </small> <br />
                                            {trans.user.outlet.nama}
                                        </div>

                                        {/* this is transaksi area */}
                                        <div className="col-lg-3">
                                            <small className="text-info">
                                                Tanggal Transaksi
                                            </small><br />
                                            {trans.tgl}
                                        </div>

                                        {/* this is batas waktu area */}
                                        <div className="col-lg-3">
                                            <small className="text-info">
                                                Batas Pengambilan
                                            </small><br />
                                            {trans.batas_waktu}
                                        </div>

                                        {/* this is transaksi area */}
                                        <div className="col-lg-3">
                                            <small className="text-info">
                                                Tanggal Bayar
                                            </small><br />
                                            {trans.tgl_bayar}
                                        </div>

                                        {/* this is status area */}
                                        <div className="col-lg-3">
                                            <small className="text-info">
                                                Status
                                            </small><br />
                                            <h6>{this.convertStatus(trans.id_transaksi, trans.status)}</h6>
                                        </div>

                                        {/* this is status bayar area */}
                                        <div className="col-lg-3">
                                            <small className="text-info">
                                                Status Bayar
                                            </small><br />
                                            <h6>{this.convertStatusBayar(trans.id_transaksi, trans.dibayar)}</h6>
                                        </div>

                                        {/* total */}
                                        <div className="col-lg-3">
                                            <small className="text-info">
                                                Total
                                            </small>
                                            <br></br>
                                            Rp {trans.total}
                                        </div>

                                        {/* this is struk area */}
                                        <div className="col-lg-2">
                                            <small className="text-info">
                                                Struk
                                            </small><br />
                                            <button id="action3" className="btn btn-sm"
                                                onClick={() => this.printStruk(trans.id_transaksi)}>
                                                <i class="fa-solid fa-file-invoice"></i>
                                            </button>
                                        </div>

                                        <div style={{ display: `none` }}>
                                            <div className="col-lg-12 p-3"
                                                id={`struk${trans.id_transaksi}`}>
                                                <h3 className="text-info1 text-center">
                                                    Loundree
                                                </h3>
                                                <h5 className="text-center">
                                                    Jl. Danau Ranau II G2D No 11
                                                    <br />
                                                    Telp: 082132425405 | IG: @laundree.co
                                                </h5>

                                                <h4>Member: {trans.member.nama}</h4>
                                                <h4>Outlet: {trans.user.outlet.nama}</h4>
                                                <h4>Alamat: {trans.user.outlet.alamat}</h4>
                                                <h4>Tgl: {trans.tgl}</h4>

                                                <div className="row mt-3"
                                                    style={{ borderBottom: `1px dotted black` }}>
                                                    <div className="col-4">
                                                        <h5>Paket</h5>
                                                    </div>
                                                    <div className="col-2">
                                                        <h5>Qty</h5>
                                                    </div>
                                                    <div className="col-3">
                                                        <h5>Harga Satuan</h5>
                                                    </div>
                                                    <div className="col-3">
                                                        <h5>Total</h5>
                                                    </div>
                                                </div>

                                                {trans.detail_transaksi.map(item => (
                                                    <div className="row mt-3"
                                                        style={{ borderBottom: `1px dotted black` }}>
                                                        <div className="col-4">
                                                            <h5>{item.paket.jenis_paket}</h5>
                                                        </div>
                                                        <div className="col-2">
                                                            <h5>{item.qty}</h5>
                                                        </div>
                                                        <div className="col-3">
                                                            <h5>Rp {formatNumber(item.paket.harga)}</h5>
                                                        </div>
                                                        <div className="col-3">
                                                            <h5>Rp {formatNumber(item.paket.harga * item.qty)}</h5>
                                                        </div>
                                                    </div>
                                                ))}

                                                <div className="row mt-2">
                                                    <div className="col-lg-9"></div>
                                                    <div className="col-lg-3">
                                                        <h4>Rp {formatNumber(trans.total)}</h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* delete button */}
                                        <div className="col-lg-3">
                                            <small className="text-info">
                                                Action
                                            </small>
                                            <br></br>
                                            <button id="hapus" className="btn btn-sm" onClick={() => this.deleteTransaksi(trans.id_transaksi)}>
                                                <i class="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <br />
                                    {/* area detail transaksi */}
                                    <h5>Detail Transaksi</h5>
                                    {trans.detail_transaksi.map(detail => (
                                        <div className="row">
                                            {/* area nama paket */}
                                            <div className="col-lg-3">
                                                {detail.paket.jenis_paket}
                                            </div>
                                            {/* area quantity paket */}
                                            <div className="col-lg-2">
                                                Qty:
                                                {detail.qty}
                                            </div>
                                            {/* area harga paket */}
                                            <div className="col-lg-3">
                                                @ Rp
                                                {detail.paket.harga}
                                            </div>
                                            {/* area harga total */}
                                            <div className="col-lg-4">
                                                Rp
                                                {detail.paket.harga * detail.qty}
                                            </div>
                                        </div>
                                    ))}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}