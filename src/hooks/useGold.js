import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export function useGold() {
  const [isGold, setIsGold] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then((user) => {
      const goldActive =
        user?.is_gold === true &&
        (!user?.gold_expires_at || new Date(user.gold_expires_at) > new Date());
      setIsGold(goldActive);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const activateGold = async () => {
    setIsGold(true);
    try {
      const expires = new Date();
      expires.setMonth(expires.getMonth() + 1);
      await base44.auth.updateMe({
        is_gold: true,
        gold_expires_at: expires.toISOString(),
      });
    } catch (err) {
      setIsGold(false);
      throw err;
    }
  };

  return { isGold, loading, activateGold };
}