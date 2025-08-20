// screens/industrial_screens/onboarding/IndustrialIdentityScreen.js
import React, { useState, useContext } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Feather";

import { Fonts } from "../../../constants";
import CustomButton from "../../../Components/CustomButton";
import CustomHeader from "../../../Components/CustomHeader";
import { UserContext } from "../../Context/UserContext";

// 🔹 Reusable upload card
const UploadCard = ({ label, imageUri, onAdd, onRemove }) => (
  <TouchableOpacity style={styles.card} onPress={onAdd}>
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
  </TouchableOpacity>
);

const IndustrialIdentityScreen = ({ navigation }) => {
  const { userInfo, setUserInfo } = useContext(UserContext);

  const [profilePic, setProfilePic] = useState(userInfo?.identity?.profilePic?.uri || null);
  const [idFront, setIdFront] = useState(userInfo?.identity?.idFront?.uri || null);
  const [idBack, setIdBack] = useState(userInfo?.identity?.idBack?.uri || null);

  const isReady = profilePic && idFront && idBack;

  // helper → keep file object (uri + name + type)
  const prepareFile = (uri, fieldName) => {
    const fileName = uri.split("/").pop();
    const ext = fileName.split(".").pop();
    return {
      uri,
      name: `${fieldName}.${ext}`,
      type: `image/${ext === "jpg" ? "jpeg" : ext}`,
    };
  };

  const pickImage = async (setter, fieldName) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("خطأ", "يرجى السماح بالوصول للصور");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        const fileObj = prepareFile(result.assets[0].uri, fieldName);
        setter(fileObj.uri);

        // save immediately to context
        setUserInfo((prev) => ({
          ...prev,
          identity: {
            ...prev.identity,
            [fieldName]: fileObj,
          },
        }));
      }
    } catch (error) {
      console.error("❌ Image picker error:", error);
      Alert.alert("خطأ", "حدث خطأ أثناء اختيار الصورة");
    }
  };

  const handleNext = () => {
    if (!isReady) {
      Alert.alert("خطأ", "يرجى رفع جميع الصور المطلوبة");
      return;
    }

    // ✅ Merge everything: profession + workshop images + identity
    const updatedInfo = {
      ...userInfo,
      profession: userInfo.profession, // keep profession from speciality
      mainImage: userInfo.mainImage, // keep main workshop image
      images: userInfo.images || [], // keep workshop images
      identity: {
        profilePic: userInfo.identity?.profilePic,
        idFront: userInfo.identity?.idFront,
        idBack: userInfo.identity?.idBack,
      },
    };

    setUserInfo(updatedInfo);

    console.log("✅ Identity + Workshop + Profession saved:", updatedInfo);

    navigation.navigate("IndustrialLocationScreen", {
      profession: updatedInfo.profession,
    });
  };

  const completedCount = [profilePic, idFront, idBack].filter(Boolean).length;

  return (
    <SafeAreaView style={styles.safe}>
      <CustomHeader
        title="اثبات الهوية"
        onBack={() => navigation.goBack()}
        activeIndex={1}
        steps={["بيانات صنايعى", "اثبات شخصيه", "الموقع"]}
        currentStep={1}
      />

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text style={styles.instruction}>
          يرجى رفع الصور التالية لإثبات هويتك وإكمال عملية التسجيل
        </Text>

        <Text style={styles.section}>صورة شخصية</Text>
        <UploadCard
          label="اضغط لاضافه صوره شخصيه"
          imageUri={profilePic}
          onAdd={() => pickImage(setProfilePic, "profilePic")}
          onRemove={() => {
            setProfilePic(null);
            setUserInfo((prev) => ({
              ...prev,
              identity: { ...prev.identity, profilePic: null },
            }));
          }}
        />

        <Text style={styles.section}>اثبات هوية أمامية</Text>
        <UploadCard
          label="اضغط لاضافه صوره اثبات هويه اماميه"
          imageUri={idFront}
          onAdd={() => pickImage(setIdFront, "idFront")}
          onRemove={() => {
            setIdFront(null);
            setUserInfo((prev) => ({
              ...prev,
              identity: { ...prev.identity, idFront: null },
            }));
          }}
        />

        <Text style={styles.section}>اثبات هوية خلفية</Text>
        <UploadCard
          label="اضغط لاضافه صوره اثبات هويه خلفيه"
          imageUri={idBack}
          onAdd={() => pickImage(setIdBack, "idBack")}
          onRemove={() => {
            setIdBack(null);
            setUserInfo((prev) => ({
              ...prev,
              identity: { ...prev.identity, idBack: null },
            }));
          }}
        />

        {/* progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{`${completedCount}/3 صور مكتملة`}</Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${(completedCount / 3) * 100}%` }]}
            />
          </View>
        </View>

        <CustomButton
          title="التالي"
          onPress={handleNext}
          disabled={!isReady}
          type={isReady ? "filled" : "outline"}
          textStyle={{ fontFamily: Fonts.BOLD, fontSize: 18 }}
          style={{ marginTop: 20 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  instruction: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: Fonts.REGULAR,
    lineHeight: 20,
  },
  section: {
    alignSelf: "flex-end",
    fontSize: 18,
    fontFamily: Fonts.BOLD,
    color: "#333",
    marginTop: 24,
    marginBottom: 8,
  },
  card: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#A0AEC0",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 12,
    position: "relative",
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
  preview: {
    width: "100%",
    height: 160,
    borderRadius: 8,
    resizeMode: "cover",
  },
  deleteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 12,
    padding: 4,
  },
  progressContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    fontFamily: Fonts.REGULAR,
    marginBottom: 8,
  },
  progressBar: {
    width: "80%",
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#004AAD",
    borderRadius: 3,
  },
});

export default IndustrialIdentityScreen;
