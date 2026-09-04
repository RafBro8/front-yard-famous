import { type PointerEvent, type RefObject, useMemo, useRef, useState } from 'react';
import { BuilderYardScene } from '../components/BuilderYardScene';
import { builderPieceFilters, builderPieces, initialBuilderLayout } from '../data/builderContent';
import { downloadBuilderPreview } from '../lib/builderPreviewExport';
import { buildBuilderLayoutSummary, saveBuilderLayout } from '../lib/builderLayoutStorage';
import type { BuilderCanvasPiece, BuilderPieceCategory, BuilderPieceTemplate } from '../types/business';

type DragState = {
  instanceId: string;
};

const arrangementPresets = [
  { id: 'statement', label: 'Statement' },
  { id: 'arc', label: 'Soft arc' },
  { id: 'stack', label: 'Stacked' },
] as const;

type ArrangementPreset = (typeof arrangementPresets)[number]['id'];
type BuilderFilter = (typeof builderPieceFilters)[number]['id'];

function BuilderPage() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const [layout, setLayout] = useState<BuilderCanvasPiece[]>(initialBuilderLayout);
  const [selectedId, setSelectedId] = useState(initialBuilderLayout[0]?.instanceId || '');
  const [activeFilter, setActiveFilter] = useState<BuilderFilter>('all');
  const [exportMessage, setExportMessage] = useState('');

  const selectedPiece = useMemo(
    () => layout.find((piece) => piece.instanceId === selectedId) || null,
    [layout, selectedId],
  );
  const filteredPieces = useMemo(
    () =>
      activeFilter === 'all'
        ? builderPieces
        : builderPieces.filter((piece) => piece.category === activeFilter),
    [activeFilter],
  );
  const layoutSummary = useMemo(() => buildBuilderLayoutSummary(layout), [layout]);

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
    setExportMessage('');
  }

  function removeSelectedPiece() {
    if (!selectedPiece) {
      return;
    }

    setLayout((current) => current.filter((piece) => piece.instanceId !== selectedPiece.instanceId));
    setSelectedId(layout.find((piece) => piece.instanceId !== selectedPiece.instanceId)?.instanceId || '');
    setExportMessage('');
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
    setExportMessage('');
  }

  function handlePiecePointerDown(
    event: PointerEvent<HTMLButtonElement>,
    piece: BuilderCanvasPiece,
  ) {
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelectedId(piece.instanceId);
    dragStateRef.current = { instanceId: piece.instanceId };
    setExportMessage('');
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
    setExportMessage('');
  }

  function resetLayout() {
    setLayout(initialBuilderLayout);
    setSelectedId(initialBuilderLayout[0]?.instanceId || '');
    setExportMessage('');
  }

  function useLayoutInBooking() {
    saveBuilderLayout(layout);
    window.location.href = '/booking';
  }

  function exportPreview() {
    downloadBuilderPreview(layout);
    setExportMessage('Preview SVG downloaded.');
  }

  return (
    <section className="bg-linen">
      <div className="mx-auto grid min-w-0 max-w-6xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[0.36fr_0.64fr] lg:items-start lg:py-12">
        <BuilderSidebar
          activeFilter={activeFilter}
          exportMessage={exportMessage}
          filteredPieces={filteredPieces}
          layout={layout}
          layoutSummary={layoutSummary}
          onAddPiece={addPiece}
          onArrange={applyArrangement}
          onExportPreview={exportPreview}
          onFilterChange={setActiveFilter}
          onRemoveSelected={removeSelectedPiece}
          onReset={resetLayout}
          onUseLayoutInBooking={useLayoutInBooking}
          onUpdateSelected={updateSelectedPiece}
          selectedPiece={selectedPiece}
        />
        <BuilderCanvas
          canvasRef={canvasRef}
          layout={layout}
          layoutSummary={layoutSummary}
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
  activeFilter,
  exportMessage,
  filteredPieces,
  layout,
  layoutSummary,
  onAddPiece,
  onArrange,
  onExportPreview,
  onFilterChange,
  onRemoveSelected,
  onReset,
  onUseLayoutInBooking,
  onUpdateSelected,
  selectedPiece,
}: {
  activeFilter: BuilderFilter;
  exportMessage: string;
  filteredPieces: BuilderPieceTemplate[];
  layout: BuilderCanvasPiece[];
  layoutSummary: string;
  onAddPiece: (template: BuilderPieceTemplate) => void;
  onArrange: (preset: ArrangementPreset) => void;
  onExportPreview: () => void;
  onFilterChange: (filter: BuilderFilter) => void;
  onRemoveSelected: () => void;
  onReset: () => void;
  onUseLayoutInBooking: () => void;
  onUpdateSelected: (updates: Partial<Pick<BuilderCanvasPiece, 'rotation' | 'scale'>>) => void;
  selectedPiece: BuilderCanvasPiece | null;
}) {
  return (
    <aside className="min-w-0 space-y-5 lg:sticky lg:top-6">
      <div>
        <p className="text-sm font-semibold uppercase text-lawn">Display builder</p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-forest">
          Design a yard setup customers can actually send.
        </h1>
        <p className="mt-4 leading-7 text-ink/68">
          Arrange sample signs, preview the setup, export a shareable SVG, or attach
          the concept to a booking request for admin review.
        </p>
      </div>

      <section className="border border-ink/10 bg-white p-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <h2 className="font-display text-2xl font-semibold text-forest">Inventory pieces</h2>
            <p className="mt-1 text-sm text-ink/52">{filteredPieces.length} available samples</p>
          </div>
          <span className="bg-cream px-3 py-1 text-xs font-semibold text-lawn">
            {layout.length} placed
          </span>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {builderPieceFilters.map((filter) => (
            <button
              key={filter.id}
              className={`shrink-0 border px-3 py-2 text-sm font-semibold transition ${
                activeFilter === filter.id
                  ? 'border-lawn bg-mint text-lawn'
                  : 'border-ink/10 bg-cream text-ink/62 hover:border-lawn hover:text-lawn'
              }`}
              onClick={() => onFilterChange(filter.id)}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {filteredPieces.map((piece) => (
            <button
              key={piece.id}
              className="border border-ink/10 bg-cream px-3 py-3 text-left text-sm font-semibold text-ink transition hover:border-lawn hover:text-lawn"
              onClick={() => onAddPiece(piece)}
              type="button"
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-3 w-3 border border-ink/10"
                  style={{ backgroundColor: piece.color }}
                />
                <span className="block">{piece.label}</span>
              </span>
              <span className="mt-1 block text-xs capitalize text-ink/48">
                {formatCategory(piece.category)}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="border border-ink/10 bg-white p-5">
        <h2 className="font-display text-2xl font-semibold text-forest">Arrange</h2>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
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
        <p className="mt-3 text-sm leading-6 text-white/70">{layoutSummary}</p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <button
            className="bg-butter px-4 py-3 text-sm font-semibold text-forest transition hover:bg-white"
            onClick={onUseLayoutInBooking}
            type="button"
          >
            Use this layout in booking
          </button>
          <button
            className="border border-white/18 bg-white/8 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-forest"
            onClick={onExportPreview}
            type="button"
          >
            Download preview SVG
          </button>
        </div>
        {exportMessage ? (
          <p className="mt-3 text-sm font-semibold text-butter">{exportMessage}</p>
        ) : null}
      </section>
    </aside>
  );
}

function BuilderCanvas({
  canvasRef,
  layout,
  layoutSummary,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  selectedId,
}: {
  canvasRef: RefObject<HTMLDivElement | null>;
  layout: BuilderCanvasPiece[];
  layoutSummary: string;
  onPointerDown: (event: PointerEvent<HTMLButtonElement>, piece: BuilderCanvasPiece) => void;
  onPointerMove: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp: () => void;
  selectedId: string;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-4 grid gap-3 border border-ink/10 bg-white p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <p className="text-sm leading-6 text-ink/62">{layoutSummary}</p>
        <span className="text-sm font-semibold text-lawn">Drag pieces on the yard</span>
      </div>
      <BuilderYardScene
        canvasRef={canvasRef}
        layout={layout}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        selectedId={selectedId}
      />
      <p className="mt-3 text-sm leading-6 text-ink/58">
        This is still sample artwork, but the saved layout now behaves like real product
        data for booking and admin review.
      </p>
    </div>
  );
}

function formatCategory(category: BuilderPieceCategory) {
  if (category === 'letter') {
    return 'message';
  }

  return category;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export { BuilderPage };
