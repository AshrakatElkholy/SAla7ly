import React, { useState } from 'react';
import { View, Alert, ScrollView, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../Components/CustomButton';
import SignupHeaderCard from '../../Components/SignupHeaderCard';
import HomeScreen from '../HomeScreen';
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Dummy API endpoint (replace with your real one later)
  const API_URL = 'https://jsonplaceholder.typicode.com/posts';

  const handleLogin = async () => {
    let hasError = false;
    if (!email) {
      setEmailError('يرجى إدخال البريد الإلكتروني');
      hasError = true;
    } else if (!email.includes('@')) {
      setEmailError('البريد الإلكتروني غير صحيح');
      hasError = true;
    } else {
      setEmailError('');
    }
    if (!password) {
      setPasswordError('يرجى إدخال كلمة المرور');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('كلمة المرور قصيرة جداً');
      hasError = true;
    } else {
      setPasswordError('');
    }
    if (hasError) return;
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      Alert.alert('تم تسجيل الدخول!', 'تم إرسال البيانات بنجاح.');
      navigation.navigate('HomeScreen');
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء تسجيل الدخول');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#fff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SignupHeaderCard
        onBack={() => navigation.goBack()}
        title=" تسجيل دخول "
        subtitle="قم بتسجيل دخول للحصول على خدمه كامله"
      />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ flex: 1, padding: 16 }}>
          <CustomInput
            label="البريد الإلكتروني"
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com"
            keyboardType="email-address"
            error={emailError}
            deferError
          />
          <CustomInput
            label="كلمة المرور"
            value={password}
            onChangeText={setPassword}
            placeholder="أدخل كلمة المرور"
            secureTextEntry
            error={passwordError}
            deferError
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPasswordScreen')}
            style={{ alignSelf: 'flex-end', marginBottom: 16 }}
          >
            <Text style={{ color: '#1566C1', fontSize: 14 }}>نسيت كلمة المرور؟</Text>
          </TouchableOpacity>
          <View style={{ height: 1, backgroundColor: '#ddd', marginVertical: 16 }} />
          <View style={{ flexDirection: 'row', justifyContent: "flex-end", marginTop: 5, marginEnd: 5 }}>
            <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
              <Text style={{ color: '#1566C1', fontSize: 14, fontWeight: 'bold' }}>انشاء حساب</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 14, color: '#444' }}>ليس لديك حساب ؟ </Text>
          </View>
        </View>
      </ScrollView>
      {/* Fixed button at the bottom */}
      <View style={styles.bottomButtonContainer}>
        <CustomButton
          title="تابع "
          onPress={handleLogin}
          type="filled"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bottomButtonContainer: {
    width: '100%',
     padding: 16,
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});

export default LoginScreen;
