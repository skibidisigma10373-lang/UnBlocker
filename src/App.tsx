/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Lock,
  ShieldAlert,
  X,
} from 'lucide-react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';

const TARGET_URL = 'https://duckmath.org/';
const UNBLOCK_PHRASE = 'unblocked';
const LOGO_SRC = '/assets/aistudio/image_c045ef_81ebd2c2.jpg';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [notification, setNotification] = useState<{
    id: number;
    message: string;
    reasonPreview: string;
  } | null>(null);
  const [logoError, setLogoError] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const requestButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isModalOpen) {
      const timer = window.setTimeout(() => {
        textareaRef.current?.focus();
      }, 30);
      return () => window.clearTimeout(timer);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  useEffect(() => {
    if (!notification) return;
    const timer = window.setTimeout(() => {
      setNotification(null);
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [notification]);

  const openModal = () => {
    setValidationError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setValidationError('');
    window.setTimeout(() => {
      requestButtonRef.current?.focus();
    }, 30);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = reason.trim();

    if (!trimmed) {
      setValidationError('Please enter a description or reason for your request.');
      textareaRef.current?.focus();
      return;
    }

    if (trimmed === UNBLOCK_PHRASE) {
      setIsModalOpen(false);
      setReason('');
      setValidationError('');
      setNotification(null);
      setIsUnlocked(true);
      return;
    }

    setIsModalOpen(false);
    setNotification({
      id: Date.now(),
      message: 'Your access request has been submitted for administrator review.',
      reasonPreview: trimmed,
    });
    setReason('');
    setValidationError('');
  };

  const handleLockSession = () => {
    setIsUnlocked(false);
    setNotification(null);
  };

  if (isUnlocked) {
    return (
      <MotionConfig reducedMotion="user">
        <div className="flex h-screen w-full flex-col bg-slate-50 text-slate-900">
        <header className="flex h-14 shrink-0 items-center justify-between gap-6 border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {!logoError ? (
              <img
                src={LOGO_SRC}
                alt="BlockWall"
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
                className="h-8 w-8 shrink-0 object-contain"
              />
            ) : (
              <ShieldAlert className="h-5 w-5 shrink-0 text-slate-700" aria-hidden="true" />
            )}
            <span className="text-sm font-semibold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
              BlockWall
            </span>
            <span className="hidden text-slate-300 sm:inline" aria-hidden="true">
              /
            </span>
            <span className="hidden truncate font-mono text-xs text-slate-600 sm:inline">
              {TARGET_URL}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={TARGET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 whitespace-nowrap shrink-0"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={handleLockSession}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-medium text-white transition-colors duration-150 hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 whitespace-nowrap shrink-0"
            >
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Return to Block Screen</span>
            </button>
          </div>
        </header>

        <main className="relative flex-1 bg-white">
          <iframe
            src={TARGET_URL}
            title="DuckMath Embedded Destination"
            className="h-full w-full border-0"
            allow="fullscreen; autoplay; clipboard-read; clipboard-write"
          />
        </main>
        </div>
      </MotionConfig>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-6">
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            {!logoError ? (
              <img
                src={LOGO_SRC}
                alt="BlockWall emblem"
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
                className="h-8 w-8 shrink-0 object-contain"
              />
            ) : (
              <ShieldAlert className="h-5 w-5 shrink-0 text-slate-800" aria-hidden="true" />
            )}
            <span className="text-base font-bold tracking-tight text-slate-900">
              BlockWall
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 whitespace-nowrap shrink-0">
            <span>GoGuardian Web Filtering</span>
            <span aria-hidden="true">·</span>
            <span>Access Enforcement</span>
          </div>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-2xl">
          <AnimatePresence>
            {notification && (
              <motion.div
                key={notification.id}
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-950"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-semibold text-emerald-950">
                      Request Submitted
                    </p>
                    <p className="mt-0.5 text-sm text-emerald-800">
                      {notification.message}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setNotification(null)}
                  aria-label="Dismiss notification"
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-emerald-800 transition-colors duration-150 hover:bg-emerald-100 hover:text-emerald-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <section
            aria-labelledby="block-heading"
            className="rounded-2xl border border-slate-200 bg-white px-6 py-10 sm:px-12 sm:py-12"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-28 w-28 items-center justify-center">
                {!logoError ? (
                  <img
                    src={LOGO_SRC}
                    alt="BlockWall Logo"
                    referrerPolicy="no-referrer"
                    onError={() => setLogoError(true)}
                    className="h-28 w-28 object-contain"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                    <ShieldAlert className="h-10 w-10 text-slate-700" aria-hidden="true" />
                  </div>
                )}
              </div>

              <h1
                id="block-heading"
                className="max-w-lg text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl [text-wrap:balance]"
              >
                Access Restricted
              </h1>

              <p className="mt-3 max-w-md text-base leading-relaxed text-slate-700 sm:text-lg">
                {'The site has been blocked by "BlockWall."'}
              </p>

              <div className="mt-8 w-full border-t border-slate-200 pt-6 text-left">
                <dl className="divide-y divide-slate-100 text-sm">
                  <div className="flex flex-col justify-between gap-1 py-3 sm:flex-row sm:items-center">
                    <dt className="text-slate-500">Destination URL</dt>
                    <dd className="font-mono text-xs font-medium text-slate-800 sm:text-sm">
                      {TARGET_URL}
                    </dd>
                  </div>
                  <div className="flex flex-col justify-between gap-1 py-3 sm:flex-row sm:items-center">
                    <dt className="text-slate-500">Filter Policy</dt>
                    <dd className="font-medium text-slate-800">
                      Organization Web Restriction
                    </dd>
                  </div>
                  <div className="flex flex-col justify-between gap-1 py-3 sm:flex-row sm:items-center">
                    <dt className="text-slate-500">Status</dt>
                    <dd className="inline-flex items-center gap-1.5 font-medium text-slate-800">
                      <Lock className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                      <span>Blocked by BlockWall</span>
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
                <button
                  ref={requestButtonRef}
                  type="button"
                  onClick={openModal}
                  className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:w-auto whitespace-nowrap shrink-0"
                >
                  Request Access
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white py-4">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 text-xs text-slate-500 sm:flex-row">
          <span>BlockWall Web Filter · Powered by GoGuardian Policy Controls</span>
          <span>Need help? Contact your school or network administrator.</span>
        </div>
      </footer>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={closeModal}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-[2px]"
              aria-hidden="true"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="modal-title"
                    className="text-lg font-semibold tracking-tight text-slate-900"
                  >
                    Request Site Access
                  </h2>
                  <p
                    id="modal-description"
                    className="mt-1 text-sm text-slate-600"
                  >
                    Provide a description or reason explaining why you need access to{' '}
                    <span className="font-mono text-xs font-medium text-slate-800">
                      {TARGET_URL}
                    </span>
                    .
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close modal"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6" noValidate>
                <div>
                  <label
                    htmlFor="access-reason"
                    className="block text-sm font-medium text-slate-800"
                  >
                    Description or Reason
                  </label>
                  <textarea
                    ref={textareaRef}
                    id="access-reason"
                    name="access-reason"
                    rows={4}
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      if (validationError) setValidationError('');
                    }}
                    placeholder="Enter your reason for requesting access..."
                    className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors duration-150 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                  {validationError && (
                    <p
                      role="alert"
                      className="mt-2 text-xs font-medium text-red-600"
                    >
                      {validationError}
                    </p>
                  )}
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 whitespace-nowrap shrink-0"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 whitespace-nowrap shrink-0"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
