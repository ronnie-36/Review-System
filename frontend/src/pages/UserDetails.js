import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { FaEdit } from "react-icons/fa";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";

import Review from "../components/Review";

import "./css/UserDetails.css";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { fetchReviewsByUser } from "../apiHelpers/review";

function UserDetails({ logged, setLogged, userID }) {
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [editMobile, setEditMobile] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [mobError, setMobError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [newMobile, setNewMobile] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [mobOTPSent, setMobOTPSent] = useState(false);
  const [emailOTPSent, setEmailOTPSent] = useState(false);
  const [mobOTPTimer, setMobOTPTimer] = useState(null);
  const [emailOTPTimer, setEmailOTPTimer] = useState(null);
  const [mobClearTimer, setMobClearTimer] = useState(null);
  const [emailClearTimer, setEmailClearTimer] = useState(null);

  const [reviews, setReviews] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  console.log(userID);
  const pageSize = 5;
  const navigate = useNavigate();
  useEffect(() => {
    if (userID === null) {
      navigate("/");
    } else {
      (async function () {
        const response = await fetchReviewsByUser(userID);
        if (response.status === "success") {
          console.log(response.reviews);
          setReviews(response.reviews);
          setPageCount(Math.ceil(response.reviews.length / pageSize));
        } else {
          //Error Handling
        }
      })();
    }

    setMobile("+9197054321");
    setEmail("keelis@gmail.com");
    if (mobOTPTimer && mobOTPTimer < 0) {
      console.log(mobOTPTimer);
      clearInterval(mobClearTimer);
      setMobClearTimer(null);
      setMobOTPTimer(null);
    } else if (mobOTPTimer && mobClearTimer == null && mobOTPTimer > 0) {
      const timeout = setInterval(
        () => setMobOTPTimer((mobOTPTimer) => mobOTPTimer - 1),
        1000
      );
      setMobClearTimer(timeout);
    }

    if (emailOTPTimer && emailOTPTimer < 0) {
      console.log(emailOTPTimer);
      clearInterval(emailClearTimer);
      setEmailClearTimer(null);
      setEmailOTPTimer(null);
    } else if (emailOTPTimer && emailClearTimer == null && emailOTPTimer > 0) {
      const timeout = setInterval(
        () => setEmailOTPTimer((emailOTPTimer) => emailOTPTimer - 1),
        1000
      );
      setEmailClearTimer(timeout);
    }
  }, [mobOTPTimer, mobClearTimer, emailOTPTimer, emailClearTimer, userID]);

  const handleClick = (e, index) => {
    e.preventDefault();
    setCurrentPage(index);
  };

  function handleEmailChange(e) {
    console.log(e);
    setEmailError(false);
    setNewEmail(e.target.value);
    // setErrors({ ...errors, email: false });
    // setUser({ ...user, email: e.target.value });
  }

  function submitMobOTP() {
    setEditMobile(false);
    setNewMobile("");
    setMobOTPSent(false);
    setMobOTPTimer(null);
    setMobClearTimer(null);
  }

  function submitEmailOTP() {
    setEditEmail(false);
    setNewEmail("");
    setEmailOTPSent(false);
    setEmailOTPTimer(null);
    setMobClearTimer(null);
  }

  function sendForMobOTP() {
    if (isValidPhoneNumber(newMobile)) {
      setMobOTPSent(true);
      console.log(newMobile);
      setMobOTPTimer(120);
    } else {
      setMobError(true);
    }
  }

  function sendForEmailOTP() {
    const validEmail = String(newEmail)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );

    if (validEmail) {
      setEmailOTPSent(true);
      console.log(newEmail);
      setEmailOTPTimer(120);
    } else {
      setEmailError(true);
    }
  }

  function handleMobCancel() {
    setEditMobile(false);
    setNewMobile("");
    setMobOTPSent(false);
    setMobOTPTimer(null);
    setMobClearTimer(null);
  }

  function handleEmailCancel() {
    setEditEmail(false);
    setNewEmail("");
    setEmailOTPSent(false);
    setEmailOTPTimer(null);
    setMobClearTimer(null);
  }

  function handelMobileChange(number) {
    setMobError(false);
    setNewMobile(number);
  }

  return (
    <>
      <Header logged={logged} setLogged={setLogged} />
      <div className="user-dets-container d-flex flex-row justify-content-center mt-3">
        <div className="user-dets">
          {/* {!editMobile ? (
            <div className="d-flex flex-row justify-content-between">
              <div className="info-display mobile-display">
                <div className="fw-bold">Mobile Number</div>
                <div className="">{mobile}</div>
              </div>
              <div>
                <Button color="danger" onClick={() => setEditMobile(true)}>
                  <FaEdit />
                </Button>
              </div>
            </div>
          ) : (
            <div className="d-flex py-3 justify-content-between">
              <div className="d-flex flex-column">
                <div className="fw-bold">New Mobile Number</div>
                <PhoneInput
                  placeholder="Enter phone number"
                  value={newMobile}
                  onChange={handelMobileChange}
                  defaultCountry="IN"
                />
                {mobError && (
                  <p className="w-100 mt-3 text-danger">
                    Please Enter a Valid Mobile Number
                  </p>
                )}
                {mobOTPSent && (
                  <Input className="mt-3" placeholder="Enter OTP" />
                )}
                <Button
                  className="w-25 mt-1"
                  color="danger"
                  onClick={handleMobCancel}
                >
                  Cancel
                </Button>
              </div>
              <div className="d-flex flex-column justify-content-between">
                <Button
                  onClick={sendForMobOTP}
                  color="primary"
                  disabled={mobOTPSent && mobOTPTimer != null}
                  className=""
                >
                  {mobOTPSent ? "Resend OTP" : "Get OTP"}
                </Button>
                {mobOTPTimer && <p>Resend OTP in {mobOTPTimer} seconds</p>}
                {mobOTPSent && (
                  <Button onClick={submitMobOTP} color="primary">
                    Submit OTP
                  </Button>
                )}
              </div>
            </div>
          )}
          {!editEmail ? (
            <div className="d-flex flex-row justify-content-between">
              <div className="info-display mobile-display">
                <div className="fw-bold">Email ID</div>
                <div className="">{email}</div>
              </div>
              <div>
                <Button color="danger" onClick={() => setEditEmail(true)}>
                  <FaEdit />
                </Button>
              </div>
            </div>
          ) : (
            <div className="d-flex py-3 justify-content-between">
              <div className="d-flex flex-column">
                <div className="fw-bold">New Email</div>
                <Input
                  className="mt-3"
                  type="email"
                  value={newEmail}
                  onChange={handleEmailChange}
                  placeholder="Email ID"
                />
                {emailError && (
                  <p className="w-100 mt-3 text-danger">
                    Please Enter a Valid Email
                  </p>
                )}
                {emailOTPSent && (
                  <Input className="mt-3" placeholder="Enter OTP" />
                )}
                <Button
                  color="danger"
                  className="w-25 mt-1"
                  onClick={handleEmailCancel}
                >
                  Cancel
                </Button>
              </div>
              <div className="d-flex flex-column p-2 justify-content-between">
                <Button
                  onClick={sendForEmailOTP}
                  color="primary"
                  disabled={emailOTPSent && emailOTPTimer != null}
                  className=""
                >
                  {emailOTPSent ? "Resend OTP" : "Get OTP"}
                </Button>
                {emailOTPTimer && <p>Resend OTP in {emailOTPTimer} seconds</p>}
                {emailOTPSent && (
                  <Button onClick={submitEmailOTP} color="primary">
                    Submit OTP
                  </Button>
                )}
              </div>
            </div>
          )} */}

          <div className=" mt-3 reviews w-100 d-flex flex-column align-items-center">
            <div className="fw-bold align-self-center">My Reviews</div>
            {reviews
              .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
              .map((value) => {
                return <Review key={value.reviewID} review={value} />;
              })}
          </div>
          {reviews.length !== 0 && (
            <Pagination
              className="d-flex justify-content-center"
              aria-label="Page navigation example"
            >
              <PaginationItem disabled={currentPage <= 0}>
                <PaginationLink
                  onClick={(e) => handleClick(e, 0)}
                  first
                  href="#"
                />
              </PaginationItem>
              <PaginationItem disabled={currentPage <= 0}>
                <PaginationLink
                  onClick={(e) => handleClick(e, currentPage - 1)}
                  previous
                  href="#"
                />
              </PaginationItem>
              {[...Array(pageCount)].map((_, i) => (
                <PaginationItem active={i === currentPage} key={i}>
                  <PaginationLink onClick={(e) => handleClick(e, i)} href="#">
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem disabled={currentPage >= pageCount - 1}>
                <PaginationLink
                  onClick={(e) => handleClick(e, currentPage + 1)}
                  next
                  href="#"
                />
              </PaginationItem>
              <PaginationItem disabled={currentPage >= pageCount - 1}>
                <PaginationLink
                  onClick={(e) => handleClick(e, 0)}
                  last
                  href="#"
                />
              </PaginationItem>
            </Pagination>
          )}
        </div>
      </div>
    </>
  );
}

export default UserDetails;
