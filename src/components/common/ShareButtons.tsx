import React, { useState } from 'react';
import { Share2, Check, MessageCircle, Link as LinkIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const XIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

interface ShareButtonsProps {
  title: string;
  url?: string;
  className?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url, className = '' }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* WhatsApp Share Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold shadow-sm transition min-h-[44px]"
        aria-label="Share on WhatsApp"
      >
        <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
        <span>{t.whatsappShare}</span>
      </a>

      {/* Facebook Share Button */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1877F2] hover:bg-[#0C63D4] text-white text-xs font-semibold shadow-sm transition min-h-[44px]"
        aria-label="Share on Facebook"
      >
        <FacebookIcon className="w-4 h-4 text-white" />
        <span>{t.facebookShare}</span>
      </a>

      {/* Twitter / X Share Button */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-navy-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition min-h-[44px]"
        aria-label="Share on X"
      >
        <XIcon className="w-4 h-4 text-white" />
        <span>X / Twitter</span>
      </a>

      {/* Copy Link Button */}
      <button
        type="button"
        onClick={handleCopyLink}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-semibold transition min-h-[44px] ${
          copied
            ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
            : 'bg-white dark:bg-navy-900 border-slate-300 dark:border-navy-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800'
        }`}
        aria-label="Copy article link"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t.linkCopied}</span>
          </>
        ) : (
          <>
            <LinkIcon className="w-4 h-4" />
            <span>{t.copyLink}</span>
          </>
        )}
      </button>
    </div>
  );
};
