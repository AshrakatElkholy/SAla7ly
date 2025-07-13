import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({
  title,
  onPress,
  type = 'filled', 
  color = '#004AAD',
}) => {
  const isFilled = type === 'filled';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isFilled ? color : 'transparent',
          borderColor: color,
          borderWidth: isFilled ? 0 : 2,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={{
          color: isFilled ? '#fff' : color,
          fontWeight: 'bold',
          fontSize: 16,
         
        }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 10,
     width: "100%"
  },
});
