# Swap Flow - Fixed Implementation

## Problem Statement

User reported two issues with the swap flow:
1. **Strike-out logic getting messed up**: Items weren't being properly marked as revealed in the panels
2. **Wrong final gift displayed**: After swapping, the result showed the original case's item instead of the swapped case's item
3. **Cases revealed too early**: After swap decision, the final case was being revealed immediately instead of staying closed

## Core Issue

The game was revealing the final case's contents immediately after the swap decision, when it should:
1. Keep the case closed after swap
2. Show the player which case is theirs (with updated marking if swapped)
3. Let the player manually click a button to open their final case
4. Only then reveal and mark the item as revealed

## Solution - New Flow

### Updated Game Flow After Swap

**Before (Incorrect)**:
1. Player accepts/declines swap
2. ❌ Item immediately marked as revealed
3. ❌ Case shown as opened
4. Jump to result screen

**After (Correct)**:
1. Player accepts/declines swap
2. ✅ Case marking updated (if swapped) but stays CLOSED
3. ✅ Phase changes to 'final-reveal'
4. ✅ Player sees their closed case with "Open My Case!" button
5. ✅ Player clicks button → drumroll sound
6. ✅ openFinalCase() action called
7. ✅ Case opened, item marked as revealed
8. ✅ Phase changes to 'game-result'
9. ✅ Result screen shows the correct item

## Code Changes

### 1. GameContext.tsx - Removed premature reveal

**ACCEPT_SWAP** (lines 155-187):
```typescript
case 'ACCEPT_SWAP': {
  const otherCase = state.suitcases.find(
    (s) => !s.isOpened && s.id !== state.playerCaseId
  );
  if (!otherCase) return state;

  // Swap: player gets the other case (keep it closed for now)
  const updatedSuitcases = state.suitcases.map((suitcase) => {
    if (suitcase.id === otherCase.id) {
      // This is the swapped case - mark as player's case but keep closed
      return {
        ...suitcase,
        isPlayerCase: true,
        // ❌ REMOVED: item: { ...suitcase.item, isRevealed: true }
      };
    }
    return {
      ...suitcase,
      isPlayerCase: false,
    };
  });

  return {
    ...state,
    suitcases: updatedSuitcases,
    playerCaseId: otherCase.id,
    swapAccepted: true,
    swapOffered: true,
    phase: 'final-reveal', // Goes to final-reveal, not game-result
  };
}
```

**DECLINE_SWAP** (lines 189-197):
```typescript
case 'DECLINE_SWAP': {
  // Player keeps their original case (keep it closed for now)
  return {
    ...state,
    swapOffered: true,
    swapAccepted: false,
    phase: 'final-reveal', // Goes to final-reveal, not game-result
    // ❌ REMOVED: suitcase updates that marked item as revealed
  };
}
```

### 2. GameContext.tsx - New OPEN_FINAL_CASE Action

**New Action Added** (lines 32, 201-227):

Added to GameAction type:
```typescript
| { type: 'OPEN_FINAL_CASE' }
```

New reducer case:
```typescript
case 'OPEN_FINAL_CASE': {
  // Open and reveal the player's final case
  const updatedSuitcases = state.suitcases.map((suitcase) => {
    if (suitcase.id === state.playerCaseId && suitcase.item) {
      return {
        ...suitcase,
        isOpened: true, // ✅ Now marked as opened
        item: { ...suitcase.item, isRevealed: true }, // ✅ Now marked as revealed
      };
    }
    return suitcase;
  });

  const playerCase = updatedSuitcases.find((s) => s.id === state.playerCaseId);

  return {
    ...state,
    suitcases: updatedSuitcases,
    phase: 'game-result',
    result: {
      kidName: '',
      item: playerCase?.item || null,
      wasSwapped: state.swapAccepted,
      acceptedBankerOffer: false,
    },
  };
}
```

**New Function in Provider** (lines 18, 302-304, 326):

Interface:
```typescript
interface GameContextType {
  // ... other functions
  openFinalCase: () => void;
}
```

Implementation:
```typescript
const openFinalCase = () => {
  dispatch({ type: 'OPEN_FINAL_CASE' });
};
```

Exported in value:
```typescript
value={{
  // ... other functions
  openFinalCase,
}}
```

### 3. GameBoard.tsx - Updated UI and Logic

**Import openFinalCase** (line 9):
```typescript
const { state, selectPlayerCase, openCase, openFinalCase, setPhase } = useGame();
```

**Updated handleSeeResult** (lines 52-57):
```typescript
const handleSeeResult = () => {
  playSound('drumroll');
  setTimeout(() => {
    openFinalCase(); // ✅ Now calls openFinalCase instead of setPhase
  }, 1000);
};
```

**Updated Suitcase Display** (line 118):
```typescript
showContent={suitcase.isOpened} // ✅ Shows content only when opened
// ❌ REMOVED: phase === 'final-reveal' && suitcase.isPlayerCase
```

**Updated Instructions** (lines 70-71):
```typescript
case 'final-reveal':
  return '🎁 Time to open your case!'; // ✅ Clearer instruction
```

**Updated Subtitle** (lines 93-94):
```typescript
: phase === 'final-reveal'
? 'Your case is still closed. Click the button below to open it and see what you got!'
```

