import React, { useState, useEffect } from 'react';
import { unthPatientService, PatientSummary } from '../services/unthPatientService';

interface PatientSummaryViewProps {
  patientId: string;
  summaryType?: PatientSummary['summary_type'];
}

export const PatientSummaryView: React.FC<PatientSummaryViewProps> = ({
  patientId,
  summaryType = 'progress'
}) => {
  const [summaries, setSummaries] = useState<PatientSummary[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState<PatientSummary | null>(null);

  useEffect(() => {
    loadSummaries();
  }, [patientId, summaryType]);

  const loadSummaries = async () => {
    // In a real implementation, this would fetch from the database
    // For now, we'll use mock data
    const mockSummaries: PatientSummary[] = [
      {
        id: '1',
        patient_id: patientId,
        summary_type: 'admission',
        generated_by: 'ai',
        content: `Patient admitted with acute appendicitis. Initial presentation with right lower quadrant pain, fever, and elevated white cell count. Physical examination revealed McBurney's point tenderness and positive Rovsing's sign. CT scan confirmed acute appendicitis with no signs of perforation.`,
        key_points: [
          'Acute appendicitis confirmed on CT',
          'No signs of perforation',
          'Classic presentation with RLQ pain',
          'Elevated WBC count'
        ],
        current_problems: [
          'Acute appendicitis',
          'Abdominal pain',
          'Risk of complications'
        ],
        medications: [
          'IV Ceftriaxone 1g BD',
          'IV Metronidazole 500mg TDS',
          'IV Tramadol 100mg TDS PRN pain'
        ],
        investigations_pending: [
          'Pre-operative workup',
          'Blood grouping and cross-matching',
          'ECG',
          'Chest X-ray'
        ],
        plan: [
          'Emergency appendectomy',
          'Continue IV antibiotics',
          'Monitor vital signs',
          'NBM for surgery'
        ],
        generated_at: new Date('2024-01-15T08:30:00'),
        generated_by_user: 'ai-system',
        ai_confidence: 92
      }
    ];
    setSummaries(mockSummaries);
    if (mockSummaries.length > 0) {
      setSelectedSummary(mockSummaries[0]);
    }
  };

  const generateNewSummary = async () => {
    setIsGenerating(true);
    try {
      const newSummary = await unthPatientService.generatePatientSummary(
        patientId,
        summaryType,
        'Generate comprehensive clinical summary'
      );
      setSummaries(prev => [newSummary, ...prev]);
      setSelectedSummary(newSummary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getSummaryTypeIcon = (type: string) => {
    switch (type) {
      case 'admission':
        return '🏥';
      case 'progress':
        return '📊';
      case 'discharge':
        return '🚪';
      case 'consultation':
        return '👩‍⚕️';
      default:
        return '📄';
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-gray-500';
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Summary List */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Patient Summaries</h3>
            <button
              onClick={generateNewSummary}
              disabled={isGenerating}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : '+ New AI Summary'}
            </button>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {summaries.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No summaries available</p>
                <button
                  onClick={generateNewSummary}
                  className="mt-2 text-sm text-green-600 hover:text-green-700"
                >
                  Generate first summary
                </button>
              </div>
            ) : (
              summaries.map(summary => (
                <div
                  key={summary.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedSummary?.id === summary.id ? 'bg-green-50 border-r-2 border-green-500' : ''
                  }`}
                  onClick={() => setSelectedSummary(summary)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getSummaryTypeIcon(summary.summary_type)}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 capitalize truncate">
                        {summary.summary_type} Summary
                      </h4>
                      <p className="text-sm text-gray-500">
                        {summary.generated_at.toLocaleDateString()} at{' '}
                        {summary.generated_at.toLocaleTimeString()}
                      </p>
                      {summary.generated_by === 'ai' && (
                        <div className="flex items-center space-x-1 mt-1">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            AI Generated
                          </span>
                          {summary.ai_confidence && (
                            <span className={`text-xs ${getConfidenceColor(summary.ai_confidence)}`}>
                              {summary.ai_confidence}% confidence
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Summary Detail */}
      <div className="lg:col-span-2">
        {selectedSummary ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getSummaryTypeIcon(selectedSummary.summary_type)}</span>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 capitalize">
                      {selectedSummary.summary_type} Summary
                    </h2>
                    <p className="text-sm text-gray-500">
                      Generated {selectedSummary.generated_at.toLocaleDateString()} at{' '}
                      {selectedSummary.generated_at.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                {selectedSummary.generated_by === 'ai' && selectedSummary.ai_confidence && (
                  <div className="text-right">
                    <span className="text-sm text-gray-500">AI Confidence</span>
                    <div className={`text-lg font-semibold ${getConfidenceColor(selectedSummary.ai_confidence)}`}>
                      {selectedSummary.ai_confidence}%
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Clinical Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Clinical Summary</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 leading-relaxed">{selectedSummary.content}</p>
                </div>
              </div>

              {/* Key Points */}
              {selectedSummary.key_points.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Clinical Points</h3>
                  <ul className="space-y-2">
                    {selectedSummary.key_points.map((point, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Current Problems */}
              {selectedSummary.current_problems.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Active Problems</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedSummary.current_problems.map((problem, index) => (
                      <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <span className="text-red-800 font-medium">{problem}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Medications */}
              {selectedSummary.medications.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Medications</h3>
                  <div className="space-y-2">
                    {selectedSummary.medications.map((medication, index) => (
                      <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <span className="text-blue-800 font-medium">{medication}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Investigations */}
              {selectedSummary.investigations_pending.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Pending Investigations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedSummary.investigations_pending.map((investigation, index) => (
                      <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <span className="text-yellow-800">{investigation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Management Plan */}
              {selectedSummary.plan.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Management Plan</h3>
                  <ol className="space-y-2">
                    {selectedSummary.plan.map((planItem, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="flex items-center justify-center w-6 h-6 bg-green-600 text-white text-sm font-semibold rounded-full flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-700 pt-0.5">{planItem}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Generated by: {selectedSummary.generated_by === 'ai' ? 'AI System' : selectedSummary.generated_by_user}
                </div>
                <div className="flex space-x-3">
                  <button className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                    Print Summary
                  </button>
                  <button className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                    Export PDF
                  </button>
                  <button 
                    onClick={generateNewSummary}
                    disabled={isGenerating}
                    className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    Generate Updated Summary
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Summary Selected</h3>
            <p className="text-gray-500">Select a summary from the list or generate a new one</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Quick Summary Card Component
export const QuickSummaryCard: React.FC<{ patientId: string }> = ({ patientId }) => {
  const [latestSummary, setLatestSummary] = useState<PatientSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock loading latest summary
    setTimeout(() => {
      setLatestSummary({
        id: '1',
        patient_id: patientId,
        summary_type: 'progress',
        generated_by: 'ai',
        content: 'Patient showing good recovery post-appendectomy. Vital signs stable, wound healing well.',
        key_points: ['Stable vital signs', 'Good wound healing', 'No complications'],
        current_problems: ['Post-operative monitoring'],
        medications: ['IV antibiotics'],
        investigations_pending: [],
        plan: ['Continue antibiotics', 'Monitor wound'],
        generated_at: new Date(),
        generated_by_user: 'ai-system',
        ai_confidence: 88
      });
      setIsLoading(false);
    }, 1000);
  }, [patientId]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!latestSummary) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <p className="text-gray-500">No recent summary available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Latest Summary</h3>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            AI Generated
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-700 text-sm mb-3">{latestSummary.content}</p>
        
        <div className="space-y-2">
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Key Points</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {latestSummary.key_points.slice(0, 3).map((point, index) => (
                <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {point}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {latestSummary.generated_at.toLocaleDateString()} at{' '}
              {latestSummary.generated_at.toLocaleTimeString()}
            </span>
            <span className="font-medium">
              {latestSummary.ai_confidence}% confidence
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};