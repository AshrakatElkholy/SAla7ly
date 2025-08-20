import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { FontAwesome5 } from "@expo/vector-icons";
import ProviderBottomNavigation from "../../Components/providerBottomNavigation";
import CustomHeaderWithLines from "../../Components/CustomHeaderTemp";
import CustomInput from "../../Components/CustomInput";
import CustomButton from "../../Components/CustomButton";
import { Fonts } from "../../constants";

const ProviderSettingsScreen = ({ navigation }) => {
  const [balance, setBalance] = useState(20000);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);

  const cards = [
    { id: 1, number: "**** 44 855", icon: require("../../assets/card.png") },
    { id: 2, number: "**** 44 855", icon: require("../../assets/card.png") },
  ];

  const handleLogoutPress = () => {
  Alert.alert(
    "تأكيد تسجيل الخروج",
    "هل أنت متأكد أنك تريد تسجيل الخروج؟",
    [
      { text: "إلغاء", style: "cancel" },
      {
        text: "تسجيل خروج",
        style: "destructive",
        onPress: async () => {
          try {
            // مسح كل البيانات المتعلقة بالمستخدم
            await AsyncStorage.clear();

            // إعادة ضبط ال navigation stack والتوجيه لشاشة login
            navigation.reset({
              index: 0,
              routes: [{ name: "LoginScreen" }],
            });
          } catch (err) {
            console.log("خطأ أثناء تسجيل الخروج:", err);
            Alert.alert("خطأ", "حدث خطأ أثناء تسجيل الخروج");
          }
        },
      },
    ]
  );
};


  const renderPopup = (type, onClose) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.modalOverlay}>
        <View style={styles.popupWrapper}>
          <Text style={styles.popupTitle}>
            {type === "deposit" ? "إدخال رصيد" : "سحب رصيد"}
          </Text>

          <Text style={styles.popupLabel}>اختر البطاقة</Text>
          {cards.map((card, idx) => (
            <View key={card.id} style={styles.cardRow}>
              <View style={styles.cardInput}>
                <Text style={styles.cardNumber}>{card.number}</Text>
                <Image source={card.icon} style={styles.cardIcon} />
              </View>
              <TouchableOpacity onPress={() => setSelectedCard(idx)}>
                <View
                  style={[
                    styles.radioOuter,
                    selectedCard === idx && styles.radioOuterActive,
                  ]}
                >
                  {selectedCard === idx && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addCardRow}
            onPress={() => {
              onClose();
              navigation.navigate("NewCardScreen");
            }}
          >
            <Image
              source={require("../../assets/card-add.png")}
              style={styles.cardAddIcon}
            />
            <Text style={styles.addCardText}>اضافه بطاقة جديده</Text>
          </TouchableOpacity>

          <Text style={styles.popupLabel}>
            ادخل المبلغ المراد {type === "deposit" ? "ادخاله" : "سحبه"}
          </Text>

          <CustomInput
            placeholder="المبلغ"
            keyboardType="numeric"
            inputStyle={styles.amountInput}
          />

          <CustomButton
            title={type === "deposit" ? "تاكيد ادخال" : "تاكيد سحب"}
            onPress={onClose}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <CustomHeaderWithLines title={null} showTabs={false} showIcons={false} />

      <View style={styles.container}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.header}>
            <Image
              source={require("../../assets/picProvider.png")}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.name}>اسم المستخدم</Text>
              <Text style={styles.location}>المدينة</Text>
            </View>
          </View>

          <View style={styles.balanceContainer}>
            <Image
              source={require("../../assets/hammer1.png")}
              style={styles.hammerIcon}
            />
            <View style={styles.balanceTextWrapper}>
              <Text style={styles.balanceTitle}>رصيد الان</Text>
              <View style={styles.balanceRow}>
                <FontAwesome5 name="wallet" size={20} color="#0057D9" />
                <Text style={styles.balanceText}>
                  {balance.toLocaleString()} ج.م
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.balanceButton}
            onPress={() => setShowWithdraw(true)}
          >
            <Text style={styles.balanceButtonText}>- سحب رصيد</Text>
          </TouchableOpacity>

          <View style={styles.listContainer}>
            <SettingItem label="تعديل بيانتي" icon="person-outline" />
            <SettingItem label="تغيير كلمة المرور" icon="key-outline" />
            <SettingItem label="تحويلات" icon="repeat-outline" />
            <SettingItem label="الدعم الفنى" icon="help-circle-outline" />
          </View>

          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogoutPress}
          >
            <Text style={styles.logoutText}>تسجيل خروج</Text>
            <Icon name="log-out" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </ScrollView>

        <ProviderBottomNavigation
          navigation={navigation}
          activeTab="settings"
        />

        <Modal
          visible={showWithdraw}
          transparent
          animationType="slide"
          onRequestClose={() => setShowWithdraw(false)}
        >
          {renderPopup("withdraw", () => setShowWithdraw(false))}
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const SettingItem = ({ label, icon }) => (
  <TouchableOpacity style={styles.item}>
    <View style={styles.itemContent}>
      <View style={styles.itemLeft}>
        <Icon name={icon} size={20} color="#555" style={{ marginLeft: 8 }} />
        <Text style={styles.itemText}>{label}</Text>
      </View>
      <Icon
        name="chevron-back"
        size={18}
        color="#999"
        style={styles.chevronIcon}
      />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#EDF2F9" },
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#0057D9",
  },
  userInfo: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  name: {
    fontSize: 24,
    fontFamily: Fonts.BOLD,
    color: "#1F1F1F",
  },
  location: {
    fontSize: 14,
    color: "#555",
  },
  balanceContainer: {
    backgroundColor: "#F5F8FF",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 20,
    marginTop: 16,
  },
  hammerIcon: {
    width: 46,
    height: 41,
    resizeMode: "contain",
  },
  balanceTextWrapper: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  balanceTitle: { fontSize: 16, color: "#000", fontFamily: Fonts.BOLD },
  balanceRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 8,
  },
  balanceText: {
    fontSize: 20,
    fontFamily: Fonts.BOLD,
    color: "#004AAD",
    marginLeft: 8,
  },
  balanceButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#0057D9",
  },
  balanceButtonText: {
    color: "#0057D9",
    fontSize: 12,
    fontFamily: Fonts.BOLD,
  },
  listContainer: {
    marginTop: 20,
  },
  item: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 8,
  },
  itemContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemLeft: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  itemText: {
    fontSize: 14,
    color: "#4B4B4B",
    fontFamily: Fonts.BOLD,
    textAlign: "right",
  },
  chevronIcon: { marginLeft: 12 },
  logoutBtn: {
    margin: 20,
    padding: 12,
    borderColor: "#FF3B30",
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
    direction: "rtl",
  },
  logoutText: {
    color: "#E37871",
    fontSize: 14,
    fontFamily: Fonts.BOLD,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  popupWrapper: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  popupTitle: {
    fontSize: 20,
    fontFamily: Fonts.BOLD,
    color: "#1F1F1F",
    marginBottom: 16,
    textAlign: "right",
  },
  popupLabel: {
    fontSize: 14,
    color: "#4B4B4B",
    fontFamily: Fonts.MEDIUM,
    marginBottom: 8,
    textAlign: "right",
  },
  cardRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  cardInput: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  cardNumber: {
    fontSize: 14,
    fontFamily: Fonts.MEDIUM,
    marginRight: 8,
    color: "#333",
  },
  cardIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  addCardRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  cardAddIcon: {
    width: 20,
    height: 20,
    marginLeft: 6,
  },
  addCardText: {
    fontSize: 13,
    fontFamily: Fonts.MEDIUM,
    color: "#0057D9",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: {
    borderColor: "#0057D9",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0057D9",
  },
});

export default ProviderSettingsScreen;