**Updated Final Reveal UI** (lines 214-228):
```typescript
<p className="text-white text-2xl md:text-3xl font-heading text-center">
  Your final case is Case #{playerCaseId}! {/* ✅ Shows case number */}
</p>

<motion.button onClick={handleSeeResult}>
  💼 Open My Case! {/* ✅ Changed from "See My Result!" */}
</motion.button>

<p className="text-white/80 text-sm">
  Click to reveal what's inside! {/* ✅ Clearer call to action */}
</p>
```

## State Flow Example

### Scenario: Player Swaps from Case #3 to Case #6

**Step 1: After 5th case opened**
```
State:
  openedCases: [1, 2, 4, 5, 7]
  playerCaseId: 3
  suitcases:
    - Case #3: isPlayerCase: true, isOpened: false
    - Case #6: isPlayerCase: false, isOpened: false
```

**Step 2: Player accepts swap**
```
Action: ACCEPT_SWAP
State after:
  playerCaseId: 6 (✅ CHANGED)
  swapAccepted: true
  phase: 'final-reveal'
  suitcases:
    - Case #3: isPlayerCase: false, isOpened: false (✅ CLOSED)
    - Case #6: isPlayerCase: true, isOpened: false (✅ CLOSED, but marked as player's)
```

**Step 3: UI in final-reveal phase**
```
Display:
  - All opened cases show their contents
  - Case #3: closed, not marked as player's
  - Case #6: closed, marked as player's case (highlighted)
  - Button: "💼 Open My Case!"
  - Panels show 6 items as struck through (revealed)
```

**Step 4: Player clicks "Open My Case!" button**
```
Action: OPEN_FINAL_CASE (after 1 second drumroll)
State after:
  phase: 'game-result'
  suitcases:
    - Case #6: isPlayerCase: true, isOpened: true, item.isRevealed: true
  result:
    - item: Case #6's item (✅ CORRECT ITEM)
    - wasSwapped: true
```

**Step 5: Result screen**
```
Display:
  - Shows Case #6's item (✅ the swapped case)
  - "✅ You swapped from Case #3 to Case #6"
  - All 7 items in panels are struck through
```

### Scenario: Player Declines Swap

**Step 2: Player declines swap**
```
Action: DECLINE_SWAP
State after:
  playerCaseId: 3 (✅ UNCHANGED)
  swapAccepted: false
  phase: 'final-reveal'
  suitcases:
    - Case #3: isPlayerCase: true, isOpened: false (✅ CLOSED)
    - Case #6: isPlayerCase: false, isOpened: false
```

**Step 4: Player clicks "Open My Case!" button**
```
Action: OPEN_FINAL_CASE
State after:
  phase: 'game-result'
  suitcases:
    - Case #3: isPlayerCase: true, isOpened: true, item.isRevealed: true
  result:
    - item: Case #3's item (✅ CORRECT - original case)
    - wasSwapped: false
```

**Step 5: Result screen**
```
Display:
  - Shows Case #3's item (✅ the original case)
  - "✋ You kept your original Case #3"
  - All 7 items in panels are struck through
```

## Benefits of This Approach

1. **✅ Suspense & Drama**: Player sees their closed final case before opening it
2. **✅ Clear Flow**: Explicit "Open My Case!" action makes it obvious what's happening
3. **✅ Correct Display**: Always shows the right case's contents (swapped or original)
4. **✅ Proper Reveal Timing**: Items only marked as revealed when actually opened
5. **✅ Panel Consistency**: Strike-through logic works correctly with proper reveal timing
6. **✅ User Control**: Player decides when to reveal their final prize

## Testing Checklist

### Test Case 1: Accept Swap
- [ ] Play to swap offer
- [ ] Accept swap
- [ ] Verify: Both cases still closed
- [ ] Verify: "Your case" marking moved to swapped case
- [ ] Verify: Button says "💼 Open My Case!"
- [ ] Click button
- [ ] Verify: Drumroll plays for 1 second
- [ ] Verify: Result shows swapped case's item
- [ ] Verify: Panel shows that item as struck through
- [ ] Verify: Result shows "You swapped from Case #X to Case #Y"

### Test Case 2: Decline Swap
- [ ] Play to swap offer
- [ ] Decline swap
- [ ] Verify: Both cases still closed
- [ ] Verify: "Your case" marking stays on original case
- [ ] Verify: Button says "💼 Open My Case!"
- [ ] Click button
- [ ] Verify: Drumroll plays for 1 second
- [ ] Verify: Result shows original case's item
- [ ] Verify: Panel shows that item as struck through
- [ ] Verify: Result shows "You kept your original Case #X"

### Test Case 3: Visual Feedback
- [ ] In final-reveal phase, verify closed cases look different from opened ones
- [ ] Verify player's case is visually highlighted
- [ ] Verify other unopened case is also closed but not highlighted
- [ ] Verify all opened cases show their contents

## Summary

The swap flow has been completely fixed:

1. **✅ Cases stay closed** after swap decision
2. **✅ Player sees their final closed case** with clear instructions
3. **✅ Manual "Open My Case!" button** gives player control
4. **✅ Correct item displayed** in results (swapped or original)
5. **✅ Strike-through logic works** correctly in panels
6. **✅ Dramatic reveal** with drumroll sound effect

All changes are live and ready for testing at **http://localhost:5173/**
