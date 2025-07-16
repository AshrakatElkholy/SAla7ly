import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native';
import { Fonts } from '../../constants';
import CustomButton from '../../Components/CustomButton';


function Done() {
  // Define the button handler to prevent errors
  const handleSignupPress = () => {};
  return (
    <View style={styles.container}>
      {/* Status Illustration */}
      <Image source={require('../../assets/images1.png')} style={styles.mainDone} resizeMode="contain" />
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.welcomeText}>! تم تفعيل حسابك بنجاح</Text>
        <Text style={styles.subtitleText}>. مبروك! دلوقتي تقدر تبدأ تستقبل طلبات وتشتغل على تطبيق صلّحلي </Text>
      </View>
      <CustomButton 
        title=" ابدأ الشغل" 
        onPress={handleSignupPress} 
        type='filled'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  outerCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#E5F5EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  documentShape: {
    width: 110,
    height: 120,
    backgroundColor: '#fff',
    borderTopLeftRadius: 55,
    borderTopRightRadius: 55,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  greenCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6BC497',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 0,
    fontFamily: Fonts.REGULAR,
  },
  subtitleText: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    opacity: 0.9,
    fontFamily: Fonts.REGULAR,
  },
  mainDone: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
});
export default Done
