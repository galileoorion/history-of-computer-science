---
title: "How a Museum Explains Tree Traversal"
subtitle: "Depth-first search follows one branch; breadth-first search visits rooms level by level"
description: "Explore a branching museum to see how DFS and BFS visit a tree, why a stack and a queue produce different orders, and when each approach helps."
sequence: 10
category: "Algorithms"
historicalPeriod: "1882–1972"
author: "Attila Kulik"
tags: ["Tree traversal", "Depth-first search", "Breadth-first search", "Algorithms"]
heroImage: "/images/tree-traversal-museum-feature-photo-v2.jpg"
heroImageAlt: "Photorealistic depiction of a front-facing marble statue in a museum hall between two branching galleries"
pubDate: 2026-10-24
draft: false
---

Imagine you are checking every gallery in a museum. There is one entrance, and no door connects separate branches. You could follow one corridor to its end, return, and try the next. Or you could check every gallery one doorway from the entrance before going two doorways away.

These are two ways to **traverse** a tree: to visit its parts in a planned order. **Depth-first search** (DFS) finishes one branch before starting another. **Breadth-first search** (BFS) checks nearby galleries before distant ones. Both can visit every gallery, but their different orders affect how soon they find something and what they must remember along the way.

## What makes this a tree

In computer science, a **graph** is a set of points, with links connecting some pairs. A **tree** is a special kind of graph: you can get from any point to any other, and you cannot return to your starting point without retracing a link. The points are called **nodes**. We choose one node as the **root**. Every other node has one **parent** closer to the root, giving exactly one route from the root to any node. A computer's folder hierarchy is a familiar example: a folder can contain other folders, which can contain still more folders.

In our museum, a gallery is a node, a doorway leading farther in is a parent–child link, and the entrance gallery is the root. The galleries below a room are its children. A gallery with no children is a **leaf**. The **depth** of a gallery is its number of doorways from the entrance: the entrance has depth zero, its children depth one, and so on.

The drawing below is our entire museum. We will always take children from left to right, because the visit order within a level or branch depends on that choice.

![Tree of eight museum galleries: A at the root; B and C below A; D and E below B; F and G below C; and H below D.](/images/tree-traversal-museum-tree.svg)

*The letters name galleries. Lines are doorways to child galleries, and each row is one level farther from A.*

## Follow one corridor: DFS

With **depth-first search**, start at A and take the leftmost unchecked branch each time: A to B, B to D, and D to H. H has no gallery farther in, so you **backtrack** through D to B. B still has E to check. Once B's branch is finished, return to A and check C's branch, visiting F and G.

The numbered badges show the order in which you first enter the galleries. Follow the numbers from 1 to 8; the path goes deep down the left branch before it moves to the right.

![Museum gallery tree numbered in depth-first visit order: 1 A, 2 B, 3 D, 4 H, 5 E, 6 C, 7 F, 8 G.](/images/tree-traversal-dfs-order.svg)

*The numbers mark **first visits**, not every doorway you walk through. To get from H to E, you pass back through D and B; those return visits are left out.*

To remember unfinished choices, imagine putting notes on a pile. At A, put a note for C down first and a note for B on top. Take the top note, and you check B next. A computer calls this pile a **stack**: the last note added is the first removed.

If the object you want is in H, this left-to-right DFS reaches it on its fourth visit. If it is in F, DFS reaches it on its seventh. DFS makes no promise to find the shallowest matching node first.

## Check one level at a time: BFS

With **breadth-first search**, check A and put B and C on a waiting list. Check B next, adding D and E behind C. Then check C and add F and G. When D is checked, add H at the back. The list works like a line of people: whoever joins first is served first. A computer calls this a **queue**: first in, first out.

The numbered badges show BFS moving across each row before going deeper. Follow the numbers from 1 to 8.

![Museum gallery tree numbered in breadth-first visit order: 1 A, 2 B, 3 C, 4 D, 5 E, 6 F, 7 G, 8 H.](/images/tree-traversal-bfs-order.svg)

The queue holds B and C before any depth-two gallery. It then holds the depth-two galleries before H, which is at depth three. This is why BFS visits the tree level by level. The queue's middle steps can be checked directly:

| Gallery just checked | Queue afterwards, front first |
| --- | --- |
| A | B, C |
| B | C, D, E |
| C | D, E, F, G |
| D | E, F, G, H |

If the object is in F, BFS finds it on its sixth visit; if it is in H, it takes eight. The example shows why neither search is always faster at finding one particular gallery. If several galleries contain a matching object and you want the one with the fewest doors from A, BFS will find one at the smallest depth first.

## The difference in one rule

