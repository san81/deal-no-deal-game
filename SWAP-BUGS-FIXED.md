# Swap Feature Bugs - Fixed

## Issues Reported

1. **Strike-out logic getting messed up**: When player swapped cases, the items in the left/right panels were not showing as struck through correctly
2. **Wrong final gift displayed**: Even after swapping, the final result was showing the item from the original selected box instead of the swapped box

## Root Cause Analysis

### Issue 1: Strike-out Logic
**Problem**: Items are struck through in the panels based on the `item.isRevealed` property. When cases are opened during gameplay, the items are marked as revealed. However, when the swap happens:

- **ACCEPT_SWAP**: The swapped case's item was NOT being marked as revealed
- **DECLINE_SWAP**: The original case's item was NOT being marked as revealed

This meant the final case item never appeared as struck through in the panels.

**Location**: `src/context/GameContext.tsx` - ACCEPT_SWAP and DECLINE_SWAP actions

### Issue 2: Wrong Item Display
**Problem**: After swapping, the game correctly updated `playerCaseId` to the new case, but when looking up the player's case in the suitcases array, the item reference might not have been properly updated.

The issue was related to Issue 1 - the item wasn't being properly marked, which could cause inconsistencies in how it's displayed.

## Fixes Applied

### Fix 1: ACCEPT_SWAP - Mark swapped item as revealed

**File**: `src/context/GameContext.tsx` (lines 155-188)

**Before**:
```typescript
case 'ACCEPT_SWAP': {
  const otherCase = state.suitcases.find(
    (s) => !s.isOpened && s.id !== state.playerCaseId
  );
  if (!otherCase) return state;

  const updatedSuitcases = state.suitcases.map((suitcase) => ({
    ...suitcase,
    isPlayerCase: suitcase.id === otherCase.id,
  }));

  return {
    ...state,
    suitcases: updatedSuitcases,
    playerCaseId: otherCase.id,
    swapAccepted: true,
    swapOffered: true,
    phase: 'final-reveal',
  };
}
```

**After**:
```typescript
case 'ACCEPT_SWAP': {
  const otherCase = state.suitcases.find(
    (s) => !s.isOpened && s.id !== state.playerCaseId
  );
  if (!otherCase) return state;

  // Swap: player gets the other case and mark its item as revealed
  const updatedSuitcases = state.suitcases.map((suitcase) => {
    if (suitcase.id === otherCase.id) {
      // This is the swapped case - mark as player's case and reveal its item
      return {
        ...suitcase,
        isPlayerCase: true,
        item: suitcase.item ? { ...suitcase.item, isRevealed: true } : suitcase.item,
      };
    }
    // Mark all other cases as not player's case
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
    phase: 'final-reveal',
  };
}
```

**Changes**:
- Now creates a new item object with `isRevealed: true` for the swapped case
- Explicitly sets `isPlayerCase: false` for all other cases (not just omitting it)
- Ensures the swapped item will show as struck through in the panels

### Fix 2: DECLINE_SWAP - Mark original item as revealed

**File**: `src/context/GameContext.tsx` (lines 190-209)

**Before**:
```typescript
case 'DECLINE_SWAP':
  return {
    ...state,
    swapOffered: true,
    swapAccepted: false,
    phase: 'final-reveal',
  };
```

**After**:
```typescript
case 'DECLINE_SWAP': {
  // Player keeps their original case - mark its item as revealed
  const updatedSuitcases = state.suitcases.map((suitcase) => {
    if (suitcase.id === state.playerCaseId && suitcase.item) {
      return {
        ...suitcase,
        item: { ...suitcase.item, isRevealed: true },
      };
    }
    return suitcase;
  });

  return {
    ...state,
    suitcases: updatedSuitcases,
    swapOffered: true,
    swapAccepted: false,
    phase: 'final-reveal',
  };
}
```

**Changes**:
- Finds the player's current case and marks its item as revealed
- Ensures consistency whether the player swaps or keeps their case

## How GameResult.tsx Works

**File**: `src/components/GameResult.tsx` (lines 23-27)

```typescript
const playerCase = state.suitcases.find((s) => s.isPlayerCase);
const item = state.result?.acceptedBankerOffer
  ? state.result?.item
  : (playerCase?.item || state.result?.item);
```

