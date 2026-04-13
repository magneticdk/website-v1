import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'

export default function ProfileLoading() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title="Din organisationsprofil" />
        
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Back Link Skeleton */}
            <div className="h-5 bg-gray-200 rounded w-40 mb-6 animate-pulse" />

            {/* Profile Completion Skeleton */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-48 mb-2" />
              <div className="w-full h-3 bg-gray-200 rounded" />
            </div>

            {/* Form Sections Skeleton */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 mb-8 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded" />
                  <div className="h-10 bg-gray-200 rounded" />
                  <div className="h-20 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
