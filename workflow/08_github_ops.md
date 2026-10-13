# 08 · GitHub ops, progress doc, resilience, cleanup

## Token handling
- Write the user's PAT to `/tmp/.ghtok` (outside the repo), use it via `tools/gh.sh` or
  `git -c http.extraheader="Authorization: Basic $(printf 'x-access-token:%s' "$(cat /tmp/.ghtok)" | base64 -w0)" push origin HEAD:<branch>`.
- Never commit it, never put it in remote URLs that get saved (`git remote set-url` back to the clean URL
  after a tokenised clone). Delete it at the end and advise the user to revoke tokens pasted in chat.

## Repo conventions
- `main` = latest approved; a branch per major style iteration (`v2`, `v3`) until approved.
- Releases: `segments` (samples + part previews), `vX.Y` (finals + poster + contact).
- Commit messages say what changed for the viewer ("S5–S9 rebuilt with real Ottoman specimens").

## docs/PROGRESS.md (keep current — it is your memory across resets/sessions)
- Resume-from-zero commands (clone, setup, VO decode, sfx, stills, render).
- Part table: name · frames · time · status · release asset.
- Open issues / next steps / critique notes. User's standing instructions.

## Reset resilience
- Push before ending every turn and before any long job.
- If the environment is empty at the start of a turn: re-write the token, clone, `tools/setup.sh`,
  regenerate tmp audio, read PROGRESS.md, check `git log` and the releases to see what was already done
  (you may have done more than your notes say).

## Workspace and storage safety
- Put scratch in a unique job-specific `/var/tmp/motion-doc-studio/<job-id>/` directory where available; record its path in `docs/PROGRESS.md`.
- Never delete user-provided inputs, source assets, prior deliverables, or files whose ownership is unclear. Do not run broad `rm -rf` or wildcard cleanup.
- Remove only files created by this run, only after validating the replacement and confirming the exact path is inside this job's scratch directory. Otherwise retain them and report the disk trade-off.
- Do not build the full CC0 kit (≈220 MB) or download example videos unless the chosen deliverable explicitly needs them. Do not reinstall already-present dependencies.
- Keep access tokens outside the repository; remove only the token created for this task after the remote operation is verified.
