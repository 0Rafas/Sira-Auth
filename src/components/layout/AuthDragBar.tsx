/**
 * AuthDragBar — invisible drag-region for frameless window on auth pages.
 * Positioned at the top of Login/Register screens.
 */
export default function AuthDragBar() {
  return (
    <div
      className="drag fixed top-0 left-0 right-0 z-50 h-8 flex items-center justify-end px-2"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Window controls */}
      <div style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties} className="flex items-center gap-1">
        <button
          onClick={() => window.electron?.minimize()}
          className="w-3 h-3 rounded-full bg-amber-400/70 hover:bg-amber-400 transition-colors"
          title="Minimize"
        />
        <button
          onClick={() => window.electron?.maximize()}
          className="w-3 h-3 rounded-full bg-emerald-400/70 hover:bg-emerald-400 transition-colors"
          title="Maximize"
        />
        <button
          onClick={() => window.electron?.close()}
          className="w-3 h-3 rounded-full bg-rose-400/70 hover:bg-rose-400 transition-colors"
          title="Close"
        />
      </div>
    </div>
  )
}
