const rooturl = "http://localhost:5000/";

export const loginWithGoogle = () => {
  const url = rooturl + "auth/google";
  window.open(url, "_self");
};
