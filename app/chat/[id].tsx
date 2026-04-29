import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useKostData } from '../../hooks/useKostData';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'owner';
  timestamp: string;
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getKostById, kostList } = useKostData();
  const kos = getKostById(id);
  const flatListRef = useRef<FlatList>(null);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Halo, ada yang bisa dibantu mengenai ${kos?.title || 'kost ini'}?`,
      sender: 'owner',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userText = inputText.trim();

    const newMessage: Message = {
      id: Date.now().toString(),
      text: userText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsLoading(true);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    
    const API_URL = "http://10.0.2.2:3000/chat";
    console.log("Sending message to:", API_URL);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
          kostList: kostList
        }),
      });

      const data = await response.json();

      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "Maaf, terjadi kesalahan.",
        sender: 'owner',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, replyMessage]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    } catch (error) {
      console.error("AI Error Details:", {
        message: error.message,
        stack: error.stack,
        url: "http://10.0.2.2:3000/chat"
      });

      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: "Tidak dapat terhubung ke server AI 😢",
        sender: 'owner',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, errorMessage]);

    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.ownerBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.ownerMessageText]}>
          {item.text}
        </Text>
        <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.ownerTimestamp]}>
          {item.timestamp}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#2f3542" />
          </Pressable>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Pemilik: {kos?.title}</Text>
            <Text style={styles.headerSubtitle}>Online</Text>
          </View>
        </View>

        {/* CHAT LIST */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatList}
          ListFooterComponent={
            isLoading ? (
              <View style={[styles.messageBubble, styles.ownerBubble, styles.loadingBubble]}>
                <ActivityIndicator size="small" color="#1e90ff" />
              </View>
            ) : null
          }
        />

        {/* INPUT */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ketik pesan..."
            placeholderTextColor="#a4b0be"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <Pressable
            style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Ionicons name="send" size={20} color="#ffffff" />
            )}
          </Pressable>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1, backgroundColor: '#f1f6f9' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },

  backButton: { marginRight: 16 },

  headerInfo: { flex: 1 },

  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2f3542',
  },

  headerSubtitle: {
    fontSize: 13,
    color: '#2ed573',
  },

  chatList: {
    padding: 16,
  },

  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },

  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#1e90ff',
  },

  ownerBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
  },

  loadingBubble: {
    width: 60,
    alignItems: 'center',
  },

  messageText: {
    fontSize: 15,
  },

  userMessageText: { color: '#ffffff' },
  ownerMessageText: { color: '#2f3542' },

  timestamp: {
    fontSize: 11,
    marginTop: 4,
    alignSelf: 'flex-end',
  },

  userTimestamp: { color: 'rgba(255,255,255,0.7)' },
  ownerTimestamp: { color: '#a4b0be' },

  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#ffffff',
  },

  input: {
    flex: 1,
    backgroundColor: '#f1f6f9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  sendButton: {
    width: 44,
    height: 44,
    backgroundColor: '#1e90ff',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  sendButtonDisabled: {
    backgroundColor: '#a4b0be',
  },
});