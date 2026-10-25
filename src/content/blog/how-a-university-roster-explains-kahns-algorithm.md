---
title: "How a University Course Catalogue Explains Kahn's Algorithm"
subtitle: "The 1962 method for ordering dependent tasks, worked through a nine-course degree: one valid order, other possible orders, the fewest semesters, and a loop in the catalogue"
description: "A nine-course degree shows how Kahn's algorithm orders prerequisites, detects cycles, and finds the fewest semesters without a course cap."
sequence: 3
category: "Algorithms"
historicalPeriod: "1958–1962"
author: "Attila Kulik"
tags: ["Kahn's algorithm", "Topological sorting", "Graph algorithms"]
listingImage: "/images/kahns-algorithm-planning-desk.jpg"
listingImageAlt: "Illustration of an early-1960s planning desk with a PERT network chart, punched cards and tape cabinets"
heroImage: "/images/kahns-algorithm-planning-desk.jpg"
heroImageAlt: "Illustration of an early-1960s planning desk with a PERT network chart, punched cards and tape cabinets"
pubDate: 2026-10-13
draft: false
---

Kahn's algorithm, published by Arthur B. Kahn in 1962, puts tasks into an order in which no task comes before the tasks it depends on. It grew out of work on project networks such as those used to plan the US Navy's Polaris missile program. A university course catalogue poses the same ordering problem on a smaller scale: prerequisites must come before the courses that require them. With nine courses, we can find a valid order, work out the fewest semesters under stated assumptions, and spot a loop in the prerequisites.

## What Kahn's algorithm does

Kahn's algorithm takes a set of tasks and a set of "this before that" rules and produces a sequence that obeys every rule. Mathematicians call this kind of structure a **directed graph**. It consists of points, each called a **vertex**, joined by one-way arrows, each called an **edge**; an arrow from task A to task B means that A must come before B. "Graph" here means a diagram of connections, not a chart of data.

An ordering that obeys every arrow is called a **topological sort**. The name comes from topology, the branch of mathematics concerned with how things are connected rather than with distances. Such an ordering exists only if the arrows contain no loop. A loop, called a **cycle**, is a chain such as A before B, B before C and C before A. A graph without one is a **directed acyclic graph**, or DAG. A method that produces a topological sort therefore also tests a plan for contradictions.

Kahn's method keeps one number for each task, its **in-degree**: the number of arrows pointing into it, meaning the number of tasks it still waits for. It repeatedly takes an eligible task whose in-degree is zero, places it next in the sequence, and lowers by one the in-degree of every task that was waiting for it. Newly eligible tasks join a set of tasks ready to be chosen. A **queue**, a first-in, first-out waiting line, is one way to choose among them; it gives one valid order, while other choices can give others.

## Who devised it

Topological sorting became a practical problem through **PERT**. Its name initially stood for Program Evaluation Research Task; it later became Program Evaluation and Review Technique. The US Navy's Special Projects Office began developing PERT in January 1958, with Booz, Allen & Hamilton and Lockheed, to plan the Polaris program. A PERT network links project events by activities. To calculate dates through the network, a computer has to follow those dependencies in topological order. M. P. Jarnagin of the Naval Weapons Laboratory also studied how to test PERT networks for consistency in a memorandum numbered K-24/60.

Kahn's paper, "Topological sorting of large networks", appeared in *Communications of the ACM* in November 1962. Its emphasis was size: it estimated that a PERT network of 30,000 activities could be ordered in under an hour on an IBM 7090. Kahn developed the method while working at Westinghouse in Baltimore. When the paper appeared, it had not been programmed: an existing Lockheed program met Westinghouse's needs.

## The course catalogue analogy

### Reading the catalogue

A university course catalogue can model Kahn's algorithm, because a degree is a set of courses with "this before that" rules that a student must turn into an order. Imagine you are planning a computer science degree with nine required courses. The catalogue lists each course with its prerequisites. Each course is a vertex, and each prerequisite is an edge from the prerequisite to the course that requires it. Beside each course you pencil in its in-degree, the number of prerequisites you have not yet passed.

| Course | Prerequisites | Still needed |
|---|---|---|
| Calculus | none | 0 |
| Discrete Mathematics | none | 0 |
| Intro to Programming | none | 0 |
| Linear Algebra | Calculus | 1 |
| Data Structures | Intro to Programming | 1 |
| Computer Architecture | Intro to Programming | 1 |
| Algorithms | Data Structures, Discrete Mathematics | 2 |
| Operating Systems | Data Structures, Computer Architecture | 2 |
| Machine Learning | Algorithms, Linear Algebra | 2 |

