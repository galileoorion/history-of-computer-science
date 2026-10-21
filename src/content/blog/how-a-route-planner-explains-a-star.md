---
title: "How a Route Planner Explains A*"
subtitle: "The shortest route comes from balancing distance travelled with distance still to go"
description: "Follow a five-stop route to see how A* uses an optimistic estimate to find a shortest path, why it can stop searching, and when its guarantee holds."
sequence: 8
category: "Algorithms"
historicalPeriod: "1966–1968"
author: "Attila Kulik"
tags: ["A*", "Pathfinding", "Heuristic search", "Algorithms"]
heroImage: "/images/a-star-route-planner-feature.jpg"
heroImageAlt: "Illustrated city map on a desk at dusk, with several glowing routes between two points and a compass beside it"
pubDate: 2026-10-21
draft: false
---

Imagine planning a journey across town. One route heads straight towards your destination but meets a slow crossing. Another begins in a less promising direction and reaches a faster road. Looking only at how close each junction appears to the destination can send you the wrong way. Looking only at the distance already travelled gives you no sense of where the destination is.

**A\*** (pronounced “A-star”) combines both pieces of information. At each possible next stop, it adds the cost of the best route found *so far* to an estimate of the cost *still to go*. It explores the stop with the smallest total first. With a suitably cautious estimate, A* finds a cheapest route without having to explore every reachable stop.

## Two numbers and an estimate

A route map is a **graph**: junctions are **nodes**, connections are **edges**, and each edge has a cost such as minutes or kilometres. A* keeps three numbers for a node `n`:

| Symbol | Meaning |
| --- | --- |
| `g(n)` | Cost of the cheapest route to `n` found so far |
| `h(n)` | Estimated cost from `n` to the destination |
| `f(n) = g(n) + h(n)` | Estimated total cost of a route through `n` |

