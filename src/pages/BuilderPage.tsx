import { PointerEvent, RefObject, useMemo, useRef, useState } from 'react';
import { builderPieces, initialBuilderLayout } from '../data/builderContent';
import { saveBuilderLayout } from '../lib/builderLayoutStorage';
import type { BuilderCanvasPiece, BuilderPieceShape, BuilderPieceTemplate } from '../types/business';

type DragState = {
  instanceId: string;
};

const arrangementPresets = [
  { id: 'statement', label: 'Statement' },
  { id: 'arc', label: 'Soft arc' },
  { id: 'stack', label: 'Stacked' },
] as const;

type ArrangementPreset = (typeof arrangementPresets)[number]['id'];

function BuilderPage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const [layout, setLayout] = useState<BuilderCanvasPiece[]>(initialBuilderLayout);
  const [selectedId, setSelectedId] = useState(initialBuilderLayout[0]?.instanceId || '');

  const selectedPiece = useMemo(
    () => layout.find((piece) => piece.instanceId === selectedId) || null,
    [layout, selectedId],
  );

  function addPiece(template: BuilderPieceTemplate) {
    const count = layout.filter((piece) => piece.id === template.id).length;
    const nextPiece: BuilderCanvasPiece = {
      ...template,
      instanceId: `${template.id}-${Date.now()}`,
      x: clamp(22 + count * 8, 8, 82),
      y: clamp(38 + count * 6, 14, 74),
      rotation: count % 2 === 0 ? -3 : 3,
      scale: 1,
    };

    setLayout((current) => [...current, nextPiece]);
    setSelectedId(nextPiece.instanceId);
  }

  function removeSelectedPiece() {
    if (!selectedPiece) {
      return;
    }

    setLayout((current) => current.filter((piece) => piece.instanceId !== selectedPiece.instanceId));
    setSelectedId(layout.find((piece) => piece.instanceId !== selectedPiece.instanceId)?.instanceId || '');
  }

  function updateSelectedPiece(updates: Partial<Pick<BuilderCanvasPiece, 'rotation' | 'scale'>>) {
    if (!selectedPiece) {
      return;
    }

    setLayout((current) =>
      current.map((piece) =>
        piece.instanceId === selectedPiece.instanceId ? { ...piece, ...updates } : piece,
      ),
    );
  }

  function handlePiecePointerDown(
    event: PointerEvent<HTMLButtonElement>,
    piece: BuilderCanvasPiece,
  ) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelectedId(piece.instanceId);
    dragStateRef.current = { instanceId: piece.instanceId };
  }

  function handlePiecePointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (!dragStateRef.current || !canvasRef.current) {
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 6, 88);
    const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 10, 76);

    setLayout((current) =>
      current.map((piece) =>
        piece.instanceId === dragStateRef.current?.instanceId ? { ...piece, x, y } : piece,
      ),
    );
  }

  function stopDragging() {
    dragStateRef.current = null;
  }

  function applyArrangement(preset: ArrangementPreset) {
    setLayout((current) =>
      current.map((piece, index) => {
        if (preset === 'arc') {
          const progress = current.length <= 1 ? 0.5 : index / (current.length - 1);
          return {
            ...piece,
            x: 14 + progress * 72,
            y: 52 - Math.sin(progress * Math.PI) * 22,
            rotation: -8 + progress * 16,
          };
        }

        if (preset === 'stack') {
          return {
            ...piece,
            x: 24 + (index % 3) * 22,
            y: 26 + Math.floor(index / 3) * 18,
            rotation: index % 2 === 0 ? -2 : 2,
          };
        }

        return {
          ...piece,
          x: 14 + (index % 4) * 22,
          y: 34 + Math.floor(index / 4) * 20,
          rotation: index % 2 === 0 ? -4 : 4,
        };
      }),
    );
  }

  function resetLayout() {
    setLayout(initialBuilderLayout);
    setSelectedId(initialBuilderLayout[0]?.instanceId || '');
  }

  function useLayoutInBooking() {
    saveBuilderLayout(layout);
    window.location.href = '/booking';
  }

  return (
    <section className="bg-linen">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.36fr_0.64fr] lg:items-start">
        <BuilderSidebar
          layout={layout}
          onAddPiece={addPiece}
          onArrange={applyArrangement}
          onRemoveSelected={removeSelectedPiece}
          onReset={resetLayout}
          onUseLayoutInBooking={useLayoutInBooking}
          onUpdateSelected={updateSelectedPiece}
          selectedPiece={selectedPiece}
        />
        <BuilderCanvas
          canvasRef={canvasRef}
          layout={layout}
          onPointerDown={handlePiecePointerDown}
          onPointerMove={handlePiecePointerMove}
          onPointerUp={stopDragging}
          selectedId={selectedId}
        />
      </div>
    </section>
  );
}

