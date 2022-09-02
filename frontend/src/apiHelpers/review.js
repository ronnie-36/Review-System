const rooturl = "http://localhost:5000/";

export const fetchReviewsByUser = async (userID) => {
  const url = rooturl + "review/byuser/" + userID;

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
  const url = rooturl + "review/byorg/" + orgID;

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
  const url = rooturl + "review/multimedia";

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
  const url = rooturl + "review/add";
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