The `h` value is a **heuristic**: a useful estimate rather than a known route. For a route measured in distance, straight-line distance can be a lower bound because a road cannot be shorter than the direct line between its endpoints. A map with obstacles might make the real journey much longer. If costs are measured in time, the heuristic must also be in time; one possible lower bound is straight-line distance divided by a speed that no route can exceed. [Amit Patel's pathfinding guide](https://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html) explains why the heuristic's units and movement rules must match the route costs.

A* keeps a list of stops it has reached but not yet examined. It repeatedly takes the one with the smallest `f`, checks its outgoing connections, and updates a neighbour when it discovers a cheaper way to reach it. It also remembers the preceding stop on each best-known route, so it can reconstruct the final journey.

## A five-stop journey

Consider this invented map of one-way connections. The number on each arrow is the travel time in minutes. Amber arrows form the cheapest route. The small `h` beside each stop is an optimistic estimate of the remaining time. The diagram shows connections rather than physical positions, so it is not drawn to scale.

![Five-stop directed route graph: Start to Arcade costs 2 and to Basin costs 3; Arcade to Crossing costs 2 and to Goal costs 9; Basin to Goal costs 4; Crossing to Goal costs 2. The Start–Arcade–Crossing–Goal route is highlighted. Remaining-time estimates are 5, 4, 4, 2 and 0 respectively.](/images/a-star-five-stop-route.svg)

Where do these particular `h` values come from? Imagine a separate scale map on which the straight-line distances to Goal are 5 km from Start, 4 km from Arcade and Basin, 2 km from Crossing, and 0 km from Goal. Suppose no route can be travelled faster than 1 km per minute. Dividing each distance by that maximum speed gives lower bounds of **5, 4, 4, 2 and 0 minutes**. These are the `h` labels in the diagram. Roads may take longer, but cannot beat the straight-line journey at the maximum speed. Moving along an edge also cannot reduce this estimate by more than that edge's travel time, making the heuristic consistent.

The true cheapest remaining times are 6 at Start, 4 at Arcade, 4 at Basin, 2 at Crossing and 0 at Goal. Each `h` is no greater than the corresponding true cost. Start's estimate of 5 is deliberately a little low.

Here is A*'s search. When two routes reach the same stop, it keeps the cheaper one.

| Stop examined | What the search learns | Best waiting stops, shown as `g + h = f` |
| --- | --- | --- |
| Start | Arcade costs 2 to reach; Basin costs 3. | Arcade `2 + 4 = 6`; Basin `3 + 4 = 7` |
| Arcade | Crossing costs `2 + 2 = 4` to reach. The direct route to Goal costs `2 + 9 = 11`. | Crossing `4 + 2 = 6`; Basin `3 + 4 = 7`; Goal `11 + 0 = 11` |
| Crossing | Its connection improves Goal's best-known cost from 11 to `4 + 2 = 6`. | Goal `6 + 0 = 6`; Basin `3 + 4 = 7` |
| Goal | Goal has the smallest `f`, so the search ends. | Route: Start → Arcade → Crossing → Goal; **6 minutes** |

Finding Goal at a cost of 11 after examining Arcade did **not** finish the search. Crossing still offered a possible route with an estimated total of 6. A* stopped only when Goal became the waiting stop with the smallest `f`. It never needed to examine Basin.

The planner analogy maps directly to the algorithm: stops are nodes, travel times are edge costs, the journey already made is `g`, and the cautious guess about the rest is `h`. The analogy stops at the guess. A human may use local knowledge or intuition without a formal bound; A*'s shortest-route guarantee depends on a precise property of that estimate.

## Why the estimate must be cautious

An **admissible** heuristic never overestimates the cheapest remaining cost. Think of `g + h` as a lower bound on the cost of completing a route through a waiting stop. If Goal is next with cost 6, while every other waiting stop has a lower bound of at least 6, none can lead to a cheaper answer. This is the reason A* can stop when it *selects* Goal, rather than when it first *discovers* it. [Carnegie Mellon University's search notes](https://www.cs.cmu.edu/~15281-f23/coursenotes/search/index.html) derive the optimality rule for A*.

There is a further detail when a program permanently closes stops it has already examined. A **consistent** heuristic satisfies `h(n) ≤ cost(n, m) + h(m)` for every edge from `n` to `m`, and assigns the goal an estimate of zero. It cannot drop by more than the cost of one step. The estimates in our map are consistent. With this property and nonnegative edge costs, the usual graph-search implementation can close each examined stop without later reopening it. If a heuristic is admissible but inconsistent, an implementation may need to reopen a stop when a cheaper route to it appears. [CMU's notes](https://www.cs.cmu.edu/~15281-f23/coursenotes/search/index.html) distinguish these cases.

Set every `h` to zero and A* chooses only by `g`: it becomes [Dijkstra's shortest-path search](/how-a-road-atlas-explains-dijkstras-algorithm/). A better lower bound can direct the search towards the goal, but an estimate that is too high can forfeit the cheapest-route guarantee. Even a valid heuristic may save little work on an unfavourable map, and storing the waiting stops and best-known routes can require substantial memory.

## From Shakey to everyday pathfinding

Peter E. Hart, Nils J. Nilsson and Bertram Raphael developed A* at the Stanford Research Institute and published [“A Formal Basis for the Heuristic Determination of Minimum Cost Paths”](https://doi.org/10.1109/TSSC.1968.300136) in **1968**. Their paper gave heuristic graph search a formal basis and studied when a search strategy could guarantee a minimum-cost path.

This work grew out of SRI's **Shakey** robot research. From **1966 to 1972**, the project explored how a mobile robot could perceive its surroundings, plan and find routes. The [Computer History Museum's Shakey exhibit](https://www.computerhistory.org/revolution/artificial-intelligence-robotics/13/289) identifies A* as one of the sophisticated search techniques developed by the team. The robot's world was simple compared with a modern street map, but the question was enduring: which possibility should a planner examine next?

Today the same idea applies wherever a problem can be represented as states, moves and costs: route planning, game movement and robot navigation are common examples. A* does not supply the map or the heuristic by itself. Its practical value comes from modelling the real costs accurately and choosing a lower bound that is both safe and informative. A closed road or changed travel time also changes the problem, so a previously computed route must be checked or planned again.

The small map captures the core lesson: **progress already made and distance still expected both matter**. A* uses their sum to decide where to look, and an honest lower bound lets it know when the best route has been found.

## Sources

- [Peter E. Hart, Nils J. Nilsson and Bertram Raphael, “A Formal Basis for the Heuristic Determination of Minimum Cost Paths” (1968)](https://doi.org/10.1109/TSSC.1968.300136): original A* paper and publication details.
- [SRI International, *Shakey the Robot*](https://www.sri.com/publication/artificial-intelligence-pubs/shakey-the-robot-pub/): the project's 1966–1972 period and its planning and route-finding aims.
- [Computer History Museum, *Shakey*](https://www.computerhistory.org/revolution/artificial-intelligence-robotics/13/289): A*'s connection to Shakey and later uses.
- [Carnegie Mellon University, *Search and Games* course notes](https://www.cs.cmu.edu/~15281-f23/coursenotes/search/index.html): `f = g + h`, admissibility, consistency and graph-search guarantees.
- [Amit Patel, *Heuristics for A\* Pathfinding*](https://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html): matching heuristics to movement rules and cost units.

The five-stop route, its times and its estimates were created for this article. The feature illustration is a visual metaphor; the labelled graph supplies the exact data used in the walkthrough.
