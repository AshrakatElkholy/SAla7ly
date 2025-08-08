import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const providerBottomNavigation = ({ navigation, activeTab }) => {
  return (
    <View style={styles.bottomNav}>
      {/* Settings */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("ProviderSettingsScreen")}
      >
        <Image
          source={require("../assets/profile-circle.png")}
          style={[
            styles.profileImage,
            { tintColor: activeTab === "settings" ? "#004AAD" : "#999" },
          ]}
        />
        <Text
          style={[
            styles.navText,
            activeTab === "settings" && styles.activeNavText,
          ]}
        >
          اعدادات
        </Text>
      </TouchableOpacity>

      {/* Favorites */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("ProviderOrdersScreen")}
      >
        <Image
          source={
            activeTab === "favorites"
              ? require("../assets/menu-blue.png")
              : require("../assets/menu-white.png")
          }
          style={{
            width: 24,
            height: 22,
            tintColor: activeTab === "favorites" ? "#004AAD" : "#999",
          }}
        />
        <Text
          style={[
            styles.navText,
            activeTab === "favorites" && styles.activeNavText,
          ]}
        >
          طلباتى
        </Text>
      </TouchableOpacity>

      {/* Services */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("providerServicesScreen")}
      >
        <FontAwesome5
          name="th-large"
          size={20}
          color={activeTab === "services" ? "#004AAD" : "#999"}
        />
        <Text
          style={[
            styles.navText,
            activeTab === "services" && styles.activeNavText,
          ]}
        >
          خدماتى
        </Text>
      </TouchableOpacity>

      {/* Home */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("providerHomeScreen")}
      >
        <Icon
          name="home"
          size={24}
          color={activeTab === "home" ? "#004AAD" : "#999"}
        />
        <Text
          style={[styles.navText, activeTab === "home" && styles.activeNavText]}
        >
          الرئيسية
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 2,
  },
  navText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  activeNavText: {
    color: "#0A71CD",
  },
  profileImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
    resizeMode: "contain",
  },
});

export default providerBottomNavigation;
