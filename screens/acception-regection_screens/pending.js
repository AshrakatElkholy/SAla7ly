import React from 'react'
import { View, Image, Text, StyleSheet, Alert } from 'react-native';
import CustomButton from '../../Components/CustomButton';
import { Fonts } from '../../constants';
// import pendingImg from '../../assets/pending.PNG';


function Pending({ navigation }) {
  const handleSignout = () => {
    // If you have authentication logic, add it here (e.g., clear tokens)
    // For now, just navigate to login or show an alert
    if (navigation && navigation.navigate) {
      navigation.navigate('ClientLoginScreen');
    } else {
      Alert.alert('تم تسجيل الخروج');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images3.png')} style={styles.mainDone} resizeMode="contain" />
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.welcomeText}>طلبك تحت المراجعة</Text>
        <Text style={styles.subtitleText}>شكراً لتسجيلك! فريقنا بيراجع بياناتك، وهنتواصل معاك قريب بعد التأكيد.</Text>
      </View>
      <CustomButton 
        title=" تسجيل خروج " 
        onPress={handleSignout} 
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
  mainDone: {
    width: 180,
    height: 180,
    marginBottom: 24,
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
});
export default Pending
