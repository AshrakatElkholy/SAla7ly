import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Fonts } from "../constants";

const STEPS = ["بيانات صنايعي", "اثبات شخصيه", "موقعك"];

export default function TabsHeader({
  activeIndex = 0,
  doneTill = activeIndex - 1,
}) {
  return (
    <View style={styles.row}>
      {STEPS.map((t, i) => {
        const isActive = i === activeIndex;
        const isDone = i <= doneTill;
        return (
          <View key={t} style={styles.tab}>
            <Text
              style={[
                styles.txt,
                isActive && styles.txtActive,
                !isActive && isDone && styles.txtDone,
              ]}
            >
              {t}
            </Text>
            {isActive && <View style={styles.underlineActive} />}
            {!isActive && isDone && <View style={styles.underlineDone} />}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: 22,
    flexDirection: "row-reverse",
    justifyContent: "space-around",
  },
  tab: { alignItems: "center" },
  txt: { fontSize: 14, color: "#8A8A8A", fontFamily: Fonts.REGULAR },
  txtActive: { color: "#004AAD", fontFamily: Fonts.BOLD },
  txtDone: { color: "#5C8FD4" },

  underlineActive: {
    height: 3,
    width: 70,
    backgroundColor: "#004AAD",
    marginTop: 4,
    borderRadius: 20,
  },
  underlineDone: {
    height: 2,
    width: 40,
    backgroundColor: "#9EBBEB",
    marginTop: 2,
  },
});
