---
title: "Scheduling Claude Code agents with launchd"
date: "2026-07-09 18:00"
tags: ["AI","Automation","CommandLine"]
excerpt: "I get more done in Claude Code than anywhere else, but it could not run agents on a schedule. So I wired one up with launchd, and now a different agent works on my apps every morning before I wake up."
---

I love Codex's scheduled automations. Genuinely. Being able to say "run this every morning" and have it happen without me is the kind of small thing that changes how you work.

The problem is that I get more done in Claude Code. That is where my repos are, where my auth is, where the agents I trust already run. And Claude had no built-in way to run those agents on a schedule on my own machine.

So I hacked one in. Now a different agent wakes up every morning, does a self-contained piece of work on one of my apps, and leaves the result where I will find it. I read it with coffee. This post is exactly how it is wired, so you can build the same thing.

## The core idea

Claude Code can start a background session with a single command:

```bash
claude --bg "<task>"
```

`--bg` dispatches and exits. It hands the task to Claude's supervisor and returns immediately. The agent then runs in the background and shows up in `claude agents` like any other session.

That is the whole insight. The scheduler does not need to be clever. It needs to run that one command, in the right directory, at the right time. On macOS the tool built for exactly that is **launchd**.

The setup is four thin layers:

```
launchd plist   →  the clock   (StartCalendarInterval)
    run.sh      →  the trigger (cd into project, exec claude --bg)
   task.txt     →  the prompt  (self-contained)
  claude --bg   →  dispatches the real agent, shows in `claude agents`
```

## The clock: a launchd plist

launchd fires jobs on a calendar with `StartCalendarInterval`. Here is a real one that runs every Monday at 09:00:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.claude.cron.koubou-review-lun</string>
    <key>ProcessType</key>
    <string>Background</string>
    <key>ProgramArguments</key>
    <array>
        <string>/bin/zsh</string>
        <string>-lc</string>
        <string>/Users/you/.claude/scheduled-agents/koubou-review-lun/run.sh</string>
    </array>
    <key>RunAtLoad</key>
    <false/>
    <key>StandardOutPath</key>
    <string>.../job.log</string>
    <key>StandardErrorPath</key>
    <string>.../job.log</string>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>    <integer>9</integer>
        <key>Minute</key>  <integer>0</integer>
        <key>Weekday</key> <integer>1</integer>
    </dict>
</dict>
</plist>
```

Two details matter here.

The job runs `/bin/zsh -lc`, not the binary directly. That login shell is load-bearing, and I will come back to why in the gotchas.

`StartCalendarInterval` fires only at a single matching instant. Omit a field to mean "every". `{Hour: 9, Minute: 0}` with no weekday means every day at 09:00. `{Weekday: 1, Hour: 9}` means Mondays at 09:00.

That last point has a sharp edge: there is no "every weekday" in one job. If you want Monday to Friday, you create five jobs, one per weekday. That is why my setup literally has `koubou-review-lun`, `-mar`, `-mie`, `-jue`, `-vie`. It looks redundant, but it is how launchd's model works, and being explicit beats a clever single job that silently fires once and makes you think it covers the week.

Drop the plist in `~/Library/LaunchAgents/` and load it:

```bash
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.claude.cron.koubou-review-lun.plist
```

## The trigger: run.sh

The plist points at a small per-job script. This is where the `claude --bg` call actually happens:

```bash
#!/bin/zsh -l
JOBDIR="$(cd "$(dirname "$0")" && pwd)"
source "$JOBDIR/job.env"          # PROJECT=/path/to/repo
cd "$PROJECT" || exit 1
TASK="$(cat "$JOBDIR/task.txt")"
exec "$HOME/.claude/local/claude" --bg "$TASK" < /dev/null
```

Three deliberate choices in five lines.

`#!/bin/zsh -l` is the login shell again. launchd runs with a bare environment: no `PATH`, no shell profile, none of your auth. Without `-l` the `claude` binary is not even found, and even if it were, credentials would not load. When a scheduled agent fails with a strange auth or "command not found" error, this is suspect number one.

