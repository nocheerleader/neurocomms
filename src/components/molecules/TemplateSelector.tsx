import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface TemplateSelectorProps {
  onTemplateSelect: (template: string) => void;
}

const templates = [
  {
    id: 'deadline_request',
    name: 'Deadline Extension Request',
    context: "I need to ask for a deadline extension on a project. The original deadline is coming up and I won't be able to finish on time due to unexpected complications."
  },
  {
    id: 'meeting_feedback',
    name: 'Meeting Follow-up',
    context: "I attended a meeting where several decisions were made, but I'm not sure I understood everything correctly. I need to follow up to clarify the next steps."
  },
  {
    id: 'colleague_conflict',
    name: 'Colleague Disagreement',
    context: "A colleague and I disagree on how to approach a work task. They seem frustrated with my suggestions, and I want to resolve this professionally."
  },
  {
    id: 'client_complaint',
    name: 'Client Complaint Response',
    context: "A client has sent an email expressing dissatisfaction with our service. They seem upset and I need to respond professionally to address their concerns."
  },
  {
    id: 'social_invitation',
    name: 'Social Event Response',
    context: "I received an invitation to a social event from a friend. I'm not sure if I want to attend, but I don't want to hurt their feelings with my response."
  },
  {
    id: 'family_boundary',
    name: 'Family Boundary Setting',
    context: "A family member keeps asking me to do things that make me uncomfortable. I need to set boundaries while maintaining our relationship."
  },
  {
    id: 'performance_review',
    name: 'Performance Review Response',
    context: "I received feedback during my performance review that I disagree with. I want to respond professionally and provide my perspective."
  },
  {
    id: 'unclear_instructions',
    name: 'Clarifying Instructions',
    context: "I received work instructions that aren't clear to me. I need to ask for clarification without seeming incompetent or difficult."
  },
];

export function TemplateSelector({ onTemplateSelect }: TemplateSelectorProps) {
  const handleTemplateSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = event.target.value;
    const template = templates.find(t => t.id === templateId);
    
    if (template) {
      onTemplateSelect(template.context);
    }
    
    // Reset the select to placeholder
    event.target.value = '';
  };

  return (
    <div className="relative">
      <select
        onChange={handleTemplateSelect}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent appearance-none bg-white pr-10"
        defaultValue=""
      >
        <option value="" disabled>
          Choose from common situations...
        </option>
        {templates.map((template) => (
          <option key={template.id} value={template.id}>
            {template.name}
          </option>
        ))}
      </select>
      
      <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
    </div>
  );
}