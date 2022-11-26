import { create } from "ipfs-http-client";

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

export const getIPFSclient = async () => {
  const projectId = process.env.REACT_APP_PROJECT_ID;
  const projectSecret = process.env.REACT_APP_API_KEY_SECRET;
  const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

  let ipfs;
  try {
    ipfs = create({
      url: "https://ipfs.infura.io:5001/api/v0",
      headers: {
        authorization,
      },
    });
  } catch (error) {
    console.error("IPFS error ", error);
    ipfs = undefined;
  }
  return ipfs;
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
