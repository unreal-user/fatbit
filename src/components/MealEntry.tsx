import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { COLORS } from '../utils/constants';

interface Props {
  onSubmit: (meal: { name: string; calories: number; notes: string }) => void;
}

export function MealEntry({ onSubmit }: Props) {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    const cal = parseInt(calories, 10);
    if (!name.trim() || isNaN(cal) || cal <= 0) return;

    onSubmit({ name: name.trim(), calories: cal, notes: notes.trim() });
    setName('');
    setCalories('');
    setNotes('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Meal</Text>
      <TextInput
        style={styles.input}
        placeholder="Meal name"
        placeholderTextColor={COLORS.textSecondary}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Calories"
        placeholderTextColor={COLORS.textSecondary}
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
      />
      <TextInput
        style={[styles.input, styles.notesInput]}
        placeholder="Notes (optional)"
        placeholderTextColor={COLORS.textSecondary}
        value={notes}
        onChangeText={setNotes}
        multiline
      />
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Add</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 8,
  },
  notesInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '700',
  },
});
