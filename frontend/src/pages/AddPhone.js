import React, { useEffect, useState } from "react";
import "./css/Login.css";
import { Button, Card, CardBody, Input } from "reactstrap";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { Link } from "react-router-dom";

function AddPhone() {
  const [user, setUser] = useState({ mobile: "" });
  const [errors, setErrors] = useState({ mobile: false });
  const [OTPSent, setOTPSent] = useState(false);
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
    const validMobile = isValidPhoneNumber(user.mobile);

    if (validMobile) {
      setOTPSent(true);
      console.log(user.mobile);
      setOTPTimer(120);
    }
    if (!validMobile) {
      setErrors({ ...errors, mobile: true });
    }
  }

  function handleMobileSignUp() {}

  function handelMobileChange(number) {
    setErrors({ ...errors, mobile: false });
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

          {errors.mobile && (
            <p className="w-100 mt-3 text-danger">
              Please Enter a Valid Mobile Number
            </p>
          )}

          {!OTPSent && (
            <Button
              className="mt-3"
              onClick={handleDetailSubmission}
              color="primary"
            >
              Submit Details
            </Button>
          )}

          {OTPSent && <Input className="mt-3" placeholder="Enter Mobile OTP" />}
          {OTPSent && (
            <Button
              onClick={handleMobileSignUp}
              color="primary"
              className="mt-3 w-100"
            >
              Register
            </Button>
          )}
          <div className="mt-3">
            {OTPTimer && <p>Resend OTP in {OTPTimer} seconds</p>}
            {OTPSent && (
              <Button
                onClick={sendForOTP}
                color="primary"
                disabled={OTPSent && OTPTimer != null}
                className=" w-100"
              >
                Resend OTP
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default AddPhone;
