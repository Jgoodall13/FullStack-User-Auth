import { useState, useEffect } from "react";
import { useProfile } from "../contexts/ProfileContext";

export const useFetchProfile = () => {
  const { fetchProfile, profile } = useProfile();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchProfile();
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchProfile]);

  return { profile, loading, error };
};
