import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, SafeAreaView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Gagal', 'Silakan masukkan username dan password.');
      return;
    }

    // Check if it's admin or general user
    const role = username.toLowerCase() === 'admin' ? 'admin' : 'user';
    login(username, role);

    // Route to appropriate view
    if (role === 'admin') {
      router.replace('/(admin)');
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.headerContainer}>
          <View style={styles.logoBadge}>
            <Ionicons name="home" size={32} color="#007AFF" />
          </View>
          <Text style={styles.title}>Selamat Datang 👏</Text>
          <Text style={styles.subtitle}>Masuk untuk mencari kost impianmu di SmartKost.</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={20} color="#a4b0be" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="#a4b0be"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#a4b0be"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Password (5 angka)"
              value={password}
              onChangeText={(text) => {
                // ambil hanya angka
                const numericText = text.replace(/[^0-9]/g, '');

                // batasi hanya 5 digit
                if (numericText.length <= 5) {
                  setPassword(numericText);
                }
              }}
              keyboardType="numeric"   // hanya tampil keyboard angka
              maxLength={5}            // maksimal 5 digit
              secureTextEntry
              placeholderTextColor="#a4b0be"
            />
          </View>
          <Pressable style={styles.forgotPassword}>
            <Text style={styles.forgotText}>Lupa Password?</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.loginButton,
              (!username || !password) && styles.loginButtonDisabled,
              pressed && styles.loginButtonPressed
            ]}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Masuk Ke Akun</Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" style={{ marginLeft: 8 }} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F9FF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 40,
  },
  logoBadge: {
    width: 64,
    height: 64,
    backgroundColor: '#E8F4FD',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1D23',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8A95A5',
    lineHeight: 24,
    fontWeight: '500',
  },
  formContainer: {
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,122,255,0.05)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 60,
    fontSize: 16,
    color: '#1A1D23',
    fontWeight: '500',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 16,
  },
  forgotText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#a4b0be',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  loginButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
});
