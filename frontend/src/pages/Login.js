import React, { useState } from "react";
import "./Login.css";
import { Alert, Button, Card, CardBody, Input } from "reactstrap";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { GoogleLoginButton } from "react-social-login-buttons";

function Login() {
  const [mobile, setMobile] = useState("");
  const [OTPSent, setOTPSent] = useState(false);
  const [error, setError] = useState(false);

  function sendForOTP() {
    if (isValidPhoneNumber(mobile)) {
      setOTPSent(true);
      console.log(mobile);
    } else {
      setError(true);
    }
  }

  function handelMobileChange(number) {
    setError(false);
    setMobile(number);
  }

  function handleMobileLogin() {}

  function handleGoogleLogin() {}

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center LoginPage">
      <Card className="p-3" style={{ width: "25rem", height: "28rem" }}>
        <CardBody className="d-flex flex-column justify-content-center">
          <PhoneInput
            placeholder="Enter phone number"
            value={mobile}
            onChange={handelMobileChange}
            defaultCountry="IN"
          />
          {error && (
            <p className="w-100 mt-3 text-danger">
              Please Enter a Valid Mobile Number
            </p>
          )}
          {OTPSent && <Input className="mt-3" placeholder="Enter OTP" />}
          {!OTPSent && (
            <Button onClick={sendForOTP} color="primary" className="mt-3 w-100">
              Get OTP
            </Button>
          )}
          {OTPSent && (
            <Button
              onClick={handleMobileLogin}
              color="primary"
              className="mt-3 w-100"
            >
              Login
            </Button>
          )}

          <GoogleLoginButton
            className="mt-3 w-100"
            onClick={handleGoogleLogin}
          />

          <hr />
          <Button className="SignUpBtn w-100">Sign Up</Button>
        </CardBody>
      </Card>
    </div>
  );
}

export default Login;
