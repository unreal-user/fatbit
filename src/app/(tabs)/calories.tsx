import { useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { db } from '../../db/client';
import { meals as mealsTable } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { useHealthStore } from '../../stores/health-store';
import { MealEntry } from '../../components/MealEntry';
import { CalorieChart } from '../../components/charts/CalorieChart';
import { COLORS, CALORIE_GOAL } from '../../utils/constants';
import { formatDate } from '../../utils/date';

export default function CaloriesScreen() {
  const todayMeals = useHealthStore((s) => s.todayMeals);
  const todayCalories = useHealthStore((s) => s.todayCalories);
  const setTodayMeals = useHealthStore((s) => s.setTodayMeals);
  const addMeal = useHealthStore((s) => s.addMeal);
  const removeMeal = useHealthStore((s) => s.removeMeal);

  const today = formatDate(new Date());

  const loadMeals = useCallback(() => {
    const rows = db.select().from(mealsTable).where(eq(mealsTable.date, today)).all();
    setTodayMeals(
      rows.map((r) => ({
        id: r.id,
        date: r.date,
        name: r.name,
        calories: r.calories,
        notes: r.notes,
        createdAt: r.createdAt,
      })),
    );
  }, [today, setTodayMeals]);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  const handleAddMeal = (meal: { name: string; calories: number; notes: string }) => {
    const now = new Date().toISOString();
    const result = db
      .insert(mealsTable)
      .values({
        date: today,
        name: meal.name,
        calories: meal.calories,
        notes: meal.notes || null,
        createdAt: now,
      })
      .run();

    // Reload from DB to get the generated ID
    loadMeals();
  };

  const handleDeleteMeal = (id: number) => {
    db.delete(mealsTable).where(eq(mealsTable.id, id)).run();
    removeMeal(id);
  };

  // Placeholder weekly data - will be populated from DB
  const weeklyData: Array<{ date: string; calories: number }> = [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryLabel}>Today's Total</Text>
        <Text style={styles.summaryValue}>
          {todayCalories} <Text style={styles.summaryUnit}>/ {CALORIE_GOAL} kcal</Text>
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min((todayCalories / CALORIE_GOAL) * 100, 100)}%` },
            ]}
          />
        </View>
      </View>

      <MealEntry onSubmit={handleAddMeal} />

      <Text style={styles.sectionTitle}>Today's Meals</Text>
      {todayMeals.length > 0 ? (
        todayMeals.map((meal) => (
          <View key={meal.id} style={styles.mealCard}>
            <View style={styles.mealInfo}>
              <Text style={styles.mealName}>{meal.name}</Text>
              {meal.notes ? <Text style={styles.mealNotes}>{meal.notes}</Text> : null}
            </View>
            <View style={styles.mealRight}>
              <Text style={styles.mealCalories}>{meal.calories} kcal</Text>
              <Pressable onPress={() => handleDeleteMeal(meal.id)}>
                <Text style={styles.deleteText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noData}>No meals logged today</Text>
      )}

      <Text style={styles.sectionTitle}>Weekly Overview</Text>
      <CalorieChart data={weeklyData} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16 },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  summaryLabel: { color: COLORS.textSecondary, fontSize: 14 },
  summaryValue: {
    color: COLORS.calories,
    fontSize: 28,
    fontWeight: '700',
    marginVertical: 4,
  },
  summaryUnit: { fontSize: 16, color: COLORS.textSecondary, fontWeight: '400' },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.background,
    borderRadius: 3,
    marginTop: 8,
  },
  progressFill: {
    height: 6,
    backgroundColor: COLORS.calories,
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  mealCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealInfo: { flex: 1 },
  mealName: { color: COLORS.text, fontSize: 16, fontWeight: '600' },
  mealNotes: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  mealRight: { alignItems: 'flex-end' },
  mealCalories: { color: COLORS.calories, fontSize: 16, fontWeight: '700' },
  deleteText: { color: COLORS.secondary, fontSize: 12, marginTop: 4 },
  noData: { color: COLORS.textSecondary, fontSize: 14, marginTop: 8 },
});
