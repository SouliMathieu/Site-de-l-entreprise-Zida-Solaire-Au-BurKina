// app/loading.tsx
export default function Loading() {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-flex h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500"></div>
          <p className="mt-4 text-sm text-slate-600">Chargement...</p>
        </div>
      </div>
    );
  }
  