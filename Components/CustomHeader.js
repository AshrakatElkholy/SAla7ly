// Components/CustomHeader.js

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Fonts } from "../constants";
import TabsHeader from "./TabsHeader";
import Svg, { Line } from "react-native-svg";

const CustomHeader = ({
  title,
  onBack,
  activeIndex = 0,
  showTabs = true,
  showCurve = true,
  bgColor = "#F0F4F8",
}) => {
  const { width } = useWindowDimensions();

  const topPadding =
    Platform.OS === "android" ? StatusBar.currentHeight || 24 : 44;

  const gridSize = 40;
  const targetLineIndex = 3; // The horizontal line index to align tabs with
  const tabsTopPosition = targetLineIndex * gridSize;

  // Calculate the header height based on tab position or fallback ratio
  const height =
    showTabs || showCurve
      ? Math.max(tabsTopPosition + 60, width * 0.42)
      : topPadding + 60;

  const numVLines = Math.ceil(width / gridSize) + 1;
  const numHLines = Math.ceil(height / gridSize) + 1;

  const verticalLines = [...Array(numVLines).keys()];
  const horizontalLines = [...Array(numHLines).keys()];

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: topPadding,
          height: height,
          backgroundColor: bgColor,
          borderBottomLeftRadius: showCurve ? width * 0.25 : 0,
          borderBottomRightRadius: showCurve ? width * 0.05 : 0,
        },
      ]}
    >
      {/* SVG background grid lines */}
      {showCurve && (
        <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
          {/* Vertical lines */}
          {verticalLines.map((i) => (
            <Line
              key={`v-${i}`}
              x1={i * gridSize}
              y1="0"
              x2={i * gridSize}
              y2={height}
              stroke="#dbe3f1"
              strokeWidth="1"
            />
          ))}
          {/* Horizontal lines */}
          {horizontalLines.map((i) => (
            <Line
              key={`h-${i}`}
              x1="0"
              y1={i * gridSize}
              x2={width}
              y2={i * gridSize}
              stroke="#dbe3f1"
              strokeWidth="1"
            />
          ))}
        </Svg>
      )}

      {/* Back button and header title */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="chevron-forward" size={16} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>
      </View>

      {/* Tabs aligned with target horizontal grid line */}
      {showTabs && (
        <View
          style={{
            position: "absolute",
            top: tabsTopPosition + 12, // Adjust to shift tabs slightly below the grid line
            left: 0,
            right: 0,
            zIndex: 2,
            paddingHorizontal: 20,
          }}
        >
          <TabsHeader activeIndex={activeIndex} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#F0F4F8",
    paddingHorizontal: 20,
    overflow: "hidden",
    position: "relative", // Required for absolutely positioned children like tabs
  },
  row: {
    marginTop: 19,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.BOLD,
    color: "#1F1F1F",
  },
  backBtn: {
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#004aad",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
});

export default CustomHeader;
