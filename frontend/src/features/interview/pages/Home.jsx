import React,{ useState, useEffect } from 'react'
import "../styles/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import { LoadingScreen } from './LoadingScreen.jsx'

const Home = () => {

  const { loading, generateReport, reports, getReports} = useInterview()
  const [selfDescription, setSelfDescription] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [resumeFile, setResumeFile] = useState(null)

  useEffect(() => {
    getReports();
  }, []);

  const navigate = useNavigate()

  const handleGenerateReport = async () => {
    
    const data = await generateReport({ jobDescription, selfDescription, resumeFile })
    navigate(`/interview/${data._id}`)
  }

  if(loading){
    return <LoadingScreen/>
  }

  return (
    <main className='home'>
      <div className="header">
        <h1 className="title">Create Your Custom <span className="highlight">Interview Plan</span></h1>
        <p className="subtitle">Let out AI analayze the job requirements and your unique profile to build a winning strategy.</p>
      </div>

      <div className="interview-input-group">
        {/* Left Section - Job Description */}
        <div className='left-section'>
          <div className="section-header">
            <div className="icon-label">
              <span className="icon">📋</span>
              <label htmlFor='jobDescription'>Job Description</label>
            </div>
            <span className="required-badge">Required</span>
          </div>
          <textarea 
            name='jobDescription' 
            id='jobDescription' 
            placeholder='Enter the full job description here, including responsibilities, requirements, and culture fit...'
            value={jobDescription}
            onChange={(e)=> setJobDescription(e.target.value)}
            className='job-textarea'
          />
          <div className="textarea-footer">
            <span className="char-count">Character count: {jobDescription.length}</span>
          </div>
        </div>

        {/* Right Section - Resume & Self Description */}
        <div className='right-section'>
          {/* Resume Section */}
          <div className="resume-section">
            <div className="section-header">
              <div className="icon-label">
                <span className="icon">☁️</span>
                <label>Candidate Resume</label>
              </div>
            </div>
            <p className="section-hint">Use resume and self description together for best results</p>
            
            <div className="file-upload-area">
              <label className='file-label' htmlFor='resume'>
                <span className="upload-icon">{resumeFile ? '📄' : '☁️'}</span>
                <span>{resumeFile ? resumeFile.name : 'Click to upload or drag and drop'}</span>
                <span className="file-hint">{resumeFile 
                  ? `${(resumeFile.size / (1024 * 1024)).toFixed(2)} MB` 
                  : 'PDF, DOCS (Up to 10MB)'}</span>
              </label>
              <input hidden type='file' id='resume' name='resume' accept='.pdf,.doc,.docx' 
                onChange={ (e) => { setResumeFile(e.target.files[0]) }} />
            </div>
            {resumeFile && <div className="file-name">{resumeFile.name}</div>}
          </div>

          {/* Self Description Section */}
          <div className="self-description-section">
            <div className="section-header">
              <div className="icon-label">
                <span className="icon">✨</span>
                <label htmlFor='selfDescription'>Self Description</label>
              </div>
            </div>
            <textarea 
              name='selfDescription' 
              id='selfDescription' 
              placeholder="Enter a few sentences about the candidate's background, aspirations, or unique selling points..."
              value={selfDescription}
              onChange={(e)=> setSelfDescription(e.target.value)}
              className='description-textarea'
            />
          </div>

          {/* Action Button & Info */}
          <div className="action-section">
            <button 
              className='button primary-button' 
              disabled={loading}
              onClick={handleGenerateReport}
            >
              {loading ? "Generating..." : "Generate Interview Report"}
            </button>
            <p className="processing-time">Estimated processing time: 15-30 seconds</p>
          </div>
        </div>
      </div>

      {/* Recent Reports List */}
      {reports.length > 0 && (
        <section className='recent-reports'>
          <h2>My Recent Interview Plans</h2>
          <ul className='reports-list'>
            {reports.map(report => (
              <li key={report._id} className='report-item' onClick={()=> navigate(`/interview/${report._id}`)}>
                <h3>{report.title || 'Untitled Position'}</h3>
                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                <p className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>Match Score: {report.matchScore}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Page Footer */}
      <footer className="home-footer">
        <p className="footer-copy">AI-powered interview planning for smarter preparation. Built to help you match your profile to the right opportunity.</p>
        <div className="footer-links">
          <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Contact</a>
        </div>
      </footer>
    </main>
  )
}

export default Home