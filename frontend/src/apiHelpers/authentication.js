const rooturl = "http://localhost:5000/";

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
      console.log(err); //TODO : Something for errors
    });

  return returnValue;
};

export const verifyMobileOTP = async (mobile, otp) => {
  const url = rooturl + "auth/phone/verifyOTP";
  const data = { phone: mobile, otp: otp };

  const options = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  return await fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((err) => {
      console.log(err); //TODO : Something for errors
    });
};
