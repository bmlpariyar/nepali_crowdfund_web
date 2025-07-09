import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Bold, Italic, Underline, Heading1, Heading2, Heading3, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

const RichTextarea = ({
    value = '',
    onChange,
    placeholder = 'Start typing...',
    className = '',
    minHeight = '200px'
}) => {
    const editorRef = useRef(null);
    const [activeStyles, setActiveStyles] = useState({
        bold: false,
        italic: false,
        underline: false,
        h1: false,
        h2: false,
        h3: false,
        ul: false,
        ol: false,
        justifyLeft: false,
        justifyCenter: false,
        justifyRight: false,
    });

    // Inject styles into the document head
    useEffect(() => {
        const styleId = 'richtextarea-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
      .richtext-editor-content:empty:before {
        content: attr(data-placeholder);
        color: #9CA3AF; /* gray-400 */
        font-style: italic;
        cursor: text;
        position: absolute;
      }
      .richtext-editor-content h1 { font-size: 1.875rem; font-weight: bold; margin: 0.6em 0; }
      .richtext-editor-content h2 { font-size: 1.5rem; font-weight: bold; margin: 0.6em 0; }
      .richtext-editor-content h3 { font-size: 1.25rem; font-weight: bold; margin: 0.6em 0; }
      .richtext-editor-content ul, .richtext-editor-content ol { margin: 0.6em 0; padding-left: 1.5rem; }
      .richtext-editor-content ul { list-style-type: disc; }
      .richtext-editor-content ol { list-style-type: decimal; }
      .richtext-editor-content li { margin: 0.25em 0; }
      .richtext-editor-content p { margin: 0.6em 0; }
    `;
        document.head.appendChild(style);

        return () => {
            const styleElement = document.getElementById(styleId);
            if (styleElement) {
                document.head.removeChild(styleElement);
            }
        };
    }, []);

    const updateActiveStyles = useCallback(() => {
        if (document.activeElement === editorRef.current) {
            const isH1 = document.queryCommandValue('formatBlock') === 'h1';
            const isH2 = document.queryCommandValue('formatBlock') === 'h2';
            const isH3 = document.queryCommandValue('formatBlock') === 'h3';

            setActiveStyles({
                bold: document.queryCommandState('bold'),
                italic: document.queryCommandState('italic'),
                underline: document.queryCommandState('underline'),
                h1: isH1,
                h2: isH2,
                h3: isH3,
                ul: document.queryCommandState('insertUnorderedList'),
                ol: document.queryCommandState('insertOrderedList'),
                justifyLeft: document.queryCommandState('justifyLeft'),
                justifyCenter: document.queryCommandState('justifyCenter'),
                justifyRight: document.queryCommandState('justifyRight'),
            });
        }
    }, []);

    useEffect(() => {
        document.addEventListener('selectionchange', updateActiveStyles);
        return () => document.removeEventListener('selectionchange', updateActiveStyles);
    }, [updateActiveStyles]);

    const execCommand = useCallback((command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        updateActiveStyles();
        if (onChange) {
            onChange(editorRef.current?.innerHTML || '');
        }
    }, [onChange, updateActiveStyles]);

    const handleInput = useCallback(() => {
        if (onChange) {
            onChange(editorRef.current?.innerHTML || '');
        }
    }, [onChange]);

    const handleKeyDown = useCallback((event) => {
        if (event.ctrlKey || event.metaKey) { // Handle Ctrl (Windows) and Cmd (Mac)
            switch (event.key.toLowerCase()) {
                case 'b':
                    event.preventDefault();
                    execCommand('bold');
                    break;
                case 'i':
                    event.preventDefault();
                    execCommand('italic');
                    break;
                case 'u':
                    event.preventDefault();
                    execCommand('underline');
                    break;
                default:
                    break;
            }
        }
    }, [execCommand]);




    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const toggleBlockType = (type) => {
        const currentBlock = document.queryCommandValue('formatBlock');
        execCommand('formatBlock', currentBlock === type ? 'p' : type);
    };

    const ToolbarButton = ({ onClick, isActive, title, children }) => (
        <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
            className={`p-2 rounded border transition-all duration-200 ${isActive
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                }`}
            title={title}
        >
            {children}
        </button>
    );

    return (
        <div className={`border border-gray-300 rounded-lg ${className}`}>
            <div className="flex items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-lg flex-wrap">
                <ToolbarButton onClick={() => execCommand('bold')} isActive={activeStyles.bold} title="Bold (Ctrl+B)">
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => execCommand('italic')} isActive={activeStyles.italic} title="Italic (Ctrl+I)">
                    <Italic className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => execCommand('underline')} isActive={activeStyles.underline} title="Underline (Ctrl+U)">
                    <Underline className="w-4 h-4" />
                </ToolbarButton>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <ToolbarButton onClick={() => toggleBlockType('h1')} isActive={activeStyles.h1} title="Heading 1">
                    <Heading1 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => toggleBlockType('h2')} isActive={activeStyles.h2} title="Heading 2">
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => toggleBlockType('h3')} isActive={activeStyles.h3} title="Heading 3">
                    <Heading3 className="w-4 h-4" />
                </ToolbarButton>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <ToolbarButton onClick={() => execCommand('insertUnorderedList')} isActive={activeStyles.ul} title="Bullet List">
                    <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => execCommand('insertOrderedList')} isActive={activeStyles.ol} title="Numbered List">
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <ToolbarButton onClick={() => execCommand('justifyLeft')} isActive={activeStyles.justifyLeft} title="Align Left">
                    <AlignLeft className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => execCommand('justifyCenter')} isActive={activeStyles.justifyCenter} title="Align Center">
                    <AlignCenter className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => execCommand('justifyRight')} isActive={activeStyles.justifyRight} title="Align Right">
                    <AlignRight className="w-4 h-4" />
                </ToolbarButton>
            </div>
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onClick={updateActiveStyles}
                onKeyUp={updateActiveStyles}
                onKeyDown={handleKeyDown}
                className="richtext-editor-content relative p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-b-lg min-h-[250px] max-h-[400px] overflow-y-auto"
                data-placeholder={placeholder}
                suppressContentEditableWarning={true}
            />
        </div>
    );
};

export default RichTextarea;    