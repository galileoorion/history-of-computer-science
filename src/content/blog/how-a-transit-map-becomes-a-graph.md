---
title: "How a Transit Map Becomes a Graph"
subtitle: "Four stations show how connections, directions and travel times become data"
description: "Use a fictional transit map to build a directed, weighted graph and an adjacency list, compare routes, and understand three graph algorithms."
sequence: 16
category: "Data structures"
historicalPeriod: "1735–1968"
author: "Attila Kulik"
tags: ["Graphs", "Adjacency lists", "Directed graphs", "Graph algorithms"]
heroImage: "/images/transit-map-graph-feature-photo.jpg"
heroImageAlt: "A passenger studies a paper transit map on a sunlit rail platform, with trains in the background"
pubDate: 2026-10-26
draft: false
---

A transit map gives a passenger a picture of where to change trains. A route-finding program needs a smaller set of facts: which stations exist, which can be reached directly from each one, and how much each ride costs. Once those facts are separated from the drawing, the map becomes a **graph**.

A graph consists of **vertices** (also called **nodes**) and **edges** connecting them. For our map, stations are vertices and direct rides are edges. The drawing helps us see the network, but an algorithm works with the connections and their data. This abstraction underlies [Dijkstra's shortest-path algorithm](/how-a-road-atlas-explains-dijkstras-algorithm/), [A*](/how-a-route-planner-explains-a-star/) and [Kahn's topological sorting algorithm](/how-a-university-roster-explains-kahns-algorithm/).

## Four stations, six rides

Imagine a tiny, fictional network with **Harbor**, **Market**, **Library** and **Terminal**. A ride goes only in the arrow's direction. The number beside an arrow is its travel time in minutes; for now, we ignore waiting and transfer times.

![Directed transit graph with Harbor, Market, Library and Terminal. Harbor points to Market in 4 minutes and Library in 7; Market points to Library in 2 and Terminal in 10; Library points to Market in 1 and Terminal in 3.](/images/transit-map-graph-four-stations.svg)

