import { describe, expect, it } from "vitest";
import { averageRating, isReviewPublic, normalizeReviewStatus, reviewSchema } from "@/lib/reviews";

const validReview = {
  client_name: "Cliente Teste",
  client_role: "Empresa",
  rating: 5,
  comment: "O show foi excelente e o público adorou.",
};

describe("Avaliações de clientes", () => {
  it("aceita nota inteira de 1 a 5 e dados válidos", () => {
    expect(reviewSchema.safeParse(validReview).success).toBe(true);
    expect(reviewSchema.safeParse({ ...validReview, rating: 1 }).success).toBe(true);
  });

  it("recusa nota fora do intervalo ou fracionada", () => {
    expect(reviewSchema.safeParse({ ...validReview, rating: 0 }).success).toBe(false);
    expect(reviewSchema.safeParse({ ...validReview, rating: 6 }).success).toBe(false);
    expect(reviewSchema.safeParse({ ...validReview, rating: 4.5 }).success).toBe(false);
  });

  it("exige nome e comentário com os limites definidos", () => {
    expect(reviewSchema.safeParse({ ...validReview, client_name: "A" }).success).toBe(false);
    expect(reviewSchema.safeParse({ ...validReview, client_name: "A".repeat(81) }).success).toBe(false);
    expect(reviewSchema.safeParse({ ...validReview, comment: "Curto" }).success).toBe(false);
    expect(reviewSchema.safeParse({ ...validReview, comment: "A".repeat(1001) }).success).toBe(false);
  });

  it("somente avaliações aprovadas podem aparecer publicamente", () => {
    expect(isReviewPublic("approved")).toBe(true);
    expect(isReviewPublic("pending")).toBe(false);
    expect(isReviewPublic("rejected")).toBe(false);
    expect(isReviewPublic("qualquer-outro-valor")).toBe(false);
  });

  it("trata estados desconhecidos como pendentes", () => {
    expect(normalizeReviewStatus("invalido")).toBe("pending");
  });

  it("calcula a média das notas publicadas", () => {
    expect(averageRating([5, 4, 3])).toBe(4);
    expect(averageRating([])).toBe(0);
  });
});
