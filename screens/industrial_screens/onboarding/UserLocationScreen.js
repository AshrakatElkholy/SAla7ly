// screens/user_screens/onboarding/UserLocationScreen.js

import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Fonts } from "../../../constants";
import CustomButton from "../../../Components/CustomButton";
import CustomInput from "../../../Components/CustomInput";
import CustomHeader from "../../../Components/CustomHeader";
import { UserContext } from "../../Context/UserContext";

const API_BASE = "https://f27ad2cde96b.ngrok-free.app";

export default function UserLocationScreen() {
  const navigation = useNavigation();
  const { userInfo } = useContext(UserContext);

  const [cityName, setCityName] = useState("جاري تحديد الموقع...");
  const [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchCityName = async (coords) => {
    try {
      const [place] = await Location.reverseGeocodeAsync(coords);
      if (place?.city) setCityName(place.city);
      else if (place?.region) setCityName(place.region);
      else setCityName("لم يتم التعرف على الموقع");
    } catch {
      setCityName("حدث خطأ في تحديد المدينة");
    }
  };

  const locateMe = async () => {
    try {
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      };
      setRegion(newRegion);
      setMarker({ latitude, longitude });
      fetchCityName({ latitude, longitude });
    } catch {
      alert("تعذر تحديد موقعك الحالي");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") throw new Error("permission denied");
        await locateMe();
      } catch {
        setRegion({
          latitude: 30.0444,
          longitude: 31.2357,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCitySearch = async () => {
    if (!search.trim()) return;
    try {
      setSearchLoading(true);
      const results = await Location.geocodeAsync(search.trim());
      if (results.length) {
        const { latitude, longitude } = results[0];
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };
        setRegion(newRegion);
        setMarker({ latitude, longitude });
        fetchCityName({ latitude, longitude });
      } else {
        alert("لم يتم العثور على الموقع");
      }
    } catch {
      alert("حدث خطأ أثناء البحث");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSave = async () => {
    if (!marker) {
      Alert.alert("تنبيه", "الرجاء اختيار موقعك على الخريطة");
      return;
    }

    try {
      setSubmitting(true);

      const signupForm = new FormData();
      signupForm.append("name", userInfo?.name?.trim() || "");
      signupForm.append("email", userInfo?.email?.trim() || "");
      signupForm.append("password", userInfo?.password || "");
      signupForm.append("rePassword", userInfo?.password || "");
      signupForm.append("phone", userInfo?.phone?.trim() || "");
      signupForm.append("role", "user");
      signupForm.append("address", cityName || "القاهرة");

      console.log("📤 Sending User signup payload (FormData):", signupForm);

      const response = await fetch(`${API_BASE}/auth/signUp`, {
        method: "POST",
        headers: { "ngrok-skip-browser-warning": "true" },
        body: signupForm,
      });

      const data = await response.json().catch(async () => {
        const txt = await response.text();
        console.error("❌ Non-JSON response:", txt);
        return null;
      });

      console.log("📍 Signup response:", data);

      // ✅ التصليح هنا: نقبل token أو access_token
      if (response.ok && (data?.access_token || data?.token)) {
        const token = data.access_token || data.token;
        const refresh = data.refresh_token || "";

        await AsyncStorage.setItem("access_token", token);
        if (refresh) {
          await AsyncStorage.setItem("refresh_token", refresh);
        }

        Alert.alert("نجاح", "تم إنشاء حسابك بنجاح ✅", [
          { text: "موافق", onPress: () => navigation.replace("DoneScreen") },
        ]);
      } else {
        let msg = data?.message || "فشل في إنشاء الحساب";
        if (Array.isArray(msg)) msg = msg.join("\n");
        Alert.alert("خطأ", msg);
      }
    } catch (err) {
      console.error("❌ Signup error:", err);
      Alert.alert("خطأ", "تعذر إنشاء الحساب");
    } finally {
      setSubmitting(false);
    }
  };

  const isReady = !!marker;

  return (
    <SafeAreaView style={styles.safe}>
      <CustomHeader
        title="حدد موقعك"
        onBack={() => navigation.goBack()}
        showTabs={false}
        showCurve={false}
        bgColor="#FFFFFF"
      />

      {loading || !region ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#004AAD" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.searchWrap}>
            <CustomInput
              placeholder="بحث"
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleCitySearch}
              deferError
              inputStyle={{ paddingRight: 52 }}
            />
            <TouchableOpacity onPress={handleCitySearch} style={styles.icHit}>
              {searchLoading ? (
                <ActivityIndicator size={18} color="#666" />
              ) : (
                <Icon name="search" size={20} color="#666" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.mapBox}>
            <MapView
              style={styles.map}
              region={region}
              onLongPress={(e) => {
                const coords = e.nativeEvent.coordinate;
                setMarker(coords);
                fetchCityName(coords);
              }}
              onRegionChangeComplete={setRegion}
            >
              {marker && <Marker coordinate={marker} />}
            </MapView>

            <TouchableOpacity style={styles.locateBtn} onPress={locateMe}>
              <Icon name="crosshair" size={22} color="#004AAD" />
            </TouchableOpacity>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
              <CustomButton
                title={submitting ? "جارٍ التسجيل..." : "ابدا مع صلحلى"}
                onPress={handleSave}
                disabled={!isReady || submitting}
                type={isReady ? "filled" : "outline"}
                textStyle={{ fontFamily: Fonts.BOLD, fontSize: 18 }}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 0,
  },
  searchWrap: {
    marginTop: 16,
    marginHorizontal: 20,
    position: "relative",
  },
  icHit: {
    position: "absolute",
    right: 15,
    top: 14,
  },
  mapBox: {
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 16,
    overflow: "hidden",
    aspectRatio: 0.6,
  },
  map: { flex: 1 },
  locateBtn: {
    position: "absolute",
    bottom: 20,
    right: 30,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 30,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 3,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
