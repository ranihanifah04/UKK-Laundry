
import React from "react";
import "./App.css";
import Member from "./pages/Member";
import Paket from "./pages/Paket";
import Users from "./pages/User";
import FormTransaksi from "./pages/FormTransaksi"
import Transaksi from "./pages/Transaksi"
import Login from "./pages/Login";
import { BrowserRouter, Route, Routes} from "react-router-dom";
import Navbar from "./Navbar";
import Dashboard from "./pages/Dashboard";
import Outlet from "./pages/Outlet";

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar><Dashboard/></Navbar>}/>
        <Route path="/transaksi" element={<Navbar><Transaksi/></Navbar>}/>
        <Route path="/member" element={<Navbar><Member/></Navbar>}/>
        <Route path="/paket" element={<Navbar><Paket/></Navbar>}/>
        <Route path="/users" element={<Navbar><Users/></Navbar>}/>
        <Route path="/outlet" element={<Navbar><Outlet/></Navbar>}/>
        <Route path="/form-transaksi" element={<Navbar><FormTransaksi/></Navbar>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  );
}