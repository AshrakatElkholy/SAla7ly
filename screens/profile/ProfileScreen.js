import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import BottomNavigation from "../../Components/BottomNavigation";
import CustomHeaderWithLines from "../../Components/CustomHeaderTemp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fonts } from "../../constants";

const ProfileScreen = ({ navigation }) => {
  const [balance, setBalance] = useState(20000);
  const [userName, setUserName] = useState("...");
  const [profileImage, setProfileImage] = useState();
  const [cityName, setCityName] = useState("غير محدد");

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Please allow access to photos to update your profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      await AsyncStorage.setItem("profileImage", imageUri);
    }
  };
  const handleLogoutPress = () => {
    Alert.alert(
      "تأكيد تسجيل الخروج",
      "هل أنت متأكد أنك تريد تسجيل الخروج؟",
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "تسجيل خروج",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                "userName",
                "profileImage",
                "userId",
                "token",
              ]);
              navigation.reset({
                index: 0,
                routes: [{ name: "ClientLoginScreen" }],
              });
            } catch (err) {
              console.log("خطأ أثناء تسجيل الخروج:", err);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    const getProfileImage = async () => {
      const storedImage = await AsyncStorage.getItem("profileImage");
      if (storedImage) setProfileImage(storedImage);
    };
    getProfileImage();
  }, []);
  useEffect(() => {
    const getCityName = async () => {
      try {
        const storedCity = await AsyncStorage.getItem("cityName");
        if (storedCity) setCityName(storedCity);
      } catch (e) {
        console.log("Failed to load city name", e);
      }
    };
    getCityName();
  }, []);

  useEffect(() => {
    const getUserName = async () => {
      try {
        const storedName = await AsyncStorage.getItem("userName");
        if (storedName) setUserName(storedName);
      } catch (e) {
        console.log("Failed to load user name", e);
      }
    };
    getUserName();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#EDF2F9" }}
      edges={["top"]}
    >
      <View style={styles.container}>
        <CustomHeaderWithLines showTabs={false} showIcons={false} title="" />
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Profile Header */}
          <View style={styles.header}>
            <View style={styles.avatarWrapper}>
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require("../../assets/picProvider.png")
                }
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
                <Icon name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.userInfo}>
              <View style={styles.titleColumn}>
                <Text style={styles.name}>{userName}</Text>
                <Text style={styles.location}>{cityName}</Text>
              </View>
            </View>
          </View>

          {/* Balance Section */}
          <View style={styles.balanceContainer}>
            <Image
              source={require("../../assets/hammer1.png")}
              style={styles.hammerIcon}
            />
            <View style={styles.balanceTextWrapper}>
              <Text style={styles.balanceTitle}>رصيد الان</Text>
              <View style={styles.balanceRow}>
                <FontAwesome5 name="wallet" size={20} color="#0057D9" />
                <Text style={styles.balanceText}>
                  {balance.toLocaleString()} ج.م
                </Text>
              </View>
            </View>
          </View>

          {/* Balance Actions */}
          <View style={styles.balanceButtonsWrapper}>
            <TouchableOpacity style={styles.balanceButton}>
              <Text style={styles.balanceButtonText}>+ إضافة رصيد</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.balanceButton}>
              <Text style={styles.balanceButtonText}>- سحب رصيد</Text>
            </TouchableOpacity>
          </View>

          {/* Settings List */}
          <View style={styles.listContainer}>
            <SettingItem label="تعديل بياناتى" icon="person-outline" />
            <SettingItem label="تغيير كلمة المرور" icon="key-outline" />
            <SettingItem label="تحويلات" icon="repeat-outline" />
            <SettingItem label="الدعم الفنى" icon="help-circle-outline" />
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogoutPress}
          >
            <Text style={styles.logoutText}>تسجيل خروج</Text>
            <Icon name="log-out" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </ScrollView>

        <BottomNavigation navigation={navigation} activeTab="settings" />
      </View>
    </SafeAreaView>
  );
};

const SettingItem = ({ label, icon, badge }) => (
  <TouchableOpacity style={styles.item}>
    <View style={styles.itemContent}>
      {/* Right side: icon + label */}
      <View style={styles.itemLeft}>
        <Icon name={icon} size={20} color="#555" style={{ marginLeft: 8 }} />
        <Text style={styles.itemText}>{label}</Text>
      </View>

      {/* Left side: chevron */}
      <Icon
        name="chevron-back"
        size={18}
        color="#999"
        style={styles.chevronIcon}
      />
    </View>

    {badge && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 12,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#0057D9",
  },
  titleColumn: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginRight: 6,
  },

  cameraBtn: {
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "#0057D9",
    borderRadius: 12,
    padding: 4,
  },

  name: {
    fontSize: 24,
    marginTop: 10,
    fontFamily: Fonts.BOLD,
    color: "#1F1F1F",
  },
  location: { fontSize: 14, color: "#555" },

  userInfo: {
    marginRight: 6,
    justifyContent: "center",
  },

  balanceContainer: {
    backgroundColor: "#F5F8FF",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 20,
    marginTop: 16,
  },

  hammerIcon: {
    width: 46,
    height: 41,
    resizeMode: "contain",
  },

  balanceTextWrapper: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
  },

  balanceTitle: { fontSize: 16, color: "#000000", fontFamily: Fonts.BOLD },

  balanceRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 8,
  },

  balanceText: {
    fontSize: 20,
    fontFamily: Fonts.BOLD,
    color: "#004AAD",
    marginLeft: 8,
  },

  balanceButtonsWrapper: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 12,
  },

  balanceButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    marginHorizontal: 6,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0057D9",
  },

  balanceButtonText: {
    color: "#0057D9",
    fontSize: 12,
    fontFamily: Fonts.BOLD,
  },

  listContainer: { marginTop: 20 },

  item: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 8,
  },
  itemContent: {
    marginHorizontal: 8,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },

  itemLeft: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  chevronIcon: {
    marginLeft: 12,
  },

  itemText: {
    fontSize: 14,
    color: "#4B4B4B",
    fontFamily: Fonts.BOLD,
    textAlign: "right",
    writingDirection: "rtl",
    flexShrink: 1,
    flexWrap: "wrap",
    maxWidth: "100%",
    flex: 1,
  },

  badge: {
    backgroundColor: "#0057D9",
    borderRadius: 12,
    paddingHorizontal: 6,
    marginRight: 6,
  },

  badgeText: { color: "#fff", fontSize: 12 },

  logoutBtn: {
    margin: 20,
    padding: 12,
    borderColor: "#FF3B30",
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
    direction: "rtl",
  },

  logoutText: {
    color: "#E37871",
    fontSize: 14,
    fontFamily: Fonts.BOLD,
  },
});

export default ProfileScreen;
