import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import BottomNavigation from '../Components/BottomNavigation';
import CustomHeaderWithLines from '../Components/CustomHeaderTemp'; 

const CategoryScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');

    const serviceCategories = [
        { id: 1, name: 'نقاشة', icon: 'brush' },
        { id: 2, name: 'حفر', icon: 'shovel' },
        { id: 3, name: 'سباكة', icon: 'pipe-wrench' },
        { id: 4, name: 'كهرباء', icon: 'flashlight' },
        { id: 5, name: 'ميكانيكي', icon: 'tool-box' },
        { id: 6, name: 'فني الأجهزة الكهربائية', icon: 'soldering' },
        { id: 7, name: 'كهرباء', icon: 'flashlight' },
        { id: 8, name: 'نقاشة', icon: 'brush' },
    ];

    const iconImages = {
        'brush': require('../assets/categoryIcons/brush.png'),
        'shovel': require('../assets/categoryIcons/shovel.png'),
        'pipe-wrench': require('../assets/categoryIcons/pipe-wrench.png'),
        'flashlight': require('../assets/categoryIcons/flashlight.png'),
        'tool-box': require('../assets/categoryIcons/tool-box.png'),
        'soldering': require('../assets/categoryIcons/soldering.png'),
    };

    const [favoriteServices, setFavoriteServices] = useState([]);

    const filteredCategories = serviceCategories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCategoryPress = (category) => {
        navigation.navigate('serviceProviderScreen', {
            categoryName: category.name,
            categoryIcon: category.icon
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Replace the old header with CustomHeaderWithLines */}
            <CustomHeaderWithLines 
                title="الخدمات"
                showTabs={false}
                showIcons={true}
            />

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <View style={styles.searchImageIcon}>
                        <Image
                            source={require('../assets/filter-square.png')}
                            style={styles.searchImage}
                        />
                    </View>
                    <View style={styles.searchInputWrapper}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="بحث عن خدمه"
                            placeholderTextColor="#999"
                            textAlign="right"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Categories Grid */}
                <View style={styles.categoriesSection}>
                    <View style={styles.categoriesGrid}>
                        {filteredCategories.map((category) => (
                            <View key={category.id} style={styles.categoryWrapper}>
                                <TouchableOpacity
                                    style={styles.categoryItem}
                                    onPress={() => handleCategoryPress(category)}
                                >
                                    <View style={styles.categoryIcon}>
                                        <Image
                                            source={iconImages[category.icon]}
                                            style={styles.iconImage}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <Text style={styles.categoryText}>{category.name}</Text>
                            </View>
                        ))}
                    </View>

                    {filteredCategories.length === 0 && (
                        <View style={styles.noResultsContainer}>
                            <Text style={styles.noResultsText}>لا توجد خدمات مطابقة لبحثك</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <BottomNavigation
                navigation={navigation}
                activeTab="services"
                favoriteServices={favoriteServices}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 45,
    },
    searchImageIcon: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 4,
        marginRight: 8,
    },
    searchImage: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'flex-end',
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingHorizontal: 8,
    },
    searchIcon: {
        marginLeft: 8,
    },
    content: {
        flex: 1,
    },
    categoriesSection: {
        paddingHorizontal: 25,
        paddingVertical: 20,
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    categoryItem: {
        width: '80%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        padding: 8,
        borderRadius: 10,
        backgroundColor: '#E6EDF7',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    categoryIcon: {
        width: 60,
        height: 60,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 2,
    },
    iconImage: {
        width: 40,
        height: 35,
        resizeMode: 'contain',
    },
    categoryWrapper: {
        width: '50%',
        alignItems: 'center',
        marginBottom: 20,
        gap: 2,
    },
    categoryText: {
        fontSize: 22,
        fontWeight: '500',
        color: '#000',
        textAlign: 'center',
    },
    noResultsContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    noResultsText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});

export default CategoryScreen;