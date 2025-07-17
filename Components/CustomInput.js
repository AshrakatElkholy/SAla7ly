// import React from "react";
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Fonts } from "../constants";

const CustomInput = ({
  ///// ** ibrahim CustomInput Component edit** /////
  scrollEnabled,
  onContentSizeChange,
  deferError = false,
  //end of ibrahim edit
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  editable = true,
  style,
  labelStyle,
  inputStyle,
  error,
  ...props
}) => {
  ///// ** ibrahim CustomInput Component edit** /////
  const finalScrollEnabled =
    scrollEnabled !== undefined ? scrollEnabled : multiline;
  const [touched, setTouched] = useState(false);
  const showError = error && (!deferError || touched);
  //end of ibrahim edit
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          inputStyle,
          showError && styles.inputError,
          !editable && styles.inputDisabled,
          ///// ** ibrahim CustomInput Component edit** /////
          multiline && styles.inputMultiline,
          //end of ibrahim edit
        ]}
        ///// ** ibrahim CustomInput Component edit** /////
        scrollEnabled={finalScrollEnabled}
        onBlur={() => setTouched(true)}
        // end of ibrahim edit
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        placeholderTextColor="#999"
        {...props}
      />
      {showError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.REGULAR,
    color: "#333",
    marginBottom: 8,
    textAlign: "right",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: "Almarai-Regular",
    fontSize: 16,
    color: "#333",
    // backgroundColor: '#fff',
    textAlign: "right",
    minHeight: 48,
  },
  /// ** ibrahim CustomInput Component StylEedit** /////
  inputMultiline: {
    minHeight: 100,
  },
  // end of ibrahim edit
  inputError: {
    borderColor: "#ff4444",
    borderWidth: 2,
  },
  inputDisabled: {
    backgroundColor: "#f5f5f5",
    color: "#999",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },
});

export default CustomInput;
