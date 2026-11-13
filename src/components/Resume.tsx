import {
  ArrowUpRight,
  Download,
  ExternalLink,
  Mail,
  MapPin,
} from "lucide-react";
import { experienceTeams, profile, resume } from "../data";

export default function ResumeView() {
  return (
    <div className="resume-view">
      <div className="resume-view-head">
        <div>
          <div className="dialog-eyebrow">
            CANDIDATE FILE / UPDATED {resume.updated}
          </div>
          <h2 id="dialog-title">{profile.name}</h2>
          <p className="resume-view-role">
            Aerospace Engineering · First-Year Student
          </p>
        </div>
        <div className="resume-view-links">
          <a
            className="primary-button"
            href="/documents/dylan-kwok-resume.pdf"
            download="Dylan-Kwok-Resume.pdf"
          >
            <Download size={15} /> Download PDF
          </a>
          <a
            className="text-button"
            href="/documents/dylan-kwok-resume.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Open in new tab <ExternalLink size={13} />
          </a>
        </div>
      </div>

      <div className="resume-contact-strip">
        <span>
          <Mail size={12} /> {profile.email}
        </span>
        <span>
          <MapPin size={12} /> {resume.location}
        </span>
        <span>PORTFOLIO / DYLANKWOK.SPACE</span>
      </div>

      <p className="resume-summary">{resume.headline}</p>

      <div className="resume-columns">
        <div className="resume-main-column">
          <section className="resume-block">
            <h3 className="resume-block-title">EDUCATION</h3>
            <div className="resume-edu-head">
              <div>
                <h4>{resume.education.program}</h4>
                <p>
                  {resume.education.standing} · {resume.education.location}
                </p>
              </div>
            </div>
          </section>

          <section className="resume-block">
            <h3 className="resume-block-title">EXPERIENCE & TEAMS</h3>
            {experienceTeams.map((team) => (
              <div className="resume-job" key={team.id}>
                <div className="resume-job-head">
                  <h4>{team.role}</h4>
                  <span>{team.period}</span>
                </div>
                <div className="resume-job-sub">
                  <span>{team.team}</span>
                  <span>{team.type}</span>
                </div>
                <ul>
                  {team.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

        </div>

        <aside className="resume-side-column">
          <section className="resume-side-block">
            <h3 className="resume-block-title">AREAS OF PRACTICE</h3>
            {resume.areasOfPractice.map((group) => (
              <div className="resume-skill" key={group.group}>
                <h4>{group.group}</h4>
                <p>{group.items}</p>
              </div>
            ))}
          </section>
          <section className="resume-side-block">
            <h3 className="resume-block-title">FOCUS</h3>
            <p className="resume-side-text">{resume.interests}</p>
          </section>
          <a className="resume-contact-link" href={`mailto:${profile.email}`}>
            Start a conversation <ArrowUpRight size={15} />
          </a>
        </aside>
      </div>
    </div>
  );
}
