import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Fonts } from "../../constants";
import CustomButton from "../../Components/CustomButton";

function Done() {
  const navigation = useNavigation();

 const handleSignupPress = () => {
  navigation.navigate("ClientLoginScreen");
};

  return (
    <View style={styles.container}>
      {/* Status Illustration */}
      <Image
        source={require("../../assets/images1.png")}
        style={styles.mainDone}
        resizeMode="contain"
      />
      <View style={{ alignItems: "center" }}>
        <Text style={styles.welcomeText}>! تم تفعيل حسابك بنجاح</Text>
        <Text style={styles.subtitleText}>
          . مبروك! دلوقتي تقدر تبدأ تستقبل طلبات وتشتغل على تطبيق صلّحلي
        </Text>
      </View>
      <CustomButton title="ابدأ الشغل" onPress={handleSignupPress} type="filled" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  mainDone: {
    width: "80%",
    height: 250,
    marginBottom: 20,
  },
  welcomeText: {
    fontFamily: Fonts.BOLD,
    fontSize: 20,
    color: "#004AAD",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitleText: {
    fontFamily: Fonts.REGULAR,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 20,
  },
});

export default Done;
