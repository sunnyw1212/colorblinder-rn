import { Dimensions, Platform } from "react-native";

export const isIPhoneXSize = dim => dim.height === 812 || dim.width === 812;

export const isIPhoneXrSize = dim => dim.height === 896 || dim.width === 896;

export const isIPhoneX = () => {
  const dim = Dimensions.get("window");

  return (
    //This has to be IOS
    Platform.OS === "ios" &&
    // check either ihpone x or xr
    (isIPhoneXSize(dim) || isIPhoneXrSize(dim))
  );
};
