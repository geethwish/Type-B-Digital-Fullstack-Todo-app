import { selectTodosCount } from "@/features/todos/store/todosSelectors";
import { useAppSelector } from "@/hooks/redux";

const Header = () => {
    const counts = useAppSelector(selectTodosCount);
    const progressPct = counts.total ? Math.round((counts.done / counts.total) * 100) : 0;

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-4">
                {/* Brand */}
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600
              flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-lg sm:text-xl">✅</span>
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-base sm:text-xl font-bold text-gray-800 leading-tight">TodoApp</h1>
                        <p className="text-[10px] sm:text-xs text-gray-400 hidden xs:block">Stay organized, stay productive</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    <div className="flex items-center gap-1.5 bg-indigo-50 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2">
                        <span className="text-base sm:text-lg font-bold text-indigo-600 leading-none">{counts.active}</span>
                        <span className="text-[10px] sm:text-xs text-indigo-400 font-medium">Active</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-50 rounded-xl px-3 py-1.5 sm:px-4 sm:py-2">
                        <span className="text-base sm:text-lg font-bold text-emerald-600 leading-none">{counts.done}</span>
                        <span className="text-[10px] sm:text-xs text-emerald-400 font-medium">Done</span>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            {counts.total > 0 && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap tabular-nums">
                            {counts.done}/{counts.total} done
                        </span>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header
