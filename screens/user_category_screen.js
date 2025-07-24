import React, { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import CustomButton from "../Components/CustomButton";
import { Fonts } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

function user_category_screen({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSanay3yPress = () => {
    console.log("Sanay3y image pressed");
    setSelectedImage("sanay3y");
  };

  const handleSnay3y1Press = () => {
    console.log("Snay3y1 image pressed");
    setSelectedImage("client");
  };

  const handleContinuePress = async () => {
    if (!selectedImage) {
      alert("يرجى اختيار نوع الحساب أولاً");
      return;
    }

    try {
      await AsyncStorage.setItem("userType", selectedImage);
      await AsyncStorage.setItem("user", "true");

      if (selectedImage === "client") {
        navigation.navigate("UserLocation"); // العميل → شاشة اللوكيشن
      } else {
        navigation.navigate("IndustrialSpecialtyScreen"); // الصنايعي → شاشة التخصصات
      }
    } catch (error) {
      console.error("AsyncStorage Error:", error);
      alert("حدث خطأ أثناء الحفظ، حاول مرة أخرى");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>من انت؟</Text>

      <View style={styles.imagesSection}>
        <View style={styles.imageRow}>
          <TouchableOpacity
            style={[
              styles.touchableImage,
              selectedImage === "sanay3y"
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

          <TouchableOpacity
            style={[
              styles.touchableImage,
              selectedImage === "client"
                ? styles.selectedImage
                : styles.unselectedImage,
            ]}
            onPress={handleSnay3y1Press}
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
          title={"تابع"}
          onPress={handleContinuePress}
          type="filled"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontFamily: Fonts.BOLD,
    color: "#000000",
    textAlign: "center",
    marginTop: 20,
  },
  imagesSection: {
    flex: 1,
    justifyContent: "center",
  },
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
  selectedImage: {
    backgroundColor: "#B0C7E6",
    borderColor: "#B0C7E6",
  },
  unselectedImage: {
    backgroundColor: "#00000033",
    borderColor: "#00000033",
  },
  brandImage: {
    width: 160,
    height: 200,
    marginBottom: 20,
  },
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

export default user_category_screen;