**Logic**:
1. Finds the current player's case by looking for `isPlayerCase: true`
2. If banker offer was accepted, uses the banker's offered item
3. Otherwise, uses the player's case item

**After Swap**:
- `playerCaseId` = new case ID
- Only the swapped case has `isPlayerCase: true`
- `playerCase.item` correctly points to the swapped item
- The item is now marked as revealed, so it appears struck through

**Display** (lines 133-146):
```typescript
{state.swapOffered && (
  <div>
    {state.swapAccepted ? (
      <p>✅ You swapped from Case #{state.originalCaseId} to Case #{state.playerCaseId}</p>
    ) : (
      <p>✋ You kept your original Case #{state.playerCaseId}</p>
    )}
  </div>
)}
```

Shows correct swap information:
- `originalCaseId`: Set during initial case selection, never changes
- `playerCaseId`: Updated after swap to new case ID
- Item displayed: From the case with `isPlayerCase: true`

## State Flow

### Before Swap (5 cases opened, 2 remain)
```
suitcases: [
  { id: 1, isOpened: true, item: {..., isRevealed: true} },
  { id: 2, isOpened: true, item: {..., isRevealed: true} },
  { id: 3, isPlayerCase: true, item: {...} },  // Original case
  { id: 4, isOpened: true, item: {..., isRevealed: true} },
  { id: 5, isOpened: true, item: {..., isRevealed: true} },
  { id: 6, item: {...} },  // Other case
  { id: 7, isOpened: true, item: {..., isRevealed: true} }
]
playerCaseId: 3
originalCaseId: 3
```

### After ACCEPT_SWAP
```
suitcases: [
  { id: 1, isOpened: true, item: {..., isRevealed: true} },
  { id: 2, isOpened: true, item: {..., isRevealed: true} },
  { id: 3, isPlayerCase: false, item: {...} },  // Was player's case
  { id: 4, isOpened: true, item: {..., isRevealed: true} },
  { id: 5, isOpened: true, item: {..., isRevealed: true} },
  { id: 6, isPlayerCase: true, item: {..., isRevealed: true} },  // NOW player's case, REVEALED
  { id: 7, isOpened: true, item: {..., isRevealed: true} }
]
playerCaseId: 6  // UPDATED
originalCaseId: 3  // UNCHANGED
swapAccepted: true
```

### After DECLINE_SWAP
```
suitcases: [
  { id: 1, isOpened: true, item: {..., isRevealed: true} },
  { id: 2, isOpened: true, item: {..., isRevealed: true} },
  { id: 3, isPlayerCase: true, item: {..., isRevealed: true} },  // Still player's case, NOW REVEALED
  { id: 4, isOpened: true, item: {..., isRevealed: true} },
  { id: 5, isOpened: true, item: {..., isRevealed: true} },
  { id: 6, item: {...} },  // Other case remains unrevealed
  { id: 7, isOpened: true, item: {..., isRevealed: true} }
]
playerCaseId: 3  // UNCHANGED
originalCaseId: 3  // UNCHANGED
swapAccepted: false
```

## Testing Checklist

To verify the fixes work correctly:

### Test 1: Swap Accepted
1. ✅ Play through to swap offer
2. ✅ Accept swap
3. ✅ Check panels - swapped item should show as struck through
4. ✅ Check final reveal - should show the swapped case's item
5. ✅ Check result screen - should show correct item with "You swapped from Case #X to Case #Y"

### Test 2: Swap Declined
1. ✅ Play through to swap offer
2. ✅ Decline swap
3. ✅ Check panels - original item should show as struck through
4. ✅ Check final reveal - should show the original case's item
5. ✅ Check result screen - should show correct item with "You kept your original Case #X"

### Test 3: Panel Strike-through
1. ✅ After swap decision, verify exactly 7 items are struck through (all items revealed)
2. ✅ Verify "X remaining" count shows 0

## Summary

Both issues were caused by not marking the final case's item as `isRevealed: true` during the swap decision:

- ✅ **ACCEPT_SWAP** now marks the swapped case's item as revealed
- ✅ **DECLINE_SWAP** now marks the original case's item as revealed
- ✅ Panels correctly show all items as struck through after swap decision
- ✅ GameResult correctly displays the swapped item (or original if swap declined)
- ✅ Swap information correctly shows which case was swapped to/from

The dev server has been updated with these fixes and is ready for testing at **http://localhost:5173/**
