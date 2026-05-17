---
title: "Learning to code when the agent can code for you"
date: "2026-05-16 18:00"
tags: ["AI","Programming","Learning"]
excerpt: "AI agents make code easier to produce, but not engineering easier to learn. The work that builds judgment has to be protected on purpose now."
---

The first time an agent helps you learn a new stack, the experience feels almost unfair.

![A minimal illustration of an AI assistant offering code while a learner walks toward a notebook full of messy reasoning](/images/learning-agent-hero.png)

You ask a question that would have taken an evening of docs, blog posts, and half-working examples. The agent answers in context. You ask for the Swift analogy. It gives you one. You ask why the compiler is angry. It explains the rule, points at the line, and suggests the fix.

For someone like me, who has spent years going deep in one ecosystem, that is hard not to love. The boundary around what I can learn has moved. Rust, Go, backend tools, build systems, small web apps: the first step into each of them is no longer a wall.

But after the first excitement, a worse question appears: if the agent can keep giving me the next answer, what am I learning?

That question matters because writing code was never mere production. It taught us to think like engineers.

For most of my career, learning programming had a simple shape. You tried to build something, got stuck, read docs, copied a bad example, adapted it, broke it, debugged it, asked someone, rewrote it, shipped it, and then learned six months later why your first version had been naive.

The loop was slow, and it taught more than we noticed.

Every bug corrected the picture you had in your head. Every ugly abstraction taught you what an ugly abstraction feels like later. Every debugging session left behind a small piece of pattern recognition. Every code review from someone better than you gave you language for a mistake you had sensed but could not yet name.

You were writing code. You were also building taste.

## The hidden curriculum

I did not learn software engineering from one source. Nobody does.

I learned from writing code that did not work. I learned from reading code written by people who were better than me. I learned from books that gave names to instincts I had not yet understood. I learned from senior engineers who told me what to change, then explained why the shape I had chosen would hurt later.

Most of that felt like work. Some of it felt like friction. Almost none of it felt like curriculum.

That is the trick. The old path taught us because there was no clean way around it. If you did not understand the framework, you got stuck. If your understanding of the system was wrong, the bug stayed there until your understanding changed. If your design was weak, the next feature made you pay for it.

The pain was not pleasant, but useful. Ignorance became visible.

AI agents change that. The agent can fill the gap between what you understand and what you can ship. It can give you the answer before you have done the thinking. It can make progress feel smooth on top of a hole you cannot see.

That is new.

Stack Overflow could save you time, but it still pointed you at material you had to read, judge, adapt, and debug. A colleague could unblock you, but you still had to make the answer fit your codebase. The agent is different. It does not point you at the answer. It gives you one.

Often, it works.

That is what makes the problem hard.

## This is not nostalgia

While writing this part of the book I started looking for a better answer than my own discomfort.

I had the feeling first. I could see it in myself when I accepted an answer before doing the work. I could see it in conversations with other engineers when we talked about juniors, interviews, and the strange new gap between code that works and code the author can explain. But a feeling is not enough for a book, so I went looking for what people who study learning, automation, and AI-assisted work were seeing.

The pattern kept pointing in the same direction. In one Anthropic study, junior engineers using AI finished a task slightly faster, but scored worse afterward on comprehension and debugging. The tool helped them produce the result. It did not help them understand it at the same depth.

I found the same shape in cognitive science, where the result is older than AI. People remember better when they produce an answer than when they read the same answer. Practice works when you attempt something, get feedback, and correct the mistake. Testing yourself teaches more than rereading. None of that was written for coding agents, but it maps cleanly onto what happens when the agent gives you the answer before you try.

The automation literature is even more direct. Microsoft Research and Carnegie Mellon described the old automation trap: routine work trains judgment, but automation removes routine work and leaves humans responsible for exceptions. Then the exception arrives, and the human has not practised the moves the exception requires.

That sentence maps too cleanly onto programming with agents.

The exception is the production bug. The exception is the security path. The exception is the migration that looks simple until it touches old data. The exception is the architectural decision hidden inside a generated patch. Those are the moments when you need the skill. The routine work was where the skill was built.

Remove the routine without thinking and you remove the training.

## What the agent should eat

The answer is not to stop using agents. That would be the wrong lesson.

The useful distinction is between friction that wastes you and friction that builds you.

![A two-panel illustration contrasting an AI assistant removing mechanical coding friction with a learner working through debugging and design](/images/friction-waste-vs-learning.png)

Some friction was never the point. Boilerplate. Syntax lookup. Remembering the exact flag for a command-line tool. Writing the same adapter for the sixth time. Digging through docs to find the one method name you half remember. Let the agent eat that. Please.

That kind of friction burns working memory without building much judgment. The agent should remove it.

But some friction is the work.

Forming a hypothesis before you debug. Designing the data model before code appears. Predicting whether a piece of code compiles. Reading an error and translating it into the rule you violated. Choosing the boundary between two modules. Asking what the system will make easy six months from now.

If the agent takes those moves away every time, you are not learning the same skill anymore. You are learning to supervise. That skill matters, but it differs from learning to program, debug, design, or reason about systems.

This is where cognitive load theory gives useful language. Some load is extraneous: waste around the task. Some load is intrinsic: the actual difficulty of the material. Some load is germane: the effort that builds understanding.

The agent removes extraneous load well. The danger is that the same gesture can remove germane load too.

When the agent writes the recursive function, you skip the reasoning about where it terminates. When it fixes the borrow checker error, you skip the work of translating the compiler message into an ownership rule. When it designs the API surface, you skip the tradeoff between caller convenience and long-term constraints.

