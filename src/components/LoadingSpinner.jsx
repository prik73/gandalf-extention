export default function LoadingSpinner() {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm fade-in">
            <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">
                ANALYZING PATTERNS...
            </p>
        </div>
    );
}
