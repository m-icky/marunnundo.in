'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { addMedicine, updateMedicine, deleteMedicine } from '@/app/actions/owner';
import { 
  PlusCircle, 
  Search, 
  Trash2, 
  Edit3, 
  AlertCircle, 
  X, 
  FileText, 
  Calendar,
  Layers,
  CheckCircle,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  manufacturer: string | null;
  batchNumber: string | null;
  expiryDate: Date | null;
  quantity: number;
  price: number;
  prescriptionRequired: boolean;
  isAvailable: boolean;
}

interface Props {
  pharmacyId: string;
  initialMedicines: Medicine[];
}

export default function OwnerMedicinesClient({ pharmacyId, initialMedicines }: Props) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [search, setSearch] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<Medicine | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [category, setCategory] = useState('Tablet');
  const [manufacturer, setManufacturer] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [quantity, setQuantity] = useState('100');
  const [price, setPrice] = useState('10');
  const [prescriptionRequired, setPrescriptionRequired] = useState(false);

  // Feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const openAddModal = () => {
    setEditingMed(null);
    setName('');
    setGenericName('');
    setCategory('Tablet');
    setManufacturer('');
    setBatchNumber('');
    setExpiryDate('');
    setQuantity('100');
    setPrice('10');
    setPrescriptionRequired(false);
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const openEditModal = (med: Medicine) => {
    setEditingMed(med);
    setName(med.name);
    setGenericName(med.genericName);
    setCategory(med.category);
    setManufacturer(med.manufacturer || '');
    setBatchNumber(med.batchNumber || '');
    setExpiryDate(med.expiryDate ? new Date(med.expiryDate).toISOString().split('T')[0] : '');
    setQuantity(med.quantity.toString());
    setPrice(med.price.toString());
    setPrescriptionRequired(med.prescriptionRequired);
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medicine?')) return;
    try {
      const res = await deleteMedicine(pharmacyId, id);
      if (res.success) {
        setMedicines(prev => prev.filter(m => m.id !== id));
        router.refresh();
      } else {
        alert(res.error || 'Failed to delete');
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (expiryDate) {
      const selectedDate = new Date(expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setError(language === 'ml' 
          ? 'കാലാവധി കഴിഞ്ഞ തീയതി നൽകാൻ സാധിക്കില്ല (Expiry date cannot be in the past).' 
          : 'Expiry date cannot be in the past / already completed.'
        );
        setIsLoading(false);
        return;
      }
    }

    const data = {
      name,
      genericName,
      category,
      manufacturer: manufacturer || undefined,
      batchNumber: batchNumber || undefined,
      expiryDate: expiryDate || undefined,
      quantity: parseInt(quantity) || 0,
      price: parseFloat(price) || 0,
      prescriptionRequired,
    };

    try {
      if (editingMed) {
        // Edit Mode
        const res = await updateMedicine(pharmacyId, editingMed.id, data);
        if (res.success && res.medicine) {
          setMedicines(prev => prev.map(m => m.id === editingMed.id ? (res.medicine as any) : m));
          setSuccess('Medicine details updated successfully!');
          setTimeout(() => setIsModalOpen(false), 1000);
          router.refresh();
        } else {
          setError(res.error || 'Failed to update medicine');
        }
      } else {
        // Add Mode
        const res = await addMedicine(pharmacyId, data);
        if (res.success && res.medicine) {
          setMedicines(prev => [res.medicine as any, ...prev]);
          setSuccess('New medicine added to stock!');
          setTimeout(() => setIsModalOpen(false), 1000);
          router.refresh();
        } else {
          setError(res.error || 'Failed to add medicine');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.genericName.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full pb-12">
      
      {/* Header section */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">മരുന്ന് സ്റ്റോക്ക് (Inventory Manager)</h2>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              Add new stock entries, update quantities, set prices and requirements
            </p>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 self-start sm:self-center"
        >
          <PlusCircle className="w-4 h-4" />
          <span>മരുന്ന് ചേർക്കുക (Add Medicine)</span>
        </button>
      </section>

      {/* FILTER BAR */}
      <section className="glass-card rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4 bg-white">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="മരുന്നിന്റെ പേരോ വിഭാഗമോ ടൈപ്പ് ചെയ്യുക (Search by brand or generic name...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        </div>
      </section>

      {/* DATA TABLE */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-4 px-6">മരുന്നിന്റെ പേര് (Medicine)</th>
                <th className="py-4 px-6">ജനറിക് പേര് (Salt)</th>
                <th className="py-4 px-6">വിഭാഗം (Category)</th>
                <th className="py-4 px-6 text-center">അളവ് (Qty)</th>
                <th className="py-4 px-6 text-right">വില (Price)</th>
                <th className="py-4 px-6 text-center">Rx പ്രിസ്ക്രിപ്ഷൻ</th>
                <th className="py-4 px-6 text-right">മാറ്റങ്ങൾ വരുത്താം</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs font-semibold text-slate-700">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-bold italic">
                    സ്റ്റോക്കിൽ മരുന്നുകൾ ഒന്നും കണ്ടെത്തിയില്ല (No medicines found)
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((med) => (
                  <tr key={med.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Name */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-800 text-sm">{med.name}</span>
                        {med.manufacturer && (
                          <span className="text-[10px] text-slate-400 mt-0.5">{med.manufacturer}</span>
                        )}
                      </div>
                    </td>

                    {/* Generic */}
                    <td className="py-4 px-6 text-slate-500 italic max-w-[150px] truncate">
                      {med.genericName}
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6">
                      <span className="inline-block bg-slate-100 text-slate-600 font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                        {med.category}
                      </span>
                    </td>

                    {/* Qty */}
                    <td className="py-4 px-6 text-center">
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        med.quantity === 0 
                          ? 'bg-red-50 text-red-600' 
                          : med.quantity <= 10 
                          ? 'bg-amber-50 text-amber-600' 
                          : 'bg-emerald-50 text-emerald-800'
                      }`}>
                        {med.quantity}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6 text-right font-black text-slate-800">
                      ₹ {med.price.toFixed(2)}
                    </td>

                    {/* Rx */}
                    <td className="py-4 px-6 text-center">
                      {med.prescriptionRequired ? (
                        <span className="text-[9px] font-extrabold text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded">
                          Required
                        </span>
                      ) : (
                        <span className="text-[9px] font-extrabold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                          OTC
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(med)}
                          className="p-2 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
                          title="Edit"
                        >
                          <Edit3 className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(med.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* DIALOG ADD/EDIT MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 relative flex flex-col gap-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            
            {/* Modal Title */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-800 text-base">
                {editingMed ? 'മരുന്ന് വിവരം എഡിറ്റ് ചെയ്യാം (Edit Medicine)' : 'പുതിയ മരുന്ന് ചേർക്കാം (Add Medicine)'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Brand Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">മരുന്നിന്റെ പേര് (Brand Name) *</label>
                <input
                  type="text"
                  placeholder="e.g. Dolo 650"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Generic Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">ജനറിക് പേര് (Generic Formulation) *</label>
                <input
                  type="text"
                  placeholder="e.g. Paracetamol"
                  value={genericName}
                  onChange={(e) => setGenericName(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Category & Manufacturer */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">വിഭാഗം (Category) *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="Tablet">Tablet (ഗുളിക)</option>
                    <option value="Syrup">Syrup (സിറപ്പ്)</option>
                    <option value="Capsule">Capsule (ക്യാപ്സ്യൂൾ)</option>
                    <option value="Injection">Injection (ഇഞ്ചക്ഷൻ)</option>
                    <option value="Ointment">Ointment (ക്രീം/തൈലം)</option>
                    <option value="Inhaler">Inhaler (ഇൻഹേലർ)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">നിർമ്മാതാവ് (Mfg)</label>
                  <input
                    type="text"
                    placeholder="e.g. Cipla"
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Batch & Expiry */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Batch Number</label>
                  <input
                    type="text"
                    placeholder="e.g. B-1029"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  />
                </div>
              </div>

              {/* Qty & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">സ്റ്റോക്ക് അളവ് (Qty) *</label>
                  <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">വില (Price INR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Prescription check */}
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 mt-1">
                <input
                  type="checkbox"
                  checked={prescriptionRequired}
                  onChange={(e) => setPrescriptionRequired(e.target.checked)}
                  className="rounded text-red-600 w-4 h-4 focus:ring-0"
                />
                <span>Rx പ്രിസ്ക്രിപ്ഷൻ നിർബന്ധമാണ് (Prescription Required)</span>
              </label>

              {error && (
                <p className="text-xs font-bold text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error}
                </p>
              )}

              {success && (
                <p className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-250 p-2 rounded flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  {success}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer mt-3"
              >
                {isLoading ? 'Saving changes...' : editingMed ? 'മാറ്റങ്ങൾ വരുത്തുക (Save Changes)' : 'സ്റ്റോക്കിലേക്ക് ചേർക്കാം (Add Stock)'}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
