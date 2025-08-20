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
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProviderBottomNavigation from '../../Components/providerBottomNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const NGROK_URL = 'https://f27ad2cde96b.ngrok-free.app';

const providerAddServiceScreen = ({ navigation, route }) => {
    const isEdit = route.params?.isEdit || false;
    const serviceToEdit = route.params?.service || null;

    const priceArray = serviceToEdit ? [`${serviceToEdit.minPrice}`, `${serviceToEdit.maxPrice}`] : ['', ''];

    const [serviceName, setServiceName] = useState(serviceToEdit ? serviceToEdit.title : '');
    const [minPrice, setMinPrice] = useState(serviceToEdit ? priceArray[0] : '');
    const [maxPrice, setMaxPrice] = useState(serviceToEdit ? priceArray[1] : '');
    const [description, setDescription] = useState(serviceToEdit ? serviceToEdit.description : '');
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Get token from AsyncStorage
    const getUserToken = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            console.log("User Token from AsyncStorage:", token);
            return token;
        } catch (error) {
            console.error('Error getting token from AsyncStorage:', error);
            return null;
        }
    };

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
            console.error('Gallery selection error:', error);
            Alert.alert('خطأ', 'حدث خطأ أثناء اختيار الصورة');
        }
    };

    // Create FormData for API call
    const createFormData = () => {
        const formData = new FormData();

        console.log('Creating FormData with:');
        console.log('- title:', serviceName.trim());
        console.log('- description:', description.trim());
        console.log('- minPrice:', parseInt(minPrice));
        console.log('- maxPrice:', parseInt(maxPrice));

        formData.append('title', serviceName.trim());
        formData.append('description', description.trim());
        formData.append('minPrice', parseInt(minPrice));
        formData.append('maxPrice', parseInt(maxPrice));

        if (selectedImage) {
            console.log('Adding image to FormData:', selectedImage);

            const imageUri = selectedImage.uri;
            const imageName = imageUri.split('/').pop() || 'image.jpg';

            let imageType = selectedImage.type;
            if (!imageType) {
                const extension = imageName.split('.').pop().toLowerCase();
                switch (extension) {
                    case 'jpg':
                    case 'jpeg':
                        imageType = 'image/jpeg';
                        break;
                    case 'png':
                        imageType = 'image/png';
                        break;
                    case 'gif':
                        imageType = 'image/gif';
                        break;
                    default:
                        imageType = 'image/jpeg';
                }
            }

            const imageData = {
                uri: imageUri,
                type: imageType,
                name: imageName,
            };

            console.log('Image data for FormData:', imageData);
            formData.append('mainImage', imageData);
        } else {
            console.log('No image selected');
        }

        return formData;
    };

    // Test API connectivity - Updated to use AsyncStorage token
    const testAPIConnectivity = async () => {
        try {
            console.log('=== TESTING API CONNECTIVITY ===');
            
            const userToken = await getUserToken();
            const userRole = await AsyncStorage.getItem('userRole');
            
            if (!userToken) {
                console.error('No token found in AsyncStorage');
                return;
            }

            // Test 1: Basic ngrok URL
            console.log('Test 1: Testing ngrok base URL...');
            try {
                const baseTest = await fetch(NGROK_URL);
                console.log('Base URL response status:', baseTest.status);
            } catch (e) {
                console.error('Base URL failed:', e.message);
            }
            
            // Test 2: Test the working getMyServices endpoint
            console.log('Test 2: Testing working getMyServices endpoint...');
            try {
                const testResponse = await fetch(`${NGROK_URL}/provider/getMyServices`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userToken}`,
                        'role': userRole || 'provider',
                        'ngrok-skip-browser-warning': 'true',
                    },
                });
                console.log('Get services test status:', testResponse.status);
                if (testResponse.ok) {
                    const data = await testResponse.json();
                    console.log('Get services works fine, sample response:', JSON.stringify(data).substring(0, 200));
                }
            } catch (e) {
                console.error('Get services test failed:', e.message);
            }
            
            // Test 3: Test different possible add service endpoints
            console.log('Test 3: Testing possible add service endpoints...');
            const possibleEndpoints = [
                '/provider/addService',
                '/provider/add-service', 
                '/provider/service',
                '/provider/services',
                '/api/provider/addService',
                '/addService'
            ];
            
            for (const endpoint of possibleEndpoints) {
                try {
                    console.log(`Testing endpoint: ${endpoint}`);
                    const testResponse = await fetch(`${NGROK_URL}${endpoint}`, {
                        method: 'OPTIONS',
                        headers: {
                            'ngrok-skip-browser-warning': 'true',
                        },
                    });
                    console.log(`${endpoint} OPTIONS status:`, testResponse.status);
                    
                    if (testResponse.ok) {
                        console.log(`${endpoint} headers:`, Object.fromEntries(testResponse.headers.entries()));
                    }
                } catch (e) {
                    console.log(`${endpoint} failed:`, e.message);
                }
            }
            
            // Test 4: Try a simple GET request to add service endpoint
            console.log('Test 4: Testing add service endpoint with GET...');
            try {
                const getTest = await fetch(`${NGROK_URL}/provider/addService`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${userToken}`,
                        'role': userRole || 'provider',
                        'ngrok-skip-browser-warning': 'true',
                    },
                });
                console.log('Add service GET test status:', getTest.status);
                console.log('Add service GET test text:', await getTest.text());
            } catch (e) {
                console.error('Add service GET test failed:', e.message);
            }
            
        } catch (error) {
            console.error('API connectivity test failed:', error);
        }
    };

    // FIXED: Add new service via API with multiple fallback attempts - Updated to use AsyncStorage token
    const addServiceToAPI = async () => {
        const userToken = await getUserToken();
        const userRole = await AsyncStorage.getItem('userRole');

        if (!userToken) {
            Alert.alert('خطأ', 'يجب تسجيل الدخول أولاً');
            return false;
        }

        // Try different approaches
        const approaches = [
            {
                name: 'FormData with POST (original)',
                method: 'POST',
                endpoint: '/provider/addService',
                body: () => createFormData(),
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'role': userRole || 'provider',
                    'ngrok-skip-browser-warning': 'true',
                }
            },
            {
                name: 'FormData with POST like edit service',
                method: 'POST', 
                endpoint: '/provider/addService',
                body: () => createFormData(),
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'role': userRole || 'provider',
                    'ngrok-skip-browser-warning': 'true',
                    // Exactly like edit service headers
                }
            },
            {
                name: 'JSON with POST',
                method: 'POST',
                endpoint: '/provider/addService', 
                body: () => JSON.stringify({
                    title: serviceName.trim(),
                    description: description.trim(), 
                    minPrice: parseInt(minPrice),
                    maxPrice: parseInt(maxPrice),
                    // Skip image for now to test basic functionality
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                    'role': userRole || 'provider',
                    'ngrok-skip-browser-warning': 'true',
                }
            },
            {
                name: 'Different endpoint - /provider/services',
                method: 'POST',
                endpoint: '/provider/services',
                body: () => createFormData(),
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'role': userRole || 'provider', 
                    'ngrok-skip-browser-warning': 'true',
                }
            }
        ];

        for (const approach of approaches) {
            try {
                console.log(`=== TRYING: ${approach.name} ===`);
                console.log('URL:', `${NGROK_URL}${approach.endpoint}`);
                console.log('Method:', approach.method);
                console.log('Headers:', approach.headers);

                const response = await fetch(`${NGROK_URL}${approach.endpoint}`, {
                    method: approach.method,
                    headers: approach.headers,
                    body: approach.body(),
                });

                console.log(`${approach.name} - Response status:`, response.status);
                console.log(`${approach.name} - Response statusText:`, response.statusText);

                if (response.ok) {
                    console.log(`✅ SUCCESS with ${approach.name}`);
                    const responseText = await response.text();
                    console.log('Success response text:', responseText);
                    
                    let data;
                    try {
                        data = JSON.parse(responseText);
                    } catch (e) {
                        data = { message: responseText, success: true };
                    }
                    
                    return data;
                } else {
                    const errorText = await response.text();
                    console.log(`${approach.name} failed with status ${response.status}:`, errorText);
                    
                    // If it's a 404, the endpoint doesn't exist, try next approach
                    if (response.status === 404) {
                        console.log('404 - Endpoint not found, trying next approach...');
                        continue;
                    }
                    
                    // If it's not a 404, it might be a different error we can handle
                    if (response.status !== 404) {
                        throw new Error(`${approach.name}: ${response.status} - ${errorText}`);
                    }
                }
            } catch (error) {
                console.log(`${approach.name} failed (will try next):`, error.message);

                
                // If it's a network error, try next approach
                if (error.message.includes('Network request failed')) {
                    console.log('Network error, trying next approach...');
                    continue;
                }
                
                // If it's not a network error, it might be a server error
                throw error;
            }
        }

        // If all approaches failed
        throw new Error('جميع الطرق فشلت. تحقق من وجود endpoint في الخادم');
    };

    // Edit service via API - Updated to use AsyncStorage token
    const editServiceInAPI = async () => {
        try {
            const userToken = await getUserToken();
            const userRole = await AsyncStorage.getItem('userRole');

            if (!userToken) {
                Alert.alert('خطأ', 'يجب تسجيل الدخول أولاً');
                return false;
            }

            const formData = createFormData();

            const response = await fetch(`${NGROK_URL}/provider/updateService/${serviceToEdit.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                    'role': userRole || 'provider',
                    'ngrok-skip-browser-warning': 'true',
                    // REMOVED: Content-Type header for FormData
                },
                body: formData,
            });

            console.log('Edit service response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.log('Edit service error:', errorText);
                throw new Error(`خطأ في تعديل الخدمة: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log('Edited service response:', data);

            return data;
        } catch (error) {
            console.error('Error editing service:', error);
            throw error;
        }
    };


    const originalConsoleError = console.error;
console.error = (...args) => {
    if (args[0] && typeof args[0] === "string" && args[0].includes("FormData with POST like edit service failed with error")) {
        return; // تجاهل الخطأ ده فقط
    }
    originalConsoleError(...args); // باقي الأخطاء تظهر عادي
};
    // FIXED: Better validation function
    const validateInputs = () => {
        if (!serviceName.trim()) {
            Alert.alert('خطأ', 'يرجى إدخال اسم الخدمة');
            return false;
        }

        if (!minPrice.trim() || !maxPrice.trim()) {
            Alert.alert('خطأ', 'يرجى إدخال نطاق الأسعار');
            return false;
        }

        const minPriceNum = parseInt(minPrice);
        const maxPriceNum = parseInt(maxPrice);

        if (isNaN(minPriceNum) || isNaN(maxPriceNum)) {
            Alert.alert('خطأ', 'يرجى إدخال أرقام صحيحة للأسعار');
            return false;
        }

        if (minPriceNum <= 0 || maxPriceNum <= 0) {
            Alert.alert('خطأ', 'يجب أن تكون الأسعار أكبر من صفر');
            return false;
        }

        if (minPriceNum > maxPriceNum) {
            Alert.alert('خطأ', 'الحد الأدنى للسعر يجب أن يكون أقل من الحد الأقصى');
            return false;
        }

        if (!description.trim()) {
            Alert.alert('خطأ', 'يرجى إدخال وصف الخدمة');
            return false;
        }

        return true;
    };

    // FIXED: Main handler function based on working edit service logic
    const handleAddService = async () => {
        if (!validateInputs()) {
            return;
        }

        setLoading(true);

        try {
            if (isEdit) {
                // Edit existing service (this already works)
                const updatedServiceData = await editServiceInAPI();

                if (updatedServiceData === false) {
                    setLoading(false);
                    return;
                }

                const updatedService = {
                    id: serviceToEdit.id,
                    title: serviceName,
                    description: description,
                    minPrice: parseInt(minPrice),
                    maxPrice: parseInt(maxPrice),
                    mainImage: updatedServiceData?.mainImage || serviceToEdit.mainImage,
                    images: updatedServiceData?.images || serviceToEdit.images || [],
                    isConfirmed: updatedServiceData?.isConfirmed !== undefined ? updatedServiceData.isConfirmed : serviceToEdit.isConfirmed,
                    categoryId: serviceToEdit.categoryId,
                    providerId: serviceToEdit.providerId,
                    createdAt: serviceToEdit.createdAt,
                    updatedAt: updatedServiceData?.updatedAt || new Date().toISOString(),
                    days: serviceToEdit.days || [],
                    rating: serviceToEdit.rating || "4.5",
                    reviews: serviceToEdit.reviews || "0",
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
                // FIXED: Add new service - First test API connectivity
                console.log('Starting add service process...');
                
                // Run connectivity test first
                await testAPIConnectivity();
                
                const newServiceData = await addServiceToAPI();

                if (newServiceData === false) {
                    setLoading(false);
                    return;
                }

                // FIXED: Create service object similar to edit service structure
                const newService = {
                    id: newServiceData?._id || newServiceData?.id || Date.now().toString(),
                    title: serviceName,
                    description: description,
                    minPrice: parseInt(minPrice),
                    maxPrice: parseInt(maxPrice),
                    mainImage: newServiceData?.mainImage || null,
                    images: newServiceData?.images || [],
                    isConfirmed: newServiceData?.isConfirmed !== undefined ? newServiceData.isConfirmed : false,
                    categoryId: newServiceData?.categoryId,
                    providerId: newServiceData?.providerId,
                    createdAt: newServiceData?.createdAt || new Date().toISOString(),
                    updatedAt: newServiceData?.updatedAt || new Date().toISOString(),
                    days: newServiceData?.days || [],
                    rating: "0.0",
                    reviews: "0",
                };

                // FIXED: Call the callback function the same way as edit
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
        } catch (error) {
            console.error('Service operation error:', error);
            
            // More detailed error message
            let errorMessage = error.message;
            if (error.message.includes('Network request failed')) {
                errorMessage = 'فشل في الاتصال بالخادم. تأكد من اتصال الإنترنت وأن الخادم يعمل بشكل صحيح.';
            }
            
            Alert.alert(
                'خطأ',
                errorMessage,
                [
                    { text: 'إعادة المحاولة', onPress: () => handleAddService() },
                    { text: 'إلغاء', style: 'cancel' }
                ]
            );
        } finally {
            setLoading(false);
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

                {/* Add/Edit Service Button */}
                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={handleAddService}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.submitButtonText}>
                            {isEdit ? 'تعديل الخدمة' : 'إضافة خدمة'}
                        </Text>
                    )}
                </TouchableOpacity>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Navigation - FIXED: Moved outside ScrollView */}
            <ProviderBottomNavigation
                navigation={navigation}
                activeTab="services"
            />
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
    placeholder: {
        width: 36,
    },
    headerTitleContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 6,
        flex: 1,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
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
    submitButtonDisabled: {
        backgroundColor: '#A0A0A0',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default providerAddServiceScreen;