The pencilled counts add up to 0 + 0 + 0 + 1 + 1 + 1 + 2 + 2 + 2 = 9, which is the number of prerequisite links. You also keep two lists. The eligible list holds every course whose count is 0. For this worked example, new courses go at the bottom and you take them from the top, so the list works as a queue. It starts with Calculus, Discrete Mathematics and Intro to Programming. The second list records the order in which you place courses in your study plan. A complete ordering is a topological sort; it does not yet say which courses you take in the same semester.

### Planning one order

At each step, you take the top course on the eligible list and write it into your study plan. Then you lower by one the count of every course that lists it as a prerequisite, and any course that reaches 0 joins the bottom of the list. Placing one course at a time, the nine-course catalogue needs nine steps.

| Step | Course placed | Counts lowered | Eligible list afterwards |
|---|---|---|---|
| 1 | Calculus | Linear Algebra 1 → 0 | Discrete Mathematics, Intro to Programming, Linear Algebra |
| 2 | Discrete Mathematics | Algorithms 2 → 1 | Intro to Programming, Linear Algebra |
| 3 | Intro to Programming | Data Structures 1 → 0; Computer Architecture 1 → 0 | Linear Algebra, Data Structures, Computer Architecture |
| 4 | Linear Algebra | Machine Learning 2 → 1 | Data Structures, Computer Architecture |
| 5 | Data Structures | Algorithms 1 → 0; Operating Systems 2 → 1 | Computer Architecture, Algorithms |
| 6 | Computer Architecture | Operating Systems 1 → 0 | Algorithms, Operating Systems |
| 7 | Algorithms | Machine Learning 1 → 0 | Operating Systems, Machine Learning |
| 8 | Operating Systems | none | Machine Learning |
| 9 | Machine Learning | none | empty |

The order is therefore Calculus, Discrete Mathematics, Intro to Programming, Linear Algebra, Data Structures, Computer Architecture, Algorithms, Operating Systems, Machine Learning. Every step is allowed because a course joins the eligible list only after all of its prerequisites are in the plan.

### Other orders

The catalogue allows 864 different orders. Orders differ wherever neither of two courses is a prerequisite of the other, directly or through other courses. Calculus and Intro to Programming are one such pair, so either can come first. For example, you could start on the longest prerequisite chain and place Intro to Programming, Data Structures, Discrete Mathematics, Algorithms, Calculus, Linear Algebra, Machine Learning, Computer Architecture, Operating Systems.

If you may choose any eligible course at each step, Kahn's method can produce any of the 864 orders. The fixed queue used above produces just one of them. The figure of 864 comes from a short program that makes every possible eligible choice at every step and counts the complete plans.

### The fewest semesters

Every complete order contains all nine courses, so no order contains fewer courses than another. What can differ is the number of semesters. Assuming each course takes one semester, prerequisites must have been completed in earlier semesters, and there is no limit on courses per semester, the minimum is four.

The semester plan comes from running Kahn's algorithm in rounds. Each semester, you take every course on the eligible list at once, and you lower the counts only when the semester ends. Semester 1 is Calculus, Discrete Mathematics and Intro to Programming, and semester 2 is Linear Algebra, Data Structures and Computer Architecture. Semester 3 is Algorithms and Operating Systems, and semester 4 is Machine Learning. That is 3 + 3 + 2 + 1 = 9 courses in four semesters.

