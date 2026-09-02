import React, { useState, useEffect } from 'react';
import { Phone, Heart, ShieldAlert } from 'lucide-react';
import { fetchCrisisResources } from '../services/aiService';

const HelpPage = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getResources = async () => {
      try {
        const data = await fetchCrisisResources();
        if (data && data.length > 0) {
          setResources(data);
        } else {
          throw new Error("No resources returned");
        }
      } catch (err) {
        // Fallback if API fails
        setResources([
          { name: "National Suicide Prevention Lifeline", phone: "988" },
          { name: "Crisis Text Line", phone: "Text HOME to 741741" },
          { name: "The Trevor Project", phone: "866-488-7386" },
          { name: "Veterans Crisis Line", phone: "988, press 1" }
        ]);
      } finally {
        setLoading(false);
      }
    };
    getResources();
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-card/60 backdrop-blur-xl border border-border rounded-3xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <div className="px-6 py-5 border-b border-border bg-card/40">
        <h2 className="font-bold text-foreground text-2xl flex items-center gap-2">
          <Heart className="text-destructive" size={24} /> Get Help Now
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-destructive/10 border border-destructive/20 text-foreground p-6 rounded-2xl flex flex-col items-center text-center gap-4">
            <ShieldAlert className="text-destructive w-12 h-12" />
            <p className="text-lg font-medium">If you are in immediate danger, please call your local emergency services (like 911 in the US and Canada) or go to the nearest emergency room.</p>
          </div>

          <h3 className="text-xl font-semibold mt-8 mb-4">Crisis Resources</h3>
          
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {resources.map((resource, i) => (
                <div key={i} className="bg-background/50 border border-border rounded-2xl p-5 hover:border-primary/50 transition-colors">
                  <h4 className="font-semibold text-lg mb-2">{resource.name}</h4>
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <Phone size={18} />
                    {resource.phone.includes('Text') ? (
                       <span>{resource.phone}</span>
                    ) : (
                      <a href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`} className="hover:underline">{resource.phone}</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>You don't have to go through this alone. Reach out to one of the resources above to connect with someone who can help right now.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
