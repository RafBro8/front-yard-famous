import type { PointerEvent, RefObject } from 'react';
import type { BuilderCanvasPiece, BuilderPieceShape } from '../types/business';

type BuilderYardSceneProps = {
  canvasRef?: RefObject<HTMLDivElement | null>;
  compact?: boolean;
  layout: BuilderCanvasPiece[];
  onPointerDown?: (event: PointerEvent<HTMLButtonElement>, piece: BuilderCanvasPiece) => void;
  onPointerMove?: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerUp?: () => void;
  selectedId?: string;
};

function BuilderYardScene({
  canvasRef,
  compact = false,
  layout,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  selectedId = '',
}: BuilderYardSceneProps) {
  const interactive = Boolean(onPointerDown && onPointerMove && onPointerUp);

  return (
    <div
      ref={canvasRef}
      className={`relative min-w-0 overflow-hidden border border-ink/10 bg-[#dff4e8] shadow-soft ${
        compact ? 'min-h-[220px]' : 'min-h-[440px] sm:min-h-[560px]'
      }`}
    >
      <YardBackdrop compact={compact} />
      {layout.map((piece) =>
        interactive && onPointerDown && onPointerMove && onPointerUp ? (
          <button
            key={piece.instanceId}
            aria-label={`Move ${piece.label}`}
            className={`absolute touch-none select-none transition ${
              selectedId === piece.instanceId
                ? 'z-20 ring-4 ring-coral/45'
                : 'z-10 hover:ring-2 hover:ring-white/80'
            }`}
            onPointerCancel={onPointerUp}
            onPointerDown={(event) => onPointerDown(event, piece)}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            style={getPiecePositionStyle(piece)}
            type="button"
          >
            <BuilderPieceArtwork compact={compact} piece={piece} />
          </button>
        ) : (
          <div
            key={piece.instanceId}
            className="absolute z-10"
            style={getPiecePositionStyle(piece)}
          >
            <BuilderPieceArtwork compact={compact} piece={piece} />
          </div>
        ),
      )}
    </div>
  );
}

function YardBackdrop({ compact }: { compact: boolean }) {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-[54%] bg-[#dff4e8]" />
      <div className="absolute inset-x-0 bottom-0 h-[52%] bg-[#4f9a68]" />
      <div className="absolute inset-x-0 bottom-[45%] h-[8%] bg-[#246b45]" />
      <div className="absolute left-[7%] right-[7%] top-[11%] h-[34%] border border-ink/8 bg-white/42" />
      <div className="absolute left-[11%] top-[17%] h-[13%] w-[18%] border border-ink/8 bg-white/45" />
      <div className="absolute right-[12%] top-[15%] h-[16%] w-[22%] border border-ink/8 bg-white/55" />
      <div className="absolute bottom-[15%] left-[8%] right-[8%] h-px bg-white/40" />
      <div className="absolute bottom-[10%] left-[18%] right-[18%] h-px bg-white/20" />
      {!compact ? (
        <>
          <div className="absolute bottom-[31%] left-[10%] h-px w-[18%] bg-white/25" />
          <div className="absolute bottom-[25%] right-[12%] h-px w-[24%] bg-white/25" />
        </>
      ) : null}
    </>
  );
}

function BuilderPieceArtwork({
  compact,
  piece,
}: {
  compact: boolean;
  piece: BuilderCanvasPiece;
}) {
  const sizeClasses = getPieceSizeClasses(piece.shape, compact);
  const faceClasses = getPieceFaceClasses(piece.shape);

  return (
    <span
      className={`relative flex items-center justify-center font-display font-semibold ${sizeClasses}`}
      style={{ color: piece.textColor }}
    >
      {piece.shape !== 'star' ? (
        <span className="absolute bottom-[-32%] left-1/2 h-[38%] w-[5px] -translate-x-1/2 bg-ink/35" />
      ) : null}
      <span
        className={`relative flex h-full w-full items-center justify-center border border-white/45 shadow-soft ${faceClasses}`}
        style={{ backgroundColor: piece.color }}
      >
        <span className="absolute inset-x-[12%] top-[14%] h-px bg-white/35" />
        <span className="relative px-2 text-center leading-none">
          {piece.shape === 'star' ? 'STAR' : piece.label}
        </span>
      </span>
    </span>
  );
}

function getPiecePositionStyle(piece: BuilderCanvasPiece) {
  return {
    left: `${piece.x}%`,
    top: `${piece.y}%`,
    transform: `translate(-50%, -50%) rotate(${piece.rotation}deg) scale(${piece.scale})`,
  };
}

function getPieceFaceClasses(shape: BuilderPieceShape) {
  if (shape === 'circle') {
    return 'rounded-full';
  }

  if (shape === 'star') {
    return '[clip-path:polygon(50%_0,61%_34%,98%_35%,68%_56%,79%_91%,50%_70%,21%_91%,32%_56%,2%_35%,39%_34%)]';
  }

  if (shape === 'stork') {
    return 'rounded-t-full';
  }

  if (shape === 'cap') {
    return '[clip-path:polygon(50%_0,100%_35%,50%_70%,0_35%)]';
  }

  return '';
}

function getPieceSizeClasses(shape: BuilderPieceShape, compact: boolean) {
  if (shape === 'circle') {
    return compact ? 'h-12 w-12 text-xl' : 'h-20 w-20 text-4xl';
  }

  if (shape === 'star') {
    return compact ? 'h-12 w-12 text-[10px]' : 'h-16 w-16 text-xs';
  }

  if (shape === 'stork') {
    return compact ? 'h-16 w-12 text-[10px]' : 'h-28 w-20 text-sm';
  }

  if (shape === 'cap') {
    return compact ? 'h-10 w-16 text-[10px]' : 'h-14 w-24 text-sm';
  }

  return compact ? 'h-9 min-w-16 text-xs' : 'h-14 min-w-24 text-xl';
}

export { BuilderYardScene };
