// screens/UserCategoryScreen.js
import React, { useState, useContext } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from "react-native";
import CustomButton from "../Components/CustomButton";
import { Fonts } from "../constants";
import { UserContext } from "../screens/Context/UserContext";

function UserCategoryScreen({ navigation }) {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const [selectedImage, setSelectedImage] = useState(userInfo?.role || null);
  const [loading, setLoading] = useState(false);

  const handleSanay3yPress = () => setSelectedImage("provider");
  const handleClientPress = () => setSelectedImage("client");

  const handleContinuePress = async () => {
    if (!selectedImage) {
      Alert.alert("تنبيه", "يرجى اختيار نوع الحساب أولاً");
      return;
    }

    // ✅ Save role in Context
    setUserInfo((prev) => ({ ...prev, role: selectedImage }));

    if (selectedImage === "client") {
      // 🔹 Instead of registering → go to UserLocationScreen
      navigation.navigate("UserLocation", { role: "client" });
    } else {
      // Provider → continue flow
      navigation.navigate("IndustrialSpecialtyScreen");
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#004AAD" />
        <Text style={styles.title}>جاري المتابعة...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>من انت؟</Text>
        <View style={styles.imagesSection}>
        <View style={styles.imageRow}>
          {/* صنايعي */}
          <TouchableOpacity
            style={[
              styles.touchableImage,
              selectedImage === "provider"
                ? styles.selectedImage
                : styles.unselectedImage,
            ]}
            onPress={handleSanay3yPress}
            activeOpacity={0.7}
          >
            <Image
              source={require("../assets/snnay3ycat.png")}
              style={styles.brandImage}
              resizeMode="contain"
            />
            <Text style={styles.imageLabel}>صنايعي</Text>
          </TouchableOpacity>

          {/* مستخدم */}
          <TouchableOpacity
            style={[
              styles.touchableImage,
              selectedImage === "client"
                ? styles.selectedImage
                : styles.unselectedImage,
            ]}
            onPress={handleClientPress}
            activeOpacity={0.7}
          >
            <Image
              source={require("../assets/user.png")}
              style={styles.brandImage}
              resizeMode="contain"
            />
            <Text style={styles.imageLabel}>مستخدم</Text>
          </TouchableOpacity>
        </View>
      </View>

        <View style={styles.buttonSection}>
          <CustomButton
            title="تابع"
            onPress={handleContinuePress}
            type="filled"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  scrollContainer: { flexGrow: 1, paddingTop: 50 },
  title: {
    fontSize: 28,
    fontFamily: Fonts.BOLD,
    color: "#000000",
    textAlign: "center",
    marginTop: 20,
  },
  imagesSection: { flex: 1, justifyContent: "center" },
  imageRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  touchableImage: {
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 2,
  },
  selectedImage: { backgroundColor: "#B0C7E6", borderColor: "#B0C7E6" },
  unselectedImage: { backgroundColor: "#00000033", borderColor: "#00000033" },
  brandImage: { width: 160, height: 200, marginBottom: 20 },
  imageLabel: {
    fontSize: 18,
    fontFamily: Fonts.BOLD,
    color: "#000000",
    textAlign: "center",
  },
  buttonSection: {
    paddingHorizontal: 10,
    alignItems: "center",
    paddingBottom: 20,
  },
});

export default UserCategoryScreen;