`< /dev/null` handles the missing terminal. There is no TTY, so redirecting stdin keeps `claude --bg` from waiting on input that will never come.

`exec` replaces the shell with the claude process, so there is nothing left to clean up.

The task and project live in flat files next to the script:

```
~/.claude/scheduled-agents/koubou-review-lun/
├── run.sh
├── job.env      →  PROJECT="/Users/you/Projects/koubou"
├── task.txt     →  the full prompt
└── job.log      →  stdout and stderr from the dispatch
```

## The prompt: task.txt

This is the part people underestimate. The scheduled agent starts cold. It has zero memory of the conversation where you set it up. Whatever you put in `task.txt` is all it knows.

So the prompt has to be fully self-contained: what to do, which repo, what to produce, and where to put it. One of mine reads, roughly: "Review the open PRs and issues in the `bitomule/Koubou` GitHub repo. Summarize which ones need my attention and why, and post the summary where I read it."

No "the repo we discussed", no "like last time". Write it as if for a stranger, because at nine on Monday morning, it is one.

## A tiny CLI to manage it

Hand-writing plists and `launchctl` commands gets old fast, so I wrapped all of it in a small Python script, `schedctl`, exposed as a Claude Code skill called `cron-agent`. It turns plain requests into the plumbing above:

```bash
schedctl create --name koubou-review-lun \
  --project ~/Projects/koubou \
  --task "Review open PRs and issues in bitomule/Koubou..." \
  --weekday 1 --hour 9

schedctl list                      # every job, its schedule, loaded state
schedctl run   --name <name>       # fire it right now, to test
schedctl logs  --name <name>       # tail the job log
schedctl remove --name <name>      # unload from launchd and delete
```

`create` writes `task.txt` and `job.env`, generates `run.sh`, renders the plist, and loads it into launchd in one shot. The schedule flags map straight to the calendar: `--weekday` where 1 is Monday, `--hour`, `--minute`, or `--interval` in seconds for interval jobs instead of a clock time.

Because it is a skill, I do not run the CLI by hand. I tell Claude "run a Koubou PR review every weekday at nine" and it turns that into five `create` calls, then fires one immediately to prove the chain works end to end.

## What runs on my machine

Ten jobs, all loaded:

- Koubou PR and issue review, Monday to Friday at 09:00, five jobs.
- ASO acquisition experiments, one app per weekday: Boxy on Monday, Undolly on Tuesday, HiddenFace on Wednesday, Numly on Thursday, FoodLabel on Friday.

Every morning a fresh agent wakes up, does its self-contained chunk of work on one of my indie apps, and leaves the result behind. I open `claude agents`, read what happened, and decide what to ship.

## Gotchas I learned the annoying way

The bare environment is the big one. launchd gives you nothing, so `zsh -l` in both the plist and `run.sh` is what loads `PATH` and auth. It is the first thing to check when a job "runs" but does nothing.

Permission prompts block the agent. A background agent that hits a tool you have not pre-approved just sits in `claude agents` as blocked, forever, because nobody is there to click allow. Keep scheduled tasks to reading and writing files and running known commands, and pre-approve anything else up front.

MCP servers that need an interactive login may not be available in a scheduled run, and a task that leans on one can fail without a clear error. Keep scheduled tasks self-contained.

The Mac has to be awake. launchd runs a missed calendar job when the machine wakes, but it will not run while the machine is fully powered off. For always-on scheduling you want a machine that does not sleep.

## Local or cloud

Claude has cloud scheduled routines too, and they are the right call when you want runs that do not depend on your laptop being awake. I went local because I wanted the agents working in my actual checkouts, with my auth, at no session cost, fully under my control. launchd is the boring, reliable primitive that turns that into a short script instead of a service.

That is the whole thing. `claude --bg` does the hard part. launchd just decides when.
