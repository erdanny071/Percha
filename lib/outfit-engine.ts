import type {
  Combo,
  Draft,
  Garment,
  GenerateResult,
  OutfitLog,
} from "@/types";
import { COLOR_NAMES } from "@/lib/constants";

const NEUTRAL = ["grey", "black", "white", "brown"];
const SIM: Record<string, string[]> = {
  red: ["orange", "pink"],
  orange: ["red", "brown", "yellow"],
  yellow: ["orange", "green"],
  green: ["blue", "yellow"],
  blue: ["green", "purple"],
  purple: ["blue", "pink"],
  pink: ["red", "purple"],
};

export function daysSinceWorn(log: OutfitLog, id: string): number {
  const dates = Object.keys(log).filter((d) => (log[d] || []).includes(id));
  if (dates.length === 0) return 9999;
  const last = dates.sort().reverse()[0];
  return Math.floor(
    (Date.now() - new Date(last + "T12:00:00").getTime()) /
      (1000 * 60 * 60 * 24),
  );
}

export function colorCompatibilityScore(
  a?: Garment | null,
  b?: Garment | null,
): number {
  if (!a || !b) return 0;
  if (a.colorBucket === b.colorBucket) return 3;
  if (
    NEUTRAL.includes(a.colorBucket as string) ||
    NEUTRAL.includes(b.colorBucket as string)
  )
    return 2;
  if (
    SIM[a.colorBucket as string] &&
    SIM[a.colorBucket as string].includes(b.colorBucket as string)
  )
    return 2;
  return 0;
}

export function findRepeatedDates(log: OutfitLog, ids: string[]): string[] {
  const matches: string[] = [];
  Object.keys(log).forEach((date) => {
    const setIds = log[date] || [];
    if (ids.every((id) => setIds.includes(id))) matches.push(date);
  });
  return matches;
}

export function scoreCombo(
  log: OutfitLog,
  t: Garment,
  b: Garment,
  s: Garment,
  occasion: string,
): number {
  let score =
    colorCompatibilityScore(t, b) * 3 +
    colorCompatibilityScore(b, s) +
    colorCompatibilityScore(t, s);
  if (t.favorite) score += 2.2;
  if (b.favorite) score += 2.2;
  if (s.favorite) score += 1.5;
  score +=
    Math.min(14, daysSinceWorn(log, t.id)) / 14 +
    Math.min(14, daysSinceWorn(log, b.id)) / 14 +
    Math.min(14, daysSinceWorn(log, s.id)) / 14;
  if (t.occasion === occasion) score += 1.2;
  if (b.occasion === occasion) score += 1.2;
  if (s.occasion === occasion) score += 0.8;
  return score;
}

export function pickBestExtra(
  log: OutfitLog,
  list: Garment[],
  refItem: Garment,
  occasion: string,
): Garment | null {
  if (!list || !list.length) return null;
  return list.slice().sort((a, b) => {
    const sa =
      colorCompatibilityScore(refItem, a) +
      (a.favorite ? 1.5 : 0) +
      (a.occasion === occasion ? 0.8 : 0) +
      Math.min(14, daysSinceWorn(log, a.id)) / 14;
    const sb =
      colorCompatibilityScore(refItem, b) +
      (b.favorite ? 1.5 : 0) +
      (b.occasion === occasion ? 0.8 : 0) +
      Math.min(14, daysSinceWorn(log, b.id)) / 14;
    return sb - sa;
  })[0];
}

// ---- razonamiento de estilo ----
function colorRelation(a?: Garment | null, b?: Garment | null): string {
  if (!a || !b) return "contraste";
  if (a.colorBucket === b.colorBucket) return "tonal";
  if (
    NEUTRAL.includes(a.colorBucket as string) ||
    NEUTRAL.includes(b.colorBucket as string)
  )
    return "neutro";
  if (
    SIM[a.colorBucket as string] &&
    SIM[a.colorBucket as string].includes(b.colorBucket as string)
  )
    return "analogo";
  return "contraste";
}

