# GSA Navigation Standard

Security+ is the canonical learner-flow model for Giant Slayer Academy certification migrations. New and migrated certifications must follow this hierarchy without inserting legacy chapter landing pages between the Campaign Map and a Chapter Objective Hub.

## Canonical learner flow

The forward learner flow is:

`Academy Gate / Enter the Academy` → `Select a Game` → `Certification Entry / Select a Mode` → `Training Grounds` → `Campaign Map` → `Chapter Objective Hub` → `Field Manual / Objective Sweep`

The normal back-navigation flow is:

`Field Manual / Objective Sweep` → `Chapter Objective Hub` → `Campaign Map` → `Certification Entry / Select a Mode` → `Select a Game`

## Permanent rules

- Academy Gate = external front door. It is the public entrance into Giant Slayer Academy and must remain available.
- Select a Game = internal Academy hub. Internal certification returns must open this state instead of replaying the Academy Gate.
- Training Grounds is the public training-mode name formerly called Hydra Run.
- Campaign Map remains Campaign Map.
- After a certification migrates to the Objective Hub architecture, each learning chapter on its Campaign Map routes directly to that Chapter Objective Hub.
- Legacy `PRESS START` / `Choose Your Training Mode` chapter pages are retired when the Objective Hub architecture replaces them. They must not remain in the active learner round trip.
- Field Manual Return to Chapter → Objective Hub.
- Objective Sweep Return to Chapter → Objective Hub.
- Objective Hub Return → Campaign Map.
- Campaign Map Return → Certification Entry / Select a Mode.
- Certification Return to Academy → Select a Game.
- The Academy Gate is not the normal internal back-navigation destination.

## Future Academy Hub action

Internal learner pages should ultimately provide a persistent **Academy Hub** action that jumps directly to `Select a Game`. This shortcut is separate from normal one-level Back/Return navigation. It is a required standard for a future GSA-wide migration and must not be implemented piecemeal unless shared architecture already provides it.

## Migration checklist

When moving another certification to this standard:

1. Use Security+ as the route and label reference.
2. Route learning-chapter Campaign Map cards directly to Chapter Objective Hubs.
3. Confirm Field Manuals and Objective Sweeps return to the correct Chapter Objective Hub.
4. Confirm every Chapter Objective Hub returns to the Campaign Map.
5. Confirm the Campaign Map returns to the certification entry page.
6. Confirm Return to Academy opens Select a Game without replaying the Academy Gate.
7. Audit all references before deleting legacy chapter landing pages.
8. Add validator coverage for the canonical forward and back routes.
9. Test desktop and mobile for dead links, overflow, and console warnings or errors.
