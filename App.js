import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import UserCategoryScreen from './screens/user_category_screen';
import WelcomeScreen from './screens/welcom_screen';
import SignupScreen from './screens/user_screens/signup';
import LoginScreen from './screens/user_screens/login';

const Stack = createStackNavigator();

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate splash screen delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar style="light" backgroundColor="#004AAD" />
        <Image 
          source={require('./assets/logo.png')} 
          style={styles.splashLogo}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#004AAD" />
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
        }}
      >
          <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen}
        />
          <Stack.Screen 
          name="SignupScreen"
          component={SignupScreen}
        />
        <Stack.Screen 
          name="UserCategoryScreen" 
          component={UserCategoryScreen}
        />
      
        <Stack.Screen 
          name="ClientLoginScreen"
          component={LoginScreen}
        />
        {/* Add other screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#004AAD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    width: 200,
    height: 200,
  },
});

export default App;
