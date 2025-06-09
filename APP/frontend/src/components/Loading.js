import React from "react";
import { View, ActivityIndicator, StyleSheet, Text, Animated, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

class Loading extends React.Component {
  gradientAnim = new Animated.Value(0);

  componentDidMount() {
    this.animateGradient();
  }

  animateGradient = () => {
    this.gradientAnim.setValue(0);
    Animated.loop(
      Animated.timing(this.gradientAnim, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: false,
      })
    ).start();
  };

  render() {
    const { message = "Carregando...", color = "#2563eb", size = "large" } = this.props;

    const gradientTranslate = this.gradientAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [height, 0],
    });

    return (
      <View style={styles.bg}>
        <Animated.View
          style={[
            styles.gradient,
            {
              transform: [{ translateY: gradientTranslate }],
            },
          ]}
        />
        <View style={styles.container}>
          <Text style={styles.title}>Aguarde...</Text>
          <Text style={styles.text}>{message}</Text>
          <ActivityIndicator size={size} color={color} style={{ marginTop: 22 }} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height,
    backgroundColor: "#2563eb",
    zIndex: 0,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: width * 0.8,
    paddingTop: 38,
    paddingBottom: 44,
    borderRadius: 24,
    backgroundColor: "#fff",
    marginHorizontal: 18,
    shadowColor: "#2563eb",
    shadowOpacity: 0.10,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
    zIndex: 1,
  },
  title: {
    marginTop: 8,
    color: "#2563eb",
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 0.8,
  },
  text: {
    marginTop: 8,
    color: "#2563eb",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
    letterSpacing: 0.3,
  },
});

export default Loading;