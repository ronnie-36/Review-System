import React, { useEffect, useState } from "react";
import "./css/Login.css";
import { Button, Card, CardBody, Input, Spinner } from "reactstrap";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { GoogleLoginButton } from "react-social-login-buttons";
import { useNavigate } from "react-router-dom";
import {
  loginWithGoogle,
  sendOTPMobile,
  verifyMobileOTP,
} from "../apiHelpers/authentication";
import { toast } from "react-toastify";

function Login({ setLogged }) {
  const [mobile, setMobile] = useState("");
  const [OTPSent, setOTPSent] = useState(false);
  const [error, setError] = useState("");
  const [OTPTimer, setOTPTimer] = useState(null);
  const [clearTimer, setClearTimer] = useState(null);
  const [OTP, setOTP] = useState("");
  const [sendOTPLoading, setSendOTPLoading] = useState(false);
  const [verifyOTPLoading, setVerifyOTPLoading] = useState(false);

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
    setSendOTPLoading(true);
    if (isValidPhoneNumber(mobile)) {
      const response = await sendOTPMobile(mobile);
      if (response.status === "success") {
        setOTPSent(true);
        console.log(mobile);
        setOTPTimer(120);
      } else {
        toast.error("Unable to send OTP");
        setError(response.error);
      }
    } else {
      toast.error("Please enter a valid mobile number");
      setError("Please enter a Valid Mobile Number");
    }
    setSendOTPLoading(false);
  }

  function handelMobileChange(number) {
    if (OTPSent) {
      return;
    }
    setError("");
    setMobile(number);
  }

  async function handleMobileLogin() {
    setVerifyOTPLoading(true);
    const response = await verifyMobileOTP(mobile, OTP);
    if (response.status === "success") {
      toast.success("Logged in successfully");
      setLogged(true);
      navigate("/");
    } else {
      toast.error("Wrong OTP");
      setError("Wrong OTP");
    }
    setVerifyOTPLoading(false);
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
            disabled={OTPSent || verifyOTPLoading}
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
              disabled={verifyOTPLoading}
              color="primary"
              className="mt-3 w-100"
            >
              {verifyOTPLoading ? <Spinner>Loading...</Spinner> : "Login"}
            </Button>
          )}
          <div className="mt-3">
            {OTPTimer && <p>Resend OTP in {OTPTimer} seconds</p>}
            <Button
              onClick={sendForOTP}
              color="primary"
              disabled={sendOTPLoading || (OTPSent && OTPTimer != null)}
              className=" w-100"
            >
              {sendOTPLoading ? (
                <Spinner>Sending...</Spinner>
              ) : OTPSent ? (
                "Resend OTP"
              ) : (
                "Get OTP"
              )}
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
