import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  I18nManager,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../Components/CustomButton";
import CustomInput from "../../Components/CustomInput";


export default function AgreementDetailsScreen() {
  const navigation = useNavigation();
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);

  // Dummy cards
  const cards = [
    { id: 1, number: "**** 44 855", icon: require("../../assets/card.png") },
    { id: 2, number: "**** 44 855", icon: require("../../assets/card.png") },
  ];

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
        />

        <CustomButton
          title={type === "deposit" ? "تاكيد ادخال" : "تاكيد سحب"}
          onPress={onClose}
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

   const services = [
     {
       id: 1,
       title: "صيانة مكيفات",
       provider: "احمد محمد",
       price: "250ج.م",
       rating: "4.5",
       reviews: "(6)",
       image: require("../../assets/providerBG.png"),
     },
   ];

  return (
    <View style={styles.container}>
      {/* الهيدر */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الاتفاقيه الجديده</Text>

        <TouchableOpacity
          style={styles.arrowBtn}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="angle-right" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* المحفظة */}
        <View style={styles.walletSection}>
          <Text style={styles.sectionTitle}>محفظتي</Text>
          <View style={styles.balanceBox}>
            <View>
              <Text style={styles.balanceLabel}>رصيد الان</Text>
            </View>
            <View style={styles.wallet}>
              <Text style={styles.balanceAmount}>20000 ج.م</Text>
              <Image
                source={require("../../assets/logo-icon.png")}
              />
            </View>
          </View>

          <View style={styles.walletButtons}>
            <TouchableOpacity style={styles.walletBtn} onPress={() => setShowWithdraw(true)}>
              <Text style={styles.walletBtnText}> - سحب رصيد</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletBtn} onPress={() => setShowDeposit(true)}>
              <Text style={styles.walletBtnText}> + إضافة رصيد </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* مقدم الخدمة */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>مقدم الخدمة</Text>
          <View style={styles.providerBox}>
            <Image
              source={require("../../assets/details.png")}
              //   style={styles.avatar}
            />
            <TouchableOpacity style={styles.detailsBtn}>
              <Text style={styles.detailsText}>تفاصيل</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>أحمد محمد</Text>
              <Text style={styles.city}>مرسى علم، مطروح</Text>
              <Text style={styles.tag}>كهربائي</Text>
            </View>

            <Image
              source={require("../../assets/chat-img.png")}
              style={styles.avatar}
            />
          </View>
        </View>

        {/* الخدمة المقدمة */}
                  <Text style={styles.sectionTitle}>خدماتى</Text>
        
        <View style={styles.sectionContainer}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.servicesScrollView}
                    contentContainerStyle={{ flexDirection: "row" }}
                  >
                    <View style={styles.servicesContainer}>
                      {services.map((service) => (
                        <View key={service.id} style={styles.serviceCard}>
                          <View style={styles.serviceImageContainer}>
                            <Image source={service.image} style={styles.serviceImage} />
        
                            <View style={styles.ratingBadge}>
                              {/* زر البوكمارك */}
                              <TouchableOpacity style={styles.circleBtnBookmark}>
                                <Image
                                  source={require("../../assets/bookmark.png")}
                                  style={{ width: 16, height: 16 }}
                                />
                              </TouchableOpacity>
                              {/* زر التعديل */}
                              <TouchableOpacity style={styles.circleBtnEdit}>
                                <FontAwesome name="pencil" size={14} color="#fff" />
                              </TouchableOpacity>
                              {/* النجمة والتقييم والمراجعات */}
                              <View style={styles.ratingInfo}>
                                <FontAwesome name="star" size={12} color="#FFD700" />
                                <Text style={styles.ratingText}>{service.rating}</Text>
                                <Text style={styles.reviewsText}>
                                  {service.reviews}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <View style={styles.serviceInfo}>
                            <View style={styles.serviceTitleRow}>
                              <Text style={styles.servicePrice}>{service.price}</Text>
                              <Text style={styles.serviceTitle}>{service.title}</Text>
                            </View>
                            <Text style={styles.serviceProvider}>
                              {service.provider}
                            </Text>
                            {/* <TouchableOpacity style={styles.bookButton}>
                              <Text style={styles.bookButtonText}>احجز الان</Text>
                            </TouchableOpacity> */}
                          </View>
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </View>

        {/* الأزرار */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.bookBtn}>
            <Text style={styles.bookText}>احجز الآن</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn}>
            <Text style={styles.cancelText}>رفض العرض</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ModalWrapper visible={showDeposit} onClose={() => setShowDeposit(false)}>
        {renderPopup("deposit", () => setShowDeposit(false))}
      </ModalWrapper>

      <ModalWrapper
        visible={showWithdraw}
        onClose={() => setShowWithdraw(false)}
      >
        {renderPopup("withdraw", () => setShowWithdraw(false))}
      </ModalWrapper>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    textAlign: "right", // للنصوص العربية
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#F5F8FF",
  },
  headerTitle: {
    fontSize: 25,
    fontFamily: "Almarai-Bold",
    marginRight: 10,
    fontWeight: "bold",
    color: "#121217",
  },
  arrowBtn: {
    backgroundColor: "#004AAD",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: "Almarai-Bold",
    fontSize: 16,
    marginBottom: 8,
    textAlign: "right",
  },
  walletSection: {
    marginBottom: 24,
  },
  balanceBox: {
    backgroundColor: "#E8F0FF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  balanceLabel: {
    fontFamily: "Almarai-Regular",
    color: "#121212",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
  balanceAmount: {
    marginLeft: 6,
    color: "#004AAD",
    fontFamily: "Almarai-Bold",
    textAlign: "right",
  },
  walletButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  walletBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#004AAD",
    paddingVertical: 5,
    borderRadius: 16,
    alignItems: "center",
  },
  walletBtnText: {
    color: "#004AAD",
    fontSize: 15,
    fontFamily: "Almarai-Bold",
  },
  providerBox: {
    flexDirection: "row", // تم تعديله ليتوافق مع RTL
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F5F8FF",
    padding: 12,
    borderRadius: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  name: {
    fontFamily: "Almarai-Bold",
    fontSize: 16,
    textAlign: "right",
  },
  city: {
    fontSize: 13,
    color: "#777",
    fontFamily: "Almarai-Regular",
    textAlign: "right",
  },
  tag: {
    fontSize: 13,
    color: "#00A86B",
    fontFamily: "Almarai-Bold",
    textAlign: "right",
  },
  detailsBtn: {
    paddingHorizontal: 25,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#004AAD",
  },
  detailsText: {
    fontFamily: "Almarai-Bold",
    color: "#004AAD",
    textAlign: "center",
  },
  actionButtons: {
    paddingVertical:50,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: 10,
  },
  bookBtn: {
    backgroundColor: "#004AAD",
    paddingVertical: 12,
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
  },
  bookText: {
    color: "#fff",
    fontFamily: "Almarai-Bold",
  },
  cancelBtn: {
    // backgroundColor: "#FFE9E9",
    paddingVertical: 12,
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelText: {
    color: "#D40000",
    fontFamily: "Almarai-Bold",
  },
  wallet: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    // backgroundColor: "#F5F8FF",
    borderRadius: 12,
  },
  serviceImageContainer: {
    position: "relative",
  },
  serviceImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  ratingBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#333",
    marginHorizontal: 3,
  },
  reviewsText: {
    fontSize: 10,
    color: "#666",
  },

  servicesContainer: {
    // flexDirection: "row-reverse",
    paddingRight: 20,
  },
  serviceCard: {
    width: 350,
    justifyContent: "center",
    marginRight: 15,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    shadowColor: "#000",
    overflow: "hidden",
  },

  serviceImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  ratingBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#333",
    marginHorizontal: 3,
  },
  reviewsText: {
    fontSize: 10,
    color: "#666",
  },
  serviceInfo: {
    padding: 12,
  },
  serviceTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "right",
    flex: 1,
  },
  serviceProvider: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
    textAlign: "right",
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: 700,
    color: "#000",
    textAlign: "left",
  },
  bookButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#004AAD",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#004AAD",
    fontSize: 14,
    fontWeight: "bold",
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ratingInfo: {
    backgroundColor: "#FFFFFF5C",
    padding: 4,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  circleBtnBookmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#8A8AA3",
    justifyContent: "center",
    alignItems: "center",
  },
  circleBtnEdit: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#004AAD",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "right",
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