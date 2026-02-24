import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const CustomSelect = ({ 
    options = [], 
    value, 
    onChange, 
    placeholder = "",
    required = false,
    className = ""
}) => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    // Find selected option
    const selectedOption = options.find(opt => String(opt.value) === String(value));

    // Filter options based on search
    const filteredOptions = options.filter(opt => 
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange({ target: { value: option.value } });
        setIsOpen(false);
        setSearch('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            setSearch('');
        }
        if (e.key === 'Enter' && filteredOptions.length > 0) {
            handleSelect(filteredOptions[0]);
        }
    };

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            {/* Hidden input for form validation */}
            <input 
                type="hidden" 
                value={value || ''} 
                required={required}
            />
            
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) {
                        setTimeout(() => inputRef.current?.focus(), 50);
                    }
                }}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl text-left transition-all duration-200"
                style={{
                    background: 'var(--bg-input)',
                    border: isOpen ? '1.5px solid var(--accent-primary)' : '1.5px solid var(--border-primary)',
                    boxShadow: isOpen ? '0 0 0 3px var(--accent-soft)' : 'none'
                }}
            >
                <span style={{ color: selectedOption ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {selectedOption ? selectedOption.label : (placeholder || t('search'))}
                </span>
                <ChevronDown 
                    size={18} 
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--text-muted)' }}
                />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div 
                    className="absolute z-50 w-full mt-2 py-2 rounded-xl animate-slideUp"
                    style={{
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border-primary)',
                        boxShadow: 'var(--shadow-xl)'
                    }}
                >
                    {/* Search Input */}
                    {options.length > 5 && (
                        <div className="px-3 pb-2 mb-2" style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder={t('search') + '...'}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="input-field text-sm"
                                    style={{ paddingLeft: '2.25rem' }}
                                />
                            </div>
                        </div>
                    )}
                    
                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto">
                        {filteredOptions.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-center" style={{ color: 'var(--text-muted)' }}>
                                {t('noResults') || 'No results found'}
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    className="w-full flex items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-colors"
                                    style={{
                                        background: String(option.value) === String(value) ? 'var(--accent-primary)' : 'transparent',
                                        color: String(option.value) === String(value) ? 'white' : 'var(--text-secondary)'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (String(option.value) !== String(value)) {
                                            e.currentTarget.style.background = 'var(--bg-hover)';
                                            e.currentTarget.style.color = 'var(--text-primary)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (String(option.value) !== String(value)) {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.color = 'var(--text-secondary)';
                                        }
                                    }}
                                >
                                    <span className="truncate">{option.label}</span>
                                    {String(option.value) === String(value) && (
                                        <Check size={16} className="shrink-0" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
