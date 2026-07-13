#!/bin/zsh
# Merged einen PR per lokalem Rebase-Flow: Branch auf main rebasen (dabei
# werden alle Commits neu SSH-signiert), Branch force-pushen, main
# fast-forwarden. Ergebnis: lineare History, jeder Commit "Verified",
# GitHub markiert den PR automatisch als merged.
#
# Der GitHub-UI-Button "Rebase and merge" kann das nicht — er schreibt die
# Commits serverseitig OHNE Signatur neu. Deshalb dieses Script.
#
# Mergen ist ausschließlich Sache des Users (siehe .agents/skills/pr).
#
# Usage: scripts/merge-pr.sh <feature-branch>
set -e -u -o pipefail

branch="${1:?Usage: merge-pr.sh <feature-branch>}"

if [[ "$(git rev-parse --git-dir)" != "$(git rev-parse --git-common-dir)" ]]; then
  print -u2 "ABBRUCH: Läuft in einem Worktree — mergen nur aus dem Haupt-Checkout."
  exit 1
fi
if git status --porcelain | grep -qv '^??'; then
  print -u2 "ABBRUCH: Working Tree nicht sauber."
  exit 1
fi

git fetch origin
git switch main
git pull --ff-only origin main

# Remote-Stand des Branches ist die Wahrheit (dort hat der Agent gepusht)
git switch -C "$branch" "origin/${branch}"

git rebase main
git push --force-with-lease origin "$branch"

git switch main
git merge --ff-only "$branch"
git push origin main

git branch -d "$branch"
git push origin --delete "$branch"

print -r -- "gemerged: ${branch} → main (fast-forward, alle Commits signiert)"
