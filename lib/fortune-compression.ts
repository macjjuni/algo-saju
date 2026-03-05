// region [Privates]
const cleanRawText = (text: string): string => {
  return text
    .split("\n")
    .map(line => line.trim())
    .filter(line => line && !line.includes("──") && !line.includes("══"))
    .join("\n");
};

const compressSajuRaw = (text: string): string => {
  if (!text) return "";
  return cleanRawText(text)
    .replace(/십신/g, "신").replace(/천간/g, "천").replace(/지지/g, "지")
    .replace(/운성/g, "운").replace(/장간/g, "장")
    .replace(/\s{2,}/g, " ");
};

const compressZiweiRaw = (text: string): string => {
  if (!text) return "";
  return cleanRawText(text)
    .replace(/十二宮|四化|大限/g, "")
    .replace(/\s{2,}/g, " ");
};

const compressNatalRaw = (text: string): string => {
  if (!text) return "";
  const zodiacs: Record<string, string> = {
    Sagittarius: "Sag", Capricorn: "Cap", Aquarius: "Aqu", Pisces: "Pis",
    Aries: "Ari", Taurus: "Tau", Gemini: "Gem", Cancer: "Can",
    Leo: "Leo", Virgo: "Vir", Libra: "Lib", Scorpio: "Sco",
  };

  let cleaned = cleanRawText(text);
  Object.entries(zodiacs).forEach(([full, short]) => {
    cleaned = cleaned.replace(new RegExp(full, "g"), short);
  });

  return cleaned.replace(/Major Aspects|Planets|Houses|Angles/g, "")
    .replace(/orb\s+/g, "@")
    .replace(/\s{2,}/g, " ");
};
// endregion

// region [Transactions]
export const getCompressedFortuneText = (saju: string, ziwei: string, natal: string): string => {
  const sajuPart = compressSajuRaw(saju);
  const ziweiPart = compressZiweiRaw(ziwei);
  const natalPart = compressNatalRaw(natal);

  return [
    sajuPart ? `[SAJU]\n${sajuPart}` : "",
    ziweiPart ? `[ZWDS]\n${ziweiPart}` : "",
    natalPart ? `[NATAL]\n${natalPart}` : "",
  ].filter(Boolean).join("\n\n");
};
// endregion
