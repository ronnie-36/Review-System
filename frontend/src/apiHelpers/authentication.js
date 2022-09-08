const rooturl = "http://localhost:5000/";

export const checkLogin = async () => {
  const url = rooturl + "auth/check";

  const options = {
    method: "GET",
    credentials: "include",
  };
  let returnValue;
  await fetch(url, options)
    .then((response) => {
      if (response.status === 401) {
        returnValue = { status: "error", message: "unauthorised" };
      } else if (response.status === 200) {
        returnValue = { status: "success", message: "authorised" };
      }
    })
    .catch((error) => {
      returnValue = { status: "error", message: { ...error } };
    });
  return returnValue;
};

export const loginWithGoogle = async () => {
  const url = rooturl + "auth/google";
  window.open(url, "_self");
};

export const sendOTPMobile = async (mobile) => {
  const url = rooturl + "auth/phone";
  const data = { phone: mobile };
  const options = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  let returnValue;
  await fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      returnValue = response;
      return response;
    })
    .catch((err) => {
      returnValue = { status: "error", message: { ...err } };
      console.log(err); //TODO : Something for errors
    });

  return returnValue;
};

export const verifyMobileOTP = async (mobile, otp, id) => {
  const url = rooturl + "auth/phone/verifyOTP";
  const data = { phone: mobile, otp: otp, user: id };

  const options = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  let returnValue;
  await fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      returnValue = response;
    })
    .catch((err) => {
      returnValue = { status: "error", message: { ...err } };
      console.log(err); //TODO : Something for errors
    });
  return returnValue;
};

export const logout = async () => {
  const url = rooturl + "auth/logout";
  const options = {
    method: "GET",
    credentials: "include",
  };

  return await fetch(url, options).then((response) => response.json());
};
