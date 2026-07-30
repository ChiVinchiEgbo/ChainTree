import React from 'react';
import { dataSource } from '@/lib/data';
import { TrackCard } from '@/components/learn/track-card';
import { Search, Filter, BookOpen } from 'lucide-react';

interface CoursesPageProps {
  searchParams: Promise<{ search?: string; level?: string }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams;
  const searchQuery = params.search || '';
  const levelFilter = params.level || 'All';

  const allCourses = await dataSource.getCourses();

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch =
      !searchQuery ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesLevel = levelFilter === 'All' || course.level === levelFilter;

    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-8 py-2">
      {/* Catalog Header */}
      <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            ChainTree Curriculum Catalog
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Web3 & Solana Developer Courses
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            From zero to writing production Anchor smart contracts on Solana. All courses are project-based and offer verifiable on-chain cNFT credentials upon completion.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mt-6 pt-6 border-t border-[#e5e5e5] dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <form action="/courses" method="GET" className="w-full sm:w-80 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-400" />
            <input
              type="text"
              name="search"
              defaultValue={searchQuery}
              placeholder="Search Rust, Anchor, cNFTs..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#f3f3f3] dark:bg-zinc-800 border border-[#e5e5e5] dark:border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-900 dark:text-zinc-100"
            />
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
              <a
                key={lvl}
                href={`/courses?level=${lvl}${searchQuery ? `&search=${searchQuery}` : ''}`}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 ${
                  levelFilter === lvl
                    ? 'bg-emerald-500 text-white font-bold shadow-xs'
                    : 'bg-[#f3f3f3] dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200'
                }`}
              >
                {lvl}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Courses */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-8">
          <BookOpen className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <h3 className="font-bold text-base text-zinc-800 dark:text-zinc-200">No courses found matching your criteria</h3>
          <p className="text-xs text-zinc-500 mt-1">Try resetting your search query or selecting a different level filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <TrackCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
