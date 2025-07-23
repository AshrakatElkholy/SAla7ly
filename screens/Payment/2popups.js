import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import CustomButton from "../../Components/CustomButton";
import CustomInput from "../../Components/CustomInput";

export default function TwoPopups({ navigation }) {
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

  return (
    <View style={styles.container}>
      <CustomButton
        title="ادخال رصيد"
        onPress={() => setShowDeposit(true)}
        style={styles.button}
      />
      <CustomButton
        title="سحب رصيد"
        onPress={() => setShowWithdraw(true)}
        style={styles.button}
      />

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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
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
