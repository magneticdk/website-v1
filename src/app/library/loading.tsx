import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function LibraryLoading() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Dit bibliotek" />
        
        <main className="flex-1 p-6">
          {/* Search and Filter Skeleton */}
          <div className="mb-6 flex flex-col md:flex-row gap-4 animate-pulse">
            <div className="flex-1 h-10 bg-gray-200 rounded-lg" />
            <div className="w-48 h-10 bg-gray-200 rounded-lg" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="w-20 h-6 bg-gray-200 rounded-full mb-3" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-full mb-1" />
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="flex gap-2">
                  <div className="flex-1 h-10 bg-gray-200 rounded" />
                  <div className="w-10 h-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
