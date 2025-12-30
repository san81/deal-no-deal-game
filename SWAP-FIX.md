# Swap Offer Timing Fix

## Problem
The swap offer was triggering at `openedCases.length === 6`, which meant all 6 non-player cases were opened, leaving only the player's case. At that point, there was no other case available to swap with.

## Solution
Swap now triggers after the 2nd banker offer (when 5 cases are opened and 2 cases remain).

## Complete Game Flow

### Phase 1: Case Selection
- Player selects their lucky case
- Total: 7 cases (1 player's + 6 to open)

### Phase 2: Opening Cases
1. **Open Case 1** → `openedCases.length = 1`
2. **Open Case 2** → `openedCases.length = 2`
3. **Open Case 3** → `openedCases.length = 3` → **Banker Ready #1** (`bankerOfferCount = 1`)

   **User Options:**
   - Click "📞 Check Uncle Donald's Offer" → See offer → Accept (game ends) / Decline (continue)
   - Click "⏭️ Keep Playing" → Continue to case 4

4. **Open Case 4** → `openedCases.length = 4`
5. **Open Case 5** → `openedCases.length = 5` → **Banker Ready #2** (`bankerOfferCount = 2`)

   **User Options:**
   - Click "📞 Check Uncle Donald's Offer" → See offer → Accept (game ends) / Decline (**triggers swap**)
   - Click "⏭️ Keep Playing" → **Triggers swap**

### Phase 3: Swap Offer
**Trigger Conditions:**
- `openedCases.length === 5` AND `bankerOfferCount === 2`

**At this point:**
- 5 cases opened and revealed
- 2 cases remaining (player's case + 1 unopened case)

**User chooses:**
- Keep their original case OR
- Swap to the other unopened case

### Phase 4: Final Reveal
- Shows player's final case (original or swapped)
- User clicks "🎉 See My Result!" button
- Drumroll plays for 1 second
- Transitions to game result

### Phase 5: Game Result
- Shows what the player won/got
- Options: Next Kid / New Game / Change Theme

## Code Changes

### 1. GameBoard.tsx - handleContinuePlaying()
```typescript
const handleContinuePlaying = () => {
  playSound('click');

  // After 2nd banker offer (5 cases opened), trigger swap instead of continuing
  if (state.openedCases.length === 5 && state.bankerOfferCount === 2) {
    setPhase('swap-offer');
  } else {
    setPhase('opening-cases');
  }
};
```

### 2. GameContext.tsx - DECLINE_BANKER_OFFER
```typescript
case 'DECLINE_BANKER_OFFER':
  // After 2nd banker offer (5 cases opened), trigger swap instead of continuing
  const shouldTriggerSwap = state.openedCases.length === 5 && state.bankerOfferCount === 2;
  return {
    ...state,
    phase: shouldTriggerSwap ? 'swap-offer' : 'opening-cases',
  };
```

### 3. GameContext.tsx - OPEN_CASE
Removed incorrect swap trigger:
```typescript
// OLD (INCORRECT):
} else if (newOpenedCases.length === 6) {
  newPhase = 'swap-offer';
}

// NEW: Removed - swap now triggers after 2nd banker offer is handled
```

## Why This Works
1. **Correct Timing**: Swap appears when exactly 2 cases remain (perfect for dramatic choice)
2. **Multiple Paths**: Whether user checks banker offer or keeps playing, swap triggers correctly
3. **No Edge Cases**: Can't reach a state where swap is impossible (only 1 case left)

## Testing Checklist
✅ Open cases 1-3, skip banker #1, continue playing
✅ Open cases 4-5, skip banker #2 → Swap appears
✅ Open cases 1-3, check banker #1, decline, continue
✅ Open cases 4-5, check banker #2, decline → Swap appears
✅ Accept swap → See final reveal with swapped case
✅ Decline swap → See final reveal with original case
✅ Accept banker #1 → Game ends immediately (no swap)
✅ Accept banker #2 → Game ends immediately (no swap)
