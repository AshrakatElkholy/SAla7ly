import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Fonts } from "../constants";

const CustomButton = ({
  title,
  onPress,
  type = "filled",
  color = "#004AAD",
  //* ibrahim customization button edits *//
  disabled = false,
  style,
  textStyle,
  //* end ibrahim customization button edits *//
}) => {
  const isFilled = type === "filled";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isFilled ? color : "transparent",
          borderColor: color,
          borderWidth: isFilled ? 0 : 2,
          //* ibrahim customization button edits *//
          opacity: disabled ? 0.6 : 1, //* ibrahim customization button edits *//
        },
        style, //* ibrahim customization button edits *//
      ]}
      onPress={onPress}
      disabled={disabled} //* ibrahim customization button edits *//
    >
      <Text
        style={[
          {
            color: isFilled ? "#fff" : color,
            fontSize: 18,
            fontFamily: Fonts.BOLD,
          },
          textStyle, //* ibrahim customization button edits *//
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
    marginVertical: 10,
    width: "100%",
  },
});
