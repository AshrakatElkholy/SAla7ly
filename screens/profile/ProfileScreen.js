import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import BottomNavigation from "../../Components/BottomNavigation";
import CustomHeaderWithLines from "../../Components/CustomHeaderTemp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fonts } from "../../constants";
import CustomButton from "../../Components/CustomButton";
import CustomInput from "../../Components/CustomInput";
import axios from "axios";
import { UserContext } from "../../screens/Context/UserContext";

// Add your API URL here
const API_URL = "https://45df9571624f.ngrok-free.app"; // Replace with your actual API URL

const ProfileScreen = ({ navigation }) => {
  const [balance, setBalance] = useState(20000);
  const [userName, setUserName] = useState("...");
  const [profileImage, setProfileImage] = useState();
  const [cityName, setCityName] = useState("غير محدد");
  
  const { token } = useContext(UserContext);

  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const cards = [
    { id: 1, number: "**** 44 855", icon: require("../../assets/card.png") },
    { id: 2, number: "**** 44 855", icon: require("../../assets/card.png") },
  ];

  // Function to make API requests with authorization
  const makeAuthorizedRequest = async (endpoint, method = "GET", data = null) => {
    try {
      if (!token) {
        throw new Error("No authentication token available");
      }

      const config = {
        method,
        url: `${API_URL}${endpoint}`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error("API Request Error:", error);
      
      // Handle unauthorized access
      if (error.response && error.response.status === 401) {
        Alert.alert("انتهت صلاحية الجلسة", "يرجى تسجيل الدخول مرة أخرى", [
          {
            text: "موافق",
            onPress: () => {
              AsyncStorage.multiRemove(["userName", "profileImage", "userId", "token"]);
              navigation.reset({ index: 0, routes: [{ name: "ClientLoginScreen" }] });
            }
          }
        ]);
      }
      
      throw error;
    }
  };

  // Function to fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const data = await makeAuthorizedRequest("/user/profile");
      // Update state with fetched data
      if (data.name) setUserName(data.name);
      if (data.city) setCityName(data.city);
      if (data.balance) setBalance(data.balance);
      if (data.profileImage) setProfileImage(data.profileImage);
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };

  // Function to handle deposit
  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      Alert.alert("خطأ", "يرجى إدخال مبلغ صحيح");
      return;
    }

    try {
      const data = await makeAuthorizedRequest("/wallet/deposit", "POST", {
        amount: parseFloat(depositAmount),
        cardId: cards[selectedCard].id,
      });
      
      Alert.alert("نجح", "تم إضافة الرصيد بنجاح");
      setBalance(data.newBalance || balance + parseFloat(depositAmount));
      setDepositAmount("");
      setShowDeposit(false);
    } catch (error) {
      Alert.alert("خطأ", "فشل في إضافة الرصيد");
    }
  };

  // Function to handle withdrawal
  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      Alert.alert("خطأ", "يرجى إدخال مبلغ صحيح");
      return;
    }

    if (parseFloat(withdrawAmount) > balance) {
      Alert.alert("خطأ", "الرصيد غير كافي");
      return;
    }

    try {
      const data = await makeAuthorizedRequest("/wallet/withdraw", "POST", {
        amount: parseFloat(withdrawAmount),
        cardId: cards[selectedCard].id,
      });
      
      Alert.alert("نجح", "تم سحب الرصيد بنجاح");
      setBalance(data.newBalance || balance - parseFloat(withdrawAmount));
      setWithdrawAmount("");
      setShowWithdraw(false);
    } catch (error) {
      Alert.alert("خطأ", "فشل في سحب الرصيد");
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Please allow access to photos to update your profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      await AsyncStorage.setItem("profileImage", imageUri);
      
      // Upload image to server
      try {
        const formData = new FormData();
        formData.append('profileImage', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'profile.jpg',
        });

        await makeAuthorizedRequest("/user/profile/image", "POST", formData);
      } catch (error) {
        console.log("Error uploading image:", error);
      }
    }
  };

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
            // مسح كل البيانات المرتبطة بالمستخدم
            await AsyncStorage.multiRemove([
              "userName",
              "profileImage",
              "userId",
              "token",
              "cityName",
            ]);

            // إعادة ضبط الـ state المحلي
            setUserToken(null);
            setUserName("");
            setProfileImage(null);
            setCityName("غير محدد");

            // إعادة التوجيه لشاشة تسجيل الدخول
            navigation.reset({
              index: 0,
              routes: [{ name: "LoginScreen" }],
            });
          } catch (err) {
            console.log("خطأ أثناء تسجيل الخروج:", err);
            Alert.alert("خطأ", "حدث خطأ أثناء تسجيل الخروج، حاول مرة أخرى");
          }
        },
      },
    ]
  );
};


  // Load initial data
  useEffect(() => {
    const initializeData = async () => {      
      // Load cached data first
      const getProfileImage = async () => {
        const storedImage = await AsyncStorage.getItem("profileImage");
        if (storedImage) setProfileImage(storedImage);
      };

      const getCityName = async () => {
        try {
          const storedCity = await AsyncStorage.getItem("cityName");
          if (storedCity) setCityName(storedCity);
        } catch (e) {
          console.log("Failed to load city name", e);
        }
      };

      const getUserName = async () => {
        try {
          const storedName = await AsyncStorage.getItem("userName");
          if (storedName) setUserName(storedName);
        } catch (e) {
          console.log("Failed to load user name", e);
        }
      };

      await Promise.all([getProfileImage(), getCityName(), getUserName()]);
      
      // Then fetch fresh data from server
      await fetchUserProfile();
    };

    initializeData();
  }, []);

  const renderCardRow = (card, idx) => (
    <View key={card.id} style={styles.cardRow}>
      <TouchableOpacity
        onPress={() => setSelectedCard(idx)}
        style={styles.radioBtnWrap}
      >
        <View
          style={[
            styles.radioOuter,
            selectedCard === idx && styles.radioOuterActive,
          ]}
        >
          {selectedCard === idx && <View style={styles.radioInner} />}
        </View>
      </TouchableOpacity>
      <View style={styles.cardInput}>
        <Text style={styles.cardNumber}>{card.number}</Text>
        <Image source={card.icon} style={styles.cardIcon} />
      </View>
    </View>
  );

  const renderPopup = (type, onClose) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.popupContainer}>
        <Text style={styles.popupTitle}>
          {type === "deposit" ? "ادخال رصيد" : "سحب رصيد"}
        </Text>

        <Text style={styles.popupLabel}>اختر البطاقة</Text>
        {cards.map(renderCardRow)}

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
          value={type === "deposit" ? depositAmount : withdrawAmount}
          onChangeText={type === "deposit" ? setDepositAmount : setWithdrawAmount}
        />

        <CustomButton
          title={type === "deposit" ? "تاكيد ادخال" : "تاكيد سحب"}
          onPress={type === "deposit" ? handleDeposit : handleWithdraw}
        />
      </View>
    </TouchableWithoutFeedback>
  );

  const ModalWrapper = ({ visible, onClose, children }) => (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBg}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 20}
          >
            <TouchableWithoutFeedback>{children}</TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#EDF2F9" }} edges={["top"]}>
      <View style={styles.container}>
        <CustomHeaderWithLines showTabs={false} showIcons={false} title="" />
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.header}>
            <View style={styles.avatarWrapper}>
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require("../../assets/picProvider.png")
                }
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
                <Icon name="camera" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.userInfo}>
              <View style={styles.titleColumn}>
                <Text style={styles.name}>{userName}</Text>
                <Text style={styles.location}>{cityName}</Text>
              </View>
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

          <View style={styles.balanceButtonsWrapper}>
            <TouchableOpacity
              style={styles.balanceButton}
              onPress={() => setShowDeposit(true)}
            >
              <Text style={styles.balanceButtonText}>+ إضافة رصيد</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.balanceButton}
              onPress={() => setShowWithdraw(true)}
            >
              <Text style={styles.balanceButtonText}>- سحب رصيد</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listContainer}>
            <SettingItem label="تعديل بياناتى" icon="person-outline" />
            <SettingItem label="تغيير كلمة المرور" icon="key-outline" />
            <SettingItem label="تحويلات" icon="repeat-outline" />
            <SettingItem label="الدعم الفنى" icon="help-circle-outline" />
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogoutPress}>
            <Text style={styles.logoutText}>تسجيل خروج</Text>
            <Icon name="log-out" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </ScrollView>

        <BottomNavigation navigation={navigation} activeTab="settings" />

        {/* Deposit and Withdraw Modals */}
        <ModalWrapper visible={showDeposit} onClose={() => setShowDeposit(false)}>
          {renderPopup("deposit", () => setShowDeposit(false))}
        </ModalWrapper>
        <ModalWrapper visible={showWithdraw} onClose={() => setShowWithdraw(false)}>
          {renderPopup("withdraw", () => setShowWithdraw(false))}
        </ModalWrapper>
      </View>
    </SafeAreaView>
  );
};

