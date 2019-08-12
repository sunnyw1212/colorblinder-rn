import React from "react";
import { Text, View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { scale } from "../utilities";

const Header = ({ fontSize }) => {
  return (
    <View style={{ flexDirection: "row", marginTop: 20 }}>
      <Text style={[styles.header, { color: "#E64C3C", fontSize }]}>c</Text>
      <Text style={[styles.header, { color: "#E57E31", fontSize }]}>o</Text>
      <Text style={[styles.header, { color: "#F1C431", fontSize }]}>l</Text>
      <Text style={[styles.header, { color: "#68CC73", fontSize }]}>o</Text>
      <Text style={[styles.header, { color: "#3998DB", fontSize }]}>r</Text>
      <Text style={[styles.header, { fontSize }]}>blinder</Text>
    </View>
  );
};

Header.propTypes = {
  fontSize: PropTypes.number
};

Header.defaultProps = {
  fontSize: scale(45)
};

const styles = StyleSheet.create({
  header: {
    fontSize: 50,
    color: "#ECF0F1",
    fontFamily: "dogbyte"
  }
});

export { Header };
