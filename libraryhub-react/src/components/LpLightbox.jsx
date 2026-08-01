import { useApp } from '../context/AppContext.jsx';

export default function LpLightbox() {
  const { lightboxSrc, setLightboxSrc } = useApp();
  if (!lightboxSrc) return null;
  return (
    <div className="lp-lightbox open" onClick={() => setLightboxSrc(null)}>
      <button className="lp-lightbox-close" onClick={() => setLightboxSrc(null)}>✕</button>
      <img src={lightboxSrc} alt="Library photo" />
    </div>
  );
}
