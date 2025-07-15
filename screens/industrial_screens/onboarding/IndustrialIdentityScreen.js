/**
 * IndustrialIdentityScreen — ONBOARDING
 */

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
import TabsHeader from "../../../Components/TabsHeader";
import CustomButton from "../../../Components/CustomButton";

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
          <Icon name="image" size={28} color="#004AAD" />
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
      <View style={dyn.headerBg}>
        <View style={dyn.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-right" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>تفاصيل صنايعي</Text>
        </View>

        {/* ✅ TabsHeader: index 1 = الشاشة الحالية */}
        <TabsHeader activeIndex={1} />
      </View>

      {/* ===== Body ===== */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
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
            textStyle={{ fontFamily: Fonts.BOLD }}
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

  /* section headings */
  section: {
    alignSelf: "flex-end",
    fontSize: 16,
    fontFamily: Fonts.BOLD,
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
    width: 64,
    height: 64,
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
