import React from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import { baseUrl, authorization } from "../config"
import { BiSearchAlt } from "react-icons/bi";
import "../index.css"

class Member extends React.Component {
    constructor() {
        super()
        this.state = {
            id_member: "",
            nama: "",
            alamat: "",
            jenis_kelamin: "",
            telepon: "",
            action: "",
            role: "",
            visible: true,
            members: [],
            masterMembers: []
        }
        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    tambahData() {
        this.modalMember = new Modal(document.getElementById("modal_member"))
        this.modalMember.show() // menampilkan modal

        // reset state untuk form member
        this.setState({
            action: "tambah",
            id_member: Math.random(1, 10000),
            nama: "",
            alamat: "",
            jenis_kelamin: "Wanita",
            telepon: ""
        })
    }

    ubahData(id_member) {
        this.modalMember = new Modal(document.getElementById("modal_member"))
        this.modalMember.show() // menampilkan modal

        // mencari index posisi dari data member yang akan diubah
        let index = this.state.members.findIndex(
            (member) => member.id_member === id_member
        )

        this.setState({
            action: "ubah",
            id_member: id_member,
            nama: this.state.members[index].nama,
            alamat: this.state.members[index].alamat,
            jenis_kelamin: this.state.members[index].jenis_kelamin,
            telepon: this.state.members[index].telepon
        })

    }

    hapusData(id_member) {
        if (window.confirm("Apakah anda yakin untuk menghapus data ini?")) {

            let endpoint = "http://localhost:8000/member/" + id_member

            axios.delete(endpoint, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
        }
    }

    simpanData(event) {
        event.preventDefault();
        // preventDefault -> mencegah aksi default dari form submit

        // cek aksi tambah atau ubah
        if (this.state.action === "tambah") {
            let endpoint = "http://localhost:8000/member"
            // menampung data isian dalam user
            let data = {
                id_member: this.state.id_member,
                nama: this.state.nama,
                alamat: this.state.alamat,
                jenis_kelamin: this.state.jenis_kelamin,
                telepon: this.state.telepon
            }

            // tambahkan ke state array members
            // let temp = this.state.members
            // temp.push(data) // menambah data pada array
            // this.setState({ members: temp })
            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            // menghilangkan modal
            this.modalMember.hide()
        } else if (this.state.action === "ubah") {
            let endpoint = "http://localhost:8000/member/" + this.state.id_member

            let data = {
                id_member: this.state.id_member,
                nama: this.state.nama,
                alamat: this.state.alamat,
                jenis_kelamin: this.state.jenis_kelamin,
                telepon: this.state.telepon
            }

            axios.put(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))
            // let temp = this.state.members
            // let index = temp.findIndex(
            //     member => member.id_member === this.state.id_member
            // )

            // temp[index].nama = this.state.nama
            // temp[index].alamat = this.state.alamat
            // temp[index].jenis_kelamin = this.state.jenis_kelamin
            // temp[index].telepon = this.state.telepon

            // this.setState({members: temp})

            this.modalMember.hide()
        }
    }

    getData() {
        let endpoint = "http://localhost:8000/member"
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ members: response.data })
                this.setState({ masterMembers: response.data })
            })
            .catch(error => console.log(error))
    }


    componentDidMount() {
        //FUNGSI INI DIJALANKAN SETELAH FUNGSI RENDER DIJALANKAN
        this.getData();
        let user = JSON.parse(localStorage.getItem("user"))
        //cara pertama
        this.setState({
            role: user.role
        })
        //cara kedua
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

    showAddButton() {
        if (this.state.role === 'Admin' || this.state.role === 'Kasir') {
            return (
                <button id="card6"
                    className="btn btn-sm my-3"
                    onClick={() => this.tambahData()}
                >
                    Tambah data
                </button>
            )
        }
    }

    searching(ev) {
        let code = ev.keyCode;
        if (code === 13) {
            let data = this.state.masterMembers;
            let found = data.filter(it =>
                it.nama.toLowerCase().includes(this.state.search.toLowerCase()))
            this.setState({ members: found });
        }
    }

    render() {
        return (
            <div className="container">
                <div className="card">
                    <div className="card-header">
                        <div id="card5" className="card-header">
                            <h4 className="text-white text-center">
                                Data Member
                            </h4>
                        </div>
                    </div>
                    <div className="card-body">
                    <div className="col-sm-4 my-2">
                            <div class="d-flex">
                                <BiSearchAlt style={{ marginLeft: "1rem", marginTop: "0.5rem", position: "absolute" }} color="#808080" size="1.5em" />
                                <input class="form-control me-2 px-5" type="search" placeholder="Search" aria-label="Search"
                                    value={this.state.search} onChange={ev => this.setState({ search: ev.target.value })} onKeyUp={(ev) => this.searching(ev)} />
                            </div>
                        </div>
                        <ul className="list-group">
                            {this.state.members.map(member => (
                                <li className="list-group-item">
                                    <div className="row">
                                        <div id="action1" className="col-lg-2">
                                            <small className="text-info">Nama</small> <br></br>
                                            <h6>{member.nama}</h6>
                                        </div>
                                        <div id="action1" className="col-lg-2">
                                            <small className="text-info"> Jenis Kelamin</small> <br></br>
                                            <h6>{member.jenis_kelamin}</h6>
                                        </div>
                                        <div id="action1" className="col-lg-2">
                                            <small className="text-info"> Telepon</small> <br></br>
                                            <h6>{member.telepon}</h6>
                                        </div>
                                        <div id="action1" className="col-lg-4">
                                            <small className="text-info"> Alamat</small> <br></br>
                                            <h6>{member.alamat}</h6>
                                        </div>
                                        <div id="action1" className="col-lg-2 justify-content-center align-self-center">
                                            <div >
                                                <button id="edit" className={`btn btn-sm mx-2 ${this.state.visible ? `` : `d-none`}`}
                                                    onClick={() => this.ubahData(member.id_member)}>
                                                    <i class="fa-solid fa-pen-to-square" ></i>
                                                </button>
                                                <button id="hapus"
                                                    className={`btn btn-sm btn-danger mx-2 ${this.state.visible ? `` : `d-none`}`}
                                                    onClick={() => this.hapusData(member.id_member)}
                                                >
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>



                        <button id="card6" type="button" className={`btn my-2 ${this.state.visible ? `` : `d-none`}`}
                            onClick={() => this.tambahData()}>
                            Tambah Data
                        </button>
                    </div>

                    <div className="modal" id="modal_member">
                        <div className="modal-dialog modal-md">
                            <div className="modal-content">
                                <div id="card5" className="modal-header">
                                    <h4 className="text-white">
                                        Form Data Member
                                    </h4>
                                </div>

                                <div className="modal-body">
                                    <form onSubmit={ev => this.simpanData(ev)}>
                                        Nama
                                        <input type="text" className="form-control mb-2"
                                            value={this.state.nama}
                                            onChange={(ev) => this.setState({ nama: ev.target.value })} />

                                        Jenis Kelamin
                                        <select className="form-control mb-2"
                                            value={this.state.jenis_kelamin}
                                            onChange={(ev) => this.setState({ jenis_kelamin: ev.target.value })}>
                                            <option value="Wanita">Wanita</option>
                                            <option value="Pria">Pria</option>
                                        </select>

                                        Telepon
                                        <input type="text" className="form-control mb-2"
                                            value={this.state.telepon}
                                            onChange={(ev) => this.setState({ telepon: ev.target.value })} />

                                        Alamat
                                        <input type="text" className="form-control mb-2"
                                            value={this.state.alamat}
                                            onChange={(ev) => this.setState({ alamat: ev.target.value })} />


                                        <button id="card6" className="btn" type="submit">Simpan</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Member