const RELATION_PHRASES: Record<string, string[]> = {
  tonal: [
    "Al ir todo en tonos de {c1}, el conjunto se lee como un total look tonal: estiliza la figura porque no corta la vista con cambios de color.",
    "Mismo tono de arriba a abajo: efecto minimalista y muy cuidado, sin necesidad de forzar accesorios para que se vea intencional.",
  ],
  neutro: [
    "El {neutro} hace de base neutra y deja que el {otro} sea quien lleve el peso visual del look; combinación segura pero con foco claro.",
    "Un neutro como el {neutro} equilibra el conjunto: es el comodín que hace que cualquier prenda encima funcione sin pelearse con nada.",
  ],
  analogo: [
    "El {c1} y el {c2} están cerca en la rueda cromática, así que el conjunto tiene armonía de color sin caer en lo plano de un monocromo.",
    "Combinación análoga ({c1}-{c2}): da sensación de profundidad y de que el color se ha pensado, no de que ha coincidido por casualidad.",
  ],
  contraste: [
    "El contraste entre {c1} y {c2} da más carácter al look: cada prenda se lee por separado en vez de fundirse en un solo bloque de color.",
    "Al no ser colores cercanos, {c1} y {c2} generan un contraste marcado, ideal si buscas que el conjunto destaque un poco más de lo habitual.",
  ],
};

const OCCASION_TIP: Record<string, string> = {
  informal:
    'Para el día a día es una apuesta cómoda que no se ve forzada ni "trabajada de más".',
  salir:
    "Tiene el punto justo de cuidado para salir sin caer en el extremo de ir demasiado arreglado.",
  elegante:
    "La paleta contenida ayuda a que se lea como elegante sin necesidad de recargar con más piezas.",
  noche: "De noche, con luz artificial, esta combinación no se apaga ni se ve deslavada.",
  trabajo:
    "Es una combinación limpia y sin distracciones, del tipo que funciona bien en un entorno de oficina.",
  deporte:
    "Aquí prima la comodidad y la libertad de movimiento por encima de la coordinación exacta de color.",
  evento: "Para un evento se nota cuidado sin llegar a resultar excesivo.",
};

export function generateStyleReasoning(
  combo: Draft | Combo,
  occasion: string,
  seedIdx: number,
): string {
  const t = combo.top;
  const b = combo.bottom;
  const rel = colorRelation(t, b);
  const phrases = RELATION_PHRASES[rel];
  let phrase = phrases[(seedIdx || 0) % phrases.length];
  const c1 = (t && (COLOR_NAMES[t.colorBucket as string] || t.colorBucket)) || "";
  const c2 = (b && (COLOR_NAMES[b.colorBucket as string] || b.colorBucket)) || "";
  const neutroItem =
    t && NEUTRAL.includes(t.colorBucket as string) ? t : b;
  const otroItem = neutroItem === t ? b : t;
  phrase = phrase
    .replaceAll("{c1}", String(c1))
    .replaceAll("{c2}", String(c2))
    .replaceAll(
      "{neutro}",
      String(
        (neutroItem &&
          (COLOR_NAMES[neutroItem.colorBucket as string] ||
            neutroItem.colorBucket)) ||
          "",
      ),
    )
    .replaceAll(
      "{otro}",
      String(
        (otroItem &&
          (COLOR_NAMES[otroItem.colorBucket as string] ||
            otroItem.colorBucket)) ||
          "",
      ),
    );
  let extra = "";
  if (combo.accessory)
    extra += ` El ${combo.accessory.name.toLowerCase()} remata el conjunto sin competir con los colores principales.`;
  if (combo.cap) extra += ` La gorra le da un toque más desenfadado al look.`;
  return `${phrase} ${OCCASION_TIP[occasion] || ""}${extra}`;
}

export function generateAllOutfits(
  garments: Garment[],
  log: OutfitLog,
  occasion: string,
  includeAcc: boolean,
  includeCap: boolean,
): GenerateResult {
  const all = garments.filter((g) => g.status === "disponible");
  const tops = all.filter((g) => g.category === "top");
  const bottoms = all.filter((g) => g.category === "bottom");
  const shoes = all.filter((g) => g.category === "shoes");
  const accessories = all.filter((g) => g.category === "accessory");
  const caps = all.filter((g) => g.category === "cap");
  const missing: string[] = [];
  if (!tops.length) missing.push("parte de arriba");
  if (!bottoms.length) missing.push("parte de abajo");
  if (!shoes.length) missing.push("playeras/calzado");
  if (missing.length) return { error: missing };
  const combos: Combo[] = [];
  for (const t of tops)
    for (const b of bottoms)
      for (const s of shoes) {
        const ids = [t.id, b.id, s.id];
        combos.push({
          top: t,
          bottom: b,
          shoes: s,
          accessory: includeAcc ? pickBestExtra(log, accessories, t, occasion) : null,
          cap: includeCap ? pickBestExtra(log, caps, t, occasion) : null,
          score: scoreCombo(log, t, b, s, occasion),
          repeatedDates: findRepeatedDates(log, ids),
        });
      }
  combos.sort((a, b) => b.score - a.score);
  return { combos, tops, bottoms, shoes, accessories, caps };
}
