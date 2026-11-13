import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Download,
  FileText,
} from "lucide-react";
import { experienceTeams } from "../data";

export default function ExperienceSection({
  onOpenResume,
  onContact,
  compactHeading = false,
}: {
  onOpenResume: () => void;
  onContact: () => void;
  compactHeading?: boolean;
}) {
  const [expandAll, setExpandAll] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 761px)");
    const sync = () => setExpandAll(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return (
    <section
      className="experience-section"
      id="experience"
      aria-labelledby="experience-title"
    >
      <div className="page-width">
        {!compactHeading && (
          <>
            <div className="eyebrow section-eyebrow">
              <span>02</span> EXPERIENCE / TEAMS / PRACTICE
            </div>
            <div className="section-heading experience-heading">
              <h2 id="experience-title">
                Five roles.
                <br />
                One direction.
              </h2>
              <p>
                From community founding to satellite structures,
                <br />
                building more ways into aerospace.
              </p>
            </div>
          </>
        )}
        {compactHeading && (
          <h2 id="experience-title" className="sr-only">
            Experience and teams
          </h2>
        )}

        <div className="experience-layout">
          <div className="experience-timeline">
            {experienceTeams.map((team, index) => (
              <details
                className="experience-entry"
                key={team.id}
                open={expandAll || index === 0}
              >
                <summary className="experience-summary">
                  <div className="experience-index">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="experience-summary-body">
                    <div className="experience-meta">
                      <span className="experience-type">{team.type}</span>
                      <span>{team.period}</span>
                    </div>
                    <h3>{team.role}</h3>
                    <div className="experience-team">{team.team}</div>
                  </div>
                  <span className="experience-toggle" aria-hidden="true">
                    <ChevronDown size={16} />
                  </span>
                </summary>
                <div className="experience-entry-body">
                  <p>{team.description}</p>
                  <ul className="experience-highlights">
                    {team.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <div className="experience-tools">
                    <ArrowUpRight size={11} />
                    {team.focus}
                  </div>
                </div>
              </details>
            ))}
          </div>

          <aside
            className="experience-aside"
            aria-label="Resume and team resources"
          >
            <div className="resume-card" id="resume">
              <div className="resume-card-top">
                <span className="dialog-eyebrow">
                  <FileText size={11} /> CANDIDATE FILE
                </span>
                <span className="resume-updated">CURRENT SNAPSHOT</span>
              </div>
              <div className="resume-sheet" aria-hidden="true">
                <span className="resume-sheet-kicker">D. KWOK / REV. 02</span>
                <strong>Dylan Kwok</strong>
                <span className="resume-sheet-role">
                  Aerospace Engineering · Student Leader
                </span>
                <span className="resume-rule" />
                <span className="resume-sheet-line w80" />
                <span className="resume-sheet-line w65" />
                <span className="resume-sheet-label">EDUCATION</span>
                <span className="resume-sheet-line w70" />
                <span className="resume-sheet-line w55" />
                <span className="resume-sheet-label">TEAMS</span>
                <span className="resume-sheet-line w76" />
                <span className="resume-sheet-line w62" />
                <span className="resume-sheet-stamp">PDF</span>
              </div>
              <h3>The one-page version.</h3>
              <p>
                Education and the engineering teams and community organizations
                I help lead.
              </p>
              <div className="resume-actions">
                <button className="primary-button" onClick={onOpenResume}>
                  View résumé <ArrowRight size={17} />
                </button>
                <a
                  className="resume-download"
                  href="/documents/dylan-kwok-resume.pdf"
                  download="Dylan-Kwok-Resume.pdf"
                >
                  <Download size={15} /> PDF
                </a>
              </div>
              <div className="resume-card-footer">
                <span>CURRENT SNAPSHOT</span>
                <span>1 PAGE / 8.5 × 11</span>
              </div>
            </div>

            <figure className="experience-photo">
              <img
                src="/photos/team-workshop.jpg"
                alt="Two engineering students collaborating over electronics at a workbench"
                loading="lazy"
              />
              <figcaption>
                <span>FIELD LOG / TEAMWORK</span>
                <span>THE BEST IDEAS ARE USUALLY SHARED.</span>
              </figcaption>
            </figure>

            <div className="experience-contact">
              <span>ROOM FOR ONE MORE?</span>
              <p>
                I'm always interested in good teams, thoughtful projects, and
                people who ask excellent questions.
              </p>
              <button onClick={onContact}>
                Start a conversation <ArrowUpRight size={15} />
              </button>
            </div>
          </aside>
        </div>

        <div className="experience-skillline">
          <span className="skillline-label">CURRENTLY INVOLVED IN</span>
          <span>UNTITLED ROCKETRY</span>
          <span>AMERICAN ROCKETRY CHALLENGE</span>
          <span>H2GP</span>
          <span>MAKERCUBED CUBESAT</span>
          <span>FREMONT STUDENT MAKERS</span>
          <span>IRVINGTON MAKER CLUB</span>
        </div>
      </div>
    </section>
  );
}
