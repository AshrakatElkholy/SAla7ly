import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";

import { Feather, Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Fonts } from "../constants";

import { useNavigation } from "@react-navigation/native"; // ✅ Added
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Line } from "react-native-svg";

const screenWidth = Dimensions.get("window").width;

const CustomHeaderWithLines = ({
  title = "طلباتي",
  onTabChange,
  tabLabels = { current: "الحاليه", past: "السابقة" },
  style,
  showTabs = true,
  showIcons = true,
  statusBarColor = "#EDF2F9",
}) => {
  const [activeTab, setActiveTab] = useState("current");
  const insets = useSafeAreaInsets();
  const navigation = useNavigation(); // ✅ useNavigation hook inside component

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <View style={{ backgroundColor: "#F3F7FF" }}>
      <StatusBar backgroundColor={statusBarColor} barStyle="dark-content" />

      <LinearGradient
        colors={["#E2EBFB", "#F3F7FF", "#FFFFFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.container, style]}
      >
        {/* خطوط SVG في الخلفية */}
        <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
          {Array.from({ length: Math.floor(screenWidth / 20) }).map((_, i) => (
            <Line
              key={`v-${i}`}
              x1={i * 60}
              y1="0"
              x2={i * 60}
              y2="100%"
              stroke="#D0D7E2"
              strokeWidth="0.3"
            />
          ))}
          {Array.from({ length: 50 }).map((_, i) => (
            <Line
              key={`h-${i}`}
              x1="0"
              y1={i * 40}
              x2={screenWidth}
              y2={i * 40}
              stroke="#D0D7E2"
              strokeWidth="0.3"
            />
          ))}
        </Svg>

        {/* الهيدر العلوي */}
        <View style={styles.headerContent}>
          {showIcons && (
            <View style={styles.iconsContainer}>
              <TouchableOpacity style={styles.icon}>
                <Feather name="bell" size={22} color="#121217" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.icon}
                onPress={() => navigation.navigate("MessagesListScreen")} // ✅ working navigation
              >
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={22}
                  color="#121217"
                />
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* التابس */}
        {showTabs && (
          <View style={styles.tabsWrapper}>
            <View style={styles.tabsContainer}>
              {["current", "past"].map((key) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.tabButton,
                    activeTab === key && styles.activeTabButton,
                  ]}
                  onPress={() => handleTabPress(key)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === key && styles.activeTabText,
                    ]}
                  >
                    {tabLabels[key]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 15,
    paddingBottom: 16,
    paddingHorizontal: 16,
    position: "relative",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  iconsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  icon: {
    padding: 6,
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    borderColor: "#F5F5F5",
  },
  title: {
    fontSize: 32,
    fontFamily: Fonts.BOLD,
    color: "#000",
  },
  tabsWrapper: {
    alignItems: "center",
  },
  tabsContainer: {
    flexDirection: "row-reverse",
    backgroundColor: "#F1F2F5",
    borderRadius: 12,
    padding: 4,
    gap: 4,
    width: "100%",
  },
  tabButton: {
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#F1F2F5",
    flex: 1,
    alignItems: "center",
  },
  activeTabButton: {
    backgroundColor: "#0057D8",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: "#B0B0B0",
    textAlign: "center",
    fontFamily: Fonts.BOLD,
  },
  activeTabText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: Fonts.BOLD,
  },
});

export default CustomHeaderWithLines;
