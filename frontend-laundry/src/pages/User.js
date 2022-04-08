import React from "react";
import { Modal } from "bootstrap";
import axios from "axios";
import { baseUrl, authorization } from "../config.js";
import { BiSearchAlt } from "react-icons/bi";
import "../index"


class Users extends React.Component {
    constructor() {
        super()
        this.state = {
            id_user: "",
            nama: "",
            username: "",
            password: "",
            role: "",
            id: "",
            visible: "",
            userss: [],
            outlets: [],
            masterUserss: []
        }

        if (!localStorage.getItem("token")) {
            window.location.href = "/login"
        }
    }

    tambahData() {
        this.modalUsers = new Modal(document.getElementById("modal_users"))
        this.modalUsers.show() // menampilkan modal

        // reset state untuk form user
        this.setState({
            action: "tambah",
            id_user: Math.random(1, 1000),
            nama: "",
            username: "",
            password: "",
            role: "Admin",
            id: ""
        })
    }

    ubahData(id_user) {
        this.modalUsers = new Modal(document.getElementById("modal_users"));
        this.modalUsers.show();

        // mencari index posisi dari data user yang akan diubah
        let index = this.state.userss.findIndex(
            (user) => user.id_user === id_user
        )

        this.setState({
            action: "ubah",
            id_user: id_user,
            nama: this.state.userss[index].nama,
            username: this.state.userss[index].username,
            password: this.state.userss[index].password,
            role: this.state.userss[index].role,
            id: this.state.userss[index].id
        })
    }

    hapusData(id_user) {
        if (window.confirm("Apakah anda yakin untuk menghapus data ini?")) {

            // let temp = this.state.userss;
            // let index = temp.findIndex((user => user.id_user === id_user))

            // temp.splice(index, 1);

            // this.setState({userss: temp})
            let endpoint = "http://localhost:8000/users/" + id_user

            axios.delete(endpoint, authorization)
                .then((response) => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch((error) => console.log(error));
        }
    }

    simpanData(event) {
        event.preventDefault();
        // preventDefault -> mencegah aksi default dari form submit

        // cek aksi tambah atau ubah
        if (this.state.action === "tambah") {
            let endpoint = `${baseUrl}/users`
            // menampung data isian dalam user
            let data = {
                id_user: this.state.id_user,
                nama: this.state.nama,
                username: this.state.username,
                password: this.state.password,
                role: this.state.role,
                id: this.state.id

            }
            axios.post(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            // menghilangkan modal
            this.modalUsers.hide()
        } else if (this.state.action === "ubah") {
            let endpoint = `${baseUrl}/users/` + this.state.id_user

            let data = {
                id_user: this.state.id_user,
                nama: this.state.nama,
                username: this.state.username,
                password: this.state.password,
                role: this.state.role,
                id: this.state.id,


            }

            axios.put(endpoint, data, authorization)
                .then(response => {
                    window.alert(response.data.message)
                    this.getData()
                })
                .catch(error => console.log(error))

            this.modalPaket.hide()
        }
    }

    getData() {
        let endpoint = `${baseUrl}/users`
        axios.get(endpoint, authorization)
            .then(response => {
                this.setState({ userss: response.data })
                this.setState({ masterUserss: response.data })
            })
            .catch(error => console.log(error))
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
        // fungsi ini dijalankan setelah fungsi render berjalan
        this.getData()
        let user = JSON.parse(localStorage.getItem("user"))
        this.getOutlet()

        // cara kedua
        if (user.role === 'Admin') {
            this.setState({
                visible: true
            })
        } else {
            this.setState({
                visible: false
            })
        }
    }

    searching(ev) {
        let code = ev.keyCode;
        if (code === 13) {
            let data = this.state.masterUserss;
            let found = data.filter(it =>
                it.nama.toLowerCase().includes(this.state.search.toLowerCase()))
            this.setState({ userss: found });
        }
    }

    render() {
        return (
            <div className="container">
                <div className="card">
                    <div className="card-header">
                        <div id="card5" className="card-header">
                            <h4 className="text-white text-center">
                                Data User
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
                            {this.state.userss.map(user => (
                                <li className="list-group-item">
                                    <div className="row">
                                        <div className="col-lg-2">
                                            <small className="text-info">Nama</small>
                                            <br></br> <h6>{user.nama}</h6>
                                        </div>
                                        <div className="col-lg-2">
                                            <small className="text-info">Username</small>
                                            <br></br> <h6>{user.username}</h6>
                                        </div>
                                        <div className="col-lg-2">
                                            <small className="text-info">Role</small>
                                            <br></br> <h6>{user.role}</h6>
                                        </div>
                                        <div className="col-lg-4">
                                            <small className="text-info">Outlet</small>
                                            <br></br> <h6>{user.outlet.nama}</h6>
                                        </div>
                                        <div className="col-lg-2 justify-content-center align-self-center">
                                            <div>
                                                <button id="edit" className={`btn btn-sm btn-info mx-2 ${this.state.visible ? `` : `d-none`}`}
                                                    onClick={() => this.ubahData(user.id_user)}>
                                                    <i class="fa-solid fa-pen-to-square" ></i>
                                                </button>
                                                <button id="hapus" className={`btn btn-sm btn-danger mx-2 ${this.state.visible ? `` : `d-none`}`}
                                                    onClick={() => this.hapusData(user.id_user)}>
                                                    <i class="fa-solid fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button id="card6" className={`btn btn-sm my-2 text-white ${this.state.visible ? `` : `d-none`}`}
                            onClick={() => this.tambahData()}>
                            Tambah Data
                        </button>
                    </div>
                </div>

                {/* form modal data paket */}
                <div className="modal" id="modal_users">
                    <div className="modal-dialog modal-md">
                        <div className="modal-content">
                            <div id="card5" className="modal-header">
                                <h4 className="text-white">Form Data User</h4>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={(ev) => this.simpanData(ev)}>
                                    Nama
                                    <input type="text" className="form-control mb-2" value={this.state.nama}
                                        onChange={(ev) => this.setState({ nama: ev.target.value })}></input>
                                    Username
                                    <input type="text" className="form-control mb-2" value={this.state.username}
                                        onChange={(ev) => this.setState({ username: ev.target.value })}></input>
                                    Password
                                    <input type="password" className="form-control mb-2" value={this.state.password}
                                        onChange={(ev) => this.setState({ password: ev.target.value })}></input>

                                    Role
                                    <select className="form-control mb-2"
                                        value={this.state.role}
                                        onChange={(ev) => this.setState({ role: ev.target.value })}>
                                        <option value="Kasir">Kasir</option>
                                        <option value="Admin">Admin</option>
                                        <option value="Owner">Owner</option>
                                    </select>

                                    Outlet
                                    <select className="form-control mb-2"
                                        value={this.state.id}
                                        onChange={e => this.setState({ id: e.target.value })}>
                                        <option value="">--Pilih Outlet--</option>
                                        {this.state.outlets.map(outlet => (
                                            <option value={outlet.id}>
                                                {outlet.nama}
                                            </option>
                                        ))}
                                    </select>



                                    <button id="card6" className="btn" type="submit">Simpan</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default Users