const SettingItem = ({ label, icon, badge }) => (
  <TouchableOpacity style={styles.item}>
    <View style={styles.itemContent}>
      <View style={styles.itemLeft}>
        <Icon name={icon} size={20} color="#555" style={{ marginLeft: 8 }} />
        <Text style={styles.itemText}>{label}</Text>
      </View>
      <Icon name="chevron-back" size={18} color="#999" style={styles.chevronIcon} />
    </View>
    {badge && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 12,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#0057D9",
  },
  titleColumn: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginRight: 6,
  },

  cameraBtn: {
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "#0057D9",
    borderRadius: 12,
    padding: 4,
  },

  name: {
    fontSize: 24,
    marginTop: 10,
    fontFamily: Fonts.BOLD,
    color: "#1F1F1F",
  },
  location: { fontSize: 14, color: "#555" },

  userInfo: {
    marginRight: 6,
    justifyContent: "center",
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
    flexDirection: "column",
    alignItems: "flex-end",
    justifyContent: "center",
  },

  balanceTitle: { fontSize: 16, color: "#000000", fontFamily: Fonts.BOLD },

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

  balanceButtonsWrapper: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 12,
  },

  balanceButton: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    marginHorizontal: 6,
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

  listContainer: { marginTop: 20 },

  item: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 8,
  },
  itemContent: {
    marginHorizontal: 8,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },

  itemLeft: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },

  chevronIcon: {
    marginLeft: 12,
  },

  itemText: {
    fontSize: 14,
    color: "#4B4B4B",
    fontFamily: Fonts.BOLD,
    textAlign: "right",
    writingDirection: "rtl",
    flexShrink: 1,
    flexWrap: "wrap",
    maxWidth: "100%",
    flex: 1,
  },

  badge: {
    backgroundColor: "#0057D9",
    borderRadius: 12,
    paddingHorizontal: 6,
    marginRight: 6,
  },

  badgeText: { color: "#fff", fontSize: 12 },

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
  button: {
    width: "100%",
    marginVertical: 10,
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    alignItems: "stretch",
  },
  popupContainer: {
    width: "100%",
    minHeight: 420,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    alignItems: "stretch",
    elevation: 8,
  },
  popupTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    textAlign: "right",
    marginBottom: 10,
  },
  popupLabel: {
    fontSize: 15,
    color: "#222",
    textAlign: "right",
    marginBottom: 8,
    marginTop: 8,
  },
  cardRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 10,
  },
  cardInput: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#F6F7FB",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  cardNumber: {
    flex: 1,
    fontSize: 16,
    color: "#888",
    textAlign: "right",
  },
  cardIcon: {
    width: 24,
    height: 24,
    marginLeft: 8,
    resizeMode: "contain",
  },
  radioBtnWrap: {
    marginHorizontal: 8,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#888",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: {
    borderColor: "#004AAD",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#004AAD",
  },
  addCardRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 0,
  },
  cardAddIcon: {
    width: 24,
    height: 24,
    marginLeft: 6,
    resizeMode: "contain",
  },
  addCardText: {
    color: "#004AAD",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  amountInput: {
    backgroundColor: "#F6F7FB",
    borderRadius: 8,
    height: 44,
    justifyContent: "center",
    paddingHorizontal: 12,
    marginBottom: 16,
    textAlign: "right",
  },
});

export default ProfileScreen;