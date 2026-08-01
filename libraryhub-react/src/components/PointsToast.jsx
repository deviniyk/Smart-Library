import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function PointsToast() {
  const { toast } = useApp();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (toast) {
      // trigger enter transition on next frame
      const id = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(id);
    }
    setShow(false);
  }, [toast]);

  if (!toast) return null;

  return (
    <div className={`pts-toast${show ? ' show' : ''}`}>
      <span className="pts-toast-icon">✦</span>
      <div className="pts-toast-text">
        <strong>+{toast.amount} Points Earned!</strong>
        <span>For reading "{toast.title}"</span>
      </div>
    </div>
  );
}
