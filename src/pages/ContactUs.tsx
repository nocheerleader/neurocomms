import React from 'react';
import { 
  ArrowLeftIcon, 
  EnvelopeIcon, 
  ClockIcon, 
  ChatBubbleLeftRightIcon, 
  QuestionMarkCircleIcon,
  BuildingOffice2Icon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

export function ContactUs() {
  const handleBackToDashboard = () => {
    window.location.href = '/profile';
  };

  const contactMethods = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'General Support',
      description: 'Questions about features, account issues, or general help using Elucidare.',
      email: 'support@elucidare.app',
      response: 'Within 24 hours'
    },
    {
      icon: QuestionMarkCircleIcon,
      title: 'Technical Issues',
      description: 'Bugs, errors, or problems with the app not working as expected.',
      email: 'tech@elucidare.app',
      response: 'Within 12 hours'
    },
    {
      icon: BuildingOffice2Icon,
      title: 'Enterprise & Sales',
      description: 'Team dashboards, admin controls, and features for organizations.',
      email: 'enterprise@elucidare.app',
      response: 'Within 4 hours'
    },
    {
      icon: LightBulbIcon,
      title: 'Feedback & Ideas',
      description: 'Ideas for new features or feedback on existing functionality.',
      email: 'feedback@elucidare.app',
      response: 'Within 48 hours'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDF6F8]">
      {/* Header */}
      <div className="bg-transparent border-b border-primary/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <EnvelopeIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Contact Us</h1>
                <p className="text-sm text-gray-600">We're here to help you</p>
              </div>
            </div>
            <button
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-xl border border-black/5 p-8 lg:p-12">
          <div className="space-y-10">
            {/* Introduction */}
            <section className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Whether you have questions, need support, or want to share feedback, 
                our team is ready to assist you.
              </p>
            </section>

            {/* Contact Methods */}
            <div className="grid md:grid-cols-2 gap-6">
              {contactMethods.map((method, index) => (
                <div key={index} className="bg-slate-50/50 rounded-lg p-6 border border-black/5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <method.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{method.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{method.description}</p>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">
                      <a href={`mailto:${method.email}`} className="hover:text-primary transition-colors">{method.email}</a>
                    </p>
                    <p className="text-gray-500">Response time: {method.response}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Support Hours */}
            <section className="bg-slate-50/50 border border-black/5 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <ClockIcon className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold text-gray-800">Support Hours</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-900">Monday - Friday</p>
                  <p className="text-gray-600">9:00 AM - 6:00 PM EST</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Weekends & Holidays</p>
                  <p className="text-gray-600">Limited support for urgent issues</p>
                </div>
              </div>
            </section>

            {/* What to Include */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Helping Us Help You</h3>
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  To help us resolve your issue quickly, please include the following in your email:
                </p>
                <ul className="space-y-2 text-gray-700">
                  {[
                    "A clear description of the issue or question",
                    "What you were trying to do when the problem occurred",
                    "Your account email address",
                    "Any error messages you received (screenshots are great!)",
                    "The browser you're using (e.g., Chrome, Safari)"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-primary font-bold mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}