function BuilderSidebar({
  layout,
  onAddPiece,
  onArrange,
  onRemoveSelected,
  onReset,
  onUseLayoutInBooking,
  onUpdateSelected,
  selectedPiece,
}: {
  layout: BuilderCanvasPiece[];
  onAddPiece: (template: BuilderPieceTemplate) => void;
  onArrange: (preset: ArrangementPreset) => void;
  onRemoveSelected: () => void;
  onReset: () => void;
  onUseLayoutInBooking: () => void;
  onUpdateSelected: (updates: Partial<Pick<BuilderCanvasPiece, 'rotation' | 'scale'>>) => void;
  selectedPiece: BuilderCanvasPiece | null;
}) {
  return (
    <aside className="space-y-5">
      <div>
        <p className="text-sm font-semibold uppercase text-lawn">Display builder</p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-forest">
          Sketch a yard setup with sample inventory.
        </h1>
        <p className="mt-4 leading-7 text-ink/68">
          Add pieces, drag them around the yard, try quick arrangements, and send the
          layout into the booking request when the concept feels right.
        </p>
      </div>

      <section className="border border-ink/10 bg-white p-5">
        <h2 className="font-display text-2xl font-semibold text-forest">Sample pieces</h2>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {builderPieces.map((piece) => (
            <button
              key={piece.id}
              className="border border-ink/10 bg-cream px-3 py-3 text-left text-sm font-semibold text-ink transition hover:border-lawn hover:text-lawn"
              onClick={() => onAddPiece(piece)}
              type="button"
            >
              <span className="block">{piece.label}</span>
              <span className="mt-1 block text-xs capitalize text-ink/48">{piece.category}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="border border-ink/10 bg-white p-5">
        <h2 className="font-display text-2xl font-semibold text-forest">Arrange</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {arrangementPresets.map((preset) => (
            <button
              key={preset.id}
              className="border border-ink/12 bg-cream px-3 py-2 text-sm font-semibold text-ink/72 transition hover:border-lawn hover:text-lawn"
              onClick={() => onArrange(preset.id)}
              type="button"
            >
              {preset.label}
            </button>
          ))}
          <button
            className="border border-coral/25 bg-coral/10 px-3 py-2 text-sm font-semibold text-coral transition hover:bg-coral hover:text-white"
            onClick={onReset}
            type="button"
          >
            Reset
          </button>
        </div>
      </section>

      <section className="border border-ink/10 bg-white p-5">
        <h2 className="font-display text-2xl font-semibold text-forest">Selected piece</h2>
        {selectedPiece ? (
          <div className="mt-4 space-y-4">
            <p className="text-sm font-semibold text-lawn">{selectedPiece.label}</p>
            <label className="grid gap-2 text-sm font-semibold text-forest">
              Size
              <input
                max="1.4"
                min="0.7"
                onChange={(event) => onUpdateSelected({ scale: Number(event.target.value) })}
                step="0.05"
                type="range"
                value={selectedPiece.scale}
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-forest">
              Tilt
              <input
                max="18"
                min="-18"
                onChange={(event) => onUpdateSelected({ rotation: Number(event.target.value) })}
                step="1"
                type="range"
                value={selectedPiece.rotation}
              />
            </label>
            <button
              className="w-full border border-ink/12 bg-white px-3 py-2 text-sm font-semibold text-ink/72 transition hover:border-coral hover:text-coral"
              onClick={onRemoveSelected}
              type="button"
            >
              Remove selected
            </button>
          </div>
        ) : (
          <p className="mt-3 text-sm leading-6 text-ink/58">
            Select a piece on the yard to adjust it.
          </p>
        )}
      </section>

      <section className="border border-ink/10 bg-forest p-5 text-white">
        <h2 className="font-display text-2xl font-semibold">Layout summary</h2>
        <p className="mt-3 text-sm leading-6 text-white/68">
          {layout.length} pieces on canvas. Save the current setup to include the layout
          summary with the booking request.
        </p>
        <button
          className="mt-5 w-full bg-butter px-4 py-3 text-sm font-semibold text-forest transition hover:bg-white"
          onClick={onUseLayoutInBooking}
          type="button"
        >
          Use this layout in booking
        </button>
      </section>
    </aside>
  );
}

function BuilderCanvas({
  canvasRef,
  layout,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  selectedId,
}: {
  canvasRef: RefObject<HTMLDivElement | null>;
  layout: BuilderCanvasPiece[];
  onPointerDown: (event: PointerEvent<HTMLButtonElement>, piece: BuilderCanvasPiece) => void;
  onPointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: () => void;
  selectedId: string;
}) {
  return (
    <div className="lg:sticky lg:top-6">
      <div
        ref={canvasRef}
        className="relative min-h-[440px] overflow-hidden border border-ink/10 bg-[#dff4e8] shadow-soft sm:min-h-[560px]"
      >
        <div className="absolute inset-x-0 bottom-0 h-[48%] bg-[#4f9a68]" />
        <div className="absolute inset-x-0 bottom-[44%] h-[9%] bg-[#246b45]" />
        <div className="absolute left-[8%] top-[12%] h-14 w-28 border border-ink/10 bg-white/62" />
        <div className="absolute right-[10%] top-[10%] h-20 w-36 border border-ink/10 bg-white/72" />
        <div className="absolute bottom-[18%] left-[7%] right-[7%] h-px bg-white/40" />

        {layout.map((piece) => (
          <BuilderCanvasPieceView
            key={piece.instanceId}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            piece={piece}
            selected={selectedId === piece.instanceId}
          />
        ))}
      </div>
      <p className="mt-3 text-sm leading-6 text-ink/58">
        Drag pieces inside the yard. This prototype uses sample shapes so the workflow
        can be tested before real inventory artwork is added.
      </p>
    </div>
  );
}

function BuilderCanvasPieceView({
  onPointerDown,
  onPointerMove,
  onPointerUp,
  piece,
  selected,
}: {
  onPointerDown: (event: PointerEvent<HTMLButtonElement>, piece: BuilderCanvasPiece) => void;
  onPointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: () => void;
  piece: BuilderCanvasPiece;
  selected: boolean;
}) {
  return (
    <button
      aria-label={`Move ${piece.label}`}
      className={`absolute touch-none select-none font-display font-semibold shadow-soft transition ${
        selected ? 'ring-4 ring-coral/45' : 'hover:ring-2 hover:ring-white/80'
      } ${getPieceShapeClasses(piece.shape)}`}
      onPointerCancel={onPointerUp}
      onPointerDown={(event) => onPointerDown(event, piece)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        backgroundColor: piece.color,
        color: piece.textColor,
        left: `${piece.x}%`,
        top: `${piece.y}%`,
        transform: `translate(-50%, -50%) rotate(${piece.rotation}deg) scale(${piece.scale})`,
      }}
      type="button"
    >
      {piece.shape === 'star' ? '★' : piece.label}
    </button>
  );
}

function getPieceShapeClasses(shape: BuilderPieceShape) {
  if (shape === 'circle') {
    return 'flex h-20 w-20 items-center justify-center rounded-full text-4xl';
  }

  if (shape === 'star') {
    return 'flex h-16 w-16 items-center justify-center bg-transparent text-5xl shadow-none';
  }

  if (shape === 'stork') {
    return 'flex h-28 w-20 items-center justify-center rounded-t-full px-3 text-sm';
  }

  if (shape === 'cap') {
    return 'flex h-14 w-24 items-center justify-center [clip-path:polygon(50%_0,100%_35%,50%_70%,0_35%)] text-sm';
  }

  return 'min-w-24 px-5 py-4 text-xl';
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export { BuilderPage };
