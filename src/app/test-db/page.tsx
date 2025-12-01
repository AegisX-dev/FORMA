import { supabase } from "@/lib/supabase";

export default async function TestDbPage() {
  const { data: exercises, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("target_muscle", "Chest");

  if (error) {
    return (
      <div className="min-h-screen bg-void p-8">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
        <p className="text-red-400">{error.message}</p>
        <pre className="mt-4 p-4 bg-card rounded text-sm text-red-300 overflow-auto">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void p-8">
      <h1 className="text-2xl font-bold text-green-500 mb-6">Success</h1>
      <p className="text-gray-400 mb-8">
        Found {exercises?.length || 0} chest exercises
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises?.map((exercise) => (
          <div
            key={exercise.id}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-3">
              {exercise.name}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              {exercise.science_note}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
