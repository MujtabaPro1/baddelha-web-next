'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Briefcase, MapPin, Clock, Search, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import lang from '../../locale';
import {
  fetchCareerDepartments,
  fetchCareerJobs,
  CareerDepartment,
  CareerJob,
} from '../../services/careerService';

const CAREERS_EMAIL = 'info@baddelha.com.sa';

const CareersPage: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const t: any = lang[isAr ? 'ar' : 'en'].careers_page;

  const [departments, setDepartments] = useState<CareerDepartment[]>([]);
  const [jobs, setJobs] = useState<CareerJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<CareerJob | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    fetchCareerDepartments()
      .then((data) => setDepartments((data || []).filter((d) => d.isActive)))
      .catch(() => setDepartments([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setHasError(false);

    fetchCareerJobs(selectedDepartment === 'all' ? undefined : selectedDepartment)
      .then((data) => {
        if (!cancelled) setJobs(data || []);
      })
      .catch(() => {
        if (!cancelled) setHasError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDepartment, reloadKey]);

  const filteredJobs = useMemo(() => {
    if (!searchTerm.trim()) return jobs;
    const q = searchTerm.trim().toLowerCase();
    return jobs.filter((job) => {
      const title = (isAr && job.titleAr ? job.titleAr : job.title) || '';
      const deptName = (isAr && job.department?.nameAr ? job.department.nameAr : job.department?.name) || '';
      const roleName = (isAr && job.role?.nameAr ? job.role.nameAr : job.role?.name) || '';
      return (
        title.toLowerCase().includes(q) ||
        deptName.toLowerCase().includes(q) ||
        roleName.toLowerCase().includes(q)
      );
    });
  }, [jobs, searchTerm, isAr]);

  const getApplyMailto = (job: CareerJob) => {
    const jobTitle = (isAr && job.titleAr ? job.titleAr : job.title) || '';
    const subject = encodeURIComponent(`${isAr ? 'طلب توظيف' : 'Job Application'}: ${jobTitle}`);
    const body = encodeURIComponent(
      isAr
        ? `مرحبًا فريق بدّلها،\n\nأود التقديم على وظيفة "${jobTitle}".\nيرجى الاطلاع على سيرتي الذاتية المرفقة.\n\nشكرًا لكم.`
        : `Hi Baddelha Team,\n\nI would like to apply for the "${jobTitle}" position.\nPlease find my CV attached.\n\nThank you.`
    );
    return `mailto:${CAREERS_EMAIL}?subject=${subject}&body=${body}`;
  };

  const generalCvMailto = `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(
    isAr ? 'سيرة ذاتية - طلب توظيف عام' : 'CV Submission - General Application'
  )}`;

  return (
    <div className="min-h-screen bg-gray-50 pt-20" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#2b2b2e] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 20%, rgba(238,60,72,0.55), transparent 45%), radial-gradient(circle at 85% 0%, rgba(238,60,72,0.35), transparent 40%)',
          }}
        />
        <div className="relative container mx-auto px-4 py-14 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 mb-4">
              <Briefcase className="h-4 w-4" />
              {t.eyebrow}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight">{t.title}</h1>
            <p className="text-lg text-gray-300">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDepartment('all')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                selectedDepartment === 'all'
                  ? 'bg-primaryBtn text-white'
                  : 'bg-white text-gray-700 ring-1 ring-black/10 hover:bg-gray-100'
              }`}
            >
              {t.allDepartments}
            </button>
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  selectedDepartment === dept.id
                    ? 'bg-primaryBtn text-white'
                    : 'bg-white text-gray-700 ring-1 ring-black/10 hover:bg-gray-100'
                }`}
              >
                {isAr && dept.nameAr ? dept.nameAr : dept.name}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 ${isAr ? 'right-3' : 'left-3'}`} />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full rounded-full bg-white ring-1 ring-black/10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primaryBtn ${
                isAr ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4'
              }`}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-2/3 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {hasError && !loading && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm max-w-lg mx-auto">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-4">
              <Briefcase className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{t.errorTitle}</h3>
            <p className="text-gray-500 mb-6">{t.errorDescription}</p>
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="bg-primaryBtn hover:bg-primaryBtn-600 text-white font-medium py-2.5 px-6 rounded-lg transition"
            >
              {t.tryAgain}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !hasError && filteredJobs.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm max-w-lg mx-auto">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
              <Briefcase className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{t.noJobsTitle}</h3>
            <p className="text-gray-500">{t.noJobsDescription}</p>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !hasError && filteredJobs.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {filteredJobs.length} {t.positionsFound}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => {
                const title = (isAr && job.titleAr ? job.titleAr : job.title) || '';
                const deptName = (isAr && job.department?.nameAr ? job.department.nameAr : job.department?.name) || '';
                return (
                  <div
                    key={job.id}
                    className="group bg-white rounded-2xl shadow-sm ring-1 ring-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-lg text-gray-900">{title}</h3>
                      {deptName && (
                        <span className="shrink-0 text-xs font-semibold text-primaryBtn bg-primaryBtn/10 rounded-full px-3 py-1">
                          {deptName}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {job.location || t.remote}
                      </span>
                      {job.employmentType && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {job.employmentType}
                        </span>
                      )}
                    </div>

                    {job.description && (
                      <p className="mt-4 text-gray-600 text-sm line-clamp-3">{job.description}</p>
                    )}

                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="text-sm font-semibold text-gray-700 hover:text-primaryBtn transition"
                      >
                        {t.viewDetails}
                      </button>
                      <a
                        href={getApplyMailto(job)}
                        className="bg-primaryBtn hover:bg-primaryBtn-600 text-white text-sm font-semibold py-2 px-5 rounded-full transition"
                      >
                        {t.applyNow}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Why Join Section */}
        <div className="mt-16">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{t.whyJoinTitle}</h2>
            <p className="mt-2 text-gray-500">{t.whyJoinSubtitle}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(t.perks || []).map((perk: any, i: number) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-6 text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primaryBtn/10 text-primaryBtn mb-4">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{perk.title}</h3>
                <p className="text-gray-500 text-sm leading-6">{perk.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Send CV CTA */}
        <div className="mt-12 rounded-2xl bg-[#2b2b2e] text-white p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className={isAr ? 'text-right' : ''}>
            <h3 className="text-xl font-bold">{t.sendCvTitle}</h3>
            <p className="mt-2 text-gray-300 max-w-xl">{t.sendCvDescription}</p>
            <p className="mt-2 text-sm text-gray-400">
              {t.sendCvEmailLabel}{' '}
              <a href={generalCvMailto} className="text-white underline hover:text-primaryBtn transition">
                {CAREERS_EMAIL}
              </a>
            </p>
          </div>
          <a
            href={generalCvMailto}
            className="shrink-0 bg-primaryBtn hover:bg-primaryBtn-600 text-white font-semibold py-3 px-6 rounded-full transition"
          >
            {t.sendCvButton}
          </a>
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
            dir={isAr ? 'rtl' : 'ltr'}
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold text-gray-900">
                {(isAr && selectedJob.titleAr ? selectedJob.titleAr : selectedJob.title) || ''}
              </h3>
              <button
                onClick={() => setSelectedJob(null)}
                className="shrink-0 text-gray-400 hover:text-gray-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
              {selectedJob.department && (
                <span>
                  <strong className="text-gray-700">{t.department}:</strong>{' '}
                  {isAr && selectedJob.department.nameAr ? selectedJob.department.nameAr : selectedJob.department.name}
                </span>
              )}
              <span>
                <strong className="text-gray-700">{t.location}:</strong> {selectedJob.location || t.remote}
              </span>
              {selectedJob.employmentType && (
                <span>
                  <strong className="text-gray-700">{t.employmentType}:</strong> {selectedJob.employmentType}
                </span>
              )}
            </div>

            {selectedJob.description && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 mb-2">{t.aboutRole}</h4>
                <p className="text-gray-600 text-sm leading-7 whitespace-pre-line">{selectedJob.description}</p>
              </div>
            )}

            <a
              href={getApplyMailto(selectedJob)}
              className="mt-8 block text-center bg-primaryBtn hover:bg-primaryBtn-600 text-white font-semibold py-3 px-6 rounded-full transition"
            >
              {t.applyNow}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersPage;
