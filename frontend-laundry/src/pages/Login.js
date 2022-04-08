import axios from "axios";
import React from "react";
import "../index"

class Login extends React.Component {
    constructor() {
        super()
        this.state = {
            username: "",
            password: "",
        }
    }

    loginProcess(event) {
        event.preventDefault()

        let endpoint = "http://localhost:8000/login"

        let data = {
            username: this.state.username,
            password: this.state.password
        }

        axios.post(endpoint, data)
            .then(result => {
                if (result.data.logged) {
                    // store token in local storage
                    localStorage.setItem("token", result.data.token)
                    localStorage.setItem("user", JSON.stringify(result.data.user))
                    window.alert("Login berhasil!")
                    window.location.href = "/"
                } else {
                    window.alert("Maaf, username atau password anda salah")
                }
            })
            .catch(error => console.log(error));
    }
    render() {
        return (
            <div className="container">
                <div className="col-lg-6" style={{ margin: "0 auto", marginTop: "15%" }}>
                    <div className="card">
                        <div className="card-body">
                            <h2 id="tittle"> <i class="fa-solid fa-arrow-right-to-bracket"></i> Login</h2>
                            <form onSubmit={ev => this.loginProcess(ev)}>
                                Username
                                <input type="text" className="form-control mb-2" required
                                    value={this.state.username} onChange={ev => this.setState({ username: ev.target.value })}></input>
                                Password
                                <input type="password" className="form-control mb-2" required
                                    value={this.state.password} onChange={ev => this.setState({ password: ev.target.value })}></input>

                                <button id="card6" type="submit" className="btn btn-login">
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login