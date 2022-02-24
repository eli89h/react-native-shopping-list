import React from "react";

const AppContext = React.createContext({
  shopList: "",
  setShopList: "",
  setUserProfile: "",
  userProfile: "",
  bought: "1"
});

export default AppContext;
