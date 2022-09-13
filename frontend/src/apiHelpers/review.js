export const fetchReviewsByUser = async () => {
  const url = process.env.REACT_APP_BACKEND_URL + "review/byuser/";

  const options = {
    method: "GET",
    credentials: "include",
  };
  let returnValue;
  await fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      returnValue = { status: "success", reviews: response };
    })
    .catch((err) => {
      returnValue = { status: "error", ...err };
      console.log(err);
    });
  return returnValue;
};

export const fetchReviewsByOrg = async (orgID) => {
  const url = process.env.REACT_APP_BACKEND_URL + "review/byorg/" + orgID;

  const options = {
    method: "GET",
    credentials: "include",
  };
  let returnValue;
  await fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      returnValue = { status: "success", reviews: response };
    })
    .catch((err) => {
      returnValue = { status: "error", ...err };
      console.log(err);
    });
  return returnValue;
};

export const getSignedURL = async (type) => {
  const url = process.env.REACT_APP_BACKEND_URL + "review/multimedia";

  const data = { filetype: type };

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
      returnValue = { status: "success", ...response };
    })
    .catch((err) => {
      console.log(err);
      returnValue = { status: "error", error: err };
    });

  return returnValue;
};

export const uploadToAWS = async (signedURL, file) => {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  };
  let returnValue;
  await fetch(signedURL, options)
    .then((response) => {
      returnValue = { status: "success", response: response };
    })
    .catch((err) => {
      returnValue = { status: "error", error: err };
    });
  return returnValue;
};

export const postReview = async (review) => {
  const url = process.env.REACT_APP_BACKEND_URL + "review/add";
  console.log(review);
  const data = review;

  const options = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  let returnValue;

  await fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      if (response === "added") {
        returnValue = { status: "success", message: "added" };
      } else {
        returnValue = { status: "error", message: "not added" };
      }
    })
    .catch((err) => {
      returnValue = { status: "error", ...err };
    });
  return returnValue;
};
