import type { Category, Status } from "@/types";

export const PAGE_SIZE = 40;

export const CAT_LABELS: Record<Category, string> = {
  top: "Parte de arriba",
  bottom: "Parte de abajo",
  dress: "Vestido / mono",
  outerwear: "Abrigo / chaqueta",
  shoes: "Calzado",
  accessory: "Accesorio",
  cap: "Gorras",
};

export const STATUS_ORDER: Status[] = ["disponible", "lavando", "no_quiero"];

export const STATUS_LABELS: Record<Status, string> = {
  disponible: "Disponible",
  lavando: "Lavando",
  no_quiero: "No me la quiero poner",
};

export const MESES = [
  "ENERO",
  "FEBRERO",
  "MARZO",
  "ABRIL",
  "MAYO",
  "JUNIO",
  "JULIO",
  "AGOSTO",
  "SEPTIEMBRE",
  "OCTUBRE",
  "NOVIEMBRE",
  "DICIEMBRE",
];

export const COLOR_NAMES: Record<string, string> = {
  red: "rojo",
  orange: "naranja",
  yellow: "amarillo",
  green: "verde",
  blue: "azul",
  purple: "morado",
  pink: "rosa",
  grey: "gris",
  black: "negro",
  white: "blanco",
  brown: "marrón",
};

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}
