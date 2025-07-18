// * IndustrialIdentityScreen — ONBOARDING

import React, { useState, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

/* ⬇️ Fonts + TabsHeader component */
import { Fonts } from "../../../constants";
import CustomButton from "../../../Components/CustomButton";
import CustomHeader from "../../../Components/CustomHeader";

/* ---------- Re‑usable upload card ---------- */
const UploadCard = ({ label, imageUri, onAdd, onRemove }) => (
  <View style={styles.card}>
    {imageUri ? (
      <>
        <Image source={{ uri: imageUri }} style={styles.preview} />
        <TouchableOpacity style={styles.deleteBtn} onPress={onRemove}>
          <Icon name="x" size={14} color="#fff" />
        </TouchableOpacity>
      </>
    ) : (
      <>
        <View style={styles.iconCircle}>
          <Icon name="image" size={24} color="#004AAD" />
        </View>
        <Text style={styles.cardLabel}>{label}</Text>
        <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
          <Text style={styles.addBtnTxt}>اضافه</Text>
        </TouchableOpacity>
      </>
    )}
  </View>
);

const IndustrialIdentityScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  /* ---------- state ---------- */
  const [personal, setPersonal] = useState(null);
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);

  /* ---------- gallery ---------- */
  const pickImage = async (setter) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("يرجى السماح بالوصول للصور");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!res.canceled) setter(res.assets[0].uri);
  };

  /* ---------- header dims ---------- */
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

  /* ---------- navigation ---------- */
  const isReady = personal && idFront && idBack;
  const handleNext = () => {
    if (!isReady) return;
    navigation.navigate("IndustrialLocationScreen");
  };

  /* ---------------- render ---------------- */
  return (
    <SafeAreaView style={styles.safe}>
      {/* ===== Header ===== */}
      <CustomHeader
        title="تفاصيل صنايعى"
        onBack={() => navigation.goBack()}
        activeIndex={1}
      />

      {/* ===== Body ===== */}
      <KeyboardAvoidingView
        style={{ flex: 2 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          <Text style={styles.section}>صوره شخصيه</Text>
          <UploadCard
            label="اضغط لاضافه صوره شخصيه"
            imageUri={personal}
            onAdd={() => pickImage(setPersonal)}
            onRemove={() => setPersonal(null)}
          />

          <Text style={styles.section}>اثبات هويه اماميه</Text>
          <UploadCard
            label="اضغط لاضافه صوره اثبات هويه اماميه"
            imageUri={idFront}
            onAdd={() => pickImage(setIdFront)}
            onRemove={() => setIdFront(null)}
          />

          <Text style={styles.section}>اثبات هويه خلفيه</Text>
          <UploadCard
            label="اضغط لاضافه صوره اثبات هويه خلفيه"
            imageUri={idBack}
            onAdd={() => pickImage(setIdBack)}
            onRemove={() => setIdBack(null)}
          />

          {/* Next */}
          <CustomButton
            title="التالى"
            onPress={handleNext}
            disabled={!isReady}
            type={isReady ? "filled" : "outline"}
            textStyle={{ fontFamily: Fonts.BOLD, fontSize: 18 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/* -------- Styles -------- */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  /* header */
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.BOLD,
    marginRight: 8,
  },
  backCircle: {
    padding: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  /* section headings */
  section: {
    alignSelf: "flex-end",
    fontSize: 18,
    fontFamily: Fonts.REGULAR,
    color: "#333",
    marginTop: 24,
    marginBottom: 8,
  },

  /* upload card */
  card: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#A0AEC0",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 32,
    backgroundColor: "#E6EEF8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 14,
    color: "#4A5568",
    fontFamily: Fonts.REGULAR,
    textAlign: "center",
    marginVertical: 12,
  },
  addBtn: {
    backgroundColor: "#004AAD",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 999,
  },
  addBtnTxt: {
    color: "#fff",
    fontSize: 14,
    fontFamily: Fonts.BOLD,
  },

  preview: { width: 110, height: 110, borderRadius: 8 },
  deleteBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#555",
    borderRadius: 10,
    padding: 2,
  },

  /* next button */
  nextBtn: {
    backgroundColor: "#004AAD",
    paddingVertical: 16,
    borderRadius: 999,
    marginTop: 30,
  },
  nextBtnDisabled: { backgroundColor: "#BFD2F6" },
  nextTxt: {
    color: "#fff",
    fontSize: 16,
    fontFamily: Fonts.BOLD,
    textAlign: "center",
  },
});

export default IndustrialIdentityScreen;
