import React from 'react'
 
class test extends React.Component{
    render(){
        return (
 
            <div className={`alert alert-${this.props.bgColor}`}>
                    {this.props.label} <br />
                <button className={`btn btn-${this.props.btnColor}`}>
                    {this.props.btnLabel}
                </button>
 
               
            </div>
        )
    }
}
 
export default test;