Both algorithms repeatedly choose a gallery from a list of work still to do. DFS takes the most recently reached unfinished branch; BFS takes the earliest gallery placed on the list. The change from a stack to a queue changes the visit order. [MIT's search-algorithms lecture](https://ocw.mit.edu/courses/6-01sc-introduction-to-electrical-engineering-and-computer-science-i-spring-2011/82b7b8c9edfeb90f0fd6ba69c9f9d10b_MIT6_01SCS11_lec12.pdf) uses these same two data structures to explain the distinction.

On our eight-gallery tree, a complete traversal checks each gallery once. In a larger tree, the work grows in proportion to the number of galleries. The methods differ in what they must remember. DFS must remember the branch it is following and where to return; on a deep tree, that record can be long. BFS keeps a queue of galleries at the current and next depths; on a broad tree, that queue can be large. A long, narrow tree gives BFS a short queue but DFS a long route to remember. [Cornell's traversal notes](https://www.cs.cornell.edu/courses/cs2112/2017fa/lectures/lec_traversals/) describe this memory trade-off.

## How the ideas developed

People described systematic maze exploration long before electronic computers. In [Édouard Lucas's 1882 account](https://www.hist-math.fr/textes/Lucas1882_RecreationsMathematiques1.pdf), he credited the telegraph engineer Trémaux with rules for marking passages and turning back at dead ends. A maze can contain loops, so those rules do more than the simple tree walk in our museum.

In [1959, Edward F. Moore published *The Shortest Path Through a Maze*](https://books.google.com/books/about/The_Shortest_Path_Through_a_Maze.html?id=IVZBHAAACAAJ). Finding a route with the fewest steps is a question that breadth-first exploration can answer when every move has the same cost. Later graph algorithms put depth-first exploration to work too: [Robert Tarjan's 1972 paper](https://doi.org/10.1137/0201010) used it to find connected structures in graphs in time proportional to their points and links. These works show the development and use of traversal methods; they do not identify a single inventor of the everyday idea of searching deeper or level by level.

## Where each method helps

DFS helps when you want to finish one branch before moving on, as when examining a folder hierarchy or exploring possible choices. BFS helps when closeness matters, as when finding the nearest matching folder or the fewest links between two web pages. If every link counts as one step—an **unweighted graph**—BFS checks one-step routes before two-step routes, so it finds a route using the fewest links. [Cornell's graph-traversal notes](https://www.cs.cornell.edu/courses/cs2112/2017fa/lectures/lec_traversals/) explain why the queue preserves this order.

The museum's simple floor plan is a tree. If another door connects two branches, it creates a loop: the plan remains a graph but is no longer a tree. On such a graph, DFS and BFS must record rooms already seen so they do not keep circling. In a tree, there is only one route from the entrance to any *particular* gallery, so DFS and BFS find the same route to it. BFS still has an advantage if **several** galleries match what you want and you need the closest one. In a graph with alternative routes to the same destination, BFS can also find the route with the fewest doorways.

The choice depends on your question. To finish one branch before moving on, go deep. To check nearby possibilities before distant ones, go broad.

If doorways have different costs, the route with the fewest doorways might not be the cheapest. [Dijkstra's algorithm](/how-a-road-atlas-explains-dijkstras-algorithm/) finds cheapest routes when costs are nonnegative; [A*](/how-a-route-planner-explains-a-star/) adds an estimate of the cost still to go when searching for one destination.

## Sources

- [MIT OpenCourseWare, *Search Algorithms*](https://ocw.mit.edu/courses/6-01sc-introduction-to-electrical-engineering-and-computer-science-i-spring-2011/82b7b8c9edfeb90f0fd6ba69c9f9d10b_MIT6_01SCS11_lec12.pdf): stack and queue explanations of DFS and BFS.
- [Cornell University, *Graph Traversals*](https://www.cs.cornell.edu/courses/cs2112/2017fa/lectures/lec_traversals/): traversal order, shortest paths by edge count, and memory use.
- [Édouard Lucas, *Récréations mathématiques*, volume I (1882)](https://www.hist-math.fr/textes/Lucas1882_RecreationsMathematiques1.pdf), chapter on labyrinths: Trémaux's backtracking method.
- [Edward F. Moore, *The Shortest Path Through a Maze* (1959)](https://books.google.com/books/about/The_Shortest_Path_Through_a_Maze.html?id=IVZBHAAACAAJ): publication record.
- [Robert Tarjan, “Depth-First Search and Linear Graph Algorithms” (1972)](https://doi.org/10.1137/0201010): depth-first search in linear graph algorithms.

The museum, its gallery labels, and its visit orders are constructed examples for this article. The AI-generated, photographic-style feature image is a visual metaphor; the labelled tree supplies the exact structure used in the walkthrough.
