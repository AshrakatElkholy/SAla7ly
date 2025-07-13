import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import CustomButton from '../Components/CustomButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function welcom_screen({ navigation, route }) {
  const { userRole } = route.params || {};
  
  // Handle navigation for signup
  const handleSignupPress = () => {
    navigation.navigate('SignupScreen');
  };

  // Handle navigation for login
  const handleLoginPress = () => {
    navigation.navigate('ClientLoginScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#fff" />
  >

      {/* Main Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../assets/snay3y1.png')} 
          style={styles.mainLogo}
          resizeMode="contain"
        />
      </View>

      {/* Bottom Card Overlay */}
      <View style={styles.roundedcard}>
        <Text style={styles.welcomeText}>صلّحها بـ "صلّحلي"!</Text>
        <Text style={styles.subtitleText}>بدل ما تدوّر… خلّي "صلّحلي" يجيبلك الصنايعي لحد باب البيت!</Text>
        <View style={styles.buttonContainer}>
          <CustomButton 
            title="انشاء حساب" 
            onPress={handleSignupPress} 
            type='filled'
          />
          <CustomButton 
            title="تسجيل الدخول" 
            onPress={handleLoginPress} 
            type='outline'
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  imageContainer: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  mainLogo: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.2, // Make image even larger
    marginBottom: 0, // Remove space between image and card
  },
  roundedcard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D1DB',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'flex-end', // <-- This is the key change
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    textAlign: "right",
    marginBottom: 10,
    marginTop: 0,
  },
  subtitleText: {
    fontSize: 15,
    color: '#444',
    textAlign: "right",
    marginBottom: 30,
    lineHeight: 22,
    opacity: 0.9,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    textAlign: "center",
    marginBottom: 15,
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    // gap: 12,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backArrow: {
    fontSize: 24,
    color: '#004AAD',
    fontWeight: 'bold',
  },
});

export default welcom_screen;
