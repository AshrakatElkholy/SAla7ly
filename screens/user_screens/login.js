// LoginScreen.js
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../Context/UserContext"; // ✅ Using your UserContext
import { useNavigation } from "@react-navigation/native";

export default function LoginScreen() {
  const { setUserInfo, setToken, setUserId, setUserRole } = useContext(UserContext);
  const navigation = useNavigation();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("خطأ", "يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setLoading(true);
    
    try {
      console.log("Sending login request:", { email, password });
      
      const res = await fetch("https://f27ad2cde96b.ngrok-free.app/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok) {
        throw new Error(data.message || "فشل في تسجيل الدخول");
      }

      // ✅ Extract token and user data
      const { access_token, refresh_token, user, ...userData } = data;
      
      if (!access_token) {
        throw new Error("لم يتم العثور على التوكن في الاستجابة");
      }

      // ✅ Store in AsyncStorage
      await AsyncStorage.setItem("access_token", access_token);
      
      if (refresh_token) {
        await AsyncStorage.setItem("refresh_token", refresh_token);
      }

      // ✅ Store user info
      const userInfo = user || userData;
      await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));

      // ✅ Update UserContext
      setToken(access_token);
      setUserInfo(userInfo);
      
      // ✅ Decode and set user ID and role from token
      try {
        const base64Url = access_token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decoded = JSON.parse(jsonPayload);
        
        if (decoded.id || decoded.sub) {
          setUserId(decoded.id || decoded.sub);
        }
        if (decoded.role) {
          setUserRole(decoded.role);
        }
      } catch (tokenError) {
        console.log("Error decoding token:", tokenError);
      }

      // ✅ Navigate based on user role
      const userRole = userInfo.role || userData.role;
      
      if (userRole === "provider" || userRole === "sanay3y") {
        navigation.reset({
          index: 0,
          routes: [{ name: "providerHome" }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "userHome" }],
        });
      }

      Alert.alert("نجح", "تم تسجيل الدخول بنجاح!");

    } catch (err) {
      console.error("Login error details:", err.message);
      Alert.alert("خطأ", err.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>تسجيل الدخول</Text>
      
      <TextInput
        style={styles.input}
        placeholder="البريد الإلكتروني"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="كلمة المرور"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>تسجيل الدخول</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    padding: 20,
    backgroundColor: "#fff"
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 30,
    color: "#004AAD"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#004AAD",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
});