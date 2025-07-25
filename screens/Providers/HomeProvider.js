import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const HomeProvider = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert('تأكيد تسجيل الخروج', 'هل أنت متأكد أنك تريد تسجيل الخروج؟', [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'تأكيد',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.multiRemove([
            'user',
            'onboardingStep',
            'onboardingSpecialty',
            'onboardingIdentity',
            'onboardingLocation',
          ]);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
          });
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>HomeProvider</Text>

      <TouchableOpacity
        style={{
          backgroundColor: '#E53935',
          padding: 14,
          borderRadius: 10,
          alignItems: 'center',
          marginTop: 30,
        }}
        onPress={handleLogout}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
          تسجيل الخروج
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeProvider;
