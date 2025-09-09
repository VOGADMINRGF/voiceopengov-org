// components/VoteBar.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const colors = {
  turquoise: "#04bfbf",
  warning: "#ffd166",
  coral: "#ef476f"
};

export default function VoteBar({ statementId, labels = ["Zustimmung", "Neutral", "Ablehnung"] }) {
  const [votes, setVotes] = useState({ agree: 0, neutral: 0, disagree: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/votes/summary?statementId=${statementId}`)
      .then(res => res.json())
      .then(data => {
        setVotes({
          agree: data.agree || 0,
          neutral: data.neutral || 0,
          disagree: data.disagree || 0
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [statementId]);

  if (loading) {
    return <div className="w-full h-8 bg-gray-100 animate-pulse rounded" />;
  }

  const { agree, neutral, disagree } = votes;
  const sum = agree + neutral + disagree;
  const pc = n => sum ? ((n / sum) * 100).toFixed(1) : "0.0";

  return (
    <div className="w-full flex flex-col gap-1 mt-2">
     <div className="flex items-center gap-4 text-xs font-semibold">
  <span style={{ color: colors.turquoise }}>👍 {agree} {/* <span className="ml-1 text-neutral-400">({pc(agree)}%)</span> */}</span>
  <span style={{ color: colors.warning }}>🤔 {neutral} {/* <span className="ml-1 text-neutral-400">({pc(neutral)}%)</span> */}</span>
  <span style={{ color: colors.coral }}>👎 {disagree} {/* <span className="ml-1 text-neutral-400">({pc(disagree)}%)</span> */}</span>
</div>

      <div className="relative flex h-3 w-full rounded-full bg-gray-200 overflow-hidden">
        <motion.div
          initial={{ width: 0 }} animate={{ width: pc(agree) + "%" }}
          style={{ background: colors.turquoise }} className="h-full"
        />
        <motion.div
          initial={{ width: 0 }} animate={{ width: pc(neutral) + "%", left: pc(agree) + "%" }}
          style={{ background: colors.warning, position: "absolute", left: pc(agree) + "%" }} className="h-full"
        />
        <motion.div
          initial={{ width: 0 }} animate={{ width: pc(disagree) + "%", left: (parseFloat(pc(agree)) + parseFloat(pc(neutral))) + "%" }}
          style={{ background: colors.coral, position: "absolute", left: (parseFloat(pc(agree)) + parseFloat(pc(neutral))) + "%" }} className="h-full"
        />
        {/* Prozent-Labels auf dem Balken 
        {["agree", "neutral", "disagree"].map((type, i) => (
          <span
            key={type}
            className="absolute top-1 left-1 text-[10px] font-bold"
            style={{
              color: "#fff",
              left:
                type === "agree" ? pc(agree) + "%" :
                type === "neutral" ? (parseFloat(pc(agree)) + parseFloat(pc(neutral) / 2)) + "%" :
                "calc(100% - 35px)"
            }}>
            {pc(type === "agree" ? agree : type === "neutral" ? neutral : disagree)}%
          </span>
        ))}*/}
      </div>
      <div className="flex justify-between text-[11px] text-neutral-400 px-1">
        {labels.map((l, i) => <span key={i}>{l}</span>)}
      </div>
    </div>
  );
}
