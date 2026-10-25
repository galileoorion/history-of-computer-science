---
title: "How an Airport Landing Queue Explains Priority Queues"
subtitle: "Why the next aircraft can be chosen without sorting every waiting flight"
description: "A fictional airport queue shows how a priority queue selects the smallest score, how a binary heap maintains that choice, and why route-finding algorithms use it."
sequence: 15
category: "Data structures"
historicalPeriod: "1959–1968"
author: "Attila Kulik"
tags: ["Priority queues", "Binary heaps", "Data structures", "Graph algorithms"]
heroImage: "/images/airport-priority-queue-feature-photoreal.jpg"
heroImageAlt: "View from an airport control tower at dusk, with an aircraft approaching a lit runway and an operations desk in the foreground"
pubDate: 2026-10-25
draft: false
---

Imagine an airport operations desk tracking several aircraft approaching one runway. In this simplified exercise, each flight has a number: the smaller the number, the sooner its landing request should be considered. Flights join the waiting list, and their numbers may change as new information arrives. The desk needs to find the smallest number again and again.

A **priority queue** keeps items waiting and repeatedly supplies the one with the highest priority. In our exercise, “highest priority” means the **lowest score**. Unlike an ordinary queue, where the first arrival leaves first, a later arrival can be considered next if its score is smaller. The priority queue decides which record to take from the list; it does not make a real aviation safety decision.

## A queue ordered by importance

Suppose five flights have these invented scores:

| Flight | Aster | Birch | Cedar | Dove | Elm |
| --- | ---: | ---: | ---: | ---: | ---: |
| Score | 4 | 7 | 6 | 9 | 8 |

The desk needs three operations: **insert** a new flight, **take the flight with the smallest score**, and **change** a waiting flight's score. A list could do this. With five cards, the desk can scan them all and find Aster's score of 4. With a million cards, scanning the whole list for every choice would be expensive. Keeping every card in fully sorted order would make the next choice easy, but inserting or changing a card could require moving many others.

