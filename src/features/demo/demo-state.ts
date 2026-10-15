import { scaleQuantity, type RecipeMatchResult } from "@/lib/domain";
import type { Recipe, ShoppingListItem } from "@/types/domain";

export function scaleDemoRecipe(recipe: Recipe, servings: number): Recipe {
  return {
    ...recipe,
    servings,
    ingredients: recipe.ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: scaleQuantity(ingredient.quantity, recipe.servings, servings),
    })),
  };
}

export function addMissingIngredients(
  current: readonly ShoppingListItem[],
  recipe: Recipe,
  match: RecipeMatchResult,
): ShoppingListItem[] {
  const next = [...current];

  for (const missing of match.missingIngredients) {
    const ingredientId = missing.key.startsWith("id:")
      ? missing.key.slice(3)
      : null;
    const existingIndex = next.findIndex(
      (item) =>
        item.recipeId === recipe.id &&
        (ingredientId
          ? item.ingredientId === ingredientId
          : item.ingredientName === missing.name),
    );
    if (existingIndex !== -1) {
      const existing = next[existingIndex]!;
      next[existingIndex] = {
        ...existing,
        quantity: missing.requiredQuantity,
        unit: missing.requiredUnit,
      };
      continue;
    }

    next.push({
      id: `demo-${recipe.id}-${missing.key}`,
      ingredientId,
      ingredientName: missing.name,
      quantity: missing.requiredQuantity,
      unit: missing.requiredUnit,
      recipeId: recipe.id,
      recipeTitle: recipe.title,
      isCompleted: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
    });
  }

  return next;
}

export function toggleShoppingItem(
  items: readonly ShoppingListItem[],
  itemId: string,
): ShoppingListItem[] {
  return items.map((item) =>
    item.id === itemId
      ? {
          ...item,
          isCompleted: !item.isCompleted,
          completedAt: item.isCompleted ? null : new Date().toISOString(),
        }
      : item,
  );
}
