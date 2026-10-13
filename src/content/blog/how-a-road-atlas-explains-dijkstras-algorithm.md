---
title: "How a Road Atlas Explains Dijkstra's Algorithm"
subtitle: "A seven-town route shows how the 1956 algorithm works\u2014and why a negative cost can defeat it"
description: "A seven-town Dutch road atlas explains Dijkstra\u2019s shortest-path algorithm, its 1956 origin, and why negative costs can break it."
sequence: 2
category: "Algorithms"
historicalPeriod: "1956–1959"
author: "Attila Kulik"
tags: ["Dijkstra", "Shortest paths", "Graph algorithms"]
pubDate: 2026-10-13
draft: false
---

To find the shortest route, Dijkstra's algorithm repeatedly chooses the nearest town it has not yet finished. Once chosen, that town's distance is final—provided no road has a negative cost. Edsger W. Dijkstra devised the method in 1956 for a computer demonstration; the seven-town atlas below lets you carry it out by hand.

## What Dijkstra's algorithm does

Dijkstra's algorithm solves the **shortest path problem**: given a **graph**, find a route from a chosen starting point to another point whose lengths add up to the smallest total. A graph here means a set of connections rather than a chart of data. Its points are called **nodes** and the links between them are called **edges**. Each edge has a **weight**, which might represent kilometres, minutes or euros. A road map is a useful example, with towns as nodes and roads as edges. Running the algorithm from one starting node finds the shortest distance to every reachable node, although you can stop when a particular destination is settled.

The method keeps one number for every node, its **tentative distance**, which is the length of the shortest route found so far. At the start, the starting node has a tentative distance of 0 and every other node has infinity, meaning no route has been found. The algorithm then repeats one step: it picks the node with the smallest tentative distance among those not yet finished, declares that node **settled**, meaning its distance is final, and examines every edge leaving it. For each such edge, it asks whether going through the settled node gives a shorter route to the node at the other end than the one recorded. If it does, the algorithm replaces the recorded number. This check and possible update is called **relaxation**.

The usual algorithm is guaranteed to be correct when every edge has a non-negative weight. A settled distance is never revised, so a later negative edge can make the result wrong. The example below shows exactly how.

## Who devised it

