import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PriceInputModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (price: number) => Promise<void>;
  productName: string;
  quantity: number;
  unit: string;
  loading?: boolean;
}

export default function PriceInputModal({
  visible,
  onClose,
  onConfirm,
  productName,
  quantity,
  unit,
  loading = false,
}: PriceInputModalProps) {
  const [price, setPrice] = useState('');
  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    const priceValue = parseFloat(price.replace(',', '.'));
    
    if (isNaN(priceValue) || priceValue < 0) {
      return;
    }

    try {
      setSaving(true);
      await onConfirm(priceValue);
      setPrice('');
      onClose();
    } catch (error) {
      console.error('Erro ao salvar preço:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = async () => {
    try {
      setSaving(true);
      await onConfirm(0); // Preço zero indica que foi pulado
      setPrice('');
      onClose();
    } catch (error) {
      console.error('Erro ao marcar item:', error);
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (text: string) => {
    // Remove caracteres não numéricos exceto vírgula e ponto
    const cleaned = text.replace(/[^0-9.,]/g, '');
    setPrice(cleaned);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Adicionar Preço</Text>
            <TouchableOpacity onPress={onClose} disabled={saving}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.productInfo}>
            <Text style={styles.productName}>{productName}</Text>
            <Text style={styles.productDetails}>
              {quantity} {unit}
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Preço pago (opcional)</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>R$</Text>
              <TextInput
                style={styles.priceInput}
                placeholder="0,00"
                value={price}
                onChangeText={formatPrice}
                keyboardType="decimal-pad"
                autoFocus
                editable={!saving}
              />
            </View>
            <Text style={styles.inputHint}>
              Deixe em branco se não quiser informar o preço
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.skipButton, saving && styles.buttonDisabled]}
              onPress={handleSkip}
              disabled={saving}
            >
              <Text style={styles.skipButtonText}>Pular</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton, saving && styles.buttonDisabled]}
              onPress={handleConfirm}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={20} color="#fff" />
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  productInfo: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productDetails: {
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginRight: 8,
  },
  priceInput: {
    flex: 1,
    fontSize: 18,
    padding: 16,
    color: '#333',
  },
  inputHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skipButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});