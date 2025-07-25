import React, { useState } from 'react';
import { View, Alert, ScrollView, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../Components/CustomButton';
import SignupHeaderCard from '../../Components/SignupHeaderCard';

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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SignupHeaderCard
          onBack={() => navigation.goBack()}
          title=" تسجيل دخول "
          subtitle="قم بتسجيل دخول للحصول على خدمه كامله"
        />
        <View style={styles.formContainer}>
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
            style={styles.forgotPasswordLink}
          >
            <Text style={styles.forgotPasswordText}>نسيت كلمة المرور؟</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <View style={styles.signupLinkContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
              <Text style={styles.signupLinkText}>انشاء حساب</Text>
            </TouchableOpacity>
            <Text style={styles.signupPromptText}>ليس لديك حساب ؟ </Text>
          </View>
          <View style={{ flex: 1 }} />
          <CustomButton
            title="تابع "
            onPress={handleLogin}
            type="filled"
            style={styles.loginButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  formContainer: {
    flex: 1,
    padding: 18,
    backgroundColor: '#fff',
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#1566C1',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 16,
  },
  signupLinkContainer: {
    flexDirection: 'row',
    justifyContent: "flex-end",
    marginTop: 5,
    marginEnd: 5,
  },
  signupLinkText: {
    color: '#1566C1',
    fontSize: 14,
    fontWeight: 'bold',
  },
  signupPromptText: {
    fontSize: 14,
    color: '#444',
  },
  loginButton: {
    paddingTop: 10,
    marginBottom: 50,
    fontSize: 18,
  },
});

export default LoginScreen;        