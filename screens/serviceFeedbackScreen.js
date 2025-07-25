import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import ProvidedServiceCard from "../Components/providedServiceCard";
import ServiceFeedbackCard from "../Components/serviceFeedbackCard";
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';


const serviceFeedbackScreen = () => {

  const route = useRoute();


  return (
    <SafeAreaView style={serviceFeddbackStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header */}
      <View style={serviceFeddbackStyles.header}>
        <View style={serviceFeddbackStyles.headerContent}>
          <TouchableOpacity
            style={serviceFeddbackStyles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>

          <View style={serviceFeddbackStyles.headerTitleContainer}>
            <Text style={serviceFeddbackStyles.headerTitle}>صيانة المطبخ</Text>
          </View>

          <View style={serviceFeddbackStyles.placeholder} />
        </View>
      </View>

      <ScrollView style={serviceFeddbackStyles.content}>
        {/* Service Provider Info */}
        <View style={serviceFeddbackStyles.providerSection}>
          <Text style={serviceFeddbackStyles.sectionTitle}>مقدم الخدمة</Text>
          <View style={serviceFeddbackStyles.providerCard}>
            <Image
              source={require("../assets/service1.jpg")}
              style={serviceFeddbackStyles.providerImage}
            />
            <View style={serviceFeddbackStyles.providerInfo}>
              <Text style={serviceFeddbackStyles.providerName}>احمد محمد</Text>
              <Text style={serviceFeddbackStyles.providerTitle}> مرسي علم مطروح</Text>
              <View style={serviceFeddbackStyles.categoryBadge}>
                <Text style={serviceFeddbackStyles.categoryText}>كهربائي</Text>
              </View>
            </View>

            <TouchableOpacity style={serviceFeddbackStyles.detailsButton}>
              <Text style={serviceFeddbackStyles.detailsButtonText}>تفاصيل</Text>
            </TouchableOpacity>
            <View style={serviceFeddbackStyles.messageIconContainer}>
              <Image
                source={require('../assets/message.png')}
                style={serviceFeddbackStyles.iconImage}
                resizeMode="contain"
              />
            </View>

          </View>
        </View>

        {/* Provided Service */}
        <View style={serviceFeddbackStyles.serviceSection}>
          <Text style={serviceFeddbackStyles.sectionTitle}>الخدمة المقدمة</Text>
          <ProvidedServiceCard
            title="صيانة مطبخ"
            price="8000"
            image={require('../assets/service1.jpg')}
            avatar={require('../assets/service1.jpg')}
            rating={4.7}
            reviews='(51)'
            provider="احمد محمد"
          />

        </View>

        {/* Service Feedback */}
        <View style={serviceFeddbackStyles.feedbackSection}>
          <Text style={serviceFeddbackStyles.sectionTitle}>تفاصيل مشكله</Text>
          <ServiceFeedbackCard
            image={require("../assets/service1.jpg")}
            description="Lorem ipsum dolor sit amet consectetur. Eu praesent verra queuepat etiam culpe ultrices nam urna auctor. Habitant neque turpis tristique magna."
          />
        </View>


        {/* Cancel Service Button */}
        <TouchableOpacity style={serviceFeddbackStyles.cancelButton}>
          <Text style={serviceFeddbackStyles.cancelButtonText}>الغاء خدمة</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const serviceFeddbackStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
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
  },

  backButton: {
    backgroundColor: '#0A71CD',
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
    marginTop : 0
  },
  providerSection: {
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#E6EDF7',
    
  },
  providerCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    // padding: 15,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 15,
  },
  providerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 15,
  },
  providerInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
    textAlign: 'right'
  },
  providerTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
    textAlign: 'right'
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginTop: 4,
    marginRight: 0,
  },

  categoryText: {
    fontSize: 13,
    color: '#0C9D61',
    fontWeight: '600',
    textAlign: 'right',
  },
  messageIconContainer: {
    width: 25,
    height: 25,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#0A71CD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  detailsButton: {
    paddingVertical: 4,
    paddingHorizontal: 25,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#0A71CD',
  },
  detailsButtonText: {
    color: '#0A71CD',
    fontSize: 12,
    fontWeight: '600'
  },
  serviceSection: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E6EDF7',
    marginTop: 0
  },
  feedbackSection: {
    marginBottom: 20,
    marginTop : 0
    
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#AF1208',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelButtonText: {
    color: '#AF1208',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default serviceFeedbackScreen;