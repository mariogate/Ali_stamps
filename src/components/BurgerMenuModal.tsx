import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MenuItem {
  label: string;
  onPress: () => void;
}

interface BurgerMenuModalProps {
  visible: boolean;
  onClose: () => void;
  items: MenuItem[];
}

const BurgerMenuModal: React.FC<BurgerMenuModalProps> = ({ visible, onClose, items }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.menuBox}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="#888" />
          </TouchableOpacity>
          {items.map((item, idx) => (
            <View key={item.label}>
              <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={22} color="#888" />
              </TouchableOpacity>
              {idx < items.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBox: {
    width: '85%',
    backgroundColor: '#F7F7F7',
    borderRadius: 28,
    paddingTop: 18,
    paddingBottom: 18,
    paddingHorizontal: 0,
    alignItems: 'stretch',
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 22,
    paddingHorizontal: 28,
    backgroundColor: 'transparent',
  },
  menuLabel: {
    fontSize: 18,
    color: '#222',
    fontWeight: '400',
  },
  divider: {
    height: 1,
    backgroundColor: '#D1D1D1',
    marginHorizontal: 28,
  },
});

export default BurgerMenuModal; 