import React from 'react'

import User from './User'
import './Form.css'

// Task specified sorting users by date, however adding date is never mentioned
// anywhere else in exercise. I am assuming we should sort users by ip since it's the third 
// parameter required by form 

const emailRegex = RegExp(
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
)

const ipRegex = RegExp(
    /^([0-9]{1,3}\.){3}[0-9]{1,3}$/
)

class Form extends React.Component{

    state = {
        nickname: "",
        email: "",
        ip: "",
        formErrors: {
            nickname: "",
            email: "",
            ip: "",
        },
        isFormValid: "empty",
        users: [
            {
                nickname: "noobmaster69",
                email: "pure@pwnage.com",
                ip: "231.212.155.155"
            },
            {
                nickname: "legend27",
                email: "test2@test2.com",
                ip: "231.212.333.333"
            },
            {
                nickname: "whiskerton",
                email: "all@rise.com",
                ip: "1.1.1.1"
            },
        ]
    }

    // Checks if there is the same nickname or email in users
    validateInput = (property, val) => {
        return (
            this.state.users.filter((item) => {
                return item[property] === val
                })
                .length > 0 ? false : true) 
    }

    // check if all fields in form are filled
    isFormFilled = () => {
        if (this.state.nickname && this.state.email && this.state.ip) return true
        else return false
    }

    // Check form for given errors
    validateForm = (nickval, emailval) => {

        let result = null
        const {nickname, email, ip} = this.state.formErrors
        const nickValInput = this.validateInput("nickname", nickval)
        const emailValInput = this.validateInput("email", emailval)

        if (this.isFormFilled() &&
            nickValInput &&
            emailValInput &&
            nickname === "" &&
            email === "" &&
            ip === ""
            ) {
            result = "valid"
            console.log(this.state.formErrors)
        } else if (!this.isFormFilled()) {
            result = "empty"
        } else if (!nickValInput){
            result = "nickname"
        } else if (!emailValInput) {
            result = "email"
        } 
        
        return result
    }

    // Submit User
    handleSubmit = (event) => {
        event.preventDefault()
        const { nickname, email, ip, isFormValid } = this.state

        switch(isFormValid) {
            case "valid":
                // Adding user to users array
                this.setState((prevState) => ({
                    users: [...prevState.users, {
                        nickname: nickname,
                        email: email,
                        ip: ip
                    }],
                    // empties state
                    nickname: "",
                    email: "",
                    ip: "",
                    isFormValid: ""
                }))
                // this.setState(this.baseState)
                break
            case "empty":
                console.error("Fill all inputs")
                break
            case "nickname":
                console.error("There is such nickname")
                break
            case "email":
                console.error("There is such email")
                break
            default:
                break
        }
    }

    // Handle inputs changes
    handleChange = (event) => {
        event.preventDefault()
        const {name, value} = event.target
        let formErrors = { ...this.state.formErrors }

        switch (name) {
            case "nickname":
                formErrors.nickname = 
                    value.length < 3 ? "minimum 3 characters required" : ""
                break
            case "email":
                formErrors.email = emailRegex.test(value)
                    ? ""
                    : "invalid email adress"
                break
            case "ip":
                formErrors.ip = ipRegex.test(value)
                    ? ""
                    : "invalid ip adress"
                break
            default:
                break
        }

        // changing state and
        // checking validity of form and then passing it to state
        this.setState({ formErrors, [name]: value },
            () => this.setState({
                isFormValid: this.validateForm(this.state.nickname, this.state.email)
            }))
    }


    // Delete specific user
    delUser = (nickname) => {
        this.setState({ 
            users: [...this.state.users
                .filter(user => user.nickname !== nickname)
            ]})
    }

    // delete all users from list
    delAllUsers = () => {
        this.setState({
            users: []
        })
    }

    // callback function to compare parameters of object
    compareParam = (propName) => {
        return ((a, b) => a[propName].toUpperCase() === b[propName].toUpperCase() ? 0 : a[propName].toUpperCase() < b[propName].toUpperCase() ? -1 : 1)
    }

    // Sorting users
    sortUsers = (type) => {
        const userArrSorted = this.state.users.sort(this.compareParam(type))

        this.setState({
            users: userArrSorted
        }) 
    }

    render() {
        const rendUsers = this.state.users.map((user) => <User key={user.nickname} user={user} delUser={this.delUser}/>)
        const { formErrors } = this.state

        return(
            <div>
                <header>
                    <h1>Simply Add Users</h1>
                </header>
                {/* INPUT FORM */}
                <div className="form">
                    <form 
                        onSubmit={this.handleSubmit} 
                        autoComplete="off">
                        <input 
                            type="text"
                            name="nickname"
                            placeholder="Nickname"
                            onChange={this.handleChange}
                            value={this.state.nickname}
                        /> 
        
                        {formErrors.nickname.length > 0 ? <span>{formErrors.nickname}</span> : null}
                        {this.validateInput("nickname", this.state.nickname) 
                            ? null 
                            : <React.Fragment>
                                <span>There already is user with such nickname</span>
                            </React.Fragment>
                        }
                        <br />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={this.handleChange}
                            value={this.state.email}
                        />
        
                        {formErrors.email.length > 0 ? <span>{formErrors.email}</span> : null}
                        {this.validateInput("email", this.state.email)
                            ? null
                            : <React.Fragment>
                                <span>There already is user with this email</span>
                            </React.Fragment>
                        } 
                        <br />

                        <input
                            type="text"
                            name="ip"
                            placeholder="Ip number"
                            onChange={this.handleChange}
                            value={this.state.ip}
                        /> 
                        
                        {formErrors.ip.length > 0 ? <span>{formErrors.ip}</span> : null}
                        <br />

                        <button type="submit" disabled={this.state.isFormValid !== "valid"}>Add user</button>

                        {this.state.isFormValid === "empty" 
                        ? <span className="fill" >Please fill all fields</span>
                        : null
                        }
                    </form>
                </div>

                {/* SORTING BAR */}
                <div className="sort-bar">
                    <h2>Users:</h2>
                    {/* RENDERS USERS LIST */}
                    <table>
                        <tr>
                            <th>
                                <button className="sort-btn"
                                    onClick={() => this.sortUsers("nickname")}
                                    disabled={!this.state.users.length}
                                >Nickname  &#9662;
                                </button>
                            </th>
                            <th>
                                <button className="sort-btn"
                                    onClick={() => this.sortUsers("email")}
                                    disabled={!this.state.users.length}
                                >Email  &#9662;
                                </button>
                            </th>
                            <th>
                                <button className="sort-btn"
                                    onClick={() => this.sortUsers("ip")}
                                    disabled={!this.state.users.length}
                                >Ip  &#9662;
                                </button>
                            </th>
                            <th>
                                <button disabled style={{backgroundColor: "transparent", border: "none"}}>&nbsp;</button>
                            </th>
                        </tr>
                        { rendUsers }
                    </table>

                    {/* REMOVE ALL USERS BUTTON */}
                    <div className="del-btn-container">
                        <button 
                            onClick={() => {if (window.confirm('Do you want to delete all users?')){this.delAllUsers()}} }
                            style={this.state.users.length > 0 ? null : {display: "none"}}
                        >! Delete All Users !
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Form
