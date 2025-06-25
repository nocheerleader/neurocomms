import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { BookmarkIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { LoadingSpinner } from '../atoms/LoadingSpinner';

interface SaveAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => Promise<{ error: string | null }>;
  analysisId: string;
  initialInputText: string;
  loading?: boolean;
}

export function SaveAnalysisModal({ 
  isOpen, 
  onClose, 
  onSave, 
  analysisId, 
  initialInputText,
  loading = false 
}: SaveAnalysisModalProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Generate a suggested title from the input text
  useEffect(() => {
    if (isOpen && initialInputText) {
      const words = initialInputText.trim().split(' ');
      const suggestedTitle = words.length > 8 
        ? `Analysis of "${words.slice(0, 8).join(' ')}..."`
        : `Analysis of "${initialInputText}"`;
      setTitle(suggestedTitle);
    }
  }, [isOpen, initialInputText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (title.length > 200) {
      setError('Title must be 200 characters or less');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const result = await onSave(title.trim());
      
      if (result.error) {
        setError(result.error);
        return;
      }

      // Success - close modal
      onClose();
      setTitle('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save analysis');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
      setTitle('');
      setError(null);
    }
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <BookmarkIcon className="h-6 w-6 text-blue-700" />
                    </div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900"
                    >
                      Save Analysis
                    </Dialog.Title>
                  </div>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={handleClose}
                    disabled={saving}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Give this analysis a memorable title to easily find it later in your history.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="analysis-title" className="block text-sm font-medium text-gray-700 mb-2">
                      Analysis Title
                    </label>
                    <input
                      type="text"
                      id="analysis-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a title for this analysis"
                      maxLength={200}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                      disabled={saving}
                      autoFocus
                    />
                    <div className="mt-1 text-xs text-gray-500 text-right">
                      {title.length}/200 characters
                    </div>
                  </div>

                  {/* Preview of original text */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">Original Message:</p>
                    <p className="text-sm text-gray-600 italic">
                      "{initialInputText.length > 100 
                        ? initialInputText.slice(0, 100) + '...' 
                        : initialInputText}"
                    </p>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                      onClick={handleClose}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!title.trim() || saving || loading}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-700 border border-transparent rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[80px] justify-center"
                    >
                      {saving ? (
                        <LoadingSpinner />
                      ) : (
                        <>
                          <BookmarkIcon className="h-4 w-4" />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}