import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import { Fonts } from "../constants";

const BottomNavigation = ({ navigation, activeTab }) => {
  return (
    <View style={styles.bottomNav}>
      {/* Settings */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("ProfileScreen")}
      >
        <Icon
          name="person-circle-outline"
          size={24}
          color={activeTab === "settings" ? "#0057D9" : "#CACACA"}
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
        onPress={() => navigation.navigate("FavoritesScreen")}
      >
        <FontAwesome
          name="bookmark"
          size={20}
          solid
          color={activeTab === "favorites" ? "#0057D9" : "#CACACA"}
        />
        <Text
          style={[
            styles.navText,
            activeTab === "favorites" && styles.activeNavText,
          ]}
        >
          المفضله
        </Text>
      </TouchableOpacity>

      {/* Orders */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("OrdersScreen")}
      >
        <FontAwesome
          name="calendar-alt"
          size={22}
          color={activeTab === "orders" ? "#0057D9" : "#CACACA"}
        />
        <Text
          style={[
            styles.navText,
            activeTab === "orders" && styles.activeNavText,
          ]}
        >
          طلباتي
        </Text>
      </TouchableOpacity>

      {/* Services */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("categoryScreen")}
      >
        <FontAwesome
          name="th"
          size={20}
          color={activeTab === "services" ? "#0057D9" : "#CACACA"}
        />
        <Text
          style={[
            styles.navText,
            activeTab === "services" && styles.activeNavText,
          ]}
        >
          خدمات
        </Text>
      </TouchableOpacity>

      {/* Home */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Home")}
      >
        <FontAwesome
          name="home"
          size={22}
          color={activeTab === "home" ? "#0057D9" : "#CACACA"}
        />
        <Text
          style={[styles.navText, activeTab === "home" && styles.activeNavText]}
        >
          الرئيسيه
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: Platform.OS === "ios" ? 18 : 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 8,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    borderTopEndRadius: 16,
    borderTopStartRadius: 16,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 12,
    color: "#CACACA",
    marginTop: 4,
    fontFamily: Fonts.REGULAR,
  },
  activeNavText: {
    color: "#0057D9",
    fontWeight: "600",
  },
});

export default BottomNavigation;
