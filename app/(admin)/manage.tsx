import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Pressable, Modal, TextInput, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useKostData } from '../../hooks/useKostData';

export default function ManageKostScreen() {
  const { kostList, updateKost } = useKostData();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedKost, setSelectedKost] = useState<string | null>(null);

  // Edit form state
  const [editPrice, setEditPrice] = useState('');
  const [editAvailableRooms, setEditAvailableRooms] = useState('');
  const [editTotalRooms, setEditTotalRooms] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const openEdit = (id: string) => {
    const kos = kostList.find(k => k.id === id);
    if (!kos) return;
    setSelectedKost(id);
    setEditPrice(kos.price);
    setEditAvailableRooms((kos.availableRooms ?? 0).toString());
    setEditTotalRooms((kos.totalRooms ?? 0).toString());
    setEditDescription(kos.description ?? '');
    setEditModalVisible(true);
  };

  const handleSave = () => {
    if (!selectedKost) return;
    updateKost(selectedKost, {
      price: editPrice,
      availableRooms: parseInt(editAvailableRooms) || 0,
      totalRooms: parseInt(editTotalRooms) || 0,
      description: editDescription,
    });
    setEditModalVisible(false);
    Alert.alert('Berhasil', 'Data kost berhasil diperbarui!');
  };

  const handleUpdateRoom = (id: string, change: number) => {
    const kos = kostList.find(k => k.id === id);
    if (!kos) return;
    const current = kos.availableRooms ?? 0;
    const total = kos.totalRooms ?? 0;
    const newVal = Math.max(0, Math.min(total, current + change));
    updateKost(id, { availableRooms: newVal });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kelola Kost</Text>
        <Text style={styles.headerSubtitle}>{kostList.length} properti terdaftar</Text>
      </View>

      <FlatList
        data={kostList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const available = item.availableRooms ?? 0;
          const total = item.totalRooms ?? 0;
          const occupied = total - available;
          const occupancyPercent = total > 0 ? Math.round((occupied / total) * 100) : 0;

          return (
            <View style={styles.kostCard}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={[styles.typeIndicator, {
                  backgroundColor: item.type === 'Putri' ? '#ff6b81' : item.type === 'Putra' ? '#1e90ff' : '#ffa502'
                }]}>
                  <Text style={styles.typeText}>{item.type}</Text>
                </View>
                <Pressable style={styles.editButton} onPress={() => openEdit(item.id)}>
                  <Ionicons name="create-outline" size={18} color="#1e90ff" />
                  <Text style={styles.editButtonText}>Edit</Text>
                </Pressable>
              </View>

              {/* Kost Info */}
              <Text style={styles.kostTitle}>{item.title}</Text>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={14} color="#747d8c" />
                <Text style={styles.kostLocation} numberOfLines={1}>{item.location}</Text>
              </View>
              <Text style={styles.kostPrice}>{item.price}<Text style={styles.priceSuffix}> /bln</Text></Text>

              {/* Room Status */}
              <View style={styles.roomSection}>
                <View style={styles.roomInfo}>
                  <Text style={styles.roomLabel}>Kamar Kosong</Text>
                  <View style={styles.roomCounter}>
                    <Pressable style={styles.counterButton} onPress={() => handleUpdateRoom(item.id, -1)}>
                      <Ionicons name="remove" size={18} color="#ff4757" />
                    </Pressable>
                    <Text style={styles.roomCount}>{available}</Text>
                    <Pressable style={styles.counterButton} onPress={() => handleUpdateRoom(item.id, 1)}>
                      <Ionicons name="add" size={18} color="#2ed573" />
                    </Pressable>
                  </View>
                </View>
                <View style={styles.roomInfo}>
                  <Text style={styles.roomLabel}>Total Kamar</Text>
                  <Text style={styles.totalRoomCount}>{total}</Text>
                </View>
                <View style={styles.roomInfo}>
                  <Text style={styles.roomLabel}>Hunian</Text>
                  <Text style={[styles.occupancyText, { color: occupancyPercent > 80 ? '#2ed573' : occupancyPercent > 50 ? '#ffa502' : '#ff4757' }]}>
                    {occupancyPercent}%
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, {
                  width: `${occupancyPercent}%`,
                  backgroundColor: occupancyPercent > 80 ? '#2ed573' : occupancyPercent > 50 ? '#ffa502' : '#ff4757',
                }]} />
              </View>
            </View>
          );
        }}
      />

      {/* Edit Modal */}
      <Modal visible={editModalVisible} animationType="slide" transparent onRequestClose={() => setEditModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Data Kost</Text>
              <Pressable onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#2f3542" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.fieldLabel}>Harga per Bulan</Text>
              <TextInput style={styles.fieldInput} value={editPrice} onChangeText={setEditPrice} placeholder="Rp 1.000.000" placeholderTextColor="#a4b0be" />

              <Text style={styles.fieldLabel}>Total Kamar</Text>
              <TextInput style={styles.fieldInput} value={editTotalRooms} onChangeText={setEditTotalRooms} keyboardType="numeric" placeholder="10" placeholderTextColor="#a4b0be" />

              <Text style={styles.fieldLabel}>Kamar Kosong</Text>
              <TextInput style={styles.fieldInput} value={editAvailableRooms} onChangeText={setEditAvailableRooms} keyboardType="numeric" placeholder="3" placeholderTextColor="#a4b0be" />

              <Text style={styles.fieldLabel}>Deskripsi</Text>
              <TextInput style={[styles.fieldInput, styles.textArea]} value={editDescription} onChangeText={setEditDescription} multiline numberOfLines={4} placeholder="Deskripsi kost..." placeholderTextColor="#a4b0be" textAlignVertical="top" />

              <View style={styles.modalFooter}>
                <Pressable style={styles.cancelButton} onPress={() => setEditModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Batal</Text>
                </Pressable>
                <Pressable style={styles.saveButton} onPress={handleSave}>
                  <Ionicons name="checkmark" size={20} color="#ffffff" />
                  <Text style={styles.saveButtonText}>Simpan</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f1f6f9',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2f3542',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#747d8c',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  kostCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  typeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f2ff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  editButtonText: {
    color: '#1e90ff',
    fontSize: 13,
    fontWeight: '700',
  },
  kostTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2f3542',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  kostLocation: {
    fontSize: 13,
    color: '#747d8c',
    flex: 1,
  },
  kostPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e90ff',
    marginBottom: 16,
  },
  priceSuffix: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a4b0be',
  },
  roomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  roomInfo: {
    alignItems: 'center',
  },
  roomLabel: {
    fontSize: 11,
    color: '#a4b0be',
    fontWeight: '600',
    marginBottom: 4,
  },
  roomCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  counterButton: {
    width: 30,
    height: 30,
    backgroundColor: '#f1f6f9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomCount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2f3542',
    minWidth: 30,
    textAlign: 'center',
  },
  totalRoomCount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2f3542',
  },
  occupancyText: {
    fontSize: 22,
    fontWeight: '800',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#f1f2f6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2f3542',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2f3542',
    marginBottom: 8,
    marginTop: 12,
  },
  fieldInput: {
    backgroundColor: '#f1f6f9',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2f3542',
    borderWidth: 1,
    borderColor: '#e6eaef',
  },
  textArea: {
    minHeight: 100,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    paddingBottom: 20,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#dfe4ea',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#747d8c',
    fontSize: 16,
    fontWeight: '700',
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#ff6348',
    paddingVertical: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#ff6348',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
