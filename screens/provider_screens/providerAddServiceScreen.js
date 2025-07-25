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

const providerAddServiceScreen = ({ navigation, route }) => {
    const isEdit = route.params?.isEdit || false;
    const serviceToEdit = route.params?.service || null;
    
    const priceArray = serviceToEdit ? serviceToEdit.priceRange.split(' - ') : ['', ''];
    
    const [serviceName, setServiceName] = useState(serviceToEdit ? serviceToEdit.category : '');
    const [minPrice, setMinPrice] = useState(serviceToEdit ? priceArray[0] : '');
    const [maxPrice, setMaxPrice] = useState(serviceToEdit ? priceArray[1] : '');
    const [description, setDescription] = useState(serviceToEdit ? serviceToEdit.description : '');

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
                image: require('../../assets/service1.jpg') 
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
                <TouchableOpacity style={styles.imageUpload}>
                    <View style={styles.uploadIconContainer}>
                        <Image
                            source={require('../../assets/addImage.png')}
                            style={styles.uploadIconImage}
                        />
                    </View>
                    <Text style={styles.imageUploadText}>{isEdit ? 'اضغط لتعديل صورة الخدمة' : 'اضغط لاضافه صوره  اثبات هويه خلفيه'}</Text>
                </TouchableOpacity>

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
        borderBottomWidth: 1,
        borderBottomColor: '#E6EDF7',
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