Dijkstra worked out the shortest-path method in 1956 while he was a programmer at the Mathematical Centre in Amsterdam. For the inauguration of its ARMAC computer, he wanted a demonstration whose question and answer would make sense to a general audience. In a [2001 oral-history interview](https://conservancy.umn.edu/bitstreams/7a97387c-e045-4647-925c-d6d94a312f6e/download), he said he had selected 64 Dutch cities for a simplified map: six bits can identify 64 different cities, because 2⁶ = 64. He recalled devising the method in about twenty minutes, without pencil and paper, while resting at an Amsterdam café with his fiancée.

In that interview, Dijkstra used Rotterdam to Groningen to illustrate the question of finding a route between two cities. His [1982 recollection](https://garfield.library.upenn.edu/classics1983/A1983QA19900001.pdf) instead describes the demonstration as using a railway map and gives Harlingen to Maastricht as an example; it also associates the café scene with his *other* graph algorithm. His recollections therefore differ on some details. The road atlas in this article is a new teaching example, not a reconstruction of the ARMAC demonstration.

The method appeared in print in 1959, in Dijkstra's three-page paper [“A note on two problems in connexion with graphs”](https://doi.org/10.1007/BF01386390). The other problem in the paper was finding a **minimum spanning tree**: a set of links that connects all the nodes with the smallest possible total weight. That is a different goal from finding the shortest route between two nodes. Vojtěch Jarník had described the spanning-tree method in 1930, and [Robert Prim published it in 1957](https://www.nokia.com/bell-labs/publications-and-media/publications/shortest-connection-networks-and-some-generalizations/).

Dijkstra's published procedure chooses the smallest tentative distance at each stage. A straightforward implementation scans all nodes to make that choice. Across *n* nodes, those scans take work that grows roughly as *n*². This describes the growth rate, not an exact count of the ARMAC's instructions or running time.

Shortest-path research was not confined to Dijkstra. Lester Ford described a related method in a [1956 report](https://www.rand.org/pubs/papers/P923.html), and Richard Bellman published [“On a routing problem” in 1958](https://doi.org/10.1090/qam/102435). The method now called **Bellman–Ford** can handle negative edge weights if no reachable negative cycle makes the shortest distance undefined. Its repeated passes over the edges generally cost more than Dijkstra's greedy choice.

Later implementations used a **priority queue** to retrieve the next node with the smallest tentative distance. One option is a **binary heap**, which gives a running-time bound of about (*n* + *m*) log *n* for *n* nodes and *m* edges. Michael Fredman and Robert Tarjan's [Fibonacci heap](https://www.eecs.tufts.edu/~aloupis/comp260/lectures/fredman-tarjan-1987.pdf), presented in 1984 and published in 1987, improves the theoretical bound to *m* + *n* log *n*. Link-state routing protocols such as [OSPF](https://www.rfc-editor.org/rfc/rfc2328.html) and [IS-IS](https://www.rfc-editor.org/rfc/rfc1195.html) use shortest-path-first calculations based on Dijkstra's method.

## Worked example: Rotterdam to Groningen

Dijkstra's algorithm can be carried out by hand on a paper road atlas with a pencil, sticky notes and a pen. This example uses seven real Dutch towns and road distances derived from a modern routing service. The ten-road network is a simplification: it is the graph on which the algorithm will operate.

### Setting up the atlas

Imagine you are planning a delivery from Rotterdam to Groningen, a trip Dijkstra later used to explain the question, with a small atlas showing Rotterdam, Amsterdam, Utrecht, Amersfoort, Arnhem, Zwolle and Groningen. Each town is a node, and each road is an edge whose length is printed in kilometres. The atlas has ten two-way roads: Rotterdam–Amsterdam is 79 km; Rotterdam–Utrecht, 62; Utrecht–Amersfoort, 27; Utrecht–Arnhem, 65; Amsterdam–Amersfoort, 52; Amsterdam–Zwolle, 105; Amsterdam–Groningen, 183; Amersfoort–Zwolle, 69; Arnhem–Zwolle, 67; and Zwolle–Groningen, 106.

![Map of the Netherlands showing Rotterdam, Amsterdam, Utrecht, Amersfoort, Arnhem, Zwolle and Groningen joined by ten roads, each labelled with its length in kilometres.](/images/dijkstra-atlas-map.svg)

The distances are driving distances between city centres from the [OSRM routing service](https://project-osrm.org/docs/v5.24.0/api/), which uses [OpenStreetMap](https://www.openstreetmap.org/copyright) data. Each road's figure is the average of the two directions, rounded to the nearest kilometre. OSRM returns the distance of its *fastest* route between the supplied points, so its answers can change with the chosen centre points, road data and routing profile. In a fresh route check, Amsterdam–Groningen used the A6 and A7, while Amsterdam–Zwolle used the A6 and N307 among other roads. The A6 passes Almere on land that [did not dry out until 1968](https://stadsarchief.almere.nl/ontdek/tentoonstelling/fotopaginas/hoe-het-begon), so these cannot be Dijkstra's 1956 distances. The figure draws approximate courses rather than exact routes.

You put a sticky note on each town. On the note for Rotterdam you write 0 in pencil, because you are already there, and on every other note you write ∞ in pencil, because you have found no route to those towns yet. The pencilled number on a note is the town's tentative distance. A town whose number you later circle in pen is a settled town, and a circled number is never changed again.

Beside each pencilled number you also write the town the current best route came from, so that at the end you can read the route backwards. Those predecessor notes turn a list of distances into an actual route.

### Circling the nearest town

Each step follows the same routine. You look at the pencilled notes on all the uncircled towns, find the smallest number, and circle it in pen; then you walk along every road leaving that town and, at each town on the far end that is not yet circled, compare the recorded number with the circled number plus the length of that road. If the sum is smaller, you rub out the pencilled number and write the sum, together with the name of the town you came from. That comparison and rewriting is relaxation.

On this atlas the routine takes seven steps, one for each town, and each step has its own figure below. In the figures, a filled red dot is a circled town, a dashed dot is a town that has only a pencilled note, the red ring marks the town circled in that step, and a struck-through number is a note that has just been rubbed out. The red roads show the “came from” choices made so far. A road leading to an uncircled town may still change. When the algorithm finishes, the final choices form a **shortest-path tree** from Rotterdam.

In step 1, Rotterdam has the smallest note, 0, so you circle it. Its two roads give Amsterdam a note of 0 + 79 = 79 and Utrecht a note of 0 + 62 = 62, both via Rotterdam.

![Step 1: Rotterdam is circled at 0. Amsterdam gets 79 and Utrecht gets 62, both via Rotterdam.](/images/dijkstra-atlas-step-1.svg)

In step 2, Utrecht has the smallest uncircled note, 62, so you circle it, even though Amsterdam is the larger city, because the routine looks only at the numbers. Utrecht's roads give Amersfoort 62 + 27 = 89 and Arnhem 62 + 65 = 127. Its road back to Rotterdam leads to a circled town and is skipped.

![Step 2: Utrecht is circled at 62. Amersfoort gets 89 and Arnhem gets 127, both via Utrecht.](/images/dijkstra-atlas-step-2.svg)

In step 3, Amsterdam is next, at 79. Its road to Amersfoort offers 79 + 52 = 131, which is longer than the 89 already pencilled there, so that note is left alone. Its other two roads give Zwolle 79 + 105 = 184 and Groningen 79 + 183 = 262. Groningen now has a route, but its note stays in pencil, because a shorter route might still appear.

![Step 3: Amsterdam is circled at 79. Zwolle gets 184 and Groningen gets 262, both via Amsterdam; Amersfoort keeps 89 because 131 is longer.](/images/dijkstra-atlas-step-3.svg)

In step 4, Amersfoort is circled at 89. Its road to Zwolle offers 89 + 69 = 158, which is shorter than 184, so you rub out 184 and write 158 via Amersfoort. This is the first step in which relaxation replaces a number that was already on a note, and it shows why the notes are written in pencil.

![Step 4: Amersfoort is circled at 89. Zwolle's note changes from 184 via Amsterdam to 158 via Amersfoort.](/images/dijkstra-atlas-step-4.svg)

In step 5, Arnhem is circled at 127. Its only road to an uncircled town, the one to Zwolle, offers 127 + 67 = 194, which is longer than 158, so no note changes.

![Step 5: Arnhem is circled at 127. Zwolle keeps 158 because 194 is longer.](/images/dijkstra-atlas-step-5.svg)

In step 6, Zwolle is circled at 158. Its road to Groningen offers 158 + 106 = 264, which is 2 km longer than the 262 pencilled there via Amsterdam, so Groningen's note stays as it is.

![Step 6: Zwolle is circled at 158. Groningen keeps 262 via Amsterdam because 264 is longer.](/images/dijkstra-atlas-step-6.svg)

In step 7, Groningen is the only uncircled town left, so you circle it at 262. Every town now has a final distance.

![Step 7: Groningen is circled at 262 via Amsterdam, and every town is circled.](/images/dijkstra-atlas-step-7.svg)

The table below records the seven steps in one place.

| Step | Town circled | Circled distance | Notes rewritten | Offers rejected |
|---|---|---|---|---|
| 1 | Rotterdam | 0 | Amsterdam 0 + 79 = 79, Utrecht 0 + 62 = 62 | none |
| 2 | Utrecht | 62 | Amersfoort 62 + 27 = 89, Arnhem 62 + 65 = 127 | none |
| 3 | Amsterdam | 79 | Zwolle 79 + 105 = 184, Groningen 79 + 183 = 262 | Amersfoort 131 (keeps 89) |
| 4 | Amersfoort | 89 | Zwolle 89 + 69 = 158 (was 184) | none |
| 5 | Arnhem | 127 | none | Zwolle 194 (keeps 158) |
| 6 | Zwolle | 158 | none | Groningen 264 (keeps 262) |
| 7 | Groningen | 262 | none | none |

Reading the "came from" names backwards from Groningen gives the route: Groningen came from Amsterdam, and Amsterdam came from Rotterdam. The route is Rotterdam, Amsterdam, Groningen, and its length is 79 + 183 = 262 km, which matches the circled number on Groningen. The route through the middle of the country, Rotterdam, Utrecht, Amersfoort, Zwolle, Groningen, measures 62 + 27 + 69 + 106 = 264 km, and the routine rejected it in step 6 by that 2 km margin.

The 2 km margin depends on rounding each road separately. The OSRM calculation used to build this atlas recorded the two unrounded routes as 262.7 km and 262.8 km, nearly a tie; a new query can differ as map data and chosen city-centre points change. A [direct OSRM route between representative centre points](https://router.project-osrm.org/route/v1/driving/4.4777,51.9244;6.5665,53.2194?overview=false) is about 248 km because it can use roads omitted from this seven-town graph. The algorithm finds the shortest route among the roads supplied to it, not among every road in the Netherlands.

### Why a circled number is final

A circled number is final because any still-undiscovered route to that town must pass through a town that is still uncircled, and the remaining roads cannot reduce its total. Take step 4, when you circle Amersfoort at 89. At that moment Rotterdam, Utrecht and Amsterdam are circled. Any alternative route not already accounted for must first leave those settled towns for an uncircled one. The pencilled note on that first uncircled town is at least 89, since 89 was the smallest available note. Every road after it adds zero or more kilometres. The alternative route therefore cannot beat 89 km.

This argument also explains the order in which the algorithm works. It circles towns in increasing order of their true distance from Rotterdam, which on this atlas is 0, 62, 79, 89, 127, 158 and 262. For that reason the routine can be stopped as soon as the destination town is circled: if the delivery had been to Amersfoort, you could have stopped after step 4 without looking at Arnhem, Zwolle or Groningen.

### Why a negative road breaks it

The argument fails if a link can have a negative **cost**, because “every road after it adds zero or more” is no longer true. Suppose the numbers now represent euros, at one euro per kilometre, and a courier firm pays you €72 to carry a parcel from Amersfoort to Amsterdam. The 52 km run then costs 52 − 72 = −20 euros in that direction. The ordinary Amsterdam-to-Amersfoort direction still costs €52, so the two directions now have different weights. Following the same routine, Amsterdam was circled at 79 in step 3. When Amersfoort is circled at 89 in step 4, its negative-cost link offers Amsterdam a route costing 89 + (−20) = 69, less than the circled 79.

![A one-way road from Amersfoort to Amsterdam costs −20. Amsterdam is already circled at 79, but Amersfoort, circled at 89, offers 89 − 20 = 69.](/images/dijkstra-atlas-negative-road.svg)

By then the circled 79 has already been used in step 3 to write the notes for Zwolle and Groningen, so the error spreads. The correct cost to Groningen becomes 69 + 183 = 252, but the routine still circles Groningen at 262, €10 too high. The routine has no step for erasing a circle. Bellman–Ford, by contrast, repeatedly checks all directed links and can revise earlier estimates; on this graph it finds €252.

The payment is below €104 for a reason. The round trip Amsterdam–Amersfoort–Amsterdam costs 52 + (52 − payment) euros. A payment above €104 would make that loop a **negative cycle**: repeating it would lower the cost without limit, so there would be no cheapest route to Groningen. Bellman–Ford can detect a reachable negative cycle; the usual Dijkstra procedure does not handle one.

### How the work grows with the map

The running time depends on how you find the smallest pencilled note. If you scan every uncircled town each time, the scans take *n* + (*n* − 1) + … + 1 checks for *n* towns, which grows as *n*². Examining the roads adds work proportional to *m*, the number of roads. Another approach is a **priority queue**: imagine keeping the notes on a rack so the smallest can be taken next. A binary heap is a practical implementation; taking the smallest note or moving an updated note within it costs at most about log₂ *n* operations. Across the towns and roads, its worst-case growth is (*n* + *m*) log *n*.

The table compares these growth formulas. Its numbers are rough *units of work*, not measured instructions or predicted running times. The larger examples assume *m* = 3*n*, a sparse network in which each town has only a few links.

| Map | Towns (*n*) | Roads (*m*) | Scan: *n*² | Binary heap: (*n* + *m*) log₂ *n* |
|---|---:|---:|---:|---:|
| Seven-town atlas | 7 | 10 | 49 | about 48 |
| Regional map | 1,000 | 3,000 | 1,000,000 | about 40,000 |
| Large road network | 1,000,000 | 3,000,000 | 1,000,000,000,000 | about 80,000,000 |

For the last row, log₂ 1,000,000 is about 20, because 2²⁰ = 1,048,576. The heap expression is therefore (1,000,000 + 3,000,000) × 20 ≈ 80,000,000, while the scan expression is 1,000,000² = 1,000,000,000,000. These formulas explain why avoiding a full scan matters on a large, sparse graph. They do not imply that one implementation will run exactly 12,500 times faster: the operations have different costs, and real performance also depends on memory use and the graph.

The advantage depends on the map being **sparse**, meaning *m* is much smaller than *n*². If nearly every town connects directly to every other, scanning can be competitive because the algorithm must inspect so many edges anyway. Road networks are usually sparse, which makes the priority queue useful.

## Sources

- Philip L. Frana, [*An Interview with Edsger W. Dijkstra*](https://conservancy.umn.edu/bitstreams/7a97387c-e045-4647-925c-d6d94a312f6e/download), Charles Babbage Institute oral history, 2 August 2001; an edited version appeared in *Communications of the ACM* 53, no. 8 (2010): 41–47. Source for the 64 cities, six-bit coding, Rotterdam–Groningen example and café account.
- Edsger W. Dijkstra, [1982 recollection of the ARMAC demonstration](https://garfield.library.upenn.edu/classics1983/A1983QA19900001.pdf), published in *Current Contents* in 1983. Describes a railway map and a Harlingen–Maastricht example.
- Edsger W. Dijkstra, [“A note on two problems in connexion with graphs”](https://doi.org/10.1007/BF01386390), *Numerische Mathematik* 1 (1959): 269–271.
- Robert C. Prim, [“Shortest Connection Networks And Some Generalizations”](https://www.nokia.com/bell-labs/publications-and-media/publications/shortest-connection-networks-and-some-generalizations/), *Bell System Technical Journal* 36 (1957): 1389–1401; [NIST's account of Jarník's 1930 contribution](https://xlinux.nist.gov/dads/HTML/primJarnik.html).
- Lester R. Ford Jr., [*Network Flow Theory*](https://www.rand.org/pubs/papers/P923.html), RAND paper P-923 (1956); Richard Bellman, [“On a routing problem”](https://doi.org/10.1090/qam/102435), *Quarterly of Applied Mathematics* 16 (1958): 87–90.
- Michael L. Fredman and Robert E. Tarjan, [“Fibonacci heaps and their uses in improved network optimization algorithms”](https://www.eecs.tufts.edu/~aloupis/comp260/lectures/fredman-tarjan-1987.pdf), *Journal of the ACM* 34, no. 3 (1987): 596–615.
- [OSPF RFC 2328](https://www.rfc-editor.org/rfc/rfc2328.html) and [IS-IS RFC 1195](https://www.rfc-editor.org/rfc/rfc1195.html), for routing applications.
- [OSRM routing API](https://project-osrm.org/docs/v5.24.0/api/) using [OpenStreetMap data](https://www.openstreetmap.org/copyright), © OpenStreetMap contributors, for the road figures and named road segments. A fresh check on 13 October 2026 using representative city-centre points was within about 2 km of each displayed link; the original input coordinates for the 262.7 km and 262.8 km unrounded totals were not retained. The direct Rotterdam–Groningen query linked above returned 247.7 km. Routing results are sensitive to inputs and map updates. [Almere City Archives](https://stadsarchief.almere.nl/ontdek/tentoonstelling/fotopaginas/hoe-het-begon) dates the drying of southern Flevoland to 1968.
- [Natural Earth](https://www.naturalearthdata.com/) 1:10m country and lake outlines, public domain, credited for the background map figures.
