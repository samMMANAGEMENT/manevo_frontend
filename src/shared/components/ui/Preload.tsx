import { useEffect, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700&display=swap');

  .mnv-preloader {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: #111817;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 28px;
    font-family: 'Manrope', sans-serif;
    transition: opacity 0.6s ease, visibility 0.6s ease;
  }

  .mnv-preloader.mnv-hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }

  /* --- Logo --- */
  .mnv-logo {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .mnv-logo svg {
    width: 62px;
    height: 36px;
  }

  .mnv-pill-left {
    animation: mnv-pulse-left 1.6s ease-in-out infinite;
    transform-origin: center;
    transform-box: fill-box;
  }

  .mnv-pill-right {
    animation: mnv-pulse-right 1.6s ease-in-out infinite;
    transform-origin: center;
    transform-box: fill-box;
  }

  @keyframes mnv-pulse-left {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.3; transform: scale(0.9); }
  }

  @keyframes mnv-pulse-right {
    0%, 100% { opacity: 0.3; transform: scale(0.9); }
    50%       { opacity: 1; transform: scale(1); }
  }

  /* --- Scan line --- */
  .mnv-scan {
    width: 62px;
    height: 2px;
    background: #13ECDA;
    border-radius: 2px;
    animation: mnv-scan 1.6s ease-in-out infinite;
  }

  @keyframes mnv-scan {
    0%, 100% { width: 8px;  opacity: 0.3; }
    50%       { width: 62px; opacity: 1;   }
  }

  /* --- Wordmark --- */
  .mnv-wordmark {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.015em;
    color: #F6F8F8;
    animation: mnv-fade 1.6s ease-in-out infinite;
  }

  .mnv-wordmark span {
    color: #13ECDA;
  }

  @keyframes mnv-fade {
    0%, 100% { opacity: 0.5; }
    50%       { opacity: 1;   }
  }

  /* --- Dots --- */
  .mnv-dots {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .mnv-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #13ECDA;
    opacity: 0.2;
    animation: mnv-dot 1.6s ease-in-out infinite;
  }

  .mnv-dot:nth-child(1) { animation-delay: 0s;    }
  .mnv-dot:nth-child(2) { animation-delay: 0.26s; }
  .mnv-dot:nth-child(3) { animation-delay: 0.52s; }

  @keyframes mnv-dot {
    0%, 80%, 100% { opacity: 0.2; transform: scale(1);   }
    40%            { opacity: 1;   transform: scale(1.5); }
  }

  /* --- Tagline --- */
  .mnv-tag {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #A7F3D0;
    animation: mnv-tag 1.6s ease-in-out infinite;
  }

  @keyframes mnv-tag {
    0%, 100% { opacity: 0.3; }
    50%       { opacity: 0.7; }
  }
`;

export interface ManevoPreloaderProps {
    duration?: number;
    onComplete?: () => void;
    global?: boolean;
}

export default function ManevoPreloader({ duration = 1500, onComplete, global = true }: ManevoPreloaderProps) {
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        let isMinTimeElapsed = false;
        let isAxiosLoading = false;

        const checkAndHide = () => {
            if (isMinTimeElapsed && !isAxiosLoading) {
                setHidden(true);
            }
        };

        const timer = setTimeout(() => {
            isMinTimeElapsed = true;
            checkAndHide();
            if (onComplete) onComplete();
        }, duration);

        if (global) {
            const handleShow = () => {
                isAxiosLoading = true;
                setHidden(false);
            };
            const handleHide = () => {
                isAxiosLoading = false;
                checkAndHide();
            };

            window.addEventListener("mnv-preloader-show", handleShow);
            window.addEventListener("mnv-preloader-hide", handleHide);

            return () => {
                clearTimeout(timer);
                window.removeEventListener("mnv-preloader-show", handleShow);
                window.removeEventListener("mnv-preloader-hide", handleHide);
            };
        } else {
            return () => {
                clearTimeout(timer);
            };
        }
    }, [duration, onComplete, global]);

    return (
        <>
            <style>{styles}</style>
            <div className={`mnv-preloader${hidden ? " mnv-hidden" : ""}`} role="status" aria-label="Cargando manevo">
                <div className="mnv-logo">
                    <svg viewBox="0 0 31 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <rect className="mnv-pill-left" x="0" y="0" width="18" height="18" rx="9" fill="#13ECDA" />
                        <rect className="mnv-pill-right" x="22" y="0" width="9" height="18" rx="4.5" fill="#13ECDA" />
                    </svg>
                    {/* <div className="mnv-scan" aria-hidden="true" /> */}
                </div>
                {/* 
                <div className="mnv-wordmark">
                    man<span>e</span>vo
                </div>

                <div className="mnv-dots" aria-hidden="true">
                    <div className="mnv-dot" />
                    <div className="mnv-dot" />
                    <div className="mnv-dot" />
                </div> */}
            </div>
        </>
    );
}