No plan can be shorter, because Intro to Programming, Data Structures, Algorithms and Machine Learning form a chain in which each course is a prerequisite of the next. Those four courses need four different semesters. This longest chain is the **critical path**; delaying a course on it delays graduation. Each of the other five courses has one semester of **slack** in the four-semester plan: considered individually, it can slip by one semester without delaying graduation. Operating Systems, for instance, can move from semester 3 to semester 4, because no course requires it. Earliest dates, latest dates and slack are quantities calculated in PERT. The minimum here is set by the longest chain, in contrast with the shortest-route problem in [How a Road Atlas Explains Dijkstra's Algorithm](../how-a-road-atlas-explains-dijkstras-algorithm/).

A cap on courses per semester makes the problem harder. With at most two courses per semester, four semesters hold only 4 × 2 = 8 courses, so at least five semesters are needed. You can finish in five by starting with the critical path:

1. Intro to Programming and Discrete Mathematics
2. Data Structures and Calculus
3. Algorithms and Linear Algebra
4. Machine Learning and Computer Architecture
5. Operating Systems

Choosing eligible courses without regard to their later dependencies can take six semesters instead. Suppose your first three semesters are Calculus and Intro to Programming, then Data Structures and Computer Architecture, then Linear Algebra and Operating Systems. Discrete Mathematics, Algorithms and Machine Learning are then left, and each is a prerequisite of the next, so they need three more semesters.

When each course takes one semester and at most two can be taken per semester, Edward Coffman and Ronald Graham published a priority rule in 1972 that always reaches the minimum. In the general version, where the cap is part of the input, Jeffrey Ullman showed in 1975 that deciding whether a plan fits within a specified number of semesters is **NP-complete**: a proposed plan can be checked quickly, but no polynomial-time method is known for finding an optimal plan in every case. Kahn's algorithm, run in rounds, finds the fewest semesters when there is no cap.

### When the catalogue contains a loop

The original catalogue contains no loop, and Kahn's algorithm confirms it by placing all nine courses in the study plan. If there were a loop, some courses would be left behind. Suppose the catalogue is misprinted so that Data Structures requires Operating Systems, while Operating Systems still requires Data Structures. Data Structures then starts with a count of 2.

You place Calculus, Discrete Mathematics, Intro to Programming, Linear Algebra and Computer Architecture, and then the eligible list is empty. Each of the four remaining courses has a count of 1. Data Structures and Operating Systems are waiting for each other, and Algorithms and Machine Learning are waiting behind them. A study plan with only 5 of the 9 courses is the signal of a cycle.

The test works in both directions. Without a loop, tracing unpassed prerequisites backwards from any waiting course must end at a course whose count is 0, so the eligible list cannot run out early. With a loop, the courses on it never reach 0. The algorithm thus detects the kind of network inconsistency that Jarnagin studied.

### How the work grows with the catalogue

Kahn's algorithm handles each course and each prerequisite link a fixed number of times. Its work therefore grows in direct proportion to the size of the catalogue, which is called **linear time**. For n courses and e links, the running time is O(n + e), assuming we can look up the courses that depend on each completed course.

Consider a deliberately simple alternative that inspects every remaining course after each selection to see what is eligible. It would visit n + (n − 1) + … + 1 = n × (n + 1) ÷ 2 course entries: 45 visits for this nine-course example, or 450,015,000 visits for 30,000 entries. Maintaining counts avoids those repeated full scans. These figures count visits under that particular rescan method, not the running time of every possible alternative.

Python's standard library follows Kahn's approach in `graphlib.TopologicalSorter`. Its `get_ready()` method returns all currently eligible courses; after they are completed, calling `done()` makes the next round available. The `prepare()` method raises `CycleError` if the prerequisites contain a loop.

## Sources

- Kahn, A. B., ["Topological sorting of large networks"](https://doi.org/10.1145/368996.369025), *Communications of the ACM* 5 (11), 1962, pp. 558–562. The historical details above come from its abstract.
- US Navy Special Projects Office, [*Program Evaluation Research Task, Summary Report, Phase 1*](https://books.google.com/books?id=THB4MR8XCcMC), 1958; Malcolm, D. G., J. H. Roseboom, C. E. Clark and W. Fazar, ["Application of a Technique for Research and Development Program Evaluation"](https://mosaicprojects.com.au/PDF-Gen/PM-History_PERT-Original_Paper.pdf), *Operations Research* 7 (5), 1959, pp. 646–669.
- Jarnagin, M. P., *Automatic machine methods of testing PERT networks for consistency*, Naval Weapons Laboratory, memorandum K-24/60, [listed by the US government catalogue as published in 1961](https://www.govinfo.gov/content/pkg/GOVPUB-GP3-8fe2f5d1d7363a9d700fe0cef9370732/pdf/GOVPUB-GP3-8fe2f5d1d7363a9d700fe0cef9370732.pdf). The memorandum itself was not consulted.
- Coffman, E. G., and R. L. Graham, ["Optimal scheduling for two-processor systems"](https://fanchung.ucsd.edu/ron/papers/72_04_two_processors.pdf), *Acta Informatica* 1, 1972, pp. 200–213; Ullman, J. D., ["NP-complete scheduling problems"](https://www.sciencedirect.com/science/article/pii/S0022000075800080), *Journal of Computer and System Sciences* 10 (3), 1975, pp. 384–393.
- Python Software Foundation, [`graphlib.TopologicalSorter` documentation](https://docs.python.org/3/library/graphlib.html).

The course catalogue is an invented example. Its 864 valid orders and the semester plans were checked separately for this article.
