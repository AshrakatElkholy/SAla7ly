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
} from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import Icon from "react-native-vector-icons/Feather";
import { Ionicons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";

import { Fonts } from "../../../constants";
import CustomButton from "../../../Components/CustomButton";
import CustomInput from "../../../Components/CustomInput";
import CustomHeader from "../../../Components/CustomHeader";

export default function IndustrialLocationScreen() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const [region, setRegion] = useState(null);
  const [marker, setMarker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

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

  const isReady = !!marker;
  const handleSave = () => isReady && navigation.navigate("ClientLoginScreen");

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
        <>
          <View style={styles.searchWrap}>
            <CustomInput
              placeholder="بحث"
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleCitySearch}
              deferError
              inputStyle={{
                paddingRight: 52,
              }}
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
              onLongPress={(e) => setMarker(e.nativeEvent.coordinate)}
              onRegionChangeComplete={setRegion}
            >
              {marker && (
                <Marker
                  coordinate={marker}
                  draggable
                  onDragEnd={(e) => setMarker(e.nativeEvent.coordinate)}
                />
              )}
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
                title="ابدا مع صلحلى"
                onPress={handleSave}
                disabled={!isReady}
                type={isReady ? "filled" : "outline"}
                textStyle={{ fontFamily: Fonts.BOLD, fontSize: 18 }}
              />
            </View>
          </KeyboardAvoidingView>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? 60 : 70,
    paddingBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    color: "#000",
    marginLeft: 10,
    marginRight: 10,
    fontFamily: Fonts.BOLD,
  },
  backCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#004AAD",
    alignItems: "center",
    justifyContent: "center",
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
  map: {
    flex: 1,
  },
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
