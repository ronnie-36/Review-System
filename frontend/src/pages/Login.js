import React, { useEffect, useState } from "react";
import "./css/Login.css";
import { Button, Card, CardBody, Input } from "reactstrap";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { GoogleLoginButton } from "react-social-login-buttons";
import { Link, useNavigate } from "react-router-dom";
import {
  loginWithGoogle,
  sendOTPMobile,
  verifyMobileOTP,
} from "../apiHelpers/authentication";

function Login() {
  const [mobile, setMobile] = useState("");
  const [OTPSent, setOTPSent] = useState(false);
  const [error, setError] = useState("");
  const [OTPTimer, setOTPTimer] = useState(null);
  const [clearTimer, setClearTimer] = useState(null);
  const [OTP, setOTP] = useState("");

  const navigate = useNavigate();

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

  async function sendForOTP() {
    if (isValidPhoneNumber(mobile)) {
      const response = await sendOTPMobile(mobile);
      if (response.status === "success") {
        setOTPSent(true);
        console.log(mobile);
        setOTPTimer(120);
      } else {
        setError(response.error);
      }
    } else {
      setError("Please enter a Valid Mobile Number");
    }
  }

  function handelMobileChange(number) {
    setError("");
    setMobile(number);
  }

  async function handleMobileLogin() {
    const response = await verifyMobileOTP(mobile, OTP);
    if (response.status === "success") {
      navigate("/");
    } else {
      setError("Wrong OTP");
    }
  }

  function handleGoogleLogin() {
    loginWithGoogle();
  }

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
          {OTPSent && (
            <Input
              className="mt-3"
              value={OTP}
              onChange={(e) => {
                setError("");
                setOTP(e.target.value);
              }}
              placeholder="Enter OTP"
            />
          )}

          <p className="w-100 mt-3 text-danger">{error}</p>

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
        </CardBody>
      </Card>
    </div>
  );
}

export default Login;
