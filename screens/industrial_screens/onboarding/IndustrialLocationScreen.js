// IndustrialLocationScreen.js
import React, { useEffect, useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  ActivityIndicator,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import Icon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Fonts } from "../../../constants";
import CustomButton from "../../../Components/CustomButton";
import CustomInput from "../../../Components/CustomInput";
import CustomHeader from "../../../Components/CustomHeader";
import { UserContext } from "../../Context/UserContext";

export default function IndustrialLocationScreen({ navigation }) {
  const { userInfo } = useContext(UserContext);

  const [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  // Load saved progress
  useEffect(() => {
    AsyncStorage.setItem("onboardingStep", "IndustrialLocationScreen");
    (async () => {
      try {
        const saved = await AsyncStorage.getItem("onboardingLocation");
        if (saved) {
          const data = JSON.parse(saved);
          setRegion(data.region || null);
          setMarker(data.marker || null);
        }
      } catch {
        console.log("No saved location data");
      }
    })();
  }, []);

  // Save progress
  useEffect(() => {
    if (region && marker) {
      AsyncStorage.setItem(
        "onboardingLocation",
        JSON.stringify({ region, marker })
      );
    }
  }, [region, marker]);

  // Get current location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") throw new Error("Location permission denied");

        const {
          coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const currentRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        };
        setRegion(currentRegion);
        setMarker({ latitude, longitude });
      } catch (error) {
        console.log("⚠️ Location error, using Cairo fallback:", error.message);
        const fallbackRegion = {
          latitude: 30.0444,
          longitude: 31.2357,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setRegion(fallbackRegion);
        setMarker({ latitude: 30.0444, longitude: 31.2357 });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Search city
  const handleCitySearch = async () => {
    if (!search.trim()) {
      Alert.alert("تنبيه", "يرجى إدخال اسم المدينة للبحث");
      return;
    }

    try {
      setSearchLoading(true);
      const results = await Location.geocodeAsync(search.trim());

      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };
        setRegion(newRegion);
        setMarker({ latitude, longitude });
      } else {
        Alert.alert("لا توجد نتائج", "لم يتم العثور على الموقع المطلوب");
      }
    } catch {
      Alert.alert("خطأ", "حدث خطأ أثناء البحث عن الموقع");
    } finally {
      setSearchLoading(false);
    }
  };

  // Register
  const handleRegister = async () => {
    if (!marker) {
      Alert.alert("خطأ", "يجب تحديد موقعك على الخريطة");
      return;
    }

    setLoading(true);

    try {
      const signupForm = new FormData();

      // Required fields
      signupForm.append("name", userInfo?.name?.trim() || "");
      signupForm.append("email", userInfo?.email?.trim() || "");
      signupForm.append("password", userInfo?.password || "");
      signupForm.append("rePassword", userInfo?.password || "");
      signupForm.append("phone", userInfo?.phone?.trim() || "");
      signupForm.append("role", "provider");
      signupForm.append("address", userInfo?.address || "القاهرة");
      signupForm.append("profession", userInfo?.profession || "نجار");

      if (userInfo?.aboutMe) signupForm.append("aboutMe", userInfo.aboutMe);

      // Identity images
      if (userInfo?.identity?.profilePic?.uri) {
        signupForm.append("profilePic", {
          uri: userInfo.identity.profilePic.uri,
          type: userInfo.identity.profilePic.type || "image/jpeg",
          name: userInfo.identity.profilePic.name || "profilePic.jpg",
        });
      }
      if (userInfo?.identity?.idFront?.uri) {
        signupForm.append("identityPic", {
          uri: userInfo.identity.idFront.uri,
          type: userInfo.identity.idFront.type || "image/jpeg",
          name: userInfo.identity.idFront.name || "idFront.jpg",
        });
      }
      if (userInfo?.identity?.idBack?.uri) {
        signupForm.append("identityPic", {
          uri: userInfo.identity.idBack.uri,
          type: userInfo.identity.idBack.type || "image/jpeg",
          name: userInfo.identity.idBack.name || "idBack.jpg",
        });
      }

      const signupRes = await fetch(
        "https://557431a98314.ngrok-free.app/auth/signUp",
        {
          method: "POST",
          headers: { "ngrok-skip-browser-warning": "true" },
          body: signupForm,
        }
      );

      const signupText = await signupRes.text();
      console.log("📩 Server Raw Response:", signupText);
      console.log("📡 Response Status:", signupRes.status);

      let signupResult;
      try {
        signupResult = JSON.parse(signupText);
      } catch {
        console.log("❌ JSON parse failed, raw text:", signupText);
        throw new Error("خطأ في تحليل استجابة السيرفر");
      }

      console.log("✅ Parsed Server Response:", signupResult);

      if (!signupRes.ok) throw new Error(signupResult.message || "فشل التسجيل");

      const token =
        signupResult?.token ||
        signupResult?.access_token ||
        signupResult?.accessToken;

      if (!token) throw new Error("لم يتم استرجاع التوكن من السيرفر");

      await AsyncStorage.setItem("access_token", token);

      // ✅ Upload workshop images with token
      await uploadWorkshop(token);

      Alert.alert("تم التسجيل بنجاح", "مرحباً بك في صلحلي!", [
        {
          text: "موافق",
          onPress: () =>  navigation.navigate("PendingScreen")
        },
      ]);
    } catch (error) {
      console.log("❌ Signup failed:", error);
      Alert.alert("خطأ", error.message || "تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  // Upload workshop API
  const uploadWorkshop = async (token) => {
    try {
      const workshopForm = new FormData();

      // ✅ send mainImage
      if (userInfo?.workshop?.mainImage?.uri) {
        workshopForm.append("mainImage", {
          uri: userInfo.workshop.mainImage.uri,
          type: userInfo.workshop.mainImage.type || "image/jpeg",
          name: userInfo.workshop.mainImage.name || "mainImage.jpg",
        });
      }

      // ✅ send multiple images
      if (userInfo?.workshop?.images?.length > 0) {
        userInfo.workshop.images.forEach((img, i) => {
          workshopForm.append("images", {
            uri: img.uri,
            type: img.type || "image/jpeg",
            name: img.name || `image_${i + 1}.jpg`,
          });
        });
      }

      const res = await fetch(
        "https://557431a98314.ngrok-free.app/provider/addWorkShop",
        {
          method: "POST",
          headers: {
            Authorization: `bearer ${token}`, // ✅ lowercase
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "multipart/form-data",
          },
          body: workshopForm,
        }
      );

      const text = await res.text();
      console.log("🏭 Workshop API Raw:", text);

      let result;
      try {
        result = JSON.parse(text);
      } catch {
        console.log("❌ Workshop JSON parse failed:", text);
        return;
      }

      console.log("✅ Workshop API Response:", result);
    } catch (err) {
      console.log("❌ Workshop upload failed:", err);
    }
  };

  // get current location button
  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") throw new Error("Location permission denied");

      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.015,
      };
      setRegion(newRegion);
      setMarker({ latitude, longitude });
    } catch {
      Alert.alert("خطأ", "فشل في تحديد الموقع الحالي");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <CustomHeader
        title="حدد موقعك"
        onBack={() => navigation.goBack()}
        activeIndex={2}
        steps={["بيانات صنايعى", "اثبات شخصيه", "الموقع"]}
        currentStep={2}
      />

      {loading && !region ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#004AAD" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Search */}
          <View style={styles.searchWrap}>
            <CustomInput
              placeholder="بحث عن مدينة أو منطقة"
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleCitySearch}
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

          {/* Map */}
          <View style={styles.mapBox}>
            <MapView
              style={styles.map}
              region={region}
              onRegionChangeComplete={setRegion}
              onLongPress={(e) => setMarker(e.nativeEvent.coordinate)}
              showsUserLocation
            >
              {marker && (
                <Marker
                  coordinate={marker}
                  draggable
                  onDragEnd={(e) => setMarker(e.nativeEvent.coordinate)}
                  title="موقعك"
                  description="اسحب لتغيير الموقع"
                />
              )}
            </MapView>
            <TouchableOpacity
              style={styles.crosshairButton}
              onPress={getCurrentLocation}
            >
              <Icon name="crosshair" size={22} color="#004AAD" />
            </TouchableOpacity>
          </View>

          {/* Button */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
              <CustomButton
                title={loading ? "جاري التسجيل..." : "ابدا مع صلحلى"}
                onPress={handleRegister}
                disabled={loading || !marker}
                type={!marker ? "outline" : "filled"}
                textStyle={{ fontFamily: Fonts.BOLD }}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  searchWrap: { marginTop: 16, marginHorizontal: 20, position: "relative" },
  icHit: { position: "absolute", right: 30, top: 12 },
  mapBox: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 16,
    overflow: "hidden",
    aspectRatio: 0.7,
    position: "relative",
    elevation: 5,
  },
  crosshairButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 30,
    elevation: 8,
  },
  map: { flex: 1 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});