A **binary heap** is one way to balance those jobs. It stores the cards in a branching arrangement, usually represented by an array. Every parent has a score no greater than either of its children. This is a **min-heap**. The rule applies only between a parent and its children: Birch's 7 and Cedar's 6 need not be in order beside each other. Because no descendant can have a smaller score than its ancestors, the root must hold the smallest score in the whole heap. [Python's `heapq` documentation](https://docs.python.org/3/library/heapq.html) states this rule and uses the first array position for the smallest item.

![A min-heap of five fictional flights. Aster 4 is the root; Birch 7 and Cedar 6 are its children; Dove 9 and Elm 8 are Birch's children. Every parent score is no greater than its children's scores.](/images/airport-priority-queue-heap.svg)

The branches are a way to picture the array, not a set of physical holding patterns in the sky. The top row has one card, the next two, and the next up to four. The last row fills from left to right. That nearly complete shape keeps the heap shallow.

## A new flight joins

Now **Finch** arrives with score **2**. Add Finch in the next open position, below Cedar. The heap rule is broken there: a child with score 2 sits below a parent with score 6. Swap Finch with Cedar. Finch is now below Aster's 4, so swap again. Finch reaches the root.

In the lists below, `A4` means Aster with score 4, and so on. Read the positions from the root down, left to right within each row:

```text
Start  A4 B7 C6 D9 E8
Add F  A4 B7 C6 D9 E8 F2
Up 1   A4 B7 F2 D9 E8 C6
Up 2   F2 B7 A4 D9 E8 C6
```

Each swap moves Finch one level upward. The heap does not sort the other flights. It repairs only the path on which the new card could violate the rule.

## Take the next flight

The desk takes Finch, whose score is the smallest and whose card sits at the root. Move the last card, Cedar 6, to the empty root. Cedar is larger than its child Aster 4, so swap those two. The remaining heap is:

```text
After Finch: A4 B7 C6 D9 E8
```

Aster is next. Notice that the heap has returned to its original arrangement; that is a result of these particular numbers, not a rule that removal undoes insertion. Taking the smallest item is often called **extract-min**. The repair after moving the last card down is called **sifting down**.

Suppose the desk then changes Birch's score from **7 to 1**. Birch now has a smaller score than its parent, Aster 4, so it moves up one level and becomes the root. This is a **decrease-key** operation: the item stays in the queue, but its priority improves. To update a particular flight quickly, the program also needs a way to locate its heap entry, such as a separate map from flight code to array position. Without that, searching for Birch can itself take a scan. Some implementations instead insert a new entry and ignore the old one when it eventually reaches the top; [Python's priority-queue notes](https://docs.python.org/3/library/heapq.html#priority-queue-implementation-notes) show that approach.

## Why the heap saves work

With *n* flights, the heap has roughly log₂ *n* levels. Inserting, extracting the smallest, or moving a known entry after its score decreases travels along at most one path through those levels. Each operation therefore takes **O(log *n*)** work in the worst case, while merely reading the root takes **O(1)**. A million entries need about 20 levels. That does not mean every operation takes exactly 20 comparisons, but it explains why the amount of work grows slowly as the queue becomes large. [MIT's binary-heaps lecture](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/40d4851e550507ca14dc778b9b2266cc_MIT6_006S20_lec8.pdf) works through the shape, heap rule and insert and removal operations.

The heap is **partly ordered**. Only the root is guaranteed to be the smallest of all the waiting entries. To obtain every flight in score order, the program must repeatedly extract the root. If two flights have the same score, the heap rule alone does not say which comes first; the desk needs a tie-breaking rule, such as arrival order.

## From heaps to shortest routes

In [his 1959 shortest-path paper](https://doi.org/10.1007/BF01386390), Edsger W. Dijkstra repeatedly selected the reachable point with the smallest distance found so far. The [road-atlas article](/how-a-road-atlas-explains-dijkstras-algorithm/) follows that selection on a small map. Finding the smallest note by scanning works for seven towns; a priority queue makes repeated selection practical on much larger, sparse maps.

J. W. J. Williams described a heap in [“Algorithm 232: Heapsort”](https://doi.org/10.1145/512274.512284), published in 1964. His procedures included adding an item and extracting the least item. The heap is a later way to carry out the kind of repeated minimum selection used in graph algorithms; it was not part of Dijkstra's 1959 paper.

[A*](https://doi.org/10.1109/TSSC.1968.300136), introduced by Peter Hart, Nils Nilsson and Bertram Raphael in 1968, also chooses a waiting point repeatedly. Its score combines the route cost found so far with an estimate of what remains. The [route-planner article](/how-a-route-planner-explains-a-star/) explains that score. A priority queue can keep the lowest current score ready in either algorithm, although Dijkstra and A* use different rules to calculate it.

The airport example is deliberately simplified. Real landing decisions involve separation, weather, runway availability, instructions and safety procedures; a single invented score cannot replace them. Aircraft cannot swap physical positions as freely as cards move inside a heap. What carries over is the data problem: **items arrive, priorities change, and the next smallest score must be found repeatedly**.

## Sources

- Edsger W. Dijkstra, [“A note on two problems in connexion with graphs”](https://doi.org/10.1007/BF01386390), *Numerische Mathematik*, 1959. Original repeated minimum-distance selection.
- J. W. J. Williams, [“Algorithm 232: Heapsort”](https://doi.org/10.1145/512274.512284), *Communications of the ACM*, 1964. Original heap procedures, including insertion and extraction of the least item.
- Peter E. Hart, Nils J. Nilsson and Bertram Raphael, [“A Formal Basis for the Heuristic Determination of Minimum Cost Paths”](https://doi.org/10.1109/TSSC.1968.300136), *IEEE Transactions on Systems Science and Cybernetics*, 1968. Original A* paper.
- MIT OpenCourseWare, [*Introduction to Algorithms*, Lecture 8: Binary Heaps](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/40d4851e550507ca14dc778b9b2266cc_MIT6_006S20_lec8.pdf). Heap shape, ordering, operations and growth.
- Python Software Foundation, [`heapq` documentation](https://docs.python.org/3/library/heapq.html). Min-heap rule, priority queues and changing priorities.

The airport, flights, scores and sequence of changes are invented teaching examples; they do not describe real air-traffic-control practice. The feature image is AI-generated, not a photograph of a real tower or flight.
