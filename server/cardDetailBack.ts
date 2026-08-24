import { getCardBySetAndNumber, getMarvelCardsBySetId } from "./db";

/** Card detail row plus backImageUrl from marvel_cards.back_image_url. */
export async function getCardDetailWithBack(setSlug: string, cardNumber: string) {
  const card = await getCardBySetAndNumber(setSlug, cardNumber);
  if (!card) return undefined;
  const setCards = await getMarvelCardsBySetId(card.setId);
  const full = setCards.find((c) => c.id === card.id);
  return { ...card, backImageUrl: full?.backImageUrl ?? null };
}
