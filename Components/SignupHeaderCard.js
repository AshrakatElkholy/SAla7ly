import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import Svg, { Line } from "react-native-svg";

////* Importing Fonts from constants */
import { Fonts } from "../constants";

const SignupHeaderCard = ({
  onBack,
  title = "انشاء حساب",
  subtitle = "قم بإنشاء حساب للوصول لجميع مستخدمين صلحى",
  style,
  children,
  ///* Ibrahim Component Props Edit */
  bgColor = "#F0F4F8",
  curveRadiusL = 40,
  curveRadiusR = 0,
  minHeaderHeight = 180,
  //* End of Ibrahim Component Props Edit */
}) => {
  const { width } = useWindowDimensions();
  const gridSize = 40;
  const targetLineIndex = 3;
  const tabsTopPosition = targetLineIndex * gridSize;
  const headerHeight = Math.max(tabsTopPosition + 60, width * 0.42);
  const numVLines = Math.ceil(width / gridSize) + 1;
  const numHLines = Math.ceil(headerHeight / gridSize) + 1;

  const topPadding =
    Platform.OS === "android" ? StatusBar.currentHeight || 24 : 44;

  return (
    <View
      style={[
        styles.card,
        //* Ibrahim Component  Edit */
        {
          backgroundColor: bgColor,
          borderBottomLeftRadius: width * 0.25,
          borderBottomRightRadius: width * 0.05,
          minHeight: headerHeight,
          paddingTop: topPadding,
        },
        //* End of Ibrahim Component Edit */
        style,
      ]}
    >
      {/* Horizontal lines */}
      <Svg
        height={headerHeight + 100}
        width={width}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: headerHeight + 100,
        }}
      >
        {/* Vertical lines */}
        {Array.from({ length: numVLines }).map((_, i) => (
          <Line
            key={`v-${i}`}
            x1={i * gridSize}
            y1="0"
            x2={i * gridSize}
            y2={headerHeight + 100}
            stroke="#dbe3f1"
            strokeWidth="1"
          />
        ))}

        {/* Horizontal lines */}
        {Array.from({ length: numHLines }).map((_, i) => (
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

      <View style={styles.arrowRow}>
        <TouchableOpacity style={styles.arrowButton} onPress={onBack}>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={{ minHeight: 40 }} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#EAF2FB",
    borderBottomLeftRadius: 40,
    minHeight: 180,
    padding: 24,
    justifyContent: "center",
    marginBottom: 24,
    overflow: "hidden",
  },
  arrowRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 12,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1566C1",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    marginTop: 8,
  },
  textContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  title: {
    fontSize: 22,
    fontFamily: Fonts.BOLD,
    color: "#222",
    textAlign: "right",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts?.REGULAR ?? undefined,
    color: "#444",
    marginTop: 4,
    textAlign: "right",
  },
});

export default SignupHeaderCard;