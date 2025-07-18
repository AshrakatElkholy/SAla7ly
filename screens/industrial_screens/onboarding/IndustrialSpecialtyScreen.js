import React, { useState, useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  useWindowDimensions,
  Platform,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

import { Fonts } from "../../../constants";
import TabsHeader from "../../../Components/TabsHeader";
import CustomInput from "../../../Components/CustomInput";
import CustomButton from "../../../Components/CustomButton";
import CustomHeader from "../../../Components/CustomHeader";

/* ---------- Upload card ---------- */
const UploadCard = ({ imageUri, onAdd, onRemove }) => (
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
        <Text style={styles.cardLabel}>اضغط لاضافه صوره من اعمالك</Text>
        <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
          <Text style={styles.addBtnTxt}>اضافه</Text>
        </TouchableOpacity>
      </>
    )}
  </View>
);

export default function IndustrialSpecialtyScreen() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  /* ---- state ---- */
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [mainImg, setMainImg] = useState(null);
  const [extraImgs, setExtraImgs] = useState([]);

  /* ---- image picker ---- */
  const pickImage = async (setter) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return alert("يجب السماح بالوصول للصور");
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!res.canceled) setter(res.assets[0].uri);
  };

  /* ---- header sizes ---- */
  const dyn = useMemo(() => {
    const topPad =
      Platform.OS === "android" ? StatusBar.currentHeight || 24 : 44;
    const h = width * 0.3;
    return StyleSheet.create({
      headerBg: {
        height: h + 50,
        backgroundColor: "#F0F4F8",
        borderBottomRightRadius: width * 0.05,
        borderBottomLeftRadius: width * 0.25,
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

  /* ---- navigation readiness ---- */
  const isReady = specialty.trim() && bio.trim() && mainImg;
  const handleNext = () =>
    isReady && navigation.navigate("IndustrialIdentityScreen");

  /* ---- render ---- */
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* ===== Header ===== */}
      <CustomHeader
        title="تفاصيل صنايعى"
        onBack={() => navigation.goBack()}
        activeIndex={0}
      />

      {/* ===== Body ===== */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* التخصص */}
          <CustomInput
            label="التخصص"
            placeholder="اضف تخصص"
            value={specialty}
            onChangeText={setSpecialty}
            error={!specialty.trim() && "يرجى إدخال التخصص"}
            deferError
            labelStyle={{ fontFamily: Fonts.REGULAR, fontSize: 18 }}

            // inputStyle={{ fontFamily: Fonts.REGULAR }}
          />

          {/* أعمالك */}
          <Text style={styles.section}>أعمالك</Text>
          <UploadCard
            imageUri={mainImg}
            onAdd={() => pickImage(setMainImg)}
            onRemove={() => setMainImg(null)}
          />

          {/* صور إضافية */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}
          >
            {extraImgs.map((uri, idx) => (
              <View key={uri} style={{ marginLeft: 8 }}>
                <Image source={{ uri }} style={styles.thumb} />
                <TouchableOpacity
                  style={styles.thumbDelete}
                  onPress={() =>
                    setExtraImgs(extraImgs.filter((_, i) => i !== idx))
                  }
                >
                  <Icon name="x" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.addMore}
            onPress={() =>
              pickImage((uri) => setExtraImgs([...extraImgs, uri]))
            }
          >
            <Text style={styles.addMoreText}>اضافة صور اخرى</Text>
            <Icon name="plus" size={18} color="#004AAD" />
          </TouchableOpacity>

          {/* نبذة */}
          <CustomInput
            label="نبذة"
            placeholder="اكتب نبذة عنك أو عن خبراتك"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            style={{ marginTop: 2 }}
            error={!bio.trim() && "يرجى إدخال النبذة"}
            deferError
            labelStyle={{ fontFamily: Fonts.REGULAR, fontSize: 18 }}
            // inputStyle={{ fontFamily: Fonts.REGULAR }}
          />

          {/* التالى */}
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
}

/* ----- static styles (باقى العناصر) ----- */
const styles = StyleSheet.create({
  section: {
    alignSelf: "flex-end",
    fontSize: 18,
    fontFamily: Fonts.REGULAR,
    color: "#333",
    marginTop: 24,
    marginBottom: 8,
  },
  //////header
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 22,
    height: 22,
    borderRadius: 18,
    backgroundColor: "#004aad",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },

  /* card + thumbnails ... fontFamily */
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
    textAlign: "center",
    marginVertical: 12,
    fontFamily: Fonts.REGULAR,
  },
  addBtn: {
    backgroundColor: "#004AAD",
    borderRadius: 999,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  addBtnTxt: { color: "#fff", fontFamily: Fonts.BOLD, fontSize: 14 },
  preview: { width: 110, height: 110, borderRadius: 8 },
  deleteBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#555",
    borderRadius: 10,
    padding: 2,
  },
  thumb: { width: 60, height: 60, borderRadius: 6 },
  thumbDelete: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#555",
    borderRadius: 8,
    padding: 1,
  },
  addMore: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 16,
    marginBottom: 20,
  },
  addMoreText: { color: "#004AAD", fontFamily: Fonts.BOLD, fontSize: 14 },
});
