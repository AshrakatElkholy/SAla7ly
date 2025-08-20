// screens/FormInput.js
import React, { useState, useContext } from "react";
import {
  View,
  Alert,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import SignupHeaderCard from "../../Components/SignupHeaderCard";
import CustomInput from "../../Components/CustomInput";
import CustomButton from "../../Components/CustomButton";
import { Fonts } from "../../constants";
import { UserContext } from "../Context/UserContext";

function FormInput({ navigation }) {
  const { setUserInfo } = useContext(UserContext);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [bio, setBio] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password);
  const validatePhone = (phone) =>
    /^(00201|\+201|01)[0-2,5]{1}[0-9]{8}$/.test(phone);

  const handleSignup = () => {
    setEmailError("");
    setPasswordError("");

    if (!name || !phone || !email || !password || !confirmPassword || !bio) {
      Alert.alert("خطأ", "يرجى ملء جميع الحقول");
      return;
    }

    if (name.length < 5) {
      Alert.alert("خطأ", "الاسم يجب ان يكون اكثر من 5 حروف");
      return;
    }

    if (!validatePhone(phone)) {
      Alert.alert("خطأ", "رقم الهاتف غير صحيح");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("البريد الالكتروني غير صحيح");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "يجب ان تحتوي كلمة المرور على حرف كبير وحرف صغير ورقم و يجب ان لا يقل عن 8 حروف"
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("خطأ", "كلمة المرور غير متطابقة");
      return;
    }

    if (bio.length < 15) {
      Alert.alert("خطأ", "النبذة يجب ان تكون اكثر من 15 حرف");
      return;
    }

    // ✅ Save to global Context so other screens can add more info later
    setUserInfo((prev) => ({
      ...prev,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      password,
      aboutMe: bio.trim(),
    }));

    console.log("✅ Basic signup data stored in Context");

    navigation.navigate("UserCategoryScreen");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <SignupHeaderCard
          onBack={() => navigation.goBack()}
          title="انشاء حساب"
          subtitle="أدخل بياناتك لإنشاء حساب جديد في صلحى"
        />

        <View style={styles.formContainer}>
          <CustomInput label="الاسم كامل" value={name} onChangeText={setName} placeholder="أدخل اسمك" />

          <CustomInput label="رقم الهاتف" value={phone} onChangeText={setPhone} placeholder="01xxxxxxxxx" keyboardType="phone-pad" />

          <CustomInput label="البريد الالكتروني" value={email} onChangeText={setEmail} placeholder="example@email.com" keyboardType="email-address" autoCapitalize="none" error={emailError} />

          <CustomInput label="كلمة المرور" value={password} onChangeText={setPassword} placeholder="أدخل كلمة المرور" secureTextEntry error={passwordError} />

          <CustomInput label="تأكيد كلمة المرور" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="أعد إدخال كلمة المرور" secureTextEntry />

          <CustomInput label="نبذة عنك" value={bio} onChangeText={setBio} placeholder="اكتب نبذة قصيرة (15 حرف على الأقل)" multiline numberOfLines={4} inputStyle={{ minHeight: 80 }} />

          <View style={styles.loginRow}>
            <TouchableOpacity onPress={() => navigation.navigate("ClientLoginScreen")}>
              <Text style={styles.loginLink}>تسجيل الدخول</Text>
            </TouchableOpacity>
            <Text style={styles.loginText}>لديك حساب بالفعل؟ </Text>
          </View>

          <CustomButton title="تابع" onPress={handleSignup} type="filled" textStyle={{ fontFamily: Fonts.BOLD, fontSize: 18 }} style={{ marginTop: 30, marginBottom: 50 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  formContainer: { flex: 1, padding: 18, backgroundColor: "#fff" },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  loginLink: {
    color: "#1566C1",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  loginText: {
    color: "#444",
    fontSize: 16,
  },
});

export default FormInput;
