import React, { useMemo, useState, useEffect } from 'react'
import '../styles/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate, useParams } from 'react-router'
import { LoadingScreen } from './LoadingScreen.jsx'

const sectionLabels = [
  { key: 'technicalQuestions', label: 'Technical questions' },
  { key: 'behavioralQuestions', label: 'Behavioral questions' },
  { key: 'preparationPlan', label: 'Road Map' }
]

const severityTone = {
  low: 'low',
  medium: 'medium',
  high: 'high'
}

const Interview = () => {
  const [activeSection, setActiveSection] = useState('technicalQuestions')
  const { report, loading, getReportById } = useInterview()
  const { interviewId } = useParams()

  useEffect(() => {
    if(interviewId){
      getReportById(interviewId)
    }
  }, [interviewId])

  const sectionMeta = useMemo(
    () =>
      sectionLabels.map(section => ({
        ...section,
        count: report?.[section.key]?.length ?? 0
      })),
    [report]
  )

  if(loading || !report) {
    return (
      <LoadingScreen/>
    )
  }

  const activeSectionData = report?.[activeSection] || []
  const hasActiveItems = Array.isArray(activeSectionData) && activeSectionData.length > 0

  return (
    <main className='interview-page'>
      <div className='report-hero'>
        <div className='hero-left'>
          <p className='report-status'>Interview Report</p>
          <h1>{report.title} <span className="highlight">Summary</span></h1>
        </div>
        <div className='report-score-card'>
          <span className='score-label'>Match Score</span>
          <span className='match-score'>{report?.matchScore ?? 0}%</span>
        </div>
      </div>

      {/* Wireframe Structured 3-Column Layout Grid */}
      <div className='report-grid'>
        
        {/* Column 1: Minimal Left Navigation */}
        <aside className='report-sidebar-left'>
          <div className='sidebar-links'>
            {sectionMeta.map(section => (
              <button
                key={section.key}
                type='button'
                className={`sidebar-link ${activeSection === section.key ? 'active' : ''}`}
                onClick={() => setActiveSection(section.key)}
              >
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Column 2: Center Main Content Workspace */}
        <section className='report-content-center'>
          <div className='content-panel'>
            {!hasActiveItems ? (
              <div className='empty-state'>
                <h3>No Items Found</h3>
                <p>This section doesn't have details configured yet.</p>
              </div>
            ) : activeSection === 'technicalQuestions' || activeSection === 'behavioralQuestions' ? (
              activeSectionData.map((item, index) => (
                <article key={index} className='question-card'>
                  <div className='question-header-info'>
                    <span className='question-label'>Question {index + 1}</span>
                    <h3>{item.question}</h3>
                    <p className='question-intention'>{item.intention}</p>
                  </div>
                  
                  {/* Native Dropdown implementation for viewing answers */}
                  <details className='answer-dropdown'>
                    <summary className='dropdown-trigger'>
                      <span className='trigger-text'>View Suggested Answer</span>
                      <span className='trigger-icon'>▼</span>
                    </summary>
                    <div className='answer-block'>
                      <p>{item.answer}</p>
                    </div>
                  </details>
                </article>
              ))
            ) : (
              report.preparationPlan?.map(plan => (
                <article key={plan.day} className='plan-card'>
                  <div className='plan-header'>
                    <span className='plan-day'>{plan.day}</span>
                    <span className='plan-focus'>{plan.focus}</span>
                  </div>
                  <ul>
                    {plan.tasks?.map((task, i) => (
                      <li key={i}>{task}</li>
                    ))}
                  </ul>
                </article>
              ))
            )}
          </div>
        </section>

        {/* Column 3: Right Insights Pane (Skill Gaps Layout) */}
        <aside className='report-sidebar-right'>
          <div className='insights-panel'>
            <h3>Skill Gaps</h3>
            <div className='gaps-list'>
              {report.skillGaps?.map(item => (
                <div key={item.skill} className={`gap-pill ${severityTone[item.severity]}`}>
                  <span className='gap-name'>{item.skill}</span>
                  <strong className='gap-severity'>{item.severity}</strong>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </main>
  )
}

export default Interview