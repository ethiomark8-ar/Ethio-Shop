import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export const SplashScreen = () => {
  const { user, initialized } = useAuthStore();
  const navigation = useNavigation<any>();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }),
    ]).start();

    const timer = setTimeout(() => {
      if (initialized) {
        if (user) {
          navigation.replace('MainTabs');
        } else {
          navigation.replace('Auth');
        }
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [initialized, user]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoTextContainer}>
          <Text style={styles.ethio}>Ethio</Text>
          <Text style={styles.shop}>Shop</Text>
        </View>
        <View style={styles.glow} />
      </Animated.View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]}>
            <LinearGradient
              colors={['#2E2A72', '#4C6FFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

import { Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTextContainer: {
    flexDirection: 'row',
  },
  ethio: {
    fontSize: 48,
    fontWeight: '900',
    color: '#00FFFF',
    textShadowColor: 'rgba(0, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  shop: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FF69B4',
    textShadowColor: 'rgba(255, 105, 180, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.secondary,
    opacity: 0.1,
    zIndex: -1,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 80,
    width: '60%',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressFill: {
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
});
