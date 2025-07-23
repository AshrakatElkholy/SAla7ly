import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch, SafeAreaView, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../Components/CustomButton';
import { Fonts } from '../../constants';
import { LinearGradient } from 'expo-linear-gradient';

export default function NewCard({ navigation }) {
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [saveCard, setSaveCard] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header with gradient */}
      <LinearGradient
        colors={["#E6EDF7", "#FFFFFF"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.arrowButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>اضافة بطاقة</Text>
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Title */}
        <Text style={styles.formTitle}>ادخال بيانات بطاقة</Text>

        {/* Form Fields */}
        <CustomInput
          label="اسم صاحب بطاقة"
          value={cardName}
          onChangeText={setCardName}
          placeholder="em"
          inputStyle={styles.input}
          labelStyle={styles.inputLabel}
        />
        <CustomInput
          label="رقم بطاقة"
          value={cardNumber}
          onChangeText={setCardNumber}
          placeholder="em"
          keyboardType="numeric"
          inputStyle={styles.input}
          labelStyle={styles.inputLabel}
        />
        <View style={styles.rowInputs2Col}>
          <View style={styles.halfInputWrapper}>
            <CustomInput
              label="تاريخ انتهاء"
              value={expiry}
              onChangeText={setExpiry}
              placeholder="MM/YY"
              inputStyle={styles.input}
              labelStyle={styles.inputLabel}
            />
          </View>
          <View style={styles.halfInputWrapper}>
            <CustomInput
              label="CVC"
              value={cvc}
              onChangeText={setCvc}
              placeholder="CVC"
              keyboardType="numeric"
              inputStyle={styles.input}
              labelStyle={styles.inputLabel}
            />
          </View>
        </View>

        {/* Save Card Switch */}
        <View style={styles.saveRow}>
        
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.saveLabel}>حفظ البطاقة لوقت لاحق</Text>
            <Text style={styles.saveDesc}>لتسجيل خروج أسرع وأكثر أماناً. احفظ تفاصيل بطاقتك</Text>
          </View>
          <Switch
            value={saveCard}
            onValueChange={setSaveCard}
            trackColor={{ false: '#ccc', true: '#004AAD' }}
            thumbColor={saveCard ? '#fff' : '#f4f3f4'}
            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
          />
        </View>
      </ScrollView>
      {/* Sticky Add Card Button at the bottom */}
      <View style={styles.stickyButtonWrapper}>
        <CustomButton
          title="اضافه كارت جديد"
          onPress={() => {}}
          color="#004AAD"
          style={styles.addButton}
          textStyle={styles.addButtonText}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  headerGradient: {
    height: 70,
    justifyContent: 'center',
    width: '100%',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  headerWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 20,
    //  marginTop: 20,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#1566C1",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    marginTop: 8,
  },
  headerTitle: {
    fontFamily: Fonts.BOLD,
    fontSize: 20,
    color: '#222',
    flex: 1,
    textAlign: 'right',
  },
  formTitle: {
    fontFamily: Fonts.BOLD,
    fontSize: 18,
    color: '#222',
    marginBottom: 18,
    textAlign: 'right'
  },
  input: {
    fontFamily: Fonts.REGULAR,
    fontSize: 16,
    textAlign: 'right',
    backgroundColor: '#fff',
  },
  inputLabel: {
    fontFamily: Fonts.REGULAR,
    fontSize: 15,
    color: '#222',
    textAlign: 'right',
  },
  rowInputs: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  saveRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  saveLabel: {
    fontFamily: Fonts.BOLD,
    fontSize: 14,
    color: '#222',
    textAlign: 'right',
  },
  saveDesc: {
    fontFamily: Fonts.REGULAR,
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginTop: 2,
  },
  addButton: {
    backgroundColor: '#004AAD',
    borderRadius: 12,
    width: '100%',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  addButtonText: {
    fontFamily: Fonts.BOLD,
    fontSize: 16,
    color: '#fff',
  },
  rowInputs2Col: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  halfInputWrapper: {
    flex: 1,
    minWidth: 0,
  },
  stickyButtonWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});
