import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowRight,
  CalendarDays,
  Check,
  CircleAlert,
  Clock3,
  ExternalLink,
  Filter,
  LayoutGrid,
  List,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'

type Stage = 'Wishlist' | 'Applied' | 'Interview' | 'Offer' | 'Rejected'
type ViewMode = 'board' | 'list'

type Application = {
  id: string
  company: string
  role: string
  stage: Stage
  dateApplied: string
  deadline: string
  nextAction: string
  location: string
  workMode: string
  source: string
  salary: string
  jobUrl: string
  notes: string
  createdAt: string
  updatedAt: string
}

type ApplicationDraft = Omit<Application, 'id' | 'createdAt' | 'updatedAt'>

const STAGES: Stage[] = ['Wishlist', 'Applied', 'Interview', 'Offer', 'Rejected']
const STORAGE_KEY = 'nextmove-applications-v1'

const isValidLocalDate = (value: string) => {
  if (!value) return true
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

const isApplication = (value: unknown): value is Application => {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  const stringFields = ['id', 'company', 'role', 'stage', 'dateApplied', 'deadline', 'nextAction', 'location', 'workMode', 'source', 'salary', 'jobUrl', 'notes', 'createdAt', 'updatedAt']
  return stringFields.every((field) => typeof record[field] === 'string')
    && STAGES.includes(record.stage as Stage)
    && Boolean(record.id && record.company && record.role)
    && isValidLocalDate(record.dateApplied as string)
    && isValidLocalDate(record.deadline as string)
    && !Number.isNaN(Date.parse(record.createdAt as string))
    && !Number.isNaN(Date.parse(record.updatedAt as string))
}

const todayIso = () => {
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 10)
}

const plusDays = (amount: number) => {
  const date = new Date()
  date.setDate(date.getDate() + amount)
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 10)
}

const demoApplications: Application[] = [
  {
    id: 'demo-figma',
    company: 'Figma',
    role: 'Product Design Intern',
    stage: 'Interview',
    dateApplied: plusDays(-12),
    deadline: plusDays(1),
    nextAction: 'Prep 3 portfolio stories',
    location: 'San Francisco, CA',
    workMode: 'Hybrid',
    source: 'University board',
    salary: '$38–44/hr',
    jobUrl: 'https://www.figma.com/careers/',
    notes: 'Second conversation with the product design team.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-notion',
    company: 'Notion',
    role: 'Associate Product Manager',
    stage: 'Applied',
    dateApplied: plusDays(-4),
    deadline: plusDays(3),
    nextAction: 'Send a concise follow-up',
    location: 'New York, NY',
    workMode: 'Hybrid',
    source: 'Referral',
    salary: '$110k–135k',
    jobUrl: 'https://www.notion.so/careers',
    notes: 'Referred by Maya. Mention campus community project.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-vercel',
    company: 'Vercel',
    role: 'Frontend Engineer, New Grad',
    stage: 'Wishlist',
    dateApplied: '',
    deadline: plusDays(5),
    nextAction: 'Tailor résumé to platform work',
    location: 'Remote',
    workMode: 'Remote',
    source: 'Company site',
    salary: '',
    jobUrl: 'https://vercel.com/careers',
    notes: 'Highlight performance work and design systems.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-duolingo',
    company: 'Duolingo',
    role: 'Product Designer',
    stage: 'Applied',
    dateApplied: plusDays(-8),
    deadline: plusDays(-1),
    nextAction: 'Follow up with recruiter',
    location: 'Pittsburgh, PA',
    workMode: 'Hybrid',
    source: 'LinkedIn',
    salary: '$96k–138k',
    jobUrl: 'https://careers.duolingo.com/',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-linear',
    company: 'Linear',
    role: 'Support Engineer',
    stage: 'Offer',
    dateApplied: plusDays(-25),
    deadline: '',
    nextAction: 'Review offer details',
    location: 'Remote',
    workMode: 'Remote',
    source: 'Community',
    salary: '$120k–150k',
    jobUrl: 'https://linear.app/careers',
    notes: 'Offer received — compare growth and team fit.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const emptyDraft = (): ApplicationDraft => ({
  company: '',
  role: '',
  stage: 'Applied',
  dateApplied: todayIso(),
  deadline: '',
  nextAction: '',
  location: '',
  workMode: 'Hybrid',
  source: '',
  salary: '',
  jobUrl: '',
  notes: '',
})

