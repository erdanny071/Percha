"use client";

import type { Garment } from "@/types";
import { CAT_LABELS, STATUS_LABELS } from "@/lib/constants";
import { StarIcon, EditIcon, TrashIcon } from "@/components/icons";
import type { Category, Status } from "@/types";

export function GarmentCard({
  g,
  selectMode,
  selected,
  onToggleSelect,
  onFav,
  onEdit,
  onDelete,
  onCycle,
}: {
  g: Garment;
  selectMode: boolean;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onFav: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCycle: (id: string) => void;
}) {
  return (
    <div className="tag-card" data-id={g.id}>
      {selectMode ? (
        <input
          type="checkbox"
          className="sel"
          checked={selected}
          onChange={() => onToggleSelect(g.id)}
        />
      ) : null}
      <div className="icon-top-right">
        <button
          className={`fav-btn ${g.favorite ? "active" : ""}`}
          title="Favorito"
          onClick={() => onFav(g.id)}
        >
          <StarIcon filled={!!g.favorite} />
        </button>
        <button className="edit-btn" title="Editar" onClick={() => onEdit(g.id)}>
          <EditIcon />
        </button>
        <button
          className="delete-btn"
          title="Eliminar"
          onClick={() => onDelete(g.id)}
        >
          <TrashIcon />
        </button>
      </div>
      <div className="tag-hole" />
      <div className="garment-img-wrap">
        <img src={g.image || "/placeholder.svg"} alt={g.name} loading="lazy" />
      </div>
      <div className="garment-name">{g.name}</div>
      <div className="garment-cat">
        {CAT_LABELS[g.category as Category] || g.category}
        {g.favorite ? " · ★" : ""}
      </div>
      {g.occasion ? <div className="occasion-badge">{g.occasion}</div> : null}
      <button
        className={`status-btn status-${g.status}`}
        onClick={() => onCycle(g.id)}
      >
        {STATUS_LABELS[g.status as Status]}
      </button>
    </div>
  );
}
