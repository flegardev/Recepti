import { describe, expect, it } from "vitest";

import {
  addMissingIngredients,
  scaleDemoRecipe,
  toggleShoppingItem,
} from "@/features/demo/demo-state";
import { demoIngredients, demoPantry, demoRecipes } from "@/lib/data/demo";
import { matchRecipe, rankRecipes } from "@/lib/domain";

describe("interactive demo state", () => {
  const results = rankRecipes(demoRecipes, demoPantry, {
    ignoreStaples: true,
    stapleIngredients: demoIngredients.filter((item) => item.isStaple),
  });
  const soup = demoRecipes.find((recipe) => recipe.id === "r-soup")!;
  const soupMatch = results.find((result) => result.recipe.id === soup.id)!;

  it("adds missing recipe ingredients without duplicating them", () => {
    const added = addMissingIngredients([], soup, soupMatch);
    const repeated = addMissingIngredients(added, soup, soupMatch);

    expect(added.map((item) => item.ingredientName)).toEqual([
      "Vegetable broth",
      "Carrot",
      "Potato",
    ]);
    expect(repeated).toHaveLength(added.length);
    expect(repeated.every((item) => item.recipeId === soup.id)).toBe(true);
  });

  it("toggles temporary shopping items without mutating the input", () => {
    const original = addMissingIngredients([], soup, soupMatch);
    const toggled = toggleShoppingItem(original, original[0]!.id);

    expect(original[0]!.isCompleted).toBe(false);
    expect(toggled[0]!.isCompleted).toBe(true);
    expect(toggled[0]!.completedAt).not.toBeNull();
  });

  it("matches and lists the selected serving quantities without mutating recipes", () => {
    const pasta = demoRecipes.find(
      (recipe) => recipe.title === "Creamy mushroom pasta",
    )!;
    const pantry = demoPantry.filter(
      (item) => item.ingredient.canonicalName !== "Mushrooms",
    );
    const scaled = scaleDemoRecipe(pasta, 2.5);
    const match = matchRecipe(scaled, pantry, { ignoreStaples: true });
    const added = addMissingIngredients([], pasta, match);
    const mushrooms = added.find(
      (item) => item.ingredientName === "Mushrooms",
    )!;

    expect(mushrooms.quantity).toBe(312.5);
    expect(
      pasta.ingredients.find((item) => item.displayName === "Mushrooms")!
        .quantity,
    ).toBe(250);

    const rescaled = matchRecipe(scaleDemoRecipe(pasta, 3), pantry, {
      ignoreStaples: true,
    });
    const updated = addMissingIngredients(added, pasta, rescaled);
    expect(updated).toHaveLength(added.length);
    expect(
      updated.find((item) => item.ingredientName === "Mushrooms")!.quantity,
    ).toBe(375);
    expect(mushrooms.quantity).toBe(312.5);
  });
});
