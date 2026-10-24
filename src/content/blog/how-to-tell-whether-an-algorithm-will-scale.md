---
title: "How to Tell Whether an Algorithm Will Scale"
subtitle: "A concert guest list shows what happens when the work grows slowly, steadily, or much faster than the list"
description: "Double a concert guest list from 10 to 20 to 40 names and count the checks behind logarithmic, linear and quadratic growth."
sequence: 12
category: "Algorithms"
historicalPeriod: "1894–1976"
author: "Attila Kulik"
tags: ["Algorithms", "Big O", "Algorithm analysis", "Scaling"]
heroImage: "/images/concert-guest-list-scaling-feature-photo.webp"
heroImageAlt: "Concert check-in attendant using a tablet guest list beside stacked tickets, with arriving guests and stage lights in the background"
pubDate: 2026-10-24
draft: false
---

You are checking guests in for a concert. Ten names fit on a short list. What changes when the list grows to twenty, then forty? The answer depends on what you do with it. Searching an unsorted list, searching a sorted list, and checking every pair of bookings require different amounts of work.

Counting those comparisons is a way to judge whether an **algorithm**—a set of steps for solving a problem—will scale. Here, *n* is the number of guest-list entries. We will count comparisons rather than seconds, because the time for one comparison depends on the device and software, while the number of comparisons reveals how the work grows.

## Three jobs at the check-in desk

Suppose a guest asks for a ticket booked under a name that is **not** on the list. With an unsorted list, you check from the first entry to the last. You must read all *n* names before you can say the name is absent. Ten entries require ten checks; twenty require twenty; forty require forty. This is a **linear search**: doubling the list doubles the worst-case comparisons.

Now suppose the list is alphabetised and stored so you can jump straight to any numbered row. Check the middle name. The alphabetical order tells you which half could contain the guest, so you discard the other half. Repeat until no rows remain. This is **[binary search](/how-a-dictionary-explains-binary-search/)**. It takes at most four name comparisons to confirm that a name is absent from ten entries, five from twenty, and six from forty. Each doubling adds about one comparison because each comparison removes about half the remaining possibilities.

Before doors open, you have a different job: check whether *any two* booking records have the same booking reference. Each record should have a unique reference, so a repeat flags a duplicate record. One simple method compares each entry with every later entry. For ten entries, the first is compared with nine others, the second with eight, and so on: 9 + 8 + ··· + 1 = 45 comparisons if no duplicate is found. Twenty entries need 190 such comparisons, and forty need 780. This is a **pairwise check**, not another way to look up one guest. We use it to see a third pattern of growth.

Both searches assume the name is absent. The pairwise check assumes no booking reference repeats. The table counts the comparisons needed in those cases.

| Entries (*n*) | Linear search | Binary search | Pair checks |
| ---: | ---: | ---: | ---: |
| 10 | 10 | 4 | 45 |
| 20 | 20 | 5 | 190 |
| 40 | 40 | 6 | 780 |
| 1,000 | 1,000 | 10 | 499,500 |

The pair count is *n* × (*n* − 1) ÷ 2: choose one of *n* entries and one of the remaining *n* − 1, then divide by two because otherwise each pair is counted twice. Thus 40 × 39 ÷ 2 = 780, while 1,000 × 999 ÷ 2 = 499,500. Binary search needs at most ten comparisons for 1,000 entries because 2¹⁰ = 1,024. These are counts for different jobs, not predicted running times. If a duplicate appears early, the pairwise check can stop sooner.

![Four stages of an unsuccessful binary search in ten sorted guest-list entries: a middle comparison narrows ten possible entries to five, then to two, then to one, then to none.](/images/concert-guest-list-binary-search.svg)

*The groups show how many entries remain possible before each comparison. The search ends when no entries remain; four names were checked.*

## What the growth labels mean

