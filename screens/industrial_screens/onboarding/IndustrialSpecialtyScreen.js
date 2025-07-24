import React, { useState } from "react";
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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Fonts } from "../../../constants";
import CustomInput from "../../../Components/CustomInput";
import CustomButton from "../../../Components/CustomButton";
import CustomHeader from "../../../Components/CustomHeader";

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
  const daysOptions = [
    "السبت",
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];

  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [mainImg, setMainImg] = useState(null);
  const [extraImgs, setExtraImgs] = useState([]);
  const [workingHours, setWorkingHours] = useState([
    { day: "", from: "", to: "" },
  ]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHourIndex, setSelectedHourIndex] = useState(null);
  const [selectedField, setSelectedField] = useState(null);

  const isReady = specialty.trim() && bio.trim() && mainImg;

  const handleNext = () =>
    isReady && navigation.navigate("IndustrialIdentityScreen");

  const pickImage = async (setter) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return alert("يجب السماح بالوصول للصور");
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!res.canceled) setter(res.assets[0].uri);
  };

  const updateWorkingHour = (index, field, value) => {
    const updated = [...workingHours];
    updated[index][field] = value;
    setWorkingHours(updated);
  };

  const openTimePicker = (index, field) => {
    setSelectedHourIndex(index);
    setSelectedField(field);
    setShowTimePicker(true);
  };

  const onTimeSelected = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate && selectedHourIndex !== null && selectedField) {
      const hours = selectedDate.getHours().toString().padStart(2, "0");
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
      updateWorkingHour(
        selectedHourIndex,
        selectedField,
        `${hours}:${minutes}`
      );
      setSelectedHourIndex(null);
      setSelectedField(null);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <CustomHeader
        title="تفاصيل صنايعى"
        onBack={() => navigation.goBack()}
        activeIndex={0}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 50 }}>
          <CustomInput
            label="التخصص"
            placeholder="اضف تخصص"
            value={specialty}
            onChangeText={setSpecialty}
            error={!specialty.trim() && "يرجى إدخال التخصص"}
            deferError
            labelStyle={{ fontFamily: Fonts.REGULAR, fontSize: 18 }}
          />

          <Text style={styles.section}>أعمالك</Text>
          <UploadCard
            imageUri={mainImg}
            onAdd={() => pickImage(setMainImg)}
            onRemove={() => setMainImg(null)}
          />

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

          <CustomInput
            label="نبذة"
            placeholder="اكتب نبذة عنك أو عن خبراتك"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            error={!bio.trim() && "يرجى إدخال النبذة"}
            deferError
            labelStyle={{ fontFamily: Fonts.REGULAR, fontSize: 18 }}
          />

          <Text style={styles.section}>مواعيد العمل</Text>
          {workingHours.map((item, index) => (
            <View key={index} style={styles.workHourContainer}>
              <View style={styles.dayPickerWrapper}>
                <View style={styles.dayPicker}>
                  <Picker
                    selectedValue={item.day}
                    onValueChange={(val) =>
                      updateWorkingHour(index, "day", val)
                    }
                    style={styles.picker}
                    mode="dropdown"
                  >
                    <Picker.Item label="اليوم" value="" />
                    {daysOptions.map((day) => (
                      <Picker.Item key={day} label={day} value={day} />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.timeRow}>
                <TouchableOpacity
                  style={styles.timeInputWrapper}
                  onPress={() => openTimePicker(index, "from")}
                >
                  <Text style={styles.timeText}>{item.from || "من"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.timeInputWrapper}
                  onPress={() => openTimePicker(index, "to")}
                >
                  <Text style={styles.timeText}>{item.to || "إلى"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const updated = [...workingHours];
                    updated.splice(index, 1);
                    setWorkingHours(updated);
                  }}
                  style={styles.removeDayBtn}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 12,
                      fontFamily: Fonts.BOLD,
                    }}
                  >
                    حذف
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {showTimePicker && (
            <DateTimePicker
              mode="time"
              display="default"
              value={new Date()}
              onChange={onTimeSelected}
              is24Hour={true}
            />
          )}

          <TouchableOpacity
            style={styles.addMore}
            onPress={() =>
              setWorkingHours([...workingHours, { day: "", from: "", to: "" }])
            }
          >
            <Text style={styles.addMoreText}>اضافة يوم اخر</Text>
            <Icon name="plus" size={18} color="#004AAD" />
          </TouchableOpacity>

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

const styles = StyleSheet.create({
  section: {
    alignSelf: "flex-end",
    fontSize: 18,
    fontFamily: Fonts.REGULAR,
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
  addBtnTxt: {
    color: "#fff",
    fontFamily: Fonts.BOLD,
    fontSize: 14,
  },
  preview: {
    width: 110,
    height: 110,
    borderRadius: 8,
  },
  deleteBtn: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#555",
    borderRadius: 10,
    padding: 2,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
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
  addMoreText: {
    color: "#004AAD",
    fontFamily: Fonts.BOLD,
    fontSize: 14,
  },
  workHourContainer: {
    marginBottom: 15,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 10,
  },
  dayPickerWrapper: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    marginBottom: 8,
  },
  dayPicker: {
    flex: 1,
    minWidth: 160,
    width: "50%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    overflow: "hidden",
  },
  picker: {
    width: "100%",
    height: 100,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#000",
    textAlign: "right",
    fontFamily: Fonts.REGULAR,
  },
  timeInputWrapper: {
    height: 40,
    paddingHorizontal: 16,
    borderColor: "#ccc",
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    minWidth: 150,
  },
  timeText: {
    fontFamily: Fonts.REGULAR,
    fontSize: 16,
    color: "#000",
  },
  timeRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 6,
  },
  removeDayBtn: {
    backgroundColor: "#d00",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
