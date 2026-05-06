---
title: "Code is no longer the bottleneck"
date: "2026-05-03 18:00"
tags: ["Automation","CommandLine"]
excerpt: "AI agents did not remove the bottleneck. They moved it from writing code to validating what is worth shipping."
---

For most of my career, software engineering had a simple shape: you understood the problem, you designed a solution, and then you wrote the code.

The writing was not the whole job, but it was the visible part. It was where time went, what estimates tried to predict, what managers asked about when they wanted to know whether something was "almost done". You could have a good idea, a clear product direction, even a decent technical plan, and still spend most of the week turning that intent into code line by line.

That is the part that changed.

Not because code stopped mattering. Code still runs the product, breaks production and wakes somebody up at three in the morning. The change is narrower and more uncomfortable: producing code is no longer the scarce part of the work.

An agent can now write more code in one afternoon than you can validate carefully in one afternoon. That sentence sounds obvious, but it changes the center of gravity. The old question was: how fast can we turn an idea into code? The new question is: how do we know the code is the right code?

That is the real shift.

![Diagram showing the bottleneck moving from code production to validation](/images/bottleneck-shift.svg)

## The old bottleneck

When I started programming, writing code was expensive, and not because typing took time. Typing was never the hard part. Writing code was expensive because every line carried thinking inside it: understanding the domain, reading APIs, choosing structure, naming things, debugging, discovering the edge case you missed, and learning the framework through contact with it.

You could not skip most of that. Stack Overflow helped, documentation helped, a senior engineer sitting next to you helped, but the work still came back to you. You had to read, adapt, test, fail, fix and understand.

That slowness was frustrating, but it had one useful property: the cost was visible. If you did not understand the framework, you got stuck. If your mental model was wrong, the bug stayed there until you fixed the model. If your architecture was weak, you felt the cost while changing it.

The bottleneck was painful, but at least you knew where it was.

## The bottleneck moved

The agent changes that feedback loop. It can produce the migration, write the test scaffold, generate the UI, translate the API client into another language, and do in minutes what would have taken you hours.

I do not want to pretend this is small. It is not. This is why I use agents: they let me attempt work that previously did not fit in my day.

The problem is what happens next. If the agent produces three times more code, you now have three times more code to understand, test, review and trust. If your process is still the old one, the bottleneck did not disappear. It moved to a later phase.

That is the part I think many teams are missing. They add an agent to the same workflow and expect the system to become faster. Sometimes it does, for a while. Then the pull requests get larger, the review gets thinner, and the supervision work starts piling up after the code already exists.

That is not leverage. That is moving the queue.

## Validation is the bottleneck

The question is no longer: can we write the code?

The question is: can we validate the code fast enough, deeply enough, and consistently enough to ship it?

A human reading every generated line does not scale. It did not scale well before agents, and it scales worse now. The agent can generate while you are still trying to understand the previous diff. If your only validation layer is "I will read it carefully", your process is bounded by your attention.

I have done this. I would like to say I read every diff carefully. I do not. But understanding what the agent did is still the job; if I skip that habit often enough, I am not getting faster, I am letting the skill atrophy.

That is not a defense of blind trust. It is the reason blind trust is not enough.

The answer cannot be "just review harder". Reviewing harder is not a system. It is a promise you make when you are rested, and then break when you are tired, interrupted, or looking at the fifth generated change of the day.

Parallelism makes this sharper. One of the obvious ways to gain speed with agents is to run more than one task at once. Git worktrees have never felt more useful: one agent on a refactor, another on a bug, another exploring an approach you might throw away. It works, and it also increases the mental load. More branches in flight, more partial context to reload, more supervision, more corrections, more review.

![Diagram showing parallel worktrees converging into one human validation queue](/images/worktree-supervision-load.svg)

If you want code that does more than look like it works, the load on the programmer does not automatically go down. It can go up. The typing disappeared; the validation did not.

## The harness is the response

If validation is the bottleneck, the work has to move into the harness.

By harness I mean the environment around the agent that makes good work more likely and bad work easier to catch: context, constraints, tests, build commands, review agents, linters, scripts, app checks, whatever gives the agent and the human a way to know whether the result is correct.

This is not about making the agent smarter with a magic prompt. It is about changing the workflow so generated code does not arrive as a pile of text waiting for a tired programmer to approve it.

The old workflow was: ask for code, read the diff, decide.

The better workflow is: define the task, give the agent the right context, let it produce the change, make it run the checks, inspect the risky parts, and only then decide.

The human is still responsible. That has not changed. What changes is where the responsibility is spent. Less time being the only validation layer. More time building the validation layers.

That is the shift I care about.

This is why "AI makes us faster" is the least interesting version of the story. Sometimes it does. Sometimes it does not. Speed depends on the task, the codebase, the engineer, and the harness around the agent.

The useful question is different: what must exist around the agent so that more generated code does not mean more unvalidated code?

That is where the next discipline is.

Code is no longer the bottleneck. Validation is.

I have started writing these ideas down in a longer form too, in a book I am calling *The Harness Engineer*. I do not know yet which parts will survive the writing process. Some will become chapters, some will stay as blog posts, some will probably be wrong in six months. That is part of why I want to publish them here first.

The book is the excuse. The thinking is the useful part.
