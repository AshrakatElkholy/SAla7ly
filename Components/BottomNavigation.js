import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { FontAwesome5 } from '@expo/vector-icons'; // This includes 'calendar-alt', 'home', 'th', 'bookmark'

const BottomNavigation = ({ navigation, activeTab, favoriteServices = [] }) => {
  const favActive = activeTab === "favorites" || favoriteServices.length > 0;

  return (
    <View style={styles.bottomNav}>
      {/* Profile */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("ProfileScreen")}
      >
        <Ionicons
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
        onPress={() =>
          navigation.navigate("favoriteServiceScreen", {
            favorites: favoriteServices,
          })
        }
      >
        <FontAwesome5
          name="bookmark"
          size={20}
          color={favActive ? "#0057D9" : "#CACACA"}
          solid={favActive}
        />
        <Text
          style={[
            styles.navText,
            activeTab === "favorites" && styles.activeNavText,
          ]}
        >
          المفضلة
        </Text>
      </TouchableOpacity>

      {/* Orders */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("OrdersScreen")}
      >
        <FontAwesome5
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
        onPress={() => navigation.navigate("ServicesCategoryScreen")}
      >
        <FontAwesome5
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
          الخدمات
        </Text>
      </TouchableOpacity>

      {/* Home */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("HomeScreen")}
      >
        <FontAwesome5
          name="home"
          size={22}
          color={activeTab === "home" ? "#0057D9" : "#CACACA"}
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
  },
  activeNavText: {
    color: "#0057D9",
    fontWeight: "600",
  },
});

export default BottomNavigation;
