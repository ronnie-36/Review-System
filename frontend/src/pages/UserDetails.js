import React, { useState } from "react";
import "./css/UserDetails.css";

function UserDetails() {
  const [mobile, setMobile] = useState("+9197054321");
  const [email, setEmail] = useState("keelis@gmail.com");
  const [editMobile, setEditMobile] = useState(false);
  const [editEmail, setEditEmail] = useState(false);

  return (
    <div className="user-dets-container d-flex flex-row justify-content-center align-items-center">
      <div className="user-dets w-25 p-5">
        {!editMobile ? (
          <div className="info-display mobile-display">
            <div className="fw-bold">Mobile Number</div>
            <div className="">{mobile}</div>
          </div>
        ) : (
          <></>
        )}
        {!editEmail ? (
          <div className="info-display mobile-display">
            <div className="fw-bold">Email Id</div>
            <div className="">{email !== "" ? email : "Not Added"}</div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default UserDetails;
