import React from 'react';
import { ArrowLeftIcon, ClockIcon, UsersIcon, ChartBarIcon, AcademicCapIcon, CogIcon } from '@heroicons/react/24/outline';

export function Roadmap() {
  const handleBackToHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#e05d38' }}>
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-funnel text-foreground">Product Roadmap</h1>
                <p className="text-sm text-muted-foreground">Upcoming features and improvements</p>
              </div>
            </div>
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary border border-border rounded-lg hover:bg-secondary/80 transition-colors"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Introduction */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-funnel text-foreground mb-4">
              What's Coming Next
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We're expanding ToneWise to serve organizations supporting neurodiverse teams. 
              Here are the enterprise features we're developing to help workplaces become more inclusive.
            </p>
          </div>

          {/* Upcoming Features */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold font-funnel text-foreground mb-6" style={{ color: '#e05d38' }}>
              Enterprise Features in Development
            </h3>

            {/* Feature 1: Team Management Dashboard */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-8">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-lg flex-shrink-0" style={{ backgroundColor: '#e05d38' }}>
                  <UsersIcon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold font-funnel text-foreground mb-3">
                    Team Management Dashboard
                  </h4>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    A comprehensive dashboard for HR teams and managers to oversee ToneWise usage across their organization. 
                    Monitor adoption, identify users who might benefit from additional support, and track communication improvement metrics.
                  </p>
                  <div className="space-y-2">
                    <h5 className="font-medium text-foreground">Key Benefits:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>View team-wide usage analytics and adoption rates</li>
                      <li>Identify patterns in communication challenges</li>
                      <li>Support team members who need additional assistance</li>
                      <li>Track progress and improvement over time</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Admin Controls & Reporting */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-8">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-lg flex-shrink-0" style={{ backgroundColor: '#e05d38' }}>
                  <ChartBarIcon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold font-funnel text-foreground mb-3">
                    Admin Controls & Reporting
                  </h4>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Powerful administrative tools and detailed reporting capabilities for enterprise customers. 
                    Generate insights about workplace communication patterns and measure the impact of neurodiversity support initiatives.
                  </p>
                  <div className="space-y-2">
                    <h5 className="font-medium text-foreground">Key Benefits:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Detailed usage reports and communication analytics</li>
                      <li>User access management and permission controls</li>
                      <li>Data export capabilities for compliance and HR reporting</li>
                      <li>Integration with existing HR systems and workflows</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Training Modules */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-8">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-lg flex-shrink-0" style={{ backgroundColor: '#e05d38' }}>
                  <AcademicCapIcon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold font-funnel text-foreground mb-3">
                    Training Modules
                  </h4>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Interactive training content designed to help neurodiverse employees build communication confidence 
                    and help neurotypical colleagues better understand and support their neurodiverse teammates.
                  </p>
                  <div className="space-y-2">
                    <h5 className="font-medium text-foreground">Key Benefits:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Self-paced learning modules for neurodiverse communication skills</li>
                      <li>Manager training on supporting neurodiverse team members</li>
                      <li>Workplace communication best practices and guidelines</li>
                      <li>Progress tracking and completion certificates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4: Custom Integrations */}
            <div className="bg-card rounded-lg shadow-sm border border-border p-8">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-lg flex-shrink-0" style={{ backgroundColor: '#e05d38' }}>
                  <CogIcon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-semibold font-funnel text-foreground mb-3">
                    Custom Integrations
                  </h4>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Seamless integration with existing workplace tools and platforms. 
                    Bring ToneWise functionality directly into the applications your team already uses every day.
                  </p>
                  <div className="space-y-2">
                    <h5 className="font-medium text-foreground">Key Benefits:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Microsoft Teams and Slack integration for real-time assistance</li>
                      <li>Email client plugins for Gmail and Outlook</li>
                      <li>API access for custom internal tool development</li>
                      <li>Single sign-on (SSO) integration with existing identity providers</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-accent/50 border border-border rounded-lg p-6 mt-12">
            <h3 className="text-lg font-semibold font-funnel text-foreground mb-4">
              Development Timeline
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#e05d38' }}></div>
                <span className="text-foreground font-medium">Q1 2025:</span>
                <span className="text-muted-foreground">Team Management Dashboard and Admin Controls</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: '#e05d38' }}></div>
                <span className="text-foreground font-medium">Q2 2025:</span>
                <span className="text-muted-foreground">Training Modules and Custom Integrations</span>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="text-center mt-12 p-8 bg-card rounded-lg shadow-sm border border-border">
            <h3 className="text-xl font-semibold font-funnel text-foreground mb-4">
              Interested in Enterprise Features?
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              If your organization is interested in supporting neurodiverse employees with ToneWise Enterprise, 
              we'd love to discuss your specific needs and timeline.
            </p>
            <a
              href="mailto:enterprise@tonewise.app"
              className="inline-flex items-center px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
              style={{ backgroundColor: '#e05d38' }}
            >
              Contact Enterprise Sales
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}