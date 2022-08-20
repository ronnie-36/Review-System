import React, { useEffect, useState } from "react";
import "./css/Login.css";
import { Button, Card, CardBody, Input } from "reactstrap";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { GoogleLoginButton } from "react-social-login-buttons";
import { Link } from "react-router-dom";

function Login() {
  const [mobile, setMobile] = useState("");
  const [OTPSent, setOTPSent] = useState(false);
  const [error, setError] = useState(false);
  const [OTPTimer, setOTPTimer] = useState(null);
  const [clearTimer, setClearTimer] = useState(null);

  useEffect(() => {
    if (OTPTimer && OTPTimer < 0) {
      console.log(OTPTimer);
      clearInterval(clearTimer);
      setClearTimer(null);
      setOTPTimer(null);
    } else if (OTPTimer && clearTimer == null && OTPTimer > 0) {
      const timeout = setInterval(
        () => setOTPTimer((OTPTimer) => OTPTimer - 1),
        1000
      );
      setClearTimer(timeout);
    }
  }, [OTPTimer, clearTimer]);

  function sendForOTP() {
    if (isValidPhoneNumber(mobile)) {
      setOTPSent(true);
      console.log(mobile);
      setOTPTimer(120);
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
      <Card className="p-3 pt-5 pb-5" style={{ width: "25rem" }}>
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
          {OTPSent && (
            <Button
              onClick={handleMobileLogin}
              color="primary"
              className="mt-3 w-100"
            >
              Login
            </Button>
          )}
          <div className="mt-3">
            {OTPTimer && <p>Resend OTP in {OTPTimer} seconds</p>}
            <Button
              onClick={sendForOTP}
              color="primary"
              disabled={OTPSent && OTPTimer != null}
              className=" w-100"
            >
              {OTPSent ? "Resend OTP" : "Get OTP"}
            </Button>
          </div>
          <div className=" mt-2 mb-1 d-flex flex-row align-middle">
            <hr className="w-50" />
            <p>or</p>
            <hr className="w-50" />
          </div>

          <GoogleLoginButton className="w-100" onClick={handleGoogleLogin} />

          <div>
            New User? <Link to={"../signup"}>Register</Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Login;