Computer scientists use **Big O notation** to describe an upper bound on how work grows with input size. The linear search is **O(n)** in the worst case: it makes at most one comparison per entry. Binary search is **O(log n)**: its repeated halving makes the number of comparisons grow slowly. The pairwise check is **O(n²)**: its comparison count, *n* × (*n* − 1) ÷ 2, grows roughly with the square of *n*. [MIT's algorithms notes](https://live.ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/c6d8f06c6f11e3342633dec85498f551_MIT6_006S20_r01.pdf) give the formal definition and use sorted-array search as a logarithmic example.

The “log” in binary search means: how many times can you halve the possibilities before none remain? For powers of two, doubling the list adds exactly one halving step. The base of the logarithm changes the numerical value by a constant factor, so Big O usually leaves the base unspecified. For our comparison counts, thinking in base two is natural.

Big O describes growth, not an exact stopwatch reading. A single comparison might take more time in one program than another. Preparing an alphabetised list also takes work that the binary-search column does not count. If you search a list only once, that preparation may outweigh the saved comparisons. And jumping to the middle row assumes a structure such as an array that lets the computer reach a numbered entry directly. A physical guest list that you can only read from the top would not offer the same cheap jump.

Strictly, O(n²) is an *upper bound*: it does not, by itself, say that an algorithm must perform work proportional to *n*². Here the pair formula shows why “quadratic” is a tight description of this particular no-duplicate check. The same care matters when reading another algorithm's label: ask which case is being counted, what one unit of work costs, and what has already been prepared.

## Where the notation came from

The notation began in mathematics before it was used to study computer programs. In his [1976 account of its history](https://doi.org/10.1145/1008328.1008329), Donald Knuth reports that Edmund Landau traced the earliest use of the O symbol known to him to **Paul Bachmann's 1894** book on analytic number theory. Knuth argued that computer scientists should use O for an upper bound and distinguish it from lower bounds and tight bounds. That precision helps us compare algorithms across machines: a faster computer changes how long each step takes, but not whether the number of steps grows with *n*, log *n* or *n*².

## Reading the rest of the series

The same questions work when the input is more than a list. In [Kahn's algorithm](../how-a-university-roster-explains-kahns-algorithm/), *n* counts courses and *e* counts prerequisite links. When each course's dependent courses are easy to find, the algorithm handles each course and link a fixed number of times, giving **O(n + e)**. A single number for “list length” would hide part of that input.

In [Dijkstra's algorithm](../how-a-road-atlas-explains-dijkstras-algorithm/), a simple search for the next town can require work growing roughly as the square of the number of towns. A heap changes how that next town is selected, leading to a bound involving the number of towns, roads and a logarithm. The formulas describe different ways to organise the work; their constants and the shape of the road network still matter in practice.

## Make the scaling decision

For one lookup on a ten-name list, a simple scan may be sufficient; sorting first adds work. If the same 1,000-name list will be searched repeatedly, keeping it sorted and using binary search becomes more attractive. The table counts one lookup, so the number of lookups matters as well as the number of entries.

For the duplicate-record job, 499,500 pair comparisons at 1,000 entries suggest changing the method. One option is to sort records by booking reference, then compare neighbouring references instead of every pair. That also takes preparation work, which belongs in the full cost. A growth label points to a possible improvement; to estimate how long the task will take, measure the complete workflow on realistic data.

To make a scaling claim, first name the input size—or sizes. Then choose a unit of work you can count, such as comparing two names, comparing two booking references or examining one road. Count how often that action can happen as the input grows, and check the assumptions that make each action cheap. The guest list's 10 → 20 → 40 progression makes those questions visible before the notation appears.

## Sources

- [Massachusetts Institute of Technology, *6.006 Introduction to Algorithms*, Recitation 1: Asymptotic Notation](https://live.ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/c6d8f06c6f11e3342633dec85498f551_MIT6_006S20_r01.pdf): formal growth definitions, the sorted-array binary-search example, and inputs described by more than one parameter.
- [Donald E. Knuth, “Big Omicron and Big Omega and Big Theta,” *SIGACT News* 8, no. 2 (1976), 18–24](https://doi.org/10.1145/1008328.1008329): history of O notation and its upper-bound meaning. [Readable copy](https://danluu.com/knuth-big-o.pdf).
- [National Institute of Standards and Technology, Dictionary of Algorithms and Data Structures, “big-O notation”](https://xlinux.nist.gov/dads/HTML/bigOnotation.html): upper-bound definition and the distinction between operation counts and elapsed time.

The concert, bookings and comparison counts are constructed teaching examples. The counts assume a missing name, direct access to sorted rows for binary search, booking references intended to be unique, and no matching pair for the duplicate check. The generated feature photo and diagram illustrate those assumptions.
