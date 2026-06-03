"use client";

import { Minus, Plus } from "lucide-react";

/**
 * QuantitySelector — Selector de cantidad reutilizable.
 * @param {number} value - Cantidad actual
 * @param {function} onChange - Callback cuando cambia la cantidad
 * @param {number} min - Valor mínimo permitido (default: 1)
 * @param {number} max - Valor máximo permitido (default: stock)
 * @param {function} [onDecrease] - Callback personalizado al disminuir
 * @param {function} [onIncrease] - Callback personalizado al aumentar
 * @param {boolean} [disabled] - Deshabilita los controles
 */
export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  onDecrease,
  onIncrease,
  disabled = false,
}) {
  const canDecrease = value > min && !disabled;
  const canIncrease = value < max && !disabled;

  const handleDecrease = () => {
    if (!canDecrease) return;
    if (onDecrease) {
      onDecrease();
      return;
    }
    onChange(value - 1);
  };

  const handleIncrease = () => {
    if (!canIncrease) return;
    if (onIncrease) {
      onIncrease();
      return;
    }
    onChange(value + 1);
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={handleDecrease}
        disabled={!canDecrease}
        aria-label="Disminuir cantidad"
        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        <Minus size={14} />
      </button>

      <span className="w-10 text-center font-semibold text-gray-800 text-sm select-none">
        {value}
      </span>

      <button
        type="button"
        onClick={handleIncrease}
        disabled={!canIncrease}
        aria-label="Aumentar cantidad"
        className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