The diagram has four vertices and six directed edges. **Harbor → Market (4)** is one edge: you can travel directly from Harbor to Market in four minutes. It does not imply a ride from Market back to Harbor. If that return service existed, we would add a separate arrow, perhaps with a different time. This is a **directed graph**. A connection with the same cost in both directions could instead be shown as one undirected edge. [Cornell's graph notes](https://www.cs.cornell.edu/courses/cs2110/2025fa/lectures/lec21/) make the same distinction.

The numbers make it a **weighted graph**. A weight can represent travel time, distance, fare or another quantity. Before comparing routes, we must define what the weights measure. Here every weight is a positive number of minutes. The shape and length of an arrow in the drawing do not determine its weight: the label does.

## A path is a sequence of permitted rides

A **path** from Harbor to Terminal is a sequence of arrows joined end to end. Consider two possibilities:

| Route | Rides | Total time |
| --- | ---: | ---: |
| Harbor → Library → Terminal | 2 | 7 + 3 = **10 minutes** |
| Harbor → Market → Library → Terminal | 3 | 4 + 2 + 3 = **9 minutes** |

The route with three rides is quicker. **Fewest edges** and **least total weight** are different questions. If every ride took the same time, counting edges would be enough; [breadth-first search](/how-a-museum-explains-tree-traversal/) explores routes in that order. With unequal nonnegative travel times, Dijkstra's algorithm can find a least-time route. A* can use an additional estimate of the time still to go when searching for a particular destination; that estimate may use information beyond the adjacency list, such as station locations.

There is also a **cycle**: Market → Library → Market. The arrows take us back to where we started, at a cost of 2 + 1 = 3 minutes. Because every time in this example is positive, taking that loop cannot improve a least-time route. A search must handle revisits so it does not explore the same loop indefinitely. The presence of a cycle is part of the graph's structure, regardless of where the stations are drawn.

## Turn the picture into an adjacency list

The program does not need to store the coordinates of these four circles to answer our route question. It can keep an **adjacency list**: for each station, list the stations reachable by one outgoing arrow and the cost of that ride.

| Station | Outgoing rides (destination, minutes) |
| --- | --- |
| Harbor | Market (4), Library (7) |
| Market | Library (2), Terminal (10) |
| Library | Market (1), Terminal (3) |
| Terminal | None |

To explore from Market, read its row: the next station can be Library or Terminal. Library's row contains Market because the reverse ride is a *separate* edge. Terminal needs an empty row so the program still knows it is a station. An adjacency list records **outgoing** edges; it does not silently add return rides.

For a network with many stations but relatively few direct connections per station, this is a compact representation. Standard adjacency-list implementations use storage proportional to the number of vertices plus the number of edges, **O(V + E)**. An **adjacency matrix**, with one cell for every possible pair of stations, instead uses space proportional to **V²**. The choice depends on the questions the program must answer as well as the network's density. [MIT's graph-representation lecture](https://live.ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/196a95604877d326c6586e60477b59d4_MIT6_006S20_lec9.pdf) and [Cornell's graph notes](https://www.cs.cornell.edu/courses/cs2110/2025fa/lectures/lec21/) show how these representations work.

## One structure, different questions

The idea of replacing a map with connections predates computers. Leonhard Euler studied whether a walk through Königsberg could cross each of its seven bridges exactly once. He focused on how the bridges connected the land areas, leaving aside the physical shape of the city. The [Euler Archive](https://scholarlycommons.pacific.edu/euler-works/53/) records that he wrote the paper in **1735** and that it was published in **1741**. Euler's question was about using every bridge once, not about finding a minimum-time route.

Later computer algorithms asked other questions of graphs. [Edsger W. Dijkstra's 1959 paper](https://doi.org/10.1007/BF01386390) addressed shortest routes through a weighted network. [Arthur B. Kahn's 1962 paper](https://doi.org/10.1145/368996.369025) ordered tasks linked by prerequisites. [Peter Hart, Nils Nilsson and Bertram Raphael's 1968 A* paper](https://doi.org/10.1109/TSSC.1968.300136) studied route search guided by an estimate of the remaining cost.

These algorithms use related graph ideas, but they ask for different things. Our transit graph's cycle is ordinary for routes. A prerequisite graph must have **no directed cycle** for Kahn's algorithm to produce an ordering: “take Market before Library” and “take Library before Market” would be impossible instructions. Dijkstra and A* use edge weights to compare routes; A* also considers an estimate of what remains. The meaning assigned to each arrow determines which questions the graph can answer.

Our graph leaves out much of a real journey. Trains have timetables, services change, transfers take time, and the quickest ride may depend on when you arrive. A useful journey planner must represent those facts too. Our small graph has a narrower purpose: it shows how to turn a picture into precise connections, then choose the right algorithm for the question you want to answer.

## Sources

- [Euler Archive, *Solutio problematis ad geometriam situs pertinentis*](https://scholarlycommons.pacific.edu/euler-works/53/). Record of Euler's Königsberg bridges paper, written in 1735 and published in 1741.
- [Cornell University, *Graphs*](https://www.cs.cornell.edu/courses/cs2110/2025fa/lectures/lec21/). Vertices, directed edges, weights, paths, cycles and graph representations.
- [MIT OpenCourseWare, *Introduction to Algorithms*, Lecture 9: Breadth-First Search](https://live.ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/196a95604877d326c6586e60477b59d4_MIT6_006S20_lec9.pdf). Adjacency lists and their storage requirements.
- Edsger W. Dijkstra, [“A note on two problems in connexion with graphs”](https://doi.org/10.1007/BF01386390), *Numerische Mathematik*, 1959.
- Arthur B. Kahn, [“Topological sorting of large networks”](https://doi.org/10.1145/368996.369025), *Communications of the ACM*, 1962.
- Peter E. Hart, Nils J. Nilsson and Bertram Raphael, [“A Formal Basis for the Heuristic Determination of Minimum Cost Paths”](https://doi.org/10.1109/TSSC.1968.300136), *IEEE Transactions on Systems Science and Cybernetics*, 1968.

The four stations, rides and travel times are invented teaching examples. The feature image is AI-generated and depicts no particular transit system; the labelled diagram supplies the exact data used in the article.
