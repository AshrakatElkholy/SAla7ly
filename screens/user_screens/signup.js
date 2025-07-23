import React, { useState } from "react";
import {
  View,
  Alert,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
import SignupHeaderCard from "../../Components/SignupHeaderCard";
import CustomInput from "../../Components/CustomInput";
import CustomButton from "../../Components/CustomButton";
import { Fonts } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from "react-native";

function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");
  const [bioHeight, setBioHeight] = useState(100);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const API_URL = "https://jsonplaceholder.typicode.com/posts";

  const handleSignup = async () => {
    let hasError = false;
    if (!name || !phone || !email || !password || !confirmPassword) {
      Alert.alert("خطأ", "يرجى ملء جميع الحقول");
      hasError = true;
    }
    if (!email) setEmailError("يرجى إدخال البريد الإلكتروني");
    else if (!email.includes("@")) setEmailError("البريد الإلكتروني غير صحيح");
    else setEmailError("");

    if (!password) setPasswordError("يرجى إدخال كلمة المرور");
    else if (password.length < 6) setPasswordError("كلمة المرور قصيرة جداً");
    else setPasswordError("");

    if (password !== confirmPassword) {
      Alert.alert("خطأ", "كلمتا المرور غير متطابقتين");
      hasError = true;
    }

    if (hasError || emailError || passwordError) return;

    const data = {
      name,
      phone,
      email,
      password,
      bio,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      // ✅ Save user locally
      await AsyncStorage.setItem("user", JSON.stringify(data));

      // ✅ Navigate to next screen
      navigation.replace("UserCategoryScreen");
    } catch (error) {
      Alert.alert("خطأ", "حدث خطأ أثناء إرسال البيانات");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <SignupHeaderCard
          onBack={() => navigation.goBack()}
          title="انشاء حساب "
          subtitle="أدخل بياناتك لإنشاء حساب جديد في صلحى"
        />
        <View style={styles.formContainer}>
          <CustomInput
            label=" الاسم كامل"
            value={name}
            onChangeText={setName}
            placeholder="أدخل اسمك"
            inputStyle={{ fontFamily: Fonts.REGULAR }}
          />
          <CustomInput
            label="رقم الهاتف"
            value={phone}
            onChangeText={setPhone}
            placeholder="أدخل رقم هاتفك"
            keyboardType="phone-pad"
            inputStyle={{ fontFamily: Fonts.REGULAR }}
          />
          <CustomInput
            label="حساب شخصي"
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com"
            keyboardType="email-address"
            error={emailError}
            deferError
            inputStyle={{ fontFamily: Fonts.REGULAR }}
          />
          <CustomInput
            label="كلمة المرور"
            value={password}
            onChangeText={setPassword}
            placeholder="أدخل كلمة المرور"
            secureTextEntry
            error={passwordError}
            deferError
            inputStyle={{ fontFamily: Fonts.REGULAR }}
          />
          <CustomInput
            label="تأكيد كلمة المرور"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="أعد إدخال كلمة المرور"
            secureTextEntry
            inputStyle={{ fontFamily: Fonts.REGULAR }}
          />
          <CustomInput
            label="نبذة عنك"
            value={bio}
            onChangeText={setBio}
            placeholder="اكتب نبذة قصيرة"
            multiline
            numberOfLines={4}
            scrollEnabled
            onContentSizeChange={e =>
              setBioHeight(e.nativeEvent.contentSize.height)
            }
            style={{ minHeight: bioHeight }}
            inputStyle={{ fontFamily: Fonts.REGULAR }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: 5,
              marginEnd: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("ClientLoginScreen")}
            >
              <Text
                style={{
                  color: "#1566C1",
                  fontSize: 16,
                  fontFamily: Fonts.REGULAR,
                }}
              >
                تسجيل الدخول
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: "#444",
                fontSize: 16,
                fontFamily: Fonts.REGULAR,
              }}
            >
              {" "}
              قم بتسجيل دخول ؟
            </Text>
          </View>
          <View style={{ flex: 1 }} />
          <CustomButton
            title="تابع"
            onPress={handleSignup}
            type="filled"
            style={{
              paddingTop: 10,
              marginBottom: 50,
              fontSize: 18,
            }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  formContainer: {
    flex: 1,
    padding: 18,
    backgroundColor: "#fff",
  },
});

export default SignupScreen;
