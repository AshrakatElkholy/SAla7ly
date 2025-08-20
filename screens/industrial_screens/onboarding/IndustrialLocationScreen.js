// screens/industrial_screens/onboarding/IndustrialLocationScreen.js
import React, { useEffect, useState, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  StatusBar,
  useWindowDimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  ScrollView,
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

export default function IndustrialLocationScreen({ route, navigation }) {
  const { width } = useWindowDimensions();

  // Get role from navigation params (default to 'provider' for now)
  const role = route?.params?.role || "provider"; // TODO: update when user roles are implemented

  /* ------------ state ------------ */
  const [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(null);
  const [centerRegion, setCenterRegion] = useState(null);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  // Load saved progress on mount
  useEffect(() => {
    AsyncStorage.setItem("onboardingStep", "IndustrialLocationScreen");
    (async () => {
      const saved = await AsyncStorage.getItem("onboardingLocation");
      if (saved) {
        const data = JSON.parse(saved);
        setRegion(data.region || null);
        setMarker(data.marker || null);
      }
    })();
  }, []);

  // Save progress on change
  useEffect(() => {
    AsyncStorage.setItem(
      "onboardingLocation",
      JSON.stringify({ region, marker })
    );
  }, [region, marker]);

  /* ------------ الحصول على إحداثيّات المستخدم ------------ */
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") throw new Error("permission denied");

        const {
          coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        });
      } catch {
        // fallback: Cairo
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

  /* ------------ البحث بالنص ------------ */
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
      } else {
        alert("لم يتم العثور على الموقع");
      }
    } catch {
      alert("حدث خطأ أثناء البحث");
    } finally {
      setSearchLoading(false);
    }
  };

  /* ------------ (responsive) ------------ */
  const dyn = useMemo(() => {
    const topPad =
      Platform.OS === "android" ? StatusBar.currentHeight || 24 : 44;
    const h = width * 0.3;
    return StyleSheet.create({
      headerBg: {
        height: h + 50,
        backgroundColor: "#F0F4F8",
        borderBottomLeftRadius: width * 0.25,
        borderBottomRightRadius: width * 0.05,
        paddingTop: topPad,
        paddingHorizontal: 20,
      },
      headerRow: {
        marginTop: 18,
        flexDirection: "row-reverse",
        alignItems: "center",
      },
    });
  }, [width]);

  /* ------------ الحفظ / التالى ------------ */
  const isReady = !!marker;
  const handleSave = () => {
    if (!isReady) return;
    AsyncStorage.multiRemove([
      "onboardingStep",
      "onboardingSpecialty",
      "onboardingIdentity",
      "onboardingLocation",
    ]);
    if (role === "provider") {
      navigation.navigate("PendingScreen");
    } else {
      Alert.alert("تم اختيار الموقع", "سيتم تحويلك للصفحة الرئيسية قريباً.");
    }
  };

  /* ------------ render ------------ */
  return (
    <SafeAreaView style={styles.safe}>
      {/* ===== Header ===== */}
      <CustomHeader
        title="حدد موقعك"
        onBack={() => navigation.goBack()}
        activeIndex={2}
      />

      {/* ===== Body ===== */}
      {loading || !region ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#004AAD" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* ===== حقل البحث ===== */}
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

          {/* ===== Map ===== */}
          <View style={styles.mapBox}>
            <MapView
              style={styles.map}
              initialRegion={region}
              region={region}
              onRegionChangeComplete={(reg) => {
                setRegion(reg);
                setCenterRegion(reg);
              }}
              onLongPress={(e) => setMarker(e.nativeEvent.coordinate)}
            >
              {marker && (
                <Marker
                  coordinate={marker}
                  draggable
                  onDragEnd={(e) => setMarker(e.nativeEvent.coordinate)}
                />
              )}
            </MapView>
            {/* ===== Crosshair Button ===== */}
            <TouchableOpacity
              style={styles.crosshairButton}
              onPress={async () => {
                try {
                  setLoading(true);
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
                } catch (error) {
                  alert("فشل في تحديد الموقع");
                } finally {
                  setLoading(false);
                }
              }}
            >
              <Icon name="crosshair" size={22} color="#004AAD" />
            </TouchableOpacity>
          </View>

          {/* ===== Save Button ===== */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
              <CustomButton
                title="ابدا مع صلحلى"
                onPress={handleSave}
                disabled={!isReady}
                type={isReady ? "filled" : "outline"}
                textStyle={{ fontFamily: Fonts.BOLD }}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

/* -------- Styles -------- */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },

  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.BOLD,
    marginRight: 8,
    fontFamily: Fonts.REGULAR,
  },

  /* search */
  searchWrap: {
    marginTop: 16,
    marginHorizontal: 20,
    position: "relative",
  },
  icHit: {
    position: "absolute",
    right: 30,
    top: 12,
  },

  mapBox: {
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 16,
    overflow: "hidden",
    aspectRatio: 0.7,
    position: "relative",
  },
  crosshairButton: {
    position: "absolute",
    bottom: 20,
    right: 30,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  map: { flex: 1 },

  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  section: {
    alignSelf: "flex-end",
    fontSize: 16,
    fontFamily: Fonts.BOLD,
    color: "#333",
    marginTop: 24,
    marginBottom: 8,
    fontFamily: Fonts.REGULAR,
  },
});
