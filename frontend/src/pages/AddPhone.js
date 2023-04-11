import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Login.css";
import { Button, Card, CardBody, Input, Spinner } from "reactstrap";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { sendOTPMobile, verifyMobileOTP } from "../apiHelpers/authentication";
import { toast } from "react-toastify";

function AddPhone() {
  const [user, setUser] = useState({ mobile: "", id: null });
  const [errors, setErrors] = useState({ mobile: "" });
  const [OTPSent, setOTPSent] = useState(false);
  const [OTPTimer, setOTPTimer] = useState(null);
  const [clearTimer, setClearTimer] = useState(null);
  const [OTP, setOTP] = useState("");
  const [mobileFixed, setMobileFixed] = useState(false);
  const [OTPSendLoad, setOTPSendLoad] = useState(false);
  const [OTPVerifyLoad, setOTPVerifyLoad] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (OTPTimer && OTPTimer < 0) {
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
    setMobileFixed(true);
    const validMobile = isValidPhoneNumber(user.mobile);
    setOTPSendLoad(true);
    if (validMobile && !OTPTimer) {
      const response = await sendOTPMobile(user.mobile);
      if (response.status === "success") {
        setUser({ ...user, id: response.user });
        setOTPSent(true);
        setOTPTimer(120);
      } else if (response.message === "User already has a phone registered.") {
        toast.error("User already exists with this mobile number");
        navigate("/login");
      } else {
        toast.error("Unable to send OTP");
      }
    }
    if (!validMobile) {
      toast.warn("Please enter a valid mobile number");
      setErrors({ ...errors, mobile: "Please enter a Valid Mobile Number" });
    }
    setOTPSendLoad(false);
  }

  async function handleMobileSignUp() {
    setOTPVerifyLoad(true);
    const response = await verifyMobileOTP(user.mobile, OTP, user.id);

    if (response.status === "success") {
      navigate("/");
    } else if (response.message === "Phone number exists.") {
      toast.error("User already exists with this mobile number");
      navigate("/login");
    } else if (response.status === "error") {
      toast.error("Wrong OTP");
      setErrors({ ...errors, mobile: "Wrong OTP" });
    }
    setOTPVerifyLoad(false);
  }

  function handelMobileChange(number) {
    if (mobileFixed) {
      return;
    }
    setErrors({ ...errors, mobile: "" });
    setUser({ ...user, mobile: number });
  }

  function handleDetailSubmission() {
    sendForOTP();
  }

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center LoginPage">
      <Card className="p-3 pt-5 pb-5" style={{ width: "25rem" }}>
        <CardBody className="d-flex flex-column justify-content-center">
          {!OTPSent && (
            <PhoneInput
              placeholder="Enter your mobile number"
              value={user.mobile}
              onChange={handelMobileChange}
              defaultCountry="IN"
            />
          )}

          {!OTPSent && (
            <Button
              className="mt-3"
              disabled={OTPSendLoad}
              onClick={handleDetailSubmission}
              color="primary"
            >
              {OTPSendLoad ? <Spinner>Sending...</Spinner> : "Submit Details"}
            </Button>
          )}

          {OTPSent && (
            <Input
              className="mt-3"
              type="password"
              value={OTP}
              onChange={(e) => {
                setErrors({ ...errors, mobile: "" });
                setOTP(e.target.value);
              }}
              placeholder="Enter Mobile OTP"
            />
          )}
          <p className="w-100 mt-3 text-danger">{errors.mobile}</p>
          {OTPSent && (
            <Button
              onClick={handleMobileSignUp}
              disabled={OTPVerifyLoad}
              color="primary"
              className="mt-3 w-100"
            >
              {OTPVerifyLoad ? <Spinner>Verifying</Spinner> : "Submit"}
            </Button>
          )}
          <div className="mt-3">
            {OTPTimer && <p>Resend OTP in {OTPTimer} seconds</p>}
            {OTPSent && (
              <Button
                onClick={sendForOTP}
                color="primary"
                disabled={!OTPVerifyLoad && OTPSent && OTPTimer != null}
                className=" w-100"
              >
                {OTPVerifyLoad ? <Spinner>Sending...</Spinner> : "Resend OTP"}
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default AddPhone;
