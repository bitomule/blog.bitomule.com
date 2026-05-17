---
title: "Introducing MAV"
date: "2026-05-17 19:00"
tags: ["AI","iOS","Tools"]
excerpt: "I built MAV to give coding agents a practical way to drive an iOS simulator or device, run flows, and record evidence."
---

I have been using coding agents more and more for iOS work, and one part of the loop was still too manual.

The agent could change the code. It could explain what it changed. It could even tell me which validation made sense.

But when the next step was "open the app and check the behavior", the workflow became messy.

That is a lower-level problem.

The agent still needs to open the app and inspect the current screen. Then it has to tap the right thing, wait for the next state, read logs, check crashes, and capture evidence that I can review later.

That is what [MAV](https://github.com/bitomule/mav) is for.

MAV is a CLI that gives an agent a simple way to work with an iOS simulator or a physical device.

It gives the agent a small set of commands for opening the app, reading the UI, interacting with the screen, running repeatable flows, and recording evidence.

## The problem

iOS validation is easy to describe and annoying to automate from an agent.

Open the app. Tap Settings. Enable a toggle. Accept a permission dialog if it appears. Confirm that the next screen changed. Check that the app logged the expected probe. Save screenshots and a video. Make sure there were no crashes.

As a human, I can do that with the simulator in front of me.

For an agent, that becomes a mix of tools and state:

- `simctl` for simulator lifecycle, install, launch, screenshots, video, and logs.
- Accessibility tooling for reading the current UI and tapping semantic targets.
- `idb` when the target is a physical device, or when the flow needs coordinate-based operations.
- Baguette, which is what I use now for simulator gestures, system UI, hardware buttons, and keyboard helpers.
- Sometimes `mitmproxy` if the validation needs network capture.

Those tools already exist. MAV is not trying to replace them.

The problem is that they do not give the agent one small interface.

They have different commands, different output, different failure modes, and different assumptions about whether the target is a simulator or a device.

An agent can use them directly, but the result is too much glue in the prompt. It also makes evidence inconsistent. One validation saves a screenshot here, another writes a log somewhere else, and a third one forgets to include the crash check.

I wanted a tool that made the common path boring, and that ended with a report I could review.

## What MAV does

MAV wraps those engines behind a common CLI.

The agent can run commands like:

```bash
mav open
mav ui tree
mav ui tap --id settings_button
mav capture --name settings
mav logs --key SettingsReached
mav crashes
mav evidence report
```

Each command returns compact output. The default shape is intentionally simple:

```text
ok cmd=ui.tree driver=axe nodes=42 screen=settings
fail code=ui_tree_empty driver=axe recovered=false
```

That matters because the output is for agents. The agent needs to know what happened, where the artifact is, and what to do next if something failed.

MAV chooses the backend by capability.

AXe is the fast path for accessibility trees and semantic UI actions. `simctl` owns simulator lifecycle, screenshots, video, and logs. MAV uses `idb` for physical devices and fallback operations. Baguette handles simulator capabilities such as multitouch, system UI, hardware buttons, erase, and `hideKeyboard`. `mitmproxy` is optional for network capture.

The important part is not the list of tools. The important part is that the agent does not need to remember which one owns each capability.

It asks MAV for the action. MAV routes it.

## Project setup

MAV does not own the build system either.

Each project defines a launch recipe in `.mav/config.yaml`. That recipe can call Bazel, Xcode, Tuist, Make, a `justfile`, or project scripts. MAV needs to know how to build, find the `.app`, install it, and launch it.

That keeps MAV out of the parts that are always project-specific.

A project can start with:

```bash
mav setup
mav sim select --device "iPhone 17 Pro Max" --ios 26
mav open
mav ui tree
```

For a physical device, the active target changes to `target_kind: device` and MAV uses `idb` for install, launch, logs, screenshots, UI actions, and crashes.

Not every capability exists everywhere. Video recording works on the simulator in the current version. Multitouch and system UI inspection also require a simulator. When a command does not make sense on a device, MAV should return a structured error instead of pretending it can do it.

That boundary is important. A common API is useful when it stays honest about what the target can do.

## YAML flows

Single commands are useful when the agent is exploring.

Flows are useful when the validation should be repeatable.

MAV has its own YAML format for that:

```yaml
version: 1
name: verify_daily_reminder
steps:
  - open: { clearState: true }
  - wait: { text: Daily Reminder, timeout: 5s }
  - video.start: {}
  - evidence.step: { name: before-toggle, note: Before tapping Daily Reminder }
  - tap: { text: Daily Reminder }
  - waitUntil:
      any:
        - id: notification_permission_alert
        - changedFrom: before-toggle
      timeout: 5s
  - evidence.step: { name: after-toggle, note: After tapping Daily Reminder }
  - logs: { key: SettingsReached }
  - crashes: {}
  - video.stop: {}
  - report: {}
```

The goal is not to create another general testing framework.

The goal is to make the repeated agent validation steps easy to write, easy to run, and easy to inspect.

Flows support the pieces I needed in real projects.

They cover UI actions, waits, optional UI with `when`, repeated onboarding with `whileNotVisible`, reusable sub-flows with `include`, shell assertions through explicit `exec`, logs, crashes, screenshots, video, and reports.

That sounds like a lot, but most flows stay small.

The point is that the validation can live next to the project instead of in my prompt history.

## Evidence

This is the part that matters most to me.

When an agent says that a flow worked, I do not want a sentence.

I want the run directory.

MAV writes project runs under `.mav/runs/<run-id>/`. A run can contain:

- `logs.txt`
- `commands.jsonl`
- `evidence.jsonl`
- screenshots for named evidence steps
- accessibility trees
- `video.mov`
- crash reports
- `report.json`

The evidence report checks that the files are usable. A screenshot has to decode. A video has to exist and have frames before MAV accepts it as valid video evidence. The report includes crashes, commands, warnings, and blockers.

That does not make every validation deterministic.

Some checks are still closer to "look at this UI and confirm it still makes sense" than to "the compiler passed". But even those softer checks become more useful when the agent has to name the evidence and give me a report I can review.

That is the important part for me. The agent should not stop at saying that it checked the app. It should give me a report with the evidence behind that claim.

## What I learned building it

The first version of this idea leaned too much on heavier automation stacks.

That worked enough to prove the idea, but I wanted a different shape. The current MAV driver pipeline is host-side and iOS-focused. It uses `simctl`, AXe, `idb`, and Baguette directly. Appium and WDA are gone from the current pipeline.

That made the tool simpler.

The second thing I learned is that routing by capability matters more than routing by tool name.

An agent should not have to decide whether a tap should go through AXe, `idb`, or another backend. It should ask for the tap. The router can choose the cheapest healthy driver that provides the capability, or fail with a useful reason.

The third thing I learned is that the accessibility tree should come before screenshots.

Screenshots are useful for layout, custom rendering, media, and human review. But for most agent decisions, the tree is cheaper and better. It has ids, labels, roles, enabled state, and frames. It gives the agent something structured to act on.

The fourth thing I learned is that simulator and device support are not the same thing.

Physical devices are important because some bugs show up there. But device support has different limits. MAV can work with devices through `idb`, but it should not hide the parts that still require a simulator.

The fifth thing I learned is that evidence needs its own data model.

A folder full of screenshots is better than nothing, but not enough.

The report has to know which command produced each artifact. It has to know which step the artifact belongs to, what tree was visible at that point, whether the video was valid, and whether crashes appeared during the run.

That is the difference between "the agent took some screenshots" and "this run is reviewable".

## The shape I wanted

I do not want the agent to remember every iOS validation detail.

I want the validation to live next to the project.

If a flow matters, it should have a YAML file. If a behavior needs proof, the run should leave screenshots, logs, crashes, trees, video, and a report in a known place.

The agent can still make decisions. It can still explore the app one command at a time. But the tool should make the boring parts consistent.

Open the app.

Read the tree.

Tap the target.

Record the evidence.

Write the report.

That is the loop I wanted MAV to cover.

Not because it replaces real tests, and not because every UI validation becomes deterministic.

Because the agent needs a practical way to use the simulator or device, create evidence, and give the human a report they can review.
