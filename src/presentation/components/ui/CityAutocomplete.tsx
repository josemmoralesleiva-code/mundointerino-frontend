import { useEffect, useId, useRef, useState } from 'react'
import type { City } from '../../../domain/models/City'
import { useCitySuggestions } from '../../hooks/useCities'

interface Props {
  value: string
  onChange: (city: City | null) => void
  placeholder?: string
  className?: string
  id?: string
  params?: { comunidad?: string; provincia?: string }
}

export default function CityAutocomplete({
  value,
  onChange,
  placeholder = 'Ciudad o provincia…',
  className = '',
  id,
  params,
}: Props) {
  const inputId = useId()
  const listboxId = id || inputId
  const [query, setQuery] = useState(value)
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { suggestions: rawSuggestions, loading, error } = useCitySuggestions(query, {
    limit: 15,
    comunidad: params?.comunidad,
    provincia: params?.provincia,
  })
  const suggestions = Array.isArray(rawSuggestions) ? rawSuggestions : []

  useEffect(() => {
    setQuery(value)
  }, [value])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function selectCity(city: City) {
    setQuery(city.nombre)
    onChange(city)
    setOpen(false)
    setHighlighted(-1)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp') && suggestions.length > 0) {
      setOpen(true)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => Math.min(h + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      if (open && highlighted >= 0 && highlighted < suggestions.length) {
        e.preventDefault()
        selectCity(suggestions[highlighted])
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
      setHighlighted(-1)
    }
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder={placeholder}
        value={query}
        onChange={e => {
          setQuery(e.target.value)
          setOpen(true)
          setHighlighted(-1)
          if (e.target.value === '') onChange(null)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className="w-full bg-transparent text-gray-900 font-medium focus:outline-none placeholder:text-gray-300 text-sm"
      />
      {loading && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <div className="h-3.5 w-3.5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
      {open && (suggestions.length > 0 || loading || error) && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-1 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 max-h-72 overflow-y-auto min-w-[18rem] w-[max(100%,18rem)] sm:w-[24rem]"
        >
          {error && (
            <div className="px-4 py-3 text-xs text-red-500">{error}</div>
          )}
          {!error && !loading && suggestions.length === 0 && query.trim().length >= 2 && (
            <div className="px-4 py-3 text-xs text-gray-400">Sin resultados</div>
          )}
          {suggestions.map((c, i) => (
            <button
              key={`${c.slug}-${i}`}
              role="option"
              aria-selected={i === highlighted}
              onMouseEnter={() => setHighlighted(i)}
              onClick={() => selectCity(c)}
              className={`w-full text-left px-4 py-2.5 flex flex-col border-b border-gray-50 last:border-0 transition-colors ${
                i === highlighted ? 'bg-amber-50' : 'hover:bg-gray-50'
              }`}
            >
              <span className="font-semibold text-gray-900 text-sm">{c.nombre}</span>
              <span className="text-xs text-gray-400">
                {c.provincia}
                {c.provincia && c.comunidad ? ', ' : ''}
                {c.comunidad}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}