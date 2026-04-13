import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Dashboard" />
        
        <main className="flex-1 p-6 space-y-8">
          {/* Welcome Header Skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-2" />
            <div className="h-6 bg-gray-200 rounded w-48" />
          </div>

          {/* Tools Grid Skeleton */}
          <div>
            <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mb-3" />
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-full mb-4" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Recent Outputs Skeleton */}
          <div>
            <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
            <div className="bg-white rounded-lg shadow-sm p-8 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-48" />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
