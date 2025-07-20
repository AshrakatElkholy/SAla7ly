import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


const BottomNavigation = ({ navigation, activeTab, favoriteServices = [] }) => {
    return (
        <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem}>
                <Icon name="person" size={24} color="#999" />
                <Text style={styles.navText}>انا</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('favoriteServiceScreen', { favorites: favoriteServices })}
            >
                <FontAwesome
                    name="bookmark"
                    size={24}
                    color={activeTab === 'favorites' ? "#0A71CD" : (favoriteServices.length > 0 ? "#0A71CD" : "#999")}
                />
                <Text style={[styles.navText, activeTab === 'favorites' && styles.activeNavText]}>المفضلة</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.navItem, activeTab === 'messages' && styles.activeNavItem]}
                onPress={() => navigation.navigate('MessagesListScreen')}
            >
                <Icon 
                    name="message" 
                    size={24} 
                    color={activeTab === 'messages' ? "#0A71CD" : "#999"} 
                />
                <Text style={[styles.navText, activeTab === 'messages' && styles.activeNavText]}>الرسائل</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navItem}
                onPress={() => navigation.navigate('ServicesCategoryScreen')}
            >
                <FontAwesome5
                    name="th-large"
                    size={20}
                    color={activeTab === 'services' ? "#0A71CD" : "#999"}
                />

                <Text style={[styles.navText, activeTab === 'services' && styles.activeNavText]}>الخدمات</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.navItem, activeTab === 'home' && styles.activeNavItem]}
                onPress={() => navigation.navigate('HomeScreen')}
            >
                <Icon
                    name="home"
                    size={24}
                    color={activeTab === 'home' ? "#0A71CD" : "#999"}
                />
                <Text style={[styles.navText, activeTab === 'home' && styles.activeNavText]}>الرئيسية</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 5,
    },
    activeNavItem: {
        // Active state styling
    },
    navText: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    activeNavText: {
        color: '#0A71CD',
    },
});

export default BottomNavigation;