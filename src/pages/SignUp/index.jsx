import React, { Component } from "react";
import {object , string, boolean } from 'yup';

import "./style.css";

import Dots from "../../images/Group.png";
import GoogleIcon from "../../images/flat-color-icons_google.svg";

import Container from "../../Components/Container";
import Button from "../../Components/Button";
import MainText from "../../Components/MainText";
import Logo from "../../Components/Logo";
import FormText from "../../Components/FormText";
import Input from "../../Components/Input";
import Or from "../../Components/Or";
import PasswordStrong from "../../Components/PasswordStrong";
import Back from "../../Components/Back";
import Checkbox from "../../Components/Checkbox";
import Alert from "../../Components/Alart";

const defaults = {
  name:"",
  email: "",
  password: "",
  confirmPassword: "",
  isWrongRepeat:false,
  passwordStrength: "",
}
const passwordRegexStrong = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#*$%^&])(?=.{8,})/;
    const passwordRegexMedium = /(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.{6,})/;
export default class SignUp extends Component {
  state = {
    name:"",
    email: "",
    password: "",
    confirmPassword: "",
    myData: defaults,
    passwordStrength: "",
    isWrongRepeat:false,
    isSuccessfullyRegistered:false,
    isChecked:false
  };
  schema = object().shape({
    name: 
      string()
      .min(8, "Name should be more than 8 characters long")
      .max(20)
      .required("Name is required"),
    email: 
      string()
      .email("Invalid email")
      .required("Email is required"),
    password: 
      string()
      .min(8, "Password must be at least 8 characters long")
      .matches(passwordRegexStrong, "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character")
      .required("Password is required"),
    confirmPassword: 
    string()
    .test('passwords-match', 'Passwords must match',  () =>{
      const status = this.state.password === this.state.confirmPassword
      this.setState({isWrongRepeat: !status})
      return status;
    })
    .required("Confirm password is required"),
    isChecked: 
      boolean()
      .oneOf([true], "You must agree to the terms and conditions")
      .required("You must agree to the terms and conditions"),
  });
  
  validate = (value) => {
      if (value.match(passwordRegexStrong)) {
        this.setState({passwordStrength:"strong"})
      }
      else if (value.match(passwordRegexMedium)) {
        this.setState({passwordStrength:"medium"})
      } else {
        this.setState({passwordStrength:"weak"})
      }
  };
  // why the validate never to go in then ?! and do this in schema is importent ?!
  // validate = (value) => {
  //   this.schema.validate({password: value})
  //   .then(() => {
  //     // Password is strong
  //     console.log("strong password");
  //     this.setState({passwordStrength:"strong"})
  //   })
  //   .catch(() => {
      //     // Password is medium or weak
  //      if (value.match(passwordRegexMedium)) {
  //       this.setState({passwordStrength:"medium"})
  //     } else {
  //       this.setState({passwordStrength:"weak"})
  //     }
  //   });
  // };

  handleSubmit = (e) => {
    e.preventDefault()
    this.schema
    .validate({
      name:this.state.name,
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      isChecked:this.state.isChecked
    })
    .then(() => {
      this.setState((prevState) => ({ myData: { name: prevState.name, email: prevState.email, password: prevState.password },isSuccessfullyRegistered:true, ...defaults }));
    })
    .catch((e) => console.log(e.errors));
  };
  handleChangeCheckBox = (e)=>{
    this.setState({isChecked:e.target.checked})
  }
  handleChangeInput = (e) => {
    const { value, id } = e.target;
    this.setState({ [id]: value });
    if (id === "password") {
      this.validate(value);
    }
  };
  close =()=> this.setState({isSuccessfullyRegistered:false})
  render() {
    return (
      <Container>
        <div className="mainbox signUp">
          <div className={`imgBox ${this.props.class || ""}`}>
            <Logo />
            <img src={Dots} alt="" className="dots" />
            <MainText color="#fff" />
          </div>
          <div className="form">
            <Back onclick={() => this.props.pageShow("LogIn")} />
            <div className="content">
              <FormText
                H1="Register Individual Account!"
                P="For the purpose of gamers regulation, your details are required."
              />
              <form onSubmit={this.handleSubmit}>
              <Input
                  onChange={this.handleChangeInput}
                  id="name"
                  type="text"
                  placeholder="Enter email name"
                  label="User Name*"
                  value={this.state.name}
                />
                <Input
                  onChange={this.handleChangeInput}
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  label="Email address*"
                  value={this.state.email}
                />
                <Input
                  onChange={this.handleChangeInput}
                  id="password"
                  type="password"
                  placeholder="Password"
                  label="Create password*"
                  value={this.state.password}
                />
                <PasswordStrong passwordStrength={this.state.passwordStrength} />
                <Input
                  onChange={this.handleChangeInput}
                  id="confirmPassword"
                  type="password"
                  placeholder="Repeat password"
                  label="Repeat password*"
                  value={this.state.confirmPassword}
                  className={this.state.isWrongRepeat?"wrong":""}
                />
                <Checkbox id="agree" label="I agree to terms & conditions" onChange={this.handleChangeCheckBox} />
                <Button type="submit" bgColor="#1565D8" color="#fff">
                  Register Account
                </Button>
                <Or />
                <div className="LogInBtn">
                  <img src={GoogleIcon} alt="" className="icon" />
                  <Button
                    type="button"
                    bgColor="#fff"
                    onclick={() => this.props.pageShow("LogIn", true)}
                    color="#000"
                  >
                    login
                  </Button>
                </div>
              </form>
            </div>
          </div>
        {this.state.isSuccessfullyRegistered&&<Alert Login={ () => this.props.pageShow("LogIn")} close={this.close}/>}
        </div>
      </Container>
    );
  }
}