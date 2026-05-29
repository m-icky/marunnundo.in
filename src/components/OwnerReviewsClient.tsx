'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { replyToReview } from '@/app/actions/owner';
import { 
  MessageSquare, 
  Star, 
  Send, 
  CheckCircle2, 
  User, 
  AlertCircle,
  Clock
} from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  reply: string | null;
  createdAt: Date;
  user: {
    name: string;
  };
}

interface Props {
  pharmacyId: string;
  initialReviews: Review[];
}

export default function OwnerReviewsClient({ pharmacyId, initialReviews }: Props) {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  
  // Track dynamic input replies for each review
  const [replies, setReplies] = useState<{ [reviewId: string]: string }>({});
  const [loadingIds, setLoadingIds] = useState<{ [reviewId: string]: boolean }>({});
  const [successIds, setSuccessIds] = useState<{ [reviewId: string]: boolean }>({});

  const handleReplyChange = (reviewId: string, val: string) => {
    setReplies(prev => ({ ...prev, [reviewId]: val }));
  };

  const handleReplySubmit = async (reviewId: string) => {
    const text = replies[reviewId];
    if (!text || !text.trim()) return;

    setLoadingIds(prev => ({ ...prev, [reviewId]: true }));
    try {
      const res = await replyToReview(pharmacyId, reviewId, text);
      if (res.success && res.review) {
        setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, reply: text } : r));
        setSuccessIds(prev => ({ ...prev, [reviewId]: true }));
        router.refresh();
      } else {
        alert(res.error || 'Failed to submit reply');
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred');
    } finally {
      setLoadingIds(prev => ({ ...prev, [reviewId]: false }));
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-12">
      
      {/* Header card */}
      <section className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <MessageSquare className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">ഉപയോക്തൃ അഭിപ്രായങ്ങൾ (Reviews Manager)</h2>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              Read feedback from patients and publish merchant replies directly
            </p>
          </div>
        </div>
      </section>

      {/* REVIEWS GRID LIST */}
      <section className="flex flex-col gap-4">
        {reviews.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 font-bold italic shadow-sm">
            നിങ്ങളുടെ മെഡിക്കൽ ഷോപ്പിന് ഇതുവരെ റിവ്യൂകൾ ലഭിച്ചിട്ടില്ല (No patient reviews yet)
          </div>
        ) : (
          reviews.map(review => {
            const hasReply = !!review.reply;
            const replyText = replies[review.id] || '';
            const isSubmitting = loadingIds[review.id] || false;
            const isSuccess = successIds[review.id] || false;

            return (
              <div key={review.id} className="glass-card rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col gap-4 bg-white">
                
                {/* Reviewer Header */}
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-slate-800 text-sm">{review.user.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${star <= review.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-250'}`} 
                      />
                    ))}
                  </div>
                </div>

                {/* Review Content */}
                <p className="text-slate-600 text-sm leading-relaxed font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {review.comment || <span className="italic text-slate-400">No written comment provided. Only rated stars.</span>}
                </p>

                {/* Reply section */}
                {hasReply ? (
                  /* Reply Render */
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl ml-4 sm:ml-8 flex flex-col gap-1 shadow-sm animate-in slide-in-from-left-3 duration-200">
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ഫാർമസി ഉടമയുടെ മറുപടി (Owner Reply)
                    </span>
                    <p className="text-slate-600 text-xs font-semibold leading-relaxed italic mt-0.5">
                      {review.reply}
                    </p>
                  </div>
                ) : (
                  /* Reply Form Input */
                  <div className="ml-4 sm:ml-8 flex flex-col gap-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="ഈ അഭിപ്രായത്തിന് ഇവിടെ മറുപടി നൽകാം (Write your response here...)"
                        value={replyText}
                        onChange={(e) => handleReplyChange(review.id, e.target.value)}
                        disabled={isSubmitting}
                        className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                      />
                      <button
                        onClick={() => handleReplySubmit(review.id)}
                        disabled={!replyText.trim() || isSubmitting}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold p-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1 text-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSubmitting ? 'Sending...' : 'Reply'}</span>
                      </button>
                    </div>
                    {isSuccess && (
                      <p className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 animate-pulse">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Reply published successfully!
                      </p>
                    )}
                  </div>
                )}

              </div>
            );
          })
        )}
      </section>

    </div>
  );
}
