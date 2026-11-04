import React, { useRef, useState, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Undo,
  Redo,
  Eye,
  FileCode,
  Upload,
  X
} from 'lucide-react';
import { uploadImageWithProgress, validateImageFile } from '../../services/storageService';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write or paste your article content here...',
  minHeight = '320px'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [rawHtml, setRawHtml] = useState(value || '');
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageCaptionInput, setImageCaptionInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Sync incoming value to editor content if changed externally
  useEffect(() => {
    if (editorRef.current && !isHtmlMode) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
    setRawHtml(value || '');
  }, [value, isHtmlMode]);

  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (isHtmlMode) return;
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      setRawHtml(html);
    }
  };

  const handleAddLink = () => {
    const url = window.prompt('Enter hyperlink URL (e.g. https://...):');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const handleInsertImage = () => {
    if (!imageUrlInput.trim()) return;

    const imgTag = `<figure class="my-4"><img src="${imageUrlInput.trim()}" alt="${imageCaptionInput.trim()}" class="rounded-lg max-w-full h-auto" />${
      imageCaptionInput.trim()
        ? `<figcaption class="text-xs text-slate-500 mt-1 italic">${imageCaptionInput.trim()}</figcaption>`
        : ''
    }</figure><p><br></p>`;

    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('insertHTML', false, imgTag);
      handleInput();
    }

    setImageUrlInput('');
    setImageCaptionInput('');
    setShowImageModal(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      return;
    }

    setUploadError(null);
    setUploadProgress(10);

    try {
      const downloadUrl = await uploadImageWithProgress(file, 'articles/body', (pct) => {
        setUploadProgress(pct);
      });

      setImageUrlInput(downloadUrl);
      setUploadProgress(null);
    } catch (err: any) {
      setUploadError(err.message || 'Image upload failed. Try another image.');
      setUploadProgress(null);
    }
  };

  const toggleHtmlMode = () => {
    if (isHtmlMode) {
      // Switching from HTML to visual editor
      onChange(rawHtml);
      setIsHtmlMode(false);
    } else {
      // Switching from visual to HTML
      if (editorRef.current) {
        setRawHtml(editorRef.current.innerHTML);
      }
      setIsHtmlMode(true);
    }
  };

  return (
    <div className="border border-slate-300 dark:border-navy-700 rounded-xl overflow-hidden bg-white dark:bg-navy-950 focus-within:ring-2 focus-within:ring-brand-500 transition">
      {/* 1. Mobile-First Toolbar */}
      <div className="flex items-center gap-1 p-2 bg-slate-50 dark:bg-navy-900 border-b border-slate-200 dark:border-navy-800 overflow-x-auto no-scrollbar">
        {/* Headings */}
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h2>')}
          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 min-w-[40px] min-h-[40px] flex items-center justify-center font-bold text-xs"
          title="Heading 2 (H2)"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h3>')}
          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 min-w-[40px] min-h-[40px] flex items-center justify-center font-bold text-xs"
          title="Heading 3 (H3)"
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<p>')}
          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 min-w-[40px] min-h-[40px] flex items-center justify-center font-bold text-xs"
          title="Paragraph"
        >
          P
        </button>

        <span className="w-px h-5 bg-slate-300 dark:bg-navy-700 mx-1 shrink-0"></span>

        {/* Inline Formatting */}
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 min-w-[40px] min-h-[40px] flex items-center justify-center"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 min-w-[40px] min-h-[40px] flex items-center justify-center"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 min-w-[40px] min-h-[40px] flex items-center justify-center"
          title="Underline"
        >
          <Underline className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 dark:bg-navy-700 mx-1 shrink-0"></span>

        {/* Lists & Quotes */}
        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 min-w-[40px] min-h-[40px] flex items-center justify-center"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 min-w-[40px] min-h-[40px] flex items-center justify-center"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<blockquote>')}
          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 min-w-[40px] min-h-[40px] flex items-center justify-center"
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 dark:bg-navy-700 mx-1 shrink-0"></span>

        {/* Link & Media */}
        <button
          type="button"
          onClick={handleAddLink}
          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 min-w-[40px] min-h-[40px] flex items-center justify-center"
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setShowImageModal(true)}
          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 min-w-[40px] min-h-[40px] flex items-center justify-center"
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-slate-300 dark:bg-navy-700 mx-1 shrink-0"></span>

        {/* Undo / Redo */}
        <button
          type="button"
          onClick={() => executeCommand('undo')}
          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 min-w-[40px] min-h-[40px] flex items-center justify-center hidden sm:flex"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('redo')}
          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-700 dark:text-slate-300 min-w-[40px] min-h-[40px] flex items-center justify-center hidden sm:flex"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>

        {/* HTML Source Mode Toggle */}
        <button
          type="button"
          onClick={toggleHtmlMode}
          className={`ml-auto p-2 rounded text-xs font-semibold flex items-center gap-1 transition min-h-[40px] ${
            isHtmlMode
              ? 'bg-brand-500 text-white'
              : 'hover:bg-slate-200 dark:hover:bg-navy-800 text-slate-600 dark:text-slate-300'
          }`}
          title="Toggle HTML Source Code Mode"
        >
          {isHtmlMode ? <Eye className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
          <span className="text-[11px] hidden sm:inline">{isHtmlMode ? 'Visual' : 'HTML'}</span>
        </button>
      </div>

      {/* 2. Editor Input Surface */}
      {isHtmlMode ? (
        <textarea
          value={rawHtml}
          onChange={(e) => {
            setRawHtml(e.target.value);
            onChange(e.target.value);
          }}
          className="w-full p-4 font-mono text-xs sm:text-sm bg-slate-900 text-slate-100 focus:outline-none resize-y"
          style={{ minHeight }}
        ></textarea>
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="p-4 sm:p-6 focus:outline-none prose dark:prose-invert max-w-none text-navy-950 dark:text-slate-100 text-base sm:text-lg leading-relaxed selection:bg-brand-500 selection:text-white"
          style={{ minHeight }}
          data-placeholder={placeholder}
        ></div>
      )}

      {/* 3. Image Insertion / Phone Upload Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-navy-900 rounded-xl max-w-md w-full p-5 border border-slate-200 dark:border-navy-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-navy-800">
              <h3 className="font-headline font-bold text-base text-navy-950 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-brand-500" />
                Insert Article Image
              </h3>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Direct Phone Gallery / File Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Upload from Phone / Device
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 border-2 border-dashed border-brand-500/50 hover:border-brand-500 rounded-lg text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20 flex items-center justify-center gap-2 transition min-h-[44px]"
              >
                <Upload className="w-4 h-4" />
                <span>Select from Phone Gallery or Files</span>
              </button>

              {uploadProgress !== null && (
                <div className="space-y-1 pt-1">
                  <div className="h-2 w-full bg-slate-200 dark:bg-navy-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-[11px] text-slate-500 block text-right font-medium">
                    Uploading: {uploadProgress}%
                  </span>
                </div>
              )}

              {uploadError && (
                <p className="text-xs text-red-500 mt-1">{uploadError}</p>
              )}
            </div>

            {/* Or URL input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Or Paste Image Web URL
              </label>
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[44px]"
              />
            </div>

            {/* Image Preview if available */}
            {imageUrlInput.trim() && (
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                <img
                  src={imageUrlInput}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Caption */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Caption / Alt Text (Optional)
              </label>
              <input
                type="text"
                value={imageCaptionInput}
                onChange={(e) => setImageCaptionInput(e.target.value)}
                placeholder="Describe this photo for readers..."
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[44px]"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-navy-800">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-lg min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertImage}
                disabled={!imageUrlInput.trim()}
                className="px-4 py-2 text-xs font-semibold bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-lg shadow-sm transition min-h-[44px]"
              >
                Insert into Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