function useApplications() {
  const [storageError, setStorageError] = useState('')
  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return demoApplications
      const parsed = JSON.parse(stored)
      if (!Array.isArray(parsed) || !parsed.every(isApplication)) throw new Error('Invalid saved data')
      return parsed
    } catch {
      setTimeout(() => setStorageError('Your saved data could not be read. Demo data is shown instead.'), 0)
      return demoApplications
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
    } catch {
      queueMicrotask(() => setStorageError('Changes are visible now, but this browser cannot save them for your next visit.'))
    }
  }, [applications])

  return { applications, setApplications, storageError, setStorageError }
}

const formatDate = (value: string) => {
  if (!value || !isValidLocalDate(value)) return ''
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(year, month - 1, day))
}

const deadlineTone = (deadline: string) => {
  if (!deadline) return 'none'
  if (deadline < todayIso()) return 'overdue'
  if (deadline === todayIso()) return 'today'
  return 'upcoming'
}

const stageClass = (stage: Stage) => stage.toLowerCase()

export default function App() {
  const { applications, setApplications, storageError, setStorageError } = useApplications()
  const [query, setQuery] = useState('')
  const [stageFilter, setStageFilter] = useState<Stage | 'All'>('All')
  const [view, setView] = useState<ViewMode>(() => window.matchMedia('(max-width: 720px)').matches ? 'list' : 'board')
  const [isEditorOpen, setEditorOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<ApplicationDraft>(emptyDraft())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [lastMove, setLastMove] = useState<{ id: string; company: string; from: Stage; to: Stage } | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const editorRef = useRef<HTMLElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)
  const shortcutLabel = navigator.userAgent.includes('Mac') ? '⌘ K' : 'Ctrl K'

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return applications.filter((application) => {
      const matchesQuery = !needle || `${application.company} ${application.role}`.toLowerCase().includes(needle)
      const matchesStage = stageFilter === 'All' || application.stage === stageFilter
      return matchesQuery && matchesStage
    })
  }, [applications, query, stageFilter])

  const activeApplications = filtered.filter((app) => app.stage !== 'Offer' && app.stage !== 'Rejected')
  const dueItems = activeApplications
    .filter((app) => app.deadline && app.deadline <= plusDays(7))
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 4)
  const interviewCount = filtered.filter((app) => app.stage === 'Interview').length
  const responseCount = filtered.filter((app) => ['Interview', 'Offer', 'Rejected'].includes(app.stage)).length
  const appliedCount = filtered.filter((app) => app.stage !== 'Wishlist').length
  const responseRate = appliedCount ? Math.round((responseCount / appliedCount) * 100) : 0

  const openCreate = () => {
    returnFocusRef.current = document.activeElement as HTMLElement
    setEditingId(null)
    setDraft(emptyDraft())
    setErrors({})
    setDeleteConfirm(false)
    setEditorOpen(true)
  }

  const openEdit = (application: Application) => {
    returnFocusRef.current = document.activeElement as HTMLElement
    const editable: ApplicationDraft = {
      company: application.company,
      role: application.role,
      stage: application.stage,
      dateApplied: application.dateApplied,
      deadline: application.deadline,
      nextAction: application.nextAction,
      location: application.location,
      workMode: application.workMode,
      source: application.source,
      salary: application.salary,
      jobUrl: application.jobUrl,
      notes: application.notes,
    }
    setEditingId(application.id)
    setDraft(editable)
    setErrors({})
    setDeleteConfirm(false)
    setEditorOpen(true)
  }

  const closeEditor = () => {
    setEditorOpen(false)
    setDeleteConfirm(false)
    requestAnimationFrame(() => returnFocusRef.current?.focus())
  }

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onShortcut)
    return () => window.removeEventListener('keydown', onShortcut)
  }, [])

  useEffect(() => {
    if (!isEditorOpen) return
    const onDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeEditor()
        return
      }
      if (event.key !== 'Tab' || !editorRef.current) return
      const focusable = Array.from(editorRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onDialogKeyDown)
    return () => window.removeEventListener('keydown', onDialogKeyDown)
  })

  useEffect(() => {
    if (!lastMove) return
    const timeout = window.setTimeout(() => setLastMove(null), 6000)
    return () => window.clearTimeout(timeout)
  }, [lastMove])

  const updateDraft = (key: keyof ApplicationDraft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }))
    if (errors[key]) setErrors((current) => ({ ...current, [key]: '' }))
  }

  const saveApplication = (event: FormEvent) => {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!draft.company.trim()) nextErrors.company = 'Add the company name.'
    if (!draft.role.trim()) nextErrors.role = 'Add the role title.'
    if (draft.jobUrl && !/^https?:\/\//i.test(draft.jobUrl)) nextErrors.jobUrl = 'Use a complete link starting with http:// or https://.'
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    const now = new Date().toISOString()
    if (editingId) {
      setApplications((current) =>
        current.map((application) =>
          application.id === editingId
            ? { ...application, ...draft, company: draft.company.trim(), role: draft.role.trim(), updatedAt: now }
            : application,
        ),
      )
    } else {
      setApplications((current) => [
        ...current,
        {
          ...draft,
          id: crypto.randomUUID(),
          company: draft.company.trim(),
          role: draft.role.trim(),
          createdAt: now,
          updatedAt: now,
        },
      ])
    }
    closeEditor()
  }

  const updateStage = (id: string, stage: Stage) => {
    setApplications((current) => {
      const moving = current.find((application) => application.id === id)
      if (!moving || moving.stage === stage) return current
      setLastMove({ id, company: moving.company, from: moving.stage, to: stage })
      return current.map((application) =>
        application.id === id
          ? {
              ...application,
              stage,
              dateApplied: stage !== 'Wishlist' && !application.dateApplied ? todayIso() : application.dateApplied,
              updatedAt: new Date().toISOString(),
            }
          : application,
      )
    })
  }

  const undoStageMove = () => {
    if (!lastMove) return
    const move = lastMove
    setApplications((current) => current.map((application) => application.id === move.id ? { ...application, stage: move.from, updatedAt: new Date().toISOString() } : application))
    setLastMove(null)
  }

  const deleteApplication = () => {
    if (!editingId) return
    setApplications((current) => current.filter((application) => application.id !== editingId))
    closeEditor()
  }

  const clearFilters = () => {
    setQuery('')
    setStageFilter('All')
  }

  return (
    <div className="app-shell">
      <aside className="side-rail" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Nextmove home">
          <span className="brand-mark">N</span>
          <span className="brand-name">nextmove</span>
        </a>
        <nav className="rail-nav">
          <a className="nav-item active" href="#today">
            <Sparkles size={18} /> <span>Today</span>
          </a>
          <a className="nav-item" href="#pipeline">
            <LayoutGrid size={18} /> <span>Pipeline</span>
          </a>
        </nav>
        <div className="rail-note">
          <span className="rail-note-dot" />
          <p>Your data stays in this browser.</p>
        </div>
        <button className="profile-chip" aria-label="Open profile settings">
          <span>ZA</span>
          <span className="profile-copy"><strong>My search</strong><small>Personal space</small></span>
          <MoreHorizontal size={16} />
        </button>
      </aside>

      <main id="top" className="main-canvas">
        <header className="topbar">
          <div className="mobile-brand"><span className="brand-mark">N</span><span>nextmove</span></div>
          <label className="search-field">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Search applications</span>
            <input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search company or role" />
            <kbd>{shortcutLabel}</kbd>
          </label>
          <button className="primary-button" onClick={openCreate}><Plus size={18} /> Add application</button>
        </header>

        {storageError && (
          <div className="storage-alert" role="alert">
            <CircleAlert size={18} /> <span>{storageError}</span>
            <button onClick={() => setStorageError('')} aria-label="Dismiss storage message"><X size={16} /></button>
          </div>
        )}

        <section className="today-section" id="today">
          <div className="section-heading">
            <div>
              <h1>Your next move,<br /><em>already lined up.</em></h1>
              <p>{activeApplications.length} active opportunities · {dueItems.length} need attention</p>
            </div>
            <div className="date-stamp">
              <CalendarDays size={20} />
              <span>{new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date())}</span>
            </div>
          </div>

          <div className="today-grid">
            <div className="action-stack">
              <div className="stack-heading">
                <h2>On your radar</h2>
                <span>Overdue + next 7 days</span>
              </div>
              {dueItems.length ? dueItems.map((item, index) => (
                <button className="action-row" key={item.id} onClick={() => openEdit(item)}>
                  <span className={`action-index ${deadlineTone(item.deadline)}`}>{String(index + 1).padStart(2, '0')}</span>
                  <span className="action-copy">
                    <strong>{item.nextAction || `Check in with ${item.company}`}</strong>
                    <small>{item.company} · {item.role}</small>
                  </span>
                  <span className={`deadline-tag ${deadlineTone(item.deadline)}`}>
                    {deadlineTone(item.deadline) === 'overdue' ? 'Overdue · ' : deadlineTone(item.deadline) === 'today' ? 'Today · ' : ''}{formatDate(item.deadline)}
                  </span>
                  <ArrowRight size={18} />
                </button>
              )) : (
                <div className="quiet-state"><Check size={20} /><span>You’re clear for now. Add a follow-up date when something needs attention.</span></div>
              )}
            </div>

            <aside className="momentum-panel" aria-label="Application momentum">
              <div className="momentum-top">
                <span>Momentum</span>
                <Sparkles size={18} />
              </div>
              <strong>{responseRate}%</strong>
              <p>response rate across your visible applications.</p>
              <div className="metric-line"><span>Interviews</span><b>{interviewCount}</b></div>
              <div className="metric-line"><span>Active</span><b>{activeApplications.length}</b></div>
              <small>Progress is information, not a score.</small>
            </aside>
          </div>
        </section>

        <section className="pipeline-section" id="pipeline">
          <div className="pipeline-heading">
            <div>
              <h2>Application pipeline</h2>
              <p>{filtered.length} {filtered.length === 1 ? 'opportunity' : 'opportunities'} in view</p>
            </div>
            <div className="pipeline-tools">
              <label className="filter-select">
                <Filter size={16} />
                <span className="sr-only">Filter by stage</span>
                <select value={stageFilter} onChange={(event) => setStageFilter(event.target.value as Stage | 'All')}>
                  <option value="All">All stages</option>
                  {STAGES.map((stage) => <option key={stage}>{stage}</option>)}
                </select>
              </label>
              <div className="view-switch" aria-label="Choose pipeline view">
                <button className={view === 'board' ? 'active' : ''} onClick={() => setView('board')} aria-label="Board view" aria-pressed={view === 'board'}><LayoutGrid size={17} /></button>
                <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} aria-label="List view" aria-pressed={view === 'list'}><List size={18} /></button>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-symbol">0</div>
              <h3>No applications match this view.</h3>
              <p>Try a different search or return to the full pipeline.</p>
              <button className="secondary-button" onClick={clearFilters}>Clear filters</button>
            </div>
          ) : view === 'board' ? (
            <div className="board" aria-label="Application kanban board">
              {STAGES.map((stage) => {
                const items = filtered.filter((item) => item.stage === stage)
                return (
                  <section
                    className={`board-column ${stageClass(stage)}`}
                    key={stage}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => { if (draggedId) updateStage(draggedId, stage); setDraggedId(null) }}
                  >
                    <div className="column-heading"><span>{stage}</span><b>{items.length}</b></div>
                    <div className="column-cards">
                      {items.map((application) => (
                        <ApplicationCard
                          key={application.id}
                          application={application}
                          onOpen={() => openEdit(application)}
                          onMove={(nextStage) => updateStage(application.id, nextStage)}
                          onDragStart={() => setDraggedId(application.id)}
                        />
                      ))}
                      {items.length === 0 && <div className="column-empty">Drop an application here</div>}
                    </div>
                  </section>
                )
              })}
            </div>
          ) : (
            <div className="application-list">
              <div className="list-head"><span>Opportunity</span><span>Stage</span><span>Next step</span><span>Due</span></div>
              {filtered.map((application) => (
                <button className="list-row" key={application.id} onClick={() => openEdit(application)}>
                  <span><strong>{application.role}</strong><small>{application.company}</small></span>
                  <span><i className={`stage-dot ${stageClass(application.stage)}`} />{application.stage}</span>
                  <span>{application.nextAction || 'No next step yet'}</span>
                  <span className={deadlineTone(application.deadline)}>{application.deadline ? formatDate(application.deadline) : '—'}</span>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>

      {isEditorOpen && (
        <div className="editor-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeEditor() }}>
          <aside ref={editorRef} className="editor-sheet" role="dialog" aria-modal="true" aria-labelledby="editor-title">
            <div className="editor-header">
              <div><span>{editingId ? 'Application details' : 'New opportunity'}</span><h2 id="editor-title">{editingId ? `${draft.company} · ${draft.role}` : 'Add an application'}</h2></div>
              <button className="icon-button" onClick={closeEditor} aria-label="Close editor"><X size={20} /></button>
            </div>
            <form onSubmit={saveApplication} noValidate>
              <div className="form-grid two-col">
                <Field label="Company" error={errors.company} required>
                  <input value={draft.company} onChange={(event) => updateDraft('company', event.target.value)} placeholder="e.g. Spotify" autoFocus />
                </Field>
                <Field label="Role" error={errors.role} required>
                  <input value={draft.role} onChange={(event) => updateDraft('role', event.target.value)} placeholder="e.g. Product Designer" />
                </Field>
              </div>
              <div className="form-grid three-col">
                <Field label="Stage">
                  <select value={draft.stage} onChange={(event) => updateDraft('stage', event.target.value)}>{STAGES.map((stage) => <option key={stage}>{stage}</option>)}</select>
                </Field>
                <Field label="Date applied">
                  <input type="date" value={draft.dateApplied} onChange={(event) => updateDraft('dateApplied', event.target.value)} />
                </Field>
                <Field label="Follow-up due">
                  <input type="date" value={draft.deadline} onChange={(event) => updateDraft('deadline', event.target.value)} />
                </Field>
              </div>
              <Field label="Next action">
                <input value={draft.nextAction} onChange={(event) => updateDraft('nextAction', event.target.value)} placeholder="What will move this forward?" />
              </Field>
              <div className="form-grid two-col">
                <Field label="Location">
                  <input value={draft.location} onChange={(event) => updateDraft('location', event.target.value)} placeholder="City or remote" />
                </Field>
                <Field label="Work mode">
                  <select value={draft.workMode} onChange={(event) => updateDraft('workMode', event.target.value)}><option>Remote</option><option>Hybrid</option><option>On-site</option></select>
                </Field>
                <Field label="Source">
                  <input value={draft.source} onChange={(event) => updateDraft('source', event.target.value)} placeholder="Referral, LinkedIn…" />
                </Field>
                <Field label="Salary range">
                  <input value={draft.salary} onChange={(event) => updateDraft('salary', event.target.value)} placeholder="$80k–100k" />
                </Field>
              </div>
              <Field label="Job link" error={errors.jobUrl}>
                <input type="url" value={draft.jobUrl} onChange={(event) => updateDraft('jobUrl', event.target.value)} placeholder="https://…" />
              </Field>
              <Field label="Notes">
                <textarea value={draft.notes} onChange={(event) => updateDraft('notes', event.target.value)} placeholder="Contacts, prep notes, résumé version…" rows={5} />
              </Field>
              <div className="editor-actions">
                {editingId && (
                  deleteConfirm ? (
                    <div className="delete-confirm"><span>Delete this application?</span><button type="button" onClick={deleteApplication}>Yes, delete</button><button type="button" onClick={() => setDeleteConfirm(false)}>Cancel</button></div>
                  ) : (
                    <button className="delete-button" type="button" onClick={() => setDeleteConfirm(true)}><Trash2 size={17} /> Delete</button>
                  )
                )}
                <div className="action-pair"><button className="secondary-button" type="button" onClick={closeEditor}>Cancel</button><button className="primary-button" type="submit">{editingId ? 'Save changes' : 'Add application'}</button></div>
              </div>
            </form>
          </aside>
        </div>
      )}
      {lastMove && (
        <div className="move-toast" role="status" aria-live="polite">
          <span>Moved {lastMove.company} to {lastMove.to}.</span>
          <button onClick={undoStageMove}>Undo</button>
        </div>
      )}
    </div>
  )
}

function Field({ label, error, required, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className={`field ${error ? 'has-error' : ''}`}>
      <span>{label}{required && <b>Required</b>}</span>
      {children}
      {error && <small role="alert">{error}</small>}
    </label>
  )
}

function ApplicationCard({ application, onOpen, onMove, onDragStart }: { application: Application; onOpen: () => void; onMove: (stage: Stage) => void; onDragStart: () => void }) {
  return (
    <article className="application-card" draggable onDragStart={onDragStart}>
      <button className="card-main" onClick={onOpen} aria-label={`Edit ${application.role} at ${application.company}`}>
        <div className="company-avatar" aria-hidden="true">{application.company.slice(0, 2).toUpperCase()}</div>
        <div className="card-title"><strong>{application.role}</strong><span>{application.company}</span></div>
        {application.jobUrl && <ExternalLink size={15} aria-hidden="true" />}
      </button>
      <div className="card-meta">
        {application.location && <span><MapPin size={14} />{application.location}</span>}
        {application.deadline && <span className={deadlineTone(application.deadline)}><Clock3 size={14} />{formatDate(application.deadline)}</span>}
      </div>
      {application.nextAction && <p>{application.nextAction}</p>}
      <div className="card-footer">
        <span>{application.source || application.workMode}</span>
        <label className="stage-picker">
          <span className="sr-only">Move {application.company} to stage</span>
          <select value={application.stage} onChange={(event) => onMove(event.target.value as Stage)} aria-label={`Move ${application.company} to stage`}>
            {STAGES.map((stage) => <option key={stage}>{stage}</option>)}
          </select>
        </label>
      </div>
    </article>
  )
}
