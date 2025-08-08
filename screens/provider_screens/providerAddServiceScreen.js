import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
    StatusBar,
    SafeAreaView,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProviderBottomNavigation from '../../Components/providerBottomNavigation';
import * as ImagePicker from 'expo-image-picker';

const providerAddServiceScreen = ({ navigation, route }) => {
    const isEdit = route.params?.isEdit || false;
    const serviceToEdit = route.params?.service || null;
    
    const priceArray = serviceToEdit ? serviceToEdit.priceRange.split(' - ') : ['', ''];
    
    const [serviceName, setServiceName] = useState(serviceToEdit ? serviceToEdit.category : '');
    const [minPrice, setMinPrice] = useState(serviceToEdit ? priceArray[0] : '');
    const [maxPrice, setMaxPrice] = useState(serviceToEdit ? priceArray[1] : '');
    const [description, setDescription] = useState(serviceToEdit ? serviceToEdit.description : '');
    const [selectedImage, setSelectedImage] = useState(null);

    // Request permissions
    const requestPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('خطأ', 'يجب السماح بالوصول لمعرض الصور');
            return false;
        }
        
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus.status !== 'granted') {
            Alert.alert('خطأ', 'يجب السماح بالوصول للكاميرا');
            return false;
        }
        
        return true;
    };

    // Open gallery directly
    const openGallery = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7,
            });

            if (!result.canceled && result.assets[0]) {
                setSelectedImage(result.assets[0]);
            }
        } catch (error) {
            Alert.alert('خطأ', 'حدث خطأ أثناء اختيار الصورة');
        }
    };

    // Select image from gallery
    const selectFromGallery = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7,
            });

            if (!result.canceled && result.assets[0]) {
                setSelectedImage(result.assets[0]);
            }
        } catch (error) {
            Alert.alert('خطأ', 'حدث خطأ أثناء اختيار الصورة');
        }
    };

    // Select image from camera
    const selectFromCamera = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        try {
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7,
            });

            if (!result.canceled && result.assets[0]) {
                setSelectedImage(result.assets[0]);
            }
        } catch (error) {
            Alert.alert('خطأ', 'حدث خطأ أثناء التقاط الصورة');
        }
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

    const handleAddService = () => {
        if (!serviceName.trim()) {
            Alert.alert('خطأ', 'يرجى إدخال اسم الخدمة');
            return;
        }
        if (!minPrice.trim() || !maxPrice.trim()) {
            Alert.alert('خطأ', 'يرجى إدخال نطاق الأسعار');
            return;
        }
        if (!description.trim()) {
            Alert.alert('خطأ', 'يرجى إدخال وصف الخدمة');
            return;
        }

        if (isEdit) {
            const updatedService = {
                ...serviceToEdit,
                category: serviceName,
                priceRange: `${minPrice} - ${maxPrice}`,
                description: description,
                image: selectedImage ? { uri: selectedImage.uri } : serviceToEdit.image,
            };

            if (route.params && route.params.onEditService) {
                route.params.onEditService(updatedService);
            }

            Alert.alert('نجح', 'تم تحديث الخدمة بنجاح', [
                {
                    text: 'موافق',
                    onPress: () => navigation.goBack()
                }
            ]);
        } else {
            const newService = {
                id: Date.now(), 
                category: serviceName,
                priceRange: `${minPrice} - ${maxPrice}`,
                rating: "0.0",
                reviews: "0", 
                description: description,
                image: selectedImage ? { uri: selectedImage.uri } : require('../../assets/service1.jpg')
            };

            if (route.params && route.params.onAddService) {
                route.params.onAddService(newService);
            }

            Alert.alert('نجح', 'تم إضافة الخدمة بنجاح', [
                {
                    text: 'موافق',
                    onPress: () => navigation.goBack()
                }
            ]);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Icon name="arrow-forward" size={20} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>{isEdit ? 'تعديل الخدمة' : 'اضافه خدمه'}</Text>
                    </View>

                    <View style={styles.placeholder} />
                </View>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                {/* Service Name */}
                <Text style={styles.fieldLabel}>اسم الخدمة</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder="اسم الخدمة"
                    placeholderTextColor="#999"
                    value={serviceName}
                    onChangeText={setServiceName}
                />

                {/* Price Range */}
                <View style={styles.priceRow}>
                    <View style={styles.priceField}>
                        <Text style={styles.fieldLabel}>الحد الأدنى للتكلفة</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="الحد الأدنى"
                            placeholderTextColor="#999"
                            value={minPrice}
                            onChangeText={setMinPrice}
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.priceField}>
                        <Text style={styles.fieldLabel}>الحد الأقصى للتكلفة</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="الحد الأقصى"
                            placeholderTextColor="#999"
                            value={maxPrice}
                            onChangeText={setMaxPrice}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                {/* Description */}
                <Text style={styles.fieldLabel}>وصف الخدمة</Text>
                <TextInput
                    style={[styles.textInput, styles.textArea]}
                    placeholder="وصف الخدمة"
                    placeholderTextColor="#999"
                    value={description}
                    onChangeText={setDescription}
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                />

                {/* Service Image */}
                <Text style={styles.fieldLabel}>صورة الخدمة</Text>
                
                {selectedImage ? (
                    <View style={styles.selectedImageContainer}>
                        <Image
                            source={{ uri: selectedImage.uri }}
                            style={styles.selectedImage}
                        />
                        <TouchableOpacity
                            style={styles.removeImageButton}
                            onPress={removeImage}
                        >
                            <Icon name="close" size={20} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.changeImageButton}
                            onPress={openGallery}
                        >
                            <Text style={styles.changeImageText}>تغيير الصورة</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity 
                        style={styles.imageUpload}
                        onPress={openGallery}
                    >
                        <View style={styles.uploadIconContainer}>
                            <Image
                                source={require('../../assets/addImage.png')}
                                style={styles.uploadIconImage}
                            />
                        </View>
                        <Text style={styles.imageUploadText}>
                            {isEdit ? 'اضغط لتعديل صورة الخدمة' : 'اضغط لاضافه صوره الخدمة'}
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Add Service Button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleAddService}>
                    <Text style={styles.submitButtonText}>{isEdit ? 'تعديل الخدمة' : 'إضافة خدمة'}</Text>
                </TouchableOpacity>

                {/* Bottom Navigation */}
                <ProviderBottomNavigation
                    navigation={navigation}
                    activeTab="services"
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'transparent',
    },
    headerContent: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
    },
    backButton: {
        backgroundColor: '#004AAD',
        padding: 8,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
    },
    headerTitleContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'right',
    },
    formContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    fieldLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
        marginTop: 15,
        textAlign: 'right'
    },
    textInput: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        color: '#333',
        borderWidth: 2,
        borderColor: '#D1D1DB',
        textAlign: 'right',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    priceField: {
        width: '48%',
    },
    textArea: {
        height: 150,
        paddingTop: 15,
    },
    imageUpload: {
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#E5E5E5',
        borderStyle: 'dashed',
        padding: 40,
        alignItems: 'center',
        marginTop: 10,
        height: 150
    },
    imageUploadText: {
        fontSize: 14,
        color: '#007AFF',
        marginTop: 10,
        textAlign: 'center',
    },
    uploadIconContainer: {
        backgroundColor: '#E6EDF7',
        width: 40,
        height: 40,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadIconImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    selectedImageContainer: {
        position: 'relative',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: 10,
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
    submitButton: {
        backgroundColor: '#004AAD',
        borderRadius: 8,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default providerAddServiceScreen;