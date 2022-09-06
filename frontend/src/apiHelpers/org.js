const rooturl = "http://localhost:5000/";

export const fetchOrganization = async (place_id) => {
  const url = rooturl + "org/search";
  const data = { place_id: place_id };

  const options = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  let returnValue;
  returnValue = await fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      if (response === "Org Not Found") {
        return {
          status: "unauthorized",
          message: "Org not found in DB Login to add the organization",
        };
      } else {
        return { status: "success", placeDetails: response };
      }
    })
    .catch((error) => {
      console.log(error);
      return { status: "error", error: error };
    });

  return returnValue;
};
