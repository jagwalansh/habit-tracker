'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ExpenseCategory } from '../lib/types';
import { X } from 'lucide-react';

const CATEGORY_OPTIONS: { value: ExpenseCategory; label: string; emoji: string }[] = [
  { value: 'food', label: 'Food', emoji: '🍕' },
  { value: 'transport', label: 'Transport', emoji: '🚕' },
  { value: 'shopping', label: 'Shopping', emoji: '🛒' },
  { value: 'bills', label: 'Bills', emoji: '📄' },
  { value: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { value: 'health', label: 'Health', emoji: '💊' },
  { value: 'other', label: 'Other', emoji: '📌' },
];

interface AddExpenseModalProps {
  isOpen: boolean;
  maxDays: number;
  defaultDay: number;
  editingExpense?: {
    id: string;
    dayNumber: number;
    amount: number;
    category: ExpenseCategory;
    note?: string;
  } | null;
  onClose: () => void;
  onSave: (dayNumber: number, amount: number, category: ExpenseCategory, note: string) => void;
  onDelete?: (id: string) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  maxDays,
  defaultDay,
  editingExpense,
  onClose,
  onSave,
  onDelete,
}) => {
  const [day, setDay] = useState(defaultDay);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [note, setNote] = useState('');
  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingExpense) {
        setDay(editingExpense.dayNumber);
        setAmount(String(editingExpense.amount));
        setCategory(editingExpense.category);
        setNote(editingExpense.note || '');
      } else {
        setDay(defaultDay);
        setAmount('');
        setCategory('food');
        setNote('');
      }
      setTimeout(() => amountRef.current?.focus(), 100);
    }
  }, [isOpen, defaultDay, editingExpense]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    onSave(day, parsedAmount, category, note.trim());
    onClose();
  };

  const isEditing = !!editingExpense;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--ink-muted)',
          }}
        >
          <X size={18} />
        </button>

        <h3 style={{
          fontSize: '18px',
          fontFamily: 'var(--font-primary)',
          fontWeight: 700,
          marginBottom: '18px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          {isEditing ? '✏️ Edit Expense' : '💰 Add Expense'}
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Day Picker */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontFamily: 'var(--font-primary)',
              fontWeight: 700,
              marginBottom: '4px',
              color: 'var(--ink-muted)',
              textTransform: 'uppercase',
            }}>
              Day
            </label>
            <input
              type="number"
              min={1}
              max={maxDays}
              value={day}
              onChange={(e) => setDay(Math.max(1, Math.min(maxDays, parseInt(e.target.value) || 1)))}
              className="hand-input"
              style={{ width: '80px', textAlign: 'center' }}
            />
          </div>

          {/* Amount */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontFamily: 'var(--font-primary)',
              fontWeight: 700,
              marginBottom: '4px',
              color: 'var(--ink-muted)',
              textTransform: 'uppercase',
            }}>
              Amount
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '16px',
                fontWeight: 700,
                color: 'var(--ink-muted)',
                fontFamily: 'var(--font-primary)',
              }}>₹</span>
              <input
                ref={amountRef}
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="hand-input"
                style={{ paddingLeft: '28px' }}
              />
            </div>
          </div>

          {/* Category */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontFamily: 'var(--font-primary)',
              fontWeight: 700,
              marginBottom: '6px',
              color: 'var(--ink-muted)',
              textTransform: 'uppercase',
            }}>
              Category
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: '13px',
                    fontWeight: 700,
                    padding: '5px 10px',
                    borderRadius: '14px',
                    border: category === cat.value
                      ? '2px solid var(--ink-black)'
                      : '1.5px solid var(--paper-dot)',
                    background: category === cat.value ? 'var(--ink-black)' : 'var(--paper-bg)',
                    color: category === cat.value ? '#ffffff' : 'var(--ink-black)',
                    cursor: 'pointer',
                    transition: 'all 0.12s ease',
                    boxShadow: category === cat.value ? '2px 2px 0px var(--ink-black)' : 'none',
                  }}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontFamily: 'var(--font-primary)',
              fontWeight: 700,
              marginBottom: '4px',
              color: 'var(--ink-muted)',
              textTransform: 'uppercase',
            }}>
              Note (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Lunch at cafe"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="hand-input"
              maxLength={60}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button type="submit" className="hand-button primary" style={{ flex: 1 }}>
              {isEditing ? 'Save Changes' : '+ Add Expense'}
            </button>
            {isEditing && editingExpense && onDelete && (
              <button
                type="button"
                className="hand-button danger"
                onClick={() => {
                  onDelete(editingExpense.id);
                  onClose();
                }}
              >
                Delete
              </button>
            )}
            <button type="button" className="hand-button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

