import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Image } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const appointmentBookingScreen = () => {
  const [activeDate, setActiveDate] = useState(null);
  const [activeTime, setActiveTime] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const getDayLetter = (dayIndex) => {
    const letters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return letters[dayIndex];
  };

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 31; i++) {
      const date = new Date(today.getFullYear(), today.getMonth(), i);
      const dayIndex = date.getDay();
      dates.push({ id: i, label: i.toString(), dayLetter: getDayLetter(dayIndex) });
    }
    return dates.reverse();
  };

  const generateTimes = () => {
    const times = [];
    for (let hour = 12; hour <= 21; hour++) {
      const suffix = hour >= 12 ? 'pm' : 'am';
      const displayHour = hour > 12 ? hour - 12 : hour;
      times.push({ id: hour, label: `${displayHour}:00 ${suffix}` });
    }
    return times.reverse();
  };

  // Request camera permission for Android
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Show photo selection options
  const showImagePickerOptions = () => {
    Alert.alert(
      'اختر صورة',
      'من أين تريد اختيار الصورة؟',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'معرض الصور',
          onPress: selectFromGallery,
        },
        {
          text: 'الكاميرا',
          onPress: selectFromCamera,
        },
      ],
      { cancelable: true }
    );
  };

  // Select image from gallery
  const selectFromGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.7,
      maxWidth: 1000,
      maxHeight: 1000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0]);
      }
    });
  };

  // Select image from camera
  const selectFromCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('خطأ', 'يجب السماح بالوصول للكاميرا');
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.7,
      maxWidth: 1000,
      maxHeight: 1000,
    };

    launchCamera(options, (response) => {
      if (response.didCancel || response.errorMessage) {
        return;
      }

      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0]);
      }
    });
  };

  // Remove selected image
  const removeImage = () => {
    Alert.alert(
      'حذف الصورة',
      'هل تريد حذف الصورة المحددة؟',
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'حذف',
          onPress: () => setSelectedImage(null),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={appointmentBookingStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header */}
      <View style={appointmentBookingStyles.header}>
        <View style={appointmentBookingStyles.headerContent}>
          <TouchableOpacity
            style={appointmentBookingStyles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Icon name="arrow-forward" size={14} color="#fff" />
          </TouchableOpacity>

          <View style={appointmentBookingStyles.headerTitleContainer}>
            <Text style={appointmentBookingStyles.headerTitle}>حجز موعد</Text>
          </View>

          <View style={appointmentBookingStyles.placeholder} />
        </View>
      </View>

      <ScrollView style={appointmentBookingStyles.content}>
        {/* Date Selection */}
        <View style={appointmentBookingStyles.dateSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} inverted>
            {generateDates().map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setActiveDate(item.id)}
                style={[
                  appointmentBookingStyles.dateItem,
                  activeDate === item.id && appointmentBookingStyles.activeDateItem
                ]}
              >
                <Text style={[
                  appointmentBookingStyles.dayText,
                  activeDate === item.id && appointmentBookingStyles.activeDateText
                ]}>{item.dayLetter}</Text>
                <Text style={[
                  appointmentBookingStyles.dateText,
                  activeDate === item.id && appointmentBookingStyles.activeDateText
                ]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View style={appointmentBookingStyles.timeSection}>
          <Text style={appointmentBookingStyles.sectionTitle}>الوقت المتاح</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} inverted>
            {generateTimes().map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setActiveTime(item.id)}
                style={[
                  appointmentBookingStyles.timeSlot,
                  activeTime === item.id && appointmentBookingStyles.activeTimeSlot
                ]}
              >
                <Text style={[
                  appointmentBookingStyles.timeText,
                  activeTime === item.id && appointmentBookingStyles.activeTimeText
                ]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Problem Description */}
        <View style={appointmentBookingStyles.problemSection}>
          <Text style={appointmentBookingStyles.sectionTitle}>اشرح مشكلتك</Text>
          <TextInput
            style={appointmentBookingStyles.problemInput}
            placeholder="اشرح مشكلتك هنا"
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Problem Image */}
        <View style={appointmentBookingStyles.imageSection}>
          <Text style={appointmentBookingStyles.sectionTitle}>صوره لمشكله</Text>
          
          {selectedImage ? (
            <View style={appointmentBookingStyles.selectedImageContainer}>
              <Image
                source={{ uri: selectedImage.uri }}
                style={appointmentBookingStyles.selectedImage}
              />
              <TouchableOpacity
                style={appointmentBookingStyles.removeImageButton}
                onPress={removeImage}
              >
                <Icon name="close" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={appointmentBookingStyles.changeImageButton}
                onPress={showImagePickerOptions}
              >
                <Text style={appointmentBookingStyles.changeImageText}>تغيير الصورة</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={appointmentBookingStyles.imageUpload}
              onPress={showImagePickerOptions}
            >
              <View style={appointmentBookingStyles.uploadIconContainer}>
                <Image
                  source={require('../assets/addImage.png')}
                  style={appointmentBookingStyles.uploadIconImage}
                />
              </View>
              <Text style={appointmentBookingStyles.uploadText}>اضغط لإضافة صورة</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Book Now Button */}
        <TouchableOpacity style={appointmentBookingStyles.bookButton}>
          <Text style={appointmentBookingStyles.bookButtonText}>احجز الان</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const appointmentBookingStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E6EDF7',
    backgroundColor: 'transparent',
  },
  headerContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
    marginTop: 20
  },
  backButton: {
    backgroundColor: '#004AAD',
    padding: 8,
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    textAlign: 'right',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
    textAlign: 'right',
    marginRight: 10
  },
  dateSection: {
    marginBottom: 25,
    marginTop: 10
  },
  timeSection: {
    marginBottom: 25,
  },
  dateItem: {
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    minWidth: 50,
    borderColor: '#D1D1DB',
    borderWidth: 1
  },
  activeDateItem: {
    backgroundColor: '#004AAD',
  },
  dayText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activeDateText: {
    color: '#fff',
  },
  timeSlot: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginRight: 10,
    alignItems: 'center',
    minWidth: 80,
    borderColor: '#D1D1DB',
    borderWidth: 1
  },
  activeTimeSlot: {
    backgroundColor: '#004AAD',
  },
  timeText: {
    fontSize: 14,
    color: '#333',
  },
  activeTimeText: {
    color: '#fff',
  },
  problemSection: {
    marginBottom: 25,
  },
  problemInput: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    height: 150,
    textAlignVertical: 'top',
    fontSize: 14,
    color: '#333',
    borderColor: "#D1D1DB",
    borderWidth: 1,
  },
  imageSection: {
    marginBottom: 30,
  },
  imageUpload: {
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  uploadIconContainer: {
    backgroundColor: '#E6EDF7',
    width: 40,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  uploadIconImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  uploadText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  selectedImageContainer: {
    position: 'relative',
    borderRadius: 10,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0, 74, 173, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changeImageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: '#004AAD',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default appointmentBookingScreen;