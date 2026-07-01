"use client";

import { useState, useEffect } from "react";
import type { TeamMember } from "@/src/types/content";
import { TeamCard } from "./team-card";

/**
 * Fisher-Yates in-place shuffle — returns a new array, never mutates the input.
 */
function shuffle<T>(arr: readonly T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

type ShuffledTeamGridProps = {
  members: TeamMember[];
  /**
   * Optional function that computes the portrait alt text for a member.
   * Callers in a locale context can pass a translated formatter here.
   * Defaults to "{name} portrait" when omitted.
   */
  getPortraitAlt?: (name: string) => string;
};

/**
 * Renders TeamCard components in a random order that changes on every page load.
 *
 * The component initialises with the original `members` order so the server HTML
 * and the first client render are identical (no hydration mismatch). After
 * hydration, the useEffect fires and re-renders with a shuffled order.
 */
export function ShuffledTeamGrid({ members, getPortraitAlt }: ShuffledTeamGridProps) {
  const [ordered, setOrdered] = useState<TeamMember[]>(members);

  useEffect(() => {
    setOrdered(shuffle(members));
  }, [members]);

  return (
    <>
      {ordered.map((member) => (
        <TeamCard
          key={member.id}
          member={member}
          portraitAlt={getPortraitAlt ? getPortraitAlt(member.name) : `${member.name} portrait`}
        />
      ))}
    </>
  );
}
