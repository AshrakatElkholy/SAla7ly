import React, { useState, useContext } from 'react';
import { View, Alert, ScrollView, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../Components/CustomButton';
import SignupHeaderCard from '../../Components/SignupHeaderCard';
import { UserContext } from '../Context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

function LoginScreen({ navigation }) {
  const context = useContext(UserContext);

  if (!context) {
    console.error('LoginScreen must be wrapped in UserContextProvider');
    Alert.alert('خطأ', 'حدث خطأ في التطبيق، يرجى إعادة تشغيل التطبيق');
    return null;
  }

  const { setToken, setUserInfo, setUserId, setUserRole } = context;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'https://3c97880a675a.ngrok-free.app/auth/signIn';

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');
    let hasError = false;

    if (!email) {
      setEmailError('يرجى إدخال البريد الإلكتروني');
      hasError = true;
    } else if (!email.includes('@')) {
      setEmailError('البريد الإلكتروني غير صحيح');
      hasError = true;
    }

    if (!password) {
      setPasswordError('يرجى إدخال كلمة المرور');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('كلمة المرور قصيرة جداً');
      hasError = true;
    }

    if (hasError) return;

    try {
      setLoading(true);
      console.log('Sending login request:', { email, password });

      const response = await axios.post(
        API_URL,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { access_token, refresh_token, user } = response.data;

      if (!access_token) throw new Error('No access token received');

      // تخزين التوكنات
      await AsyncStorage.setItem('access_token', access_token);
      if (refresh_token) await AsyncStorage.setItem('refresh_token', refresh_token);

      setToken(access_token);

      if (user) {
        setUserInfo(user);
        await AsyncStorage.setItem('userInfo', JSON.stringify(user));

        if (user.id || user._id) setUserId(user.id || user._id);
        if (user.role) setUserRole(user.role);

        // التوجيه حسب الدور
        if (user.role === 'provider') {
          navigation.replace('ProviderHomeScreen');
        } else {
          navigation.replace('HomeScreen');
        }
      } else {
        // fallback
        navigation.replace('HomeScreen');
      }

      setLoading(false);

    } catch (error) {
      setLoading(false);
      console.log('Login error details:', error.response?.data || error.message);
      const message = error.response?.data?.message;

      if (message === 'user not confirmed yet') {
        navigation.navigate('AccountStatusPending');
      } else if (message === 'your account is rejected') {
        navigation.navigate('AccountStatusRejected');
      } else if (message === 'user not found' || message === 'invalid credentials') {
        Alert.alert('خطأ', 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
      } else {
        Alert.alert('خطأ', 'حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى');
      }
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <SignupHeaderCard
          onBack={() => navigation.goBack()}
          title="تسجيل دخول"
          subtitle="قم بتسجيل دخول للحصول على خدمة كاملة"
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
            editable={!loading}
          />
          <CustomInput
            label="كلمة المرور"
            value={password}
            onChangeText={setPassword}
            placeholder="أدخل كلمة المرور"
            secureTextEntry
            error={passwordError}
            deferError
            editable={!loading}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPasswordScreen')}
            style={styles.forgotPasswordLink}
            disabled={loading}
          >
            <Text style={styles.forgotPasswordText}>نسيت كلمة المرور؟</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.signupLinkContainer}>
            <Text style={styles.signupPromptText}>ليس لديك حساب؟ </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')} disabled={loading}>
              <Text style={styles.signupLinkText}>انشاء حساب</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }} />

          <CustomButton
            title={loading ? "جاري تسجيل الدخول..." : "تسجيل دخول"}
            onPress={handleLogin}
            type="filled"
            style={styles.loginButton}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1 },
  formContainer: { flex: 1, padding: 18, backgroundColor: '#fff' },
  forgotPasswordLink: { alignSelf: 'flex-end', marginBottom: 16 },
  forgotPasswordText: { color: '#1566C1', fontSize: 14 },
  divider: { height: 1, backgroundColor: '#ddd', marginVertical: 16 },
  signupLinkContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 5, marginEnd: 5 },
  signupLinkText: { color: '#1566C1', fontSize: 14, fontWeight: 'bold' },
  signupPromptText: { fontSize: 14, color: '#444' },
  loginButton: { paddingTop: 10, marginBottom: 50, fontSize: 18 },
});

export default LoginScreen; 