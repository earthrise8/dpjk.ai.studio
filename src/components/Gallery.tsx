import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Camera, Maximize2, X } from "lucide-react";
import Modal from "./Modal";
import { photos } from "../data";

export default function PhotoArchive() {
  const [filter, setFilter] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const visiblePhotos = photos.filter(
    (photo) => filter === "All" || photo.category === filter,
  );
  const selectedIndex = visiblePhotos.findIndex(
    (photo) => photo.id === selectedId,
  );
  const selected = selectedIndex >= 0 ? visiblePhotos[selectedIndex] : null;

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight")
        setSelectedId(
          visiblePhotos[(selectedIndex + 1) % visiblePhotos.length].id,
        );
      if (event.key === "ArrowLeft")
        setSelectedId(
          visiblePhotos[
            (selectedIndex - 1 + visiblePhotos.length) % visiblePhotos.length
          ].id,
        );
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected, visiblePhotos, selectedIndex]);

  return (
    <section
      className="photos-section light-section"
      id="photos"
      aria-labelledby="photos-title"
    >
      <div className="page-width">
        <div className="eyebrow section-eyebrow">
          <span>01</span> LIGHT / PLACE / MEMORY
        </div>
        <div className="section-heading photos-heading">
          <h2 id="photos-title">Seen along the way.</h2>
          <div className="photo-heading-aside">
            <span>
              <Camera size={13} /> {photos.length} FRAMES / VOL. 01
            </span>
            <div className="photo-filters" aria-label="Filter photographs">
              {["All", ...Array.from(new Set(photos.map((photo) => photo.category)))].map((option) => (
                <button
                  key={option}
                  className={filter === option ? "active" : ""}
                  aria-pressed={filter === option}
                  onClick={() => {
                    setFilter(option);
                    setSelectedId(null);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="photo-grid" aria-live="polite">
          {visiblePhotos.map((photo, index) => (
            <motion.button
              layout
              key={photo.id}
              className={`photo-card photo-card-${(photos.indexOf(photo) % 6) + 1}`}
              onClick={() => setSelectedId(photo.id)}
              aria-label={`Open photograph: ${photo.title}, ${photo.location}`}
            >
              <img src={photo.src} alt={photo.alt} loading="lazy" />
              <span className="photo-index">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(visiblePhotos.length).padStart(2, "0")}
              </span>
              <span className="photo-open">
                <Maximize2 size={14} />
              </span>
              <span className="photo-caption">
                <span>
                  <strong>{photo.title}</strong>
                  <small>{photo.location}</small>
                </span>
                <small>{photo.category}</small>
              </span>
            </motion.button>
          ))}
        </div>
        <div className="photos-footnote">
          <span className="status-dot" /> A rotating archive. More frames will
          join as the journey continues.
          <span className="footnote-rule" />
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <Modal
            contentKey={selected.id}
            onClose={() => setSelectedId(null)}
            wide
          >
            <div className="photo-lightbox">
              <div className="lightbox-toolbar">
                <span className="dialog-eyebrow">
                  FRAME {String(selectedIndex + 1).padStart(2, "0")} /{" "}
                  {String(visiblePhotos.length).padStart(2, "0")}
                </span>
                <div className="lightbox-controls">
                  <button
                    className="icon-button"
                    aria-label="Previous photograph"
                    onClick={() =>
                      setSelectedId(
                        visiblePhotos[
                          (selectedIndex - 1 + visiblePhotos.length) %
                            visiblePhotos.length
                        ].id,
                      )
                    }
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label="Next photograph"
                    onClick={() =>
                      setSelectedId(
                        visiblePhotos[
                          (selectedIndex + 1) % visiblePhotos.length
                        ].id,
                      )
                    }
                  >
                    <ArrowRight size={18} />
                  </button>
                  <button
                    className="icon-button lightbox-close"
                    aria-label="Close photograph"
                    onClick={() => setSelectedId(null)}
                  >
                    <X size={19} />
                  </button>
                </div>
              </div>
              <div className="lightbox-image-wrap">
                <img src={selected.src} alt={selected.alt} />
                <span className="lightbox-cross tl">+</span>
                <span className="lightbox-cross tr">+</span>
                <span className="lightbox-cross bl">+</span>
                <span className="lightbox-cross br">+</span>
              </div>
              <div className="lightbox-caption">
                <div>
                  <h2 id="dialog-title">{selected.title}</h2>
                  <p>
                    {selected.location} <span>/</span> {selected.category}{" "}
                    <span>/</span> {selected.date}
                  </p>
                </div>
                <div className="lightbox-credit">
                  <span>IMAGE CREDIT</span>
                  <p>{selected.credit}</p>
                </div>
              </div>
              <p className="lightbox-hint">
                <ArrowLeft size={11} /> <ArrowRight size={11} /> Use arrow keys
                to move through the archive
              </p>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </section>
  );
}
