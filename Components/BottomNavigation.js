import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { FontAwesome5 } from '@expo/vector-icons';

const BottomNavigation = ({ navigation, activeTab, favoriteServices = [] }) => {
  const favActive = activeTab === "favorites";
  
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
          color={activeTab === "settings" ? "#004AAD" : "#CACACA"}
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
        <Image
          source={
            favActive
              ? require('../assets/favorite-filled.png')
              : require('../assets/favorite-outline.png')
          }
          style={{ width: 20, height: 20 }}
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
          color={activeTab === "orders" ? "#004AAD" : "#CACACA"}
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
          color={activeTab === "services" ? "#004AAD" : "#CACACA"}
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
          color={activeTab === "home" ? "#004AAD" : "#CACACA"}
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
    color: "#004AAD",
    fontWeight: "600",
  },
});

export default BottomNavigation;