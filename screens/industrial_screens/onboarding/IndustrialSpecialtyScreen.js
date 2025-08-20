import React, { useState, useContext, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";

import { Fonts } from "../../../constants";
import CustomButton from "../../../Components/CustomButton";
import CustomHeader from "../../../Components/CustomHeader";
import { UserContext } from "../../../screens/Context/UserContext";

// ✅ Base URL
const API_BASE = "https://45df9571624f.ngrok-free.app";

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
  const { userInfo, setUserInfo } = useContext(UserContext);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(userInfo?.profession || null);
  const [mainImg, setMainImg] = useState(userInfo?.mainImg || null);
  const [extraImgs, setExtraImgs] = useState(userInfo?.extraImgs || []);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // DropDownPicker state
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Fetch categories from server
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await fetch(`${API_BASE}/category`, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          Accept: "application/json",
        },
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("❌ JSON parse error:", e, text);
        Alert.alert("خطأ", "البيانات المستلمة من السيرفر غير صحيحة");
        return;
      }

      const cats = Array.isArray(data) ? data : data.categories;
      if (response.ok && Array.isArray(cats)) {
        setCategories(cats);
        setItems(cats.map((cat) => ({ label: cat.title, value: cat._id })));
      } else {
        Alert.alert("خطأ", "فشل في تحميل التخصصات");
      }
    } catch (error) {
      console.error("❌ Categories fetch error:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء تحميل التخصصات");
    } finally {
      setCategoriesLoading(false);
    }
  };

  // 🔧 helper: uri -> file
  const prepareFile = (uri, namePrefix = "image", idx = 0) => {
    try {
      const fileName = uri.split("/").pop() || `${namePrefix}_${idx}`;
      const extFromName = (fileName.split(".").pop() || "").toLowerCase();
      const ext = ["jpg", "jpeg", "png", "webp"].includes(extFromName) ? extFromName : "jpg";
      const type = ext === "jpg" ? "image/jpeg" : `image/${ext}`;
      return {
        uri,
        name: `${namePrefix}_${idx}.${ext}`,
        type,
      };
    } catch {
      return {
        uri,
        name: `${namePrefix}_${idx}.jpg`,
        type: "image/jpeg",
      };
    }
  };

  // ✅ Image picker
  const pickImage = async (setter) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("خطأ", "يجب السماح بالوصول للصور");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) setter(result.assets[0].uri);
  };

  // ✅ Submit and save data in context
  const handleSubmit = () => {
    if (!selectedCategory || !mainImg) {
      Alert.alert("خطأ", "يرجى اختيار التخصص ورفع صورة رئيسية");
      return;
    }

    const selectedCategoryObj = categories.find((cat) => cat._id === selectedCategory);

    // Prepare files
    const mainImageFile = prepareFile(mainImg, "mainImage", 0);
    const imagesFiles = extraImgs.map((u, i) => prepareFile(u, "images", i));

    const updatedUserInfo = {
      ...userInfo,
      profession: selectedCategory,                     // ID
      professionName: selectedCategoryObj?.title || "", // For display
      mainImg,                                         // keep URI for preview
      extraImgs,                                       // keep URIs
      // ✅ workshop shaped exactly for API
      workshop: {
        mainImage: mainImageFile,
        images: imagesFiles,
      },
    };

    setUserInfo(updatedUserInfo);
    console.log("🧰 Saved to context (specialty):", {
      profession: updatedUserInfo.profession,
      workshop: {
        mainImage: updatedUserInfo.workshop?.mainImage,
        imagesCount: updatedUserInfo.workshop?.images?.length || 0,
      },
    });

    navigation.navigate("IndustrialIdentityScreen");
  };

  if (categoriesLoading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#004AAD" />
        <Text style={styles.loaderText}>جاري تحميل التخصصات...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <CustomHeader
        title="تفاصيل صنايعى"
        onBack={() => navigation.goBack()}
        activeIndex={0}
        steps={["بيانات صنايعى", "اثبات شخصيه", "الموقع"]}
        currentStep={0}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          nestedScrollEnabled={true}
          contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
        >
          {/* DROPDOWN */}
          <Text style={styles.section}>التخصص</Text>
          <DropDownPicker
            open={open}
            value={selectedCategory}
            items={items}
            setOpen={setOpen}
            setValue={(callback) => {
              const value = callback(selectedCategory);
              setSelectedCategory(value);
            }}
            setItems={setItems}
            placeholder="اختر التخصص"
            zIndex={5000}
            listMode="SCROLLVIEW"
            containerStyle={{ marginBottom: 15 }}
          />

          {/* MAIN IMAGE */}
          <Text style={styles.section}>أعمالك (صورة رئيسية)</Text>
          <UploadCard
            imageUri={mainImg}
            onAdd={() => pickImage(setMainImg)}
            onRemove={() => setMainImg(null)}
          />

          {/* EXTRA IMAGES */}
          {extraImgs.length > 0 && (
            <>
              <Text style={styles.section}>صور إضافية</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
                {extraImgs.map((uri, idx) => (
                  <View key={idx} style={{ marginLeft: 8 }}>
                    <Image source={{ uri }} style={styles.thumb} />
                    <TouchableOpacity
                      style={styles.thumbDelete}
                      onPress={() => setExtraImgs(extraImgs.filter((_, i) => i !== idx))}
                    >
                      <Icon name="x" size={12} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          <TouchableOpacity
            style={styles.addMore}
            onPress={() => pickImage((uri) => setExtraImgs([...extraImgs, uri]))}
          >
            <Text style={styles.addMoreText}>اضافة صور اخرى</Text>
            <Icon name="plus" size={18} color="#004AAD" />
          </TouchableOpacity>

          <CustomButton
            title="التالى"
            onPress={handleSubmit}
            disabled={!selectedCategory || !mainImg}
            type={selectedCategory && mainImg ? "filled" : "outline"}
            textStyle={{ fontFamily: Fonts.BOLD }}
            style={{ marginTop: 20 }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  section: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
    color: "#333",
    fontFamily: Fonts?.BOLD || "System",
    textAlign: "right",
  },
  card: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#A0AEC0",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    backgroundColor: "#fff",
    position: "relative",
  },
  preview: { width: "100%", height: 160, borderRadius: 10, resizeMode: "cover" },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E6EEF8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardLabel: { fontSize: 14, color: "#4A5568", textAlign: "center", marginBottom: 12, fontFamily: Fonts.REGULAR },
  addBtn: { backgroundColor: "#004AAD", paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  addBtnTxt: { color: "#fff", fontSize: 14, fontFamily: Fonts.BOLD },
  deleteBtn: { position: "absolute", top: 8, right: 8, backgroundColor: "rgba(255,0,0,0.8)", borderRadius: 12, padding: 4 },
  thumb: { width: 80, height: 80, borderRadius: 8, marginRight: 8 },
  thumbDelete: { position: "absolute", top: 2, right: 2, backgroundColor: "rgba(255,0,0,0.8)", borderRadius: 10, padding: 2 },
  addMore: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#004AAD",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  addMoreText: { color: "#004AAD", marginRight: 8, fontFamily: Fonts.REGULAR },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  loaderText: { marginTop: 10, fontFamily: Fonts.REGULAR },
});
