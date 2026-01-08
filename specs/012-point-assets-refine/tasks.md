# Tasks: Point Assets Tab Refinement

**Feature**: Point Assets Refinement
**Status**: Planned
**Spec**: [spec.md](spec.md)

## Phases

### Phase 1: Setup
- [x] T001 Create `PacketTable` component shell in `src/components/member/detail/PointPacketTable.tsx`
- [x] T002 Create `LedgerTable` component shell in `src/components/member/detail/PointLedgerTable.tsx`

### Phase 2: User Story 1 - Asset Overview & Detail Inspection (P1)
**Goal**: View member's point holdings with precise columns.
**Independent Test**: Navigate to Member Detail > Point Assets > Points Detail. Verify columns and expiry warnings.

- [x] T100 [US1] Implement `ExpirationAlert` component (Simple Banner) in `src/components/member/detail/PointDetailTab.tsx`
- [x] T101 [US1] Implement Segmented Control (Points Detail / Points Ledger) in `src/components/member/detail/PointDetailTab.tsx`
- [x] T102 [US1] Implement `PacketTable` with exact columns (Detail ID, Total, Remaining, Earned, Expiry, Source, Remarks) in `src/components/member/detail/PointPacketTable.tsx`
- [x] T103 [US1] Integrate `PacketTable` into `PointDetailTab` and pass `packets` prop in `src/components/member/detail/PointDetailTab.tsx`
- [x] T104 [US1] Implement Expiry Logic (Amber < 30 days, Red < 0) for "Expiry Time" column in `src/components/member/detail/PointPacketTable.tsx`
- [x] T105 [US1] Update `SummaryCard` colors to match IA (Primary, Green, Blue, Slate) and labels (Total Used, Total Expired) in `src/components/member/detail/PointDetailTab.tsx`

### Phase 3: User Story 2 - Transaction History & Audit (P1)
**Goal**: View chronological history of point changes.
**Independent Test**: Switch to Points Ledger view. Verify columns and value coloring.

- [x] T201 [US2] Implement `LedgerTable` with exact columns (Type, Value, Pre-bal, Post-bal, Time, Source, Remarks) in `src/components/member/detail/PointLedgerTable.tsx`
- [x] T202 [US2] Integrate `LedgerTable` into `PointDetailTab` and pass `logs` prop in `src/components/member/detail/PointDetailTab.tsx`
- [x] T203 [US2] Implement Value Logic (Green/+ for Earn, Red/- for Burn) in `src/components/member/detail/PointLedgerTable.tsx`
- [x] T204 [US2] Implement Change Type Badges in `src/components/member/detail/PointLedgerTable.tsx`

### Phase 4: User Story 3 - Search & Filtering (P2)
**Goal**: Filter long lists to find specific records.
**Independent Test**: Apply filters in both views and verify list updates.

- [x] T301 [US3] Add Earned Date Filter to `src/components/member/detail/PointPacketTable.tsx`
- [x] T302 [US3] Add Date Range Filter inputs to `src/components/member/detail/PointLedgerTable.tsx`
- [x] T303 [US3] Add Type Filter (Earn/Redeem/Expire/Adjust) to `src/components/member/detail/PointLedgerTable.tsx`
- [x] T304 [US3] Ensure Search filter works for ID/Source/Remarks in `src/components/member/detail/PointPacketTable.tsx`

### Phase 5: Polish & Verification
- [x] T401 Perform visual check of empty states ("No records found") in both tables in `src/components/member/detail/PointPacketTable.tsx` and `src/components/member/detail/PointLedgerTable.tsx`
- [x] T402 Manual validation walk-through using `quickstart.md` scenarios

## Dependencies

1. Phase 1 (Setup) -> Phase 2 (US1) -> Phase 3 (US2) -> Phase 4 (US3)
2. `PointDetailTab.tsx` handles the switching state (`T101`) which is needed for integration (`T103`, `T202`).
3. Filter logic (`T301`-`T304`) adds to existing tables, so must come after Table implementation.

## Implementation Strategy

1. **Extract & Refactor**: First, break down the monolithic `PointDetailTab` into `PacketTable` and `LedgerTable`. This cleanly separates concerns.
2. **Strict Compliance**: Implement the columns exactly as specified in the new files.
3. **Enhance**: Add the filtering logic on top of the clean tables.
