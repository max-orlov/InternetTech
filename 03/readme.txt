Questions
Q1. What was hard in this exercise?
Q2. What was fun in this exercise?
Q3. What did we do in order to make our server efficient?

Answers
A1. The hardest part of this exercise was getting a firm grasp on the event loop concept.
    Though we had some idea on concurrency (through threads in c++), this was a bit different.
    The event loop itself made us think differently then what we ever encountered before, this event driven
    concept was new for us.
    After getting a better understanding we had some cross-platform issues (but it appears that the error was
    confined to single machine issue).
A2. The best part of this exercise was the understanding, that js is quite flexible. That is, we might add some
    attributes to an existing object on run-time (or even create new function - which is the same in js)
A3. Our server uses only async function (when possible), thus creating a non blocking server - which is
    necessary in order to provide a better reactivity to the client-side.