The code ships. The understanding does not.

## Try before you ask

One of the most useful ideas from learning research is simple: you remember better when you try to produce an answer yourself than when you read the same answer already written for you. That seems obvious once stated, but it matters a lot with agents.

Watching the agent solve a problem is not the same as solving it.

Reading a generated diff is not the same as predicting the diff before it exists.

Accepting a correct explanation is not the same as trying to explain the mechanism yourself and then being corrected.

This does not mean the agent should disappear from the learning process. It means the order matters.

Try first, then ask.

Predict first, then run.

Explain first, then compare.

If you let the agent go first every time, you train a different muscle. You become better at recognizing plausible answers, not at producing or evaluating them from first principles. Recognition has value, but the ability to make your own attempt holds up better when the system is on fire and no clean answer is waiting to be recognized.

The agent can still be a great teacher. It can ask better questions than a static tutorial. It can adapt to your background. It can explain the same concept through Swift, Rust, TypeScript, or whatever language gives you the strongest analogy. It can catch gaps in your explanation and push you one level deeper.

But you have to make it teach.

Left alone, the agent tends to answer. Teaching requires resistance.

## Juniors still need the loop

This matters most for juniors.

The next generation will not learn without agents. That option is gone. The agent will be there from the first day, the same way Google and Stack Overflow were there for earlier generations. Every generation gets a tool the previous one had to invent a relationship with.

The problem is not that juniors will use agents. They should. The problem is what the agent lets them skip.

New engineers still need to learn what programs do underneath. They need to write loops, get them wrong, and understand why. They need to feel the difference between a list and a hash table in a real problem. They need to debug something without pasting the whole stack trace into a chat window first. They need to design a bad abstraction and then suffer it long enough to recognize the next one earlier.

The agent can describe the loop. It cannot give them the rep.

That is the uncomfortable part. A junior with an agent can ship work that looks more advanced than their understanding. The floor has moved up. Someone with little context can now produce what used to look like junior output. A junior can produce what used to look like mid-level output. The visible output is no longer a clean signal of the underlying skill.

The step to senior gets harder because of that.

Senior engineering is not typing speed. The work is judgment under constraint: architecture, debugging, security, domain knowledge, product sense, knowing which problem is worth solving and which solution will rot. Agents can help with those, but they do not transfer the judgment into you.

Practice does.

## Seniors are not exempt

This would be convenient as a junior problem. Seniors have their own version.

Senior engineers are vulnerable in a different way. We already have enough knowledge to make the agent useful, and enough confidence to trust ourselves while doing it. That combination is powerful and dangerous.

The agent lets you move into adjacent domains faster than before. I love that part. I have built tools in stacks I would have avoided three years ago because the cost of entry was too high. Now I can ask better questions, read unfamiliar code with help, and get a working path before motivation dies.

That is leverage.

The trap is mistaking reach for mastery. Building one tool in Go with an agent does not make me a Go expert. Shipping a Rust prototype does not mean I understand Rust's memory model. Getting a web app deployed does not mean I have earned the instincts of someone who has operated web systems for years.

The agent can extend your range before your judgment catches up.

That is fine if you know it, dangerous if you forget.

For seniors, the learning work becomes more deliberate. You have to decide when to delegate and when to drop down a level. Sometimes you let the agent write the code. Sometimes you sketch the design yourself first. Sometimes you ask for three approaches and critique them. Sometimes you close the agent and wrestle with the hard part manually because the rep is the point.

This is not anti-automation. Pilots do not preserve skill by refusing autopilot forever. They preserve skill by knowing when to step down the automation and fly the part that matters. Engineers need the same habit.

## What I refuse to outsource

I am still figuring out my own rules, but some have become clear.

I do not want the agent to own the first version of my understanding. If I am learning a new concept, I want to try to explain it before I ask for the polished explanation. If I am debugging something important, I want a hypothesis before I paste the error. If I am designing a system boundary, I want to name the tradeoff before the agent gives me options.

I also want to keep reading code. Not every line of every generated diff, because that does not scale and I would be lying if I said I did it. But reading code as practice has not stopped mattering: open source, teammate code, generated code that touches a risky path.

Reading still transmits taste.

The same applies to writing. Some code should still start with my hands on the keyboard when the goal is learning. Not because the agent would fail, but because success is not the output I care about most. Sometimes the output is the understanding that stays after the code is done.

That is why I set up a small AI learning folder for myself. Not a grand product. A personal learning harness. Right now I am using it for Rust. The important part is not the files, but the rule: the agent is a tutor, not an answer machine.

It tracks where I am. It knows my Swift background. It uses Rust exercises that force prediction, compiler-error diagnosis, memory diagrams, and small explanations back from me. It can help. It cannot protect me from every useful struggle.

That distinction matters.

## The new discipline of learning

The old path to programming skill was inefficient, but it had one gift: it forced practice. You could not get far without running into the material directly.

Agents remove that force. That is their power, and their cost.

Learning to code when the agent can code for you means choosing some work that you no longer have to do. Manual programming is not obsolete. Debugging by hand is not obsolete. Reading code is not obsolete. System design is not obsolete. They have changed category. They used to be default paths. Now they are deliberate practice.

That is the shift.

Use the agent. Let it remove waste. Let it open doors into languages, tools, and domains you would not have reached alone. But pay attention to the mental moves it takes from you. If the move builds judgment, do not outsource it every time.

The agent can help you learn faster.

It can also help you skip the part that would have made you good.
