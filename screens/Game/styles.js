import { StyleSheet, Dimensions } from "react-native";
import { scale } from "../../utilities";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
    justifyContent: "center",
    alignItems: "center"
  },
  bottomContainer: {
    flex: 1,
    width: Dimensions.get("window").width * 0.875,
    flexDirection: "row"
  },
  bottomSectionContainer: {
    flex: 1,
    marginTop: "auto",
    marginBottom: "auto"
  },
  bottomIcon: {
    width: scale(45),
    height: scale(45)
  },
  counterCount: {
    fontFamily: "dogbyte",
    textAlign: "center",
    color: "#EEEEEE",
    fontSize: 50
  },
  counterLabel: {
    fontFamily: "dogbyte",
    textAlign: "center",
    color: "#BBBBBB",
    fontSize: 20
  },
  bestContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center"
  },
  bestIcon: {
    width: 25,
    height: 25,
    marginRight: 5
  },
  bestLabel: {
    fontFamily: "dogbyte",
    color: "#BBBBBB",
    fontSize: 25,
    marginTop: 2.5
  },
  pausedContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  pausedText: {
    fontFamily: "dogbyte",
    textAlign: "center",
    color: "#eee",
    marginTop: 20,
    fontSize: scale(55)
  },
  pausedIcon: {
    width: scale(75),
    height: scale(75)
  },
  exitIcon: {
    marginTop: 20,
    width: scale(90),
    height: scale(45)